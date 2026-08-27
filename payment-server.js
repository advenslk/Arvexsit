import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PAYMENT_PORT || 5001);
const PUBLIC_ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://arvex.host').replace(/\/$/, '');
const INTERNAL_API_ORIGIN = String(process.env.INTERNAL_API_ORIGIN || 'http://127.0.0.1:5000').replace(/\/$/, '');
const PAYHERE_MERCHANT_ID = String(process.env.PAYHERE_MERCHANT_ID || '').trim();
const PAYHERE_MERCHANT_SECRET = String(process.env.PAYHERE_MERCHANT_SECRET || '').trim();
const PAYHERE_SANDBOX = String(process.env.PAYHERE_SANDBOX || 'true').toLowerCase() === 'true';
const USD_TO_LKR = Number(process.env.PAYHERE_USD_TO_LKR || 300);
const DATA_DIR = path.join(__dirname, 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const ORDERS_FILE = path.join(DATA_DIR, 'payment-orders.json');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  next();
});

async function readJson(file,fallback){try{return JSON.parse(await fs.readFile(file,'utf8'));}catch(error){if(error.code!=='ENOENT')console.error('Read error:',error);return fallback;}}
async function atomicWrite(file,value){await fs.mkdir(DATA_DIR,{recursive:true,mode:0o700});const temp=`${file}.tmp-${process.pid}-${Date.now()}`;await fs.writeFile(temp,JSON.stringify(value,null,2),{encoding:'utf8',mode:0o600});await fs.rename(temp,file);}
function clientKey(req){return String(req.headers['cf-connecting-ip']||req.ip||'unknown');}
function rateLimited(req){const key=clientKey(req),now=Date.now(),entry=attempts.get(key);if(!entry||now-entry.startedAt>WINDOW_MS){attempts.set(key,{startedAt:now,count:0});return false;}return entry.count>=MAX_ATTEMPTS;}
function record(req){const key=clientKey(req),now=Date.now(),entry=attempts.get(key);if(!entry||now-entry.startedAt>WINDOW_MS)attempts.set(key,{startedAt:now,count:1});else entry.count+=1;}
function sameOrigin(req,res,next){const origin=String(req.headers.origin||'');if(origin&&origin!==PUBLIC_ORIGIN)return res.status(403).json({error:'Cross-origin request blocked.'});next();}
function parseCookies(req){const header=String(req.headers.cookie||'');return Object.fromEntries(header.split(';').map(part=>{const i=part.indexOf('=');if(i<0)return[part.trim(),''];return[part.slice(0,i).trim(),decodeURIComponent(part.slice(i+1).trim())];}).filter(([k])=>k));}
async function currentUser(req){const cookie=parseCookies(req).arvex_session;if(!cookie)return null;try{const r=await fetch(`${INTERNAL_API_ORIGIN}/api/auth/me`,{headers:{cookie:`arvex_session=${encodeURIComponent(cookie)}`}});if(!r.ok)return null;const data=await r.json();return data.authenticated?data.user:null;}catch{return null;}}
function md5(value){return crypto.createHash('md5').update(value).digest('hex').toUpperCase();}
function amountString(value){return Number(value).toFixed(2);}
function checkoutHash(orderId,amount,currency){return md5(PAYHERE_MERCHANT_ID+orderId+amountString(amount)+currency+md5(PAYHERE_MERCHANT_SECRET));}
function notifyHash(merchantId,orderId,amount,currency,status){return md5(merchantId+orderId+amount+currency+status+md5(PAYHERE_MERCHANT_SECRET));}
function payhereAction(){return PAYHERE_SANDBOX?'https://sandbox.payhere.lk/pay/checkout':'https://www.payhere.lk/pay/checkout';}
function splitName(name){const parts=String(name||'ArveX Customer').trim().split(/\s+/);return{first:parts.shift()||'ArveX',last:parts.join(' ')||'Customer'};}
function cleanText(value,max=200){return String(value??'').trim().replace(/[<>]/g,'').slice(0,max);}
function getPlan(config,planId){const plans=Array.isArray(config.plans)?config.plans:[];return plans.find(p=>String(p.id)===String(planId)&&p.status!=='inactive')||null;}
function priceForCycle(plan,cycle){if(cycle==='quarterly'&&Number.isFinite(Number(plan.quarterlyPrice)))return Number(plan.quarterlyPrice);if(cycle==='yearly'&&Number.isFinite(Number(plan.yearlyPrice)))return Number(plan.yearlyPrice);return Number(plan.monthlyPrice);}
function normalizeAmountFromPlan(plan,cycle){const usd=priceForCycle(plan,cycle);if(!Number.isFinite(usd)||usd<=0)throw new Error('This plan does not have a valid price.');const lkr=Math.round(usd*USD_TO_LKR*100)/100;return{usd,lkr};}

