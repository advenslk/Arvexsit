import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
const PORT = Number(process.env.PAYMENT_PORT || 5001);
const DATA_DIR = path.resolve(process.env.ARVEX_DATA_DIR || './data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const DISCORD_TOKEN = String(process.env.DISCORD_BOT_TOKEN || '').trim();
const DISCORD_GUILD_ID = String(process.env.DISCORD_GUILD_ID || '').trim();
const DISCORD_CATEGORY_ID = String(process.env.DISCORD_TICKET_CATEGORY_ID || '').trim();
const DISCORD_STAFF_ROLE_ID = String(process.env.DISCORD_STAFF_ROLE_ID || '').trim();
const DISCORD_INTERACTION_PUBLIC_KEY = String(process.env.DISCORD_INTERACTION_PUBLIC_KEY || '').trim();
const DISCORD_CLIENT_ID = String(process.env.DISCORD_CLIENT_ID || '').trim();
const DISCORD_CLIENT_SECRET = String(process.env.DISCORD_CLIENT_SECRET || '').trim();
const DISCORD_REDIRECT_URI = String(process.env.DISCORD_REDIRECT_URI || '').trim();
const PTERO_URL = String(process.env.PTERODACTYL_URL || '').replace(/\/$/, '');
const PTERO_KEY = String(process.env.PTERODACTYL_API_KEY || '').trim();
const PTERO_NODE_ID = Number(process.env.PTERODACTYL_NODE_ID || 0);
const PTERO_NEST_ID = Number(process.env.PTERODACTYL_NEST_ID || 0);
const PTERO_EGG_ID = Number(process.env.PTERODACTYL_EGG_ID || 0);
const PTERO_IMAGE = String(process.env.PTERODACTYL_DOCKER_IMAGE || 'ghcr.io/pterodactyl/yolks:java_21').trim();
const PTERO_STARTUP = String(process.env.PTERODACTYL_STARTUP || 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar nogui').trim();
const PUBLIC_ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://arvex.host').replace(/\/$/, '');
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = String(process.env.RESEND_FROM || 'ArveX Hosting <noreply@arvex.host>').trim();
const AUTOMATION_SECRET = String(process.env.ORDER_AUTOMATION_SECRET || '').trim();

app.use(express.json({ limit: '256kb' }));

async function readJson(file, fallback) { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') console.error(e); return fallback; } }
async function writeJson(file, value) { await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 }); const tmp = `${file}.${process.pid}.${Date.now()}.tmp`; await fs.writeFile(tmp, JSON.stringify(value, null, 2), { mode: 0o600 }); await fs.rename(tmp, file); }
function auth(req, res, next) { const key = String(req.headers['x-order-automation-secret'] || ''); if (!AUTOMATION_SECRET || key !== AUTOMATION_SECRET) return res.status(401).json({ error: 'Unauthorized automation request.' }); next(); }
function discordHeaders() { return { Authorization: `Bot ${DISCORD_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'ArveXHosting/1.0' }; }
async function discord(pathname, options = {}) { if (!DISCORD_TOKEN) throw new Error('DISCORD_BOT_TOKEN is not configured.'); const r = await fetch(`https://discord.com/api/v10${pathname}`, { ...options, headers: { ...discordHeaders(), ...(options.headers || {}) } }); const text = await r.text(); let data; try { data = JSON.parse(text); } catch { data = text; } if (!r.ok) throw new Error(`Discord API ${r.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`); return data; }
function snowflakeName(orderId) { return `order-${orderId.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(-85)}`; }
function orderId() { return `ARX-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomInt(100000, 1000000)}`; }
function password() { return `${crypto.randomBytes(12).toString('base64url')}A9!`; }
function cleanName(v, fallback='Customer') { return String(v || fallback).replace(/[<>`]/g, '').slice(0,80); }

async function sendEmail(to, subject, text, html) {
  if (!RESEND_API_KEY || !to) return false;
  const r = await fetch('https://api.resend.com/emails', { method:'POST', headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({from:RESEND_FROM,to:[to],subject,text,html}) });
  return r.ok;
}

async function createTicket(order) {
  const overwrites = [
    { id: DISCORD_GUILD_ID, type: 0, allow: '1024', deny: '0' },
    { id: order.discordUserId, type: 1, allow: '68608', deny: '0' }
  ];
  if (DISCORD_STAFF_ROLE_ID) overwrites.push({ id: DISCORD_STAFF_ROLE_ID, type: 0, allow: '68608', deny: '0' });
  const channel = await discord(`/guilds/${DISCORD_GUILD_ID}/channels`, { method:'POST', body:JSON.stringify({ name:snowflakeName(order.id), type:0, parent_id:DISCORD_CATEGORY_ID || null, topic:`ArveX Order ${order.id}`, permission_overwrites:overwrites }) });
  const embed = { title:`🛒 ArveX Hosting • ${order.id}`, description:'**New hosting order**\nA staff member must verify the payment before provisioning.', color:0x8b5cf6, fields:[
    {name:'Customer',value:`${order.customerName}\n${order.email}`,inline:true},
    {name:'Plan',value:order.planName,inline:true},
    {name:'Amount',value:`${order.currency} ${order.amount}`,inline:true},
    {name:'Billing',value:order.billingCycle,inline:true},
    {name:'Location',value:order.location || 'Not specified',inline:true},
    {name:'Order ID',value:order.id,inline:true},
    {name:'Status',value:'🟡 Awaiting payment verification',inline:false}
  ], footer:{text:'ArveX Hosting • Secure Order Desk'} };
  const components = [{ type:1, components:[
    {type:2, style:1, label:'Claim', custom_id:`arx:claim:${order.id}`, emoji:{name:'🔒'}},
    {type:2, style:3, label:'Payment Done', custom_id:`arx:paid:${order.id}`, emoji:{name:'✅'}},
    {type:2, style:2, label:'Order Info', custom_id:`arx:info:${order.id}`, emoji:{name:'📋'}},
    {type:2, style:4, label:'Close', custom_id:`arx:close:${order.id}`, emoji:{name:'🔒'}}
  ]}];
  await discord(`/channels/${channel.id}/messages`, { method:'POST', body:JSON.stringify({ content:`<@${order.discordUserId}> <@&${DISCORD_STAFF_ROLE_ID}>`, embeds:[embed], components }) });
  return channel.id;
}

async function ptero(pathname, options={}) {
  if (!PTERO_URL || !PTERO_KEY) throw new Error('Pterodactyl configuration is incomplete.');
  const r = await fetch(`${PTERO_URL}/api/application${pathname}`, { ...options, headers:{Authorization:`Bearer ${PTERO_KEY}`,'Content-Type':'application/json',Accept:'Application/vnd.pterodactyl.v1+json',...(options.headers||{})} });
  const text = await r.text(); let data; try { data=JSON.parse(text); } catch { data=text; }
  if (!r.ok) throw new Error(`Pterodactyl API ${r.status}: ${typeof data==='string'?data:JSON.stringify(data)}`); return data;
}

async function provision(order) {
  const users = await ptero('/users?filter[email]='+encodeURIComponent(order.email));
  let user = users.data?.[0]?.attributes;
  const generatedPassword = password();
  if (!user) {
    const created = await ptero('/users', {method:'POST', body:JSON.stringify({username:`arx_${order.id.slice(-6).toLowerCase()}`,email:order.email,first_name:cleanName(order.customerName).split(' ')[0],last_name:cleanName(order.customerName).split(' ').slice(1).join(' ') || 'Customer',password:generatedPassword,root_admin:false,language:'en'})});
    user=created.attributes;
  }
  const memory = Math.max(128, Number(order.ramMb || order.ram || 2048));
  const disk = Math.max(512, Number(order.storageMb || order.storage || 10240));
  const cpu = Math.max(1, Number(order.cpu || order.cores || 1) * 100);
  const server = await ptero('/servers', {method:'POST', body:JSON.stringify({name:`ArveX-${order.planName}`.slice(0,100),user:user.id,egg:PTERO_EGG_ID,nest:PTERO_NEST_ID,docker_image:PTERO_IMAGE,startup:PTERO_STARTUP,environment:order.environment || {},limits:{memory,disk,cpu},feature_limits:{databases:1,allocations:1,backups:1},deploy:{locations:[PTERO_NODE_ID],port_range:[],dedicated_ip:false}})});
  return {userId:user.id,serverId:server.attributes?.id || server.attributes?.identifier,identifier:server.attributes?.identifier,panelUrl:`${PTERO_URL}/server/${server.attributes?.identifier}`,username:user.username,password:generatedPassword};
}

async function updateTicket(order, content, components=[]) { if (!order.discordChannelId) return; await discord(`/channels/${order.discordChannelId}/messages`, {method:'POST',body:JSON.stringify({content,components})}); }
async function dmUser(discordUserId, content) { const dm=await discord('/users/@me/channels',{method:'POST',body:JSON.stringify({recipient_id:discordUserId})}); await discord(`/channels/${dm.id}/messages`,{method:'POST',body:JSON.stringify({content})}); }

app.get('/api/automation/health', (_req,res)=>res.json({ok:true,service:'arvex-order-automation',time:new Date().toISOString()}));

app.get('/api/automation/discord/start', (req,res)=>{
  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) return res.status(503).send('Discord OAuth is not configured.');
  const state=crypto.randomBytes(32).toString('base64url');
  const q=new URLSearchParams({client_id:DISCORD_CLIENT_ID,redirect_uri:DISCORD_REDIRECT_URI,response_type:'code',scope:'identify email',state});
  res.redirect(`https://discord.com/oauth2/authorize?${q}`);
});
app.get('/api/automation/discord/callback', async(req,res)=>{
  try {
    if(!DISCORD_CLIENT_ID||!DISCORD_CLIENT_SECRET||!DISCORD_REDIRECT_URI) return res.status(503).send('Discord OAuth is not configured.');
    const code=String(req.query.code||''); if(!code) return res.status(400).send('Missing Discord authorization code.');
    const token=await fetch('https://discord.com/api/v10/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:DISCORD_CLIENT_ID,client_secret:DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code,redirect_uri:DISCORD_REDIRECT_URI})});
    if(!token.ok)return res.status(502).send('Discord authentication failed.');
    const td=await token.json();const profile=await fetch('https://discord.com/api/v10/users/@me',{headers:{Authorization:`Bearer ${td.access_token}`}});if(!profile.ok)return res.status(502).send('Unable to read Discord account.');const u=await profile.json();
    const packed=Buffer.from(JSON.stringify({id:u.id,username:u.global_name||u.username,email:u.email||'',avatar:u.avatar||''})).toString('base64url');
    res.redirect(`${PUBLIC_ORIGIN}/#/home?discord_auth=${encodeURIComponent(packed)}`);
  } catch(e){console.error(e);res.status(500).send('Discord authentication failed.');}
});

app.post('/api/automation/orders', auth, async(req,res)=>{
  try {
    const body=req.body||{}; if(!body.discordUserId||!body.email||!body.planName) return res.status(400).json({error:'discordUserId, email and planName are required.'});
    const orders=await readJson(ORDERS_FILE,[]); const existing=orders.find(o=>o.externalId && body.externalId && o.externalId===body.externalId); if(existing)return res.json({ok:true,order:existing,idempotent:true});
    const order={id:orderId(),externalId:String(body.externalId||''),createdAt:new Date().toISOString(),status:'awaiting_payment',customerName:cleanName(body.customerName),email:String(body.email).trim().toLowerCase(),discordUserId:String(body.discordUserId),planName:cleanName(body.planName),amount:Number(body.amount||0),currency:String(body.currency||'LKR'),billingCycle:cleanName(body.billingCycle,'monthly'),location:cleanName(body.location,'Default'),ramMb:Number(body.ramMb||body.ram||2048),storageMb:Number(body.storageMb||body.storage||10240),cpu:Number(body.cpu||body.cores||1),environment:typeof body.environment==='object'&&body.environment?body.environment:{},provisioningLock:false};
    order.discordChannelId=await createTicket(order);orders.unshift(order);await writeJson(ORDERS_FILE,orders);res.status(201).json({ok:true,order});
  } catch(e){console.error(e);res.status(500).json({error:e.message||'Unable to create order.'});}
});

app.get('/api/automation/orders/:id', auth, async(req,res)=>{const orders=await readJson(ORDERS_FILE,[]);const order=orders.find(o=>o.id===req.params.id);if(!order)return res.status(404).json({error:'Order not found.'});res.json({ok:true,order});});

app.post('/api/automation/provision/:id', auth, async(req,res)=>{
  const orders=await readJson(ORDERS_FILE,[]);const order=orders.find(o=>o.id===req.params.id);if(!order)return res.status(404).json({error:'Order not found.'});
  if(order.status==='provisioned')return res.json({ok:true,idempotent:true,order});
  if(order.provisioningLock)return res.status(409).json({error:'Provisioning is already running.'});
  order.provisioningLock=true;order.status='provisioning';await writeJson(ORDERS_FILE,orders);
  try { order.server=await provision(order);order.status='provisioned';order.provisionedAt=new Date().toISOString();order.provisioningLock=false;await writeJson(ORDERS_FILE,orders);
    await updateTicket(order,`<@${order.discordUserId}>\n## ✅ Payment verified & server provisioned\n**Order:** ${order.id}\n**Plan:** ${order.planName}\n**Panel:** ${order.server.panelUrl}\n**Server:** ${order.server.identifier || order.server.serverId}\n\nCredentials have been sent privately to your Discord DM.`);
    try { await dmUser(order.discordUserId,`🔐 **ArveX Hosting — Server Ready**\n\nOrder: **${order.id}**\nPlan: **${order.planName}**\nPanel: ${order.server.panelUrl}\nUsername: **${order.server.username}**\nPassword: **${order.server.password}**\n\n⚠️ Change your password after first login and never share these credentials.`); } catch(e){console.error('DM failed:',e.message);}
    await sendEmail(order.email,`ArveX Hosting — ${order.id} is ready`,`Your ArveX server is ready. Panel: ${order.server.panelUrl}`,`<h2>Your ArveX server is ready</h2><p>Order: <b>${order.id}</b></p><p>Panel: <a href="${order.server.panelUrl}">${order.server.panelUrl}</a></p><p>Your credentials were sent to your Discord DM.</p>`);
    return res.json({ok:true,order});
  } catch(e){order.status='provisioning_failed';order.provisioningLock=false;order.provisioningError=e.message;await writeJson(ORDERS_FILE,orders);await updateTicket(order,`⚠️ **Provisioning failed for ${order.id}.**\n\`${String(e.message).slice(0,1500)}\`\nStaff should review and retry.`,[]);return res.status(502).json({error:e.message,order});}
});

async function verifyDiscordSignature(req) {
  if (!DISCORD_INTERACTION_PUBLIC_KEY) return false;
  const signature=req.headers['x-signature-ed25519']; const timestamp=req.headers['x-signature-timestamp']; if(!signature||!timestamp||!req.rawBody)return false;
  try { return crypto.verify(null,Buffer.from(`${timestamp}${req.rawBody}`),{key:Buffer.from(DISCORD_INTERACTION_PUBLIC_KEY,'hex'),format:'der',type:'spki'},Buffer.from(String(signature),'hex')); } catch { return false; }
}

const rawApp=express();rawApp.disable('x-powered-by');rawApp.post('/api/automation/discord/interactions',express.raw({type:'application/json'}),async(req,res)=>{
  if(!(await verifyDiscordSignature(req)))return res.status(401).send('Invalid request signature.');
  let body;try{body=JSON.parse(req.rawBody.toString('utf8'));}catch{return res.status(400).send('Invalid JSON.');}
  if(body.type===1)return res.json({type:1});
  if(body.type!==3)return res.json({type:4,data:{content:'Unsupported interaction.',flags:64}});
  const custom=String(body.data?.custom_id||'');const[,action,id]=custom.split(':');if(!id)return res.json({type:4,data:{content:'Invalid order action.',flags:64}});
  const orders=await readJson(ORDERS_FILE,[]);const order=orders.find(o=>o.id===id);if(!order)return res.json({type:4,data:{content:'Order not found.',flags:64}});
  const isStaff=DISCORD_STAFF_ROLE_ID && Array.isArray(body.member?.roles) && body.member.roles.includes(DISCORD_STAFF_ROLE_ID);
  if(!isStaff)return res.json({type:4,data:{content:'⛔ Staff permission required.',flags:64}});
  try {
    if(action==='claim'){order.claimedBy=body.member.user?.id||'unknown';order.status=order.status==='awaiting_payment'?'claimed':order.status;await writeJson(ORDERS_FILE,orders);return res.json({type:4,data:{content:`🔒 Order **${id}** claimed by <@${order.claimedBy}>.`,flags:64}});}
    if(action==='info')return res.json({type:4,data:{content:`📋 **${id}**\nCustomer: ${order.customerName} (${order.email})\nPlan: ${order.planName}\nAmount: ${order.currency} ${order.amount}\nStatus: ${order.status}\nLocation: ${order.location}`,flags:64}});
    if(action==='close'){await discord(`/channels/${order.discordChannelId}`,{method:'PATCH',body:JSON.stringify({name:`closed-${id.toLowerCase()}`})});order.status=order.status==='provisioned'?'provisioned':'closed';await writeJson(ORDERS_FILE,orders);return res.json({type:4,data:{content:'🔒 Ticket closed.',flags:64}});}
    if(action==='paid'){if(!['awaiting_payment','claimed'].includes(order.status))return res.json({type:4,data:{content:`Order is already **${order.status}**.`,flags:64}});order.paymentVerifiedAt=new Date().toISOString();order.paymentVerifiedBy=body.member.user?.id||'unknown';order.status='payment_verified';order.provisioningLock=false;await writeJson(ORDERS_FILE,orders);setImmediate(async()=>{try{await fetch(`http://127.0.0.1:${PORT}/api/automation/provision/${encodeURIComponent(id)}`,{method:'POST',headers:{'Content-Type':'application/json','x-order-automation-secret':AUTOMATION_SECRET},body:'{}'});}catch(e){console.error(e);}});return res.json({type:4,data:{content:`⏳ **Payment verified.** Provisioning **${order.planName}** now…`,flags:64}});}
  } catch(e){console.error(e);return res.json({type:4,data:{content:`❌ Action failed: ${e.message}`,flags:64}});}
});

app.use((req,res,next)=>{ if(req.path==='/api/automation/discord/interactions') return next(); res.setHeader('X-Content-Type-Options','nosniff'); next(); });
app.use((req,res,next)=>{ if(req.path.startsWith('/api/automation/discord/interactions')) return rawApp(req,res,next); next(); });
app.listen(PORT,'127.0.0.1',()=>console.log(`ArveX order automation listening on 127.0.0.1:${PORT}`));