app.get('/api/payments/payhere/quote',sameOrigin,async(req,res)=>{
  const planId=cleanText(req.query.planId,120),cycle=cleanText(req.query.cycle||'monthly',20);if(!['monthly','quarterly','yearly'].includes(cycle))return res.status(400).json({error:'Invalid billing cycle.'});
  const config=await readJson(CMS_FILE,{}),plan=getPlan(config,planId);if(!plan)return res.status(404).json({error:'Plan not found.'});
  try{const amount=normalizeAmountFromPlan(plan,cycle);res.set('Cache-Control','no-store');return res.json({ok:true,planId:plan.id,planName:plan.name,cycle,amountUsd:amount.usd,amountLkr:amount.lkr,currency:'LKR'});}catch(error){return res.status(400).json({error:error.message});}
});

app.post('/api/payments/payhere/create',sameOrigin,async(req,res)=>{
  if(rateLimited(req))return res.status(429).json({error:'Too many payment attempts. Please try again later.'});
  if(!PAYHERE_MERCHANT_ID||!PAYHERE_MERCHANT_SECRET)return res.status(503).json({error:'PayHere is not configured on this server.'});
  const user=await currentUser(req);if(!user)return res.status(401).json({error:'Please sign in before making a payment.'});
  const planId=cleanText(req.body?.planId,120),cycle=cleanText(req.body?.cycle||'monthly',20);if(!['monthly','quarterly','yearly'].includes(cycle)){record(req);return res.status(400).json({error:'Invalid billing cycle.'});}
  const config=await readJson(CMS_FILE,{}),plan=getPlan(config,planId);if(!plan){record(req);return res.status(404).json({error:'Selected plan is unavailable.'});}
  let amount;try{amount=normalizeAmountFromPlan(plan,cycle);}catch(error){record(req);return res.status(400).json({error:error.message});}
  const phone=cleanText(req.body?.phone,30),address=cleanText(req.body?.address,200),city=cleanText(req.body?.city||'Colombo',80);if(!/^\+?[0-9 ()-]{7,20}$/.test(phone)){record(req);return res.status(400).json({error:'Enter a valid phone number.'});}if(!address||!city){record(req);return res.status(400).json({error:'Billing address and city are required.'});}
  const suppliedId=cleanText(req.body?.orderId,80);const orderId=/^ARX-[A-Z0-9-]{8,70}$/.test(suppliedId)?suppliedId:`ARX-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
  const orders=await readJson(ORDERS_FILE,[]);const existing=orders.find(o=>o.orderId===orderId);if(existing&&existing.status!=='pending')return res.status(409).json({error:'This order has already been processed.'});
  const {first,last}=splitName(user.name);const order={orderId,userId:user.id,userEmail:user.email,customerName:user.name,planId:plan.id,planName:plan.name,cycle,amountUsd:amount.usd,amountLkr:amount.lkr,currency:'LKR',status:'pending',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  const nextOrders=existing?orders.map(o=>o.orderId===orderId?{...o,...order}:o):[...orders,order];await atomicWrite(ORDERS_FILE,nextOrders);
  const fields={merchant_id:PAYHERE_MERCHANT_ID,return_url:`${PUBLIC_ORIGIN}/payment?orderId=${encodeURIComponent(orderId)}&status=return`,cancel_url:`${PUBLIC_ORIGIN}/payment?orderId=${encodeURIComponent(orderId)}&status=cancelled`,notify_url:`${PUBLIC_ORIGIN}/api/payments/payhere/notify`,first_name:first,last_name:last,email:user.email,phone,address,city,country:'Sri Lanka',order_id:orderId,items:`${plan.name} - ${cycle}`,currency:'LKR',amount:amountString(amount.lkr),hash:checkoutHash(orderId,amount.lkr,'LKR'),custom_1:user.id,custom_2:plan.id};
  record(req);res.json({ok:true,action:payhereAction(),fields,orderId,amountUsd:amount.usd,amountLkr:amount.lkr,currency:'LKR'});
});

app.post('/api/payments/payhere/notify',async(req,res)=>{
  const body=req.body||{};const merchantId=cleanText(body.merchant_id,50),orderId=cleanText(body.order_id,100),paymentId=cleanText(body.payment_id,100),amount=cleanText(body.payhere_amount,50),currency=cleanText(body.payhere_currency,10),status=cleanText(body.status_code,10),md5sig=cleanText(body.md5sig,64);
  if(!merchantId||!orderId||!paymentId||!amount||!currency||!status||!md5sig)return res.status(400).send('Missing notification fields.');
  if(!safeSignature(notifyHash(merchantId,orderId,amount,currency,status),md5sig))return res.status(403).send('Invalid payment signature.');
  if(merchantId!==PAYHERE_MERCHANT_ID)return res.status(403).send('Invalid merchant.');
  const orders=await readJson(ORDERS_FILE,[]),order=orders.find(o=>o.orderId===orderId);if(!order)return res.status(404).send('Unknown order.');
  if(currency!==order.currency||Number(amount).toFixed(2)!==Number(order.amountLkr).toFixed(2))return res.status(400).send('Payment amount mismatch.');
  const payments=await readJson(PAYMENTS_FILE,[]);const duplicate=payments.find(p=>p.paymentId===paymentId);if(duplicate)return res.send('OK');
  const statusMap={'2':'success','0':'pending','-1':'failed','-2':'failed','-3':'refunded'};const mapped=statusMap[status]||'failed';const now=new Date().toISOString();
  const payment={id:`pay-${crypto.randomUUID()}`,paymentId,orderId,userId:order.userId,customerName:order.customerName,customerEmail:order.userEmail,amount:Number(amount),currency,provider:'payhere',status:mapped,transactionId:paymentId,date:now,webhookReceived:true,method:cleanText(body.method,40),statusCode:status,statusMessage:cleanText(body.status_message,200)};
  payments.push(payment);await atomicWrite(PAYMENTS_FILE,payments);
  const nextStatus=mapped==='success'?'paid':mapped==='refunded'?'refunded':mapped==='failed'?'failed':'pending';await atomicWrite(ORDERS_FILE,orders.map(o=>o.orderId===orderId?{...o,status:nextStatus,transactionId:paymentId,updatedAt:now,paidAt:mapped==='success'?now:o.paidAt}:o));
  return res.send('OK');
});

function safeSignature(a,b){const aa=Buffer.from(String(a).toUpperCase()),bb=Buffer.from(String(b).toUpperCase());return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb);}
app.get('/api/payments/payhere/status',sameOrigin,async(req,res)=>{
  const orderId=cleanText(req.query.orderId,100);if(!orderId)return res.status(400).json({error:'Order ID is required.'});const user=await currentUser(req);if(!user)return res.status(401).json({error:'Authentication required.'});const orders=await readJson(ORDERS_FILE,[]),order=orders.find(o=>o.orderId===orderId&&o.userId===user.id);if(!order)return res.status(404).json({error:'Order not found.'});res.set('Cache-Control','no-store');return res.json({status:order.status==='paid'?'paid':order.status==='failed'?'failed':order.status==='refunded'?'failed':'pending',statusMessage:order.status,orderId:order.orderId,amountLkr:order.amountLkr,currency:order.currency,transactionId:order.transactionId||null});
});

app.get('/api/payments/health',(_req,res)=>res.json({ok:true,service:'arvex-payments',payhereConfigured:Boolean(PAYHERE_MERCHANT_ID&&PAYHERE_MERCHANT_SECRET),sandbox:PAYHERE_SANDBOX}));

app.listen(PORT,'127.0.0.1',()=>console.log(`ArveX PayHere service listening on 127.0.0.1:${PORT}`));
