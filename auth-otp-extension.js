import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

// OTP/auth extension. It overrides the public email-auth routes before server.js
// registers them, so customer and administrator verification use one consistent
// implementation and do not depend on the server's single-origin middleware.
const originalPost = express.application.post;
const originalGet = express.application.get;
const challenges = new Map();
const sessions = new Map();
const adminChallenges = new Map();
const USERS_FILE = path.resolve(process.env.AUTH_USERS_FILE || './data/users.json');
const OTP_TTL = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = String(process.env.RESEND_FROM || '').trim();
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const TOKEN_SECRET = String(process.env.ADMIN_TOKEN_SECRET || '').trim();
const PUBLIC_ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://arvex.host').replace(/\/$/, '');
const ALLOWED_ORIGINS = new Set([PUBLIC_ORIGIN, 'https://arvex.host', 'https://www.arvex.host']);

async function readUsers(){try{return JSON.parse(await fs.readFile(USERS_FILE,'utf8'));}catch{return []}}
async function writeUsers(users){await fs.mkdir(path.dirname(USERS_FILE),{recursive:true});const tmp=`${USERS_FILE}.tmp-${process.pid}`;await fs.writeFile(tmp,JSON.stringify(users,null,2),{encoding:'utf8',mode:0o600});await fs.rename(tmp,USERS_FILE)}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){return new Promise((resolve,reject)=>crypto.scrypt(password,salt,64,{N:16384,r:8,p:1},(e,d)=>e?reject(e):resolve(`${salt}:${d.toString('hex')}`)))}
async function verifyPassword(password,stored){const [salt,hash]=String(stored||'').split(':');if(!salt||!hash)return false;const derived=await hashPassword(password,salt);const a=Buffer.from(derived),b=Buffer.from(`${salt}:${hash}`);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function validPassword(v){return typeof v==='string'&&v.length>=10&&v.length<=128&&/[A-Za-z]/.test(v)&&/\d/.test(v)}
async function sendMail(to,subject,text){if(!RESEND_API_KEY||!RESEND_FROM)return false;try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json','User-Agent':'ArveX-Hosting/1.0'},body:JSON.stringify({from:RESEND_FROM,to:[to],subject,text})});if(!r.ok)console.error('Resend email failed:',r.status,await r.text().catch(()=>''));return r.ok}catch(error){console.error('Resend request failed:',error);return false}}
function code(){return String(crypto.randomInt(100000,1000000))}
function normalizeOtp(v){return String(v ?? '').normalize('NFKC').replace(/\s+/g,'').replace(/[^0-9]/g,'').slice(0,6)}
function codeHash(v){return crypto.createHash('sha256').update(normalizeOtp(v),'utf8').digest('hex')}
function validCode(input,challenge){const normalized=normalizeOtp(input);if(normalized.length!==6)return false;if(challenge?.code && normalized===normalizeOtp(challenge.code))return true;const actual=Buffer.from(codeHash(normalized),'utf8');const expected=Buffer.from(String(challenge?.codeHash||''),'utf8');return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected)}
function signAdminToken(payload){const body=Buffer.from(JSON.stringify(payload)).toString('base64url');const signature=crypto.createHmac('sha256',TOKEN_SECRET).update(body).digest('base64url');return `${body}.${signature}`}
// Session cookie: survives refreshes, but is discarded when the browser session ends.
function setCookie(res,name,id){res.setHeader('Set-Cookie',`${name}=${encodeURIComponent(id)}; Path=/; HttpOnly; Secure; SameSite=Lax`)}
function getCookie(req,name){return String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(`${name}=`))?.split('=').slice(1).join('=')}
function publicUser(u){return{id:u.id,name:u.name,email:u.email,role:u.role||'customer',provider:u.provider||'email',avatar:u.avatar||'',createdAt:u.createdAt,emailVerified:Boolean(u.emailVerified)}}
function jsonError(res,status,error){return res.status(status).json({error})}
function originAllowed(req){const origin=String(req.headers.origin||'').replace(/\/$/,'');return !origin||ALLOWED_ORIGINS.has(origin)}
function rejectOrigin(req,res){if(!originAllowed(req))return jsonError(res,403,'Cross-origin request blocked.');return false}

const postOverrides = new Map();
const getOverrides = new Map();
express.application.post = function(route,...handlers){const override=postOverrides.get(route);return override?originalPost.call(this,route,override):originalPost.call(this,route,...handlers)};
express.application.get = function(route,...handlers){const override=getOverrides.get(route);return override?originalGet.call(this,route,override):originalGet.call(this,route,...handlers)};

// Customer registration + email OTP.
postOverrides.set('/api/auth/register', async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const name=String(req.body?.name||'').trim().replace(/\s+/g,' '),email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||'');
  if(name.length<2||name.length>80||!validEmail(email)||!validPassword(password))return jsonError(res,400,'Use a valid name, email and a password of at least 10 characters containing letters and numbers.');
  if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM.');
  const users=await readUsers();if(users.some(u=>u.email===email))return jsonError(res,409,'An account with that email already exists.');
  const user={id:`usr-${crypto.randomUUID()}`,name,email,passwordDigest:await hashPassword(password),role:'customer',provider:'email',emailVerified:false,createdAt:new Date().toISOString()};
  const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'register',user,code:otp,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});
  const sent=await sendMail(email,'ArveX Hosting email verification',`Hi ${name},\n\nYour ArveX Hosting verification code is ${otp}.\n\nThis code expires in 10 minutes. If you did not create this account, ignore this email.`);
  if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the verification code.');}
  res.status(201).json({ok:true,verificationRequired:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'Account created. A 6-digit verification code was sent to your email.'});
});

postOverrides.set('/api/auth/verify-email-otp',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),c=challenges.get(id);
  if(!c||c.type!=='register'||c.expiresAt<Date.now())return jsonError(res,401,'Verification code expired. Start registration again.');
  if(otp.length!==6)return jsonError(res,401,'Invalid verification code.');
  c.attempts+=1;if(c.attempts>MAX_OTP_ATTEMPTS){challenges.delete(id);return jsonError(res,401,'Too many verification attempts. Start registration again.')}
  if(!validCode(otp,c))return jsonError(res,401,'Invalid verification code.');
  c.user.emailVerified=true;const users=await readUsers();if(users.some(u=>u.email===c.user.email))return jsonError(res,409,'An account with that email already exists.');users.push(c.user);await writeUsers(users);challenges.delete(id);
  const sid=crypto.randomBytes(32).toString('base64url');sessions.set(sid,{userId:c.user.id,expiresAt:Date.now()+7*24*60*60*1000});setCookie(res,'arvex_otp_session',sid);res.json({ok:true,user:publicUser(c.user)});
});

// Customer password login + email OTP.
postOverrides.set('/api/auth/login',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||''),users=await readUsers(),user=users.find(u=>u.email===email&&u.provider==='email');
  if(!user||!await verifyPassword(password,user.passwordDigest))return jsonError(res,401,'Invalid email or password.');
  if(!user.emailVerified)return jsonError(res,403,'Please verify your email address before signing in.');
  if(user.banned)return jsonError(res,403,'This account has been disabled.');
  if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM.');
  const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'login',user,code:otp,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});
  const sent=await sendMail(email,'ArveX Hosting sign-in code',`Your ArveX Hosting sign-in code is ${otp}. It expires in 10 minutes.`);if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the sign-in code.');}
  res.json({ok:true,requiresTwoFactor:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'A 6-digit sign-in code was sent to your email.'});
});

postOverrides.set('/api/auth/verify-login-otp',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),c=challenges.get(id);
  if(!c||c.type!=='login'||c.expiresAt<Date.now())return jsonError(res,401,'Sign-in code expired. Start sign-in again.');
  if(otp.length!==6)return jsonError(res,401,'Invalid sign-in code.');
  c.attempts+=1;if(c.attempts>MAX_OTP_ATTEMPTS){challenges.delete(id);return jsonError(res,401,'Too many verification attempts. Start sign-in again.')}
  if(!validCode(otp,c))return jsonError(res,401,'Invalid sign-in code.');
  challenges.delete(id);const sid=crypto.randomBytes(32).toString('base64url');sessions.set(sid,{userId:c.user.id,expiresAt:Date.now()+7*24*60*60*1000});setCookie(res,'arvex_otp_session',sid);res.json({ok:true,user:publicUser(c.user)});
});

// Customer password reset + OTP.
postOverrides.set('/api/auth/forgot-password',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const email=String(req.body?.email||'').trim().toLowerCase(),users=await readUsers(),user=users.find(u=>u.email===email&&u.provider==='email');
  if(!user)return res.json({ok:true,message:'If an account exists, a reset code has been sent.'});
  if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Password reset email is not configured.');
  const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'reset',userId:user.id,code:otp,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});
  const sent=await sendMail(email,'ArveX Hosting password reset code',`Your ArveX Hosting password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`);if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the reset code.');}
  res.json({ok:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'A password reset code was sent to your email.'});
});

postOverrides.set('/api/auth/reset-password',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),password=String(req.body?.password||''),c=challenges.get(id);
  if(!c||c.type!=='reset'||c.expiresAt<Date.now())return jsonError(res,401,'Reset code expired. Start password reset again.');
  if(!validPassword(password))return jsonError(res,400,'Password must be at least 10 characters and contain letters and numbers.');if(otp.length!==6)return jsonError(res,401,'Invalid reset code.');
  c.attempts+=1;if(c.attempts>MAX_OTP_ATTEMPTS){challenges.delete(id);return jsonError(res,401,'Too many reset attempts. Start password reset again.')}if(!validCode(otp,c))return jsonError(res,401,'Invalid reset code.');
  const users=await readUsers(),user=users.find(u=>u.id===c.userId);if(!user)return jsonError(res,404,'Account not found.');user.passwordDigest=await hashPassword(password);user.emailVerified=true;await writeUsers(users);challenges.delete(id);res.json({ok:true});
});

// Administrator password + email OTP. This override intentionally bypasses the
// old single-origin middleware in server.js while still enforcing our allowlist.
postOverrides.set('/api/admin/login',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  if(!ADMIN_EMAIL||!ADMIN_PASSWORD||!TOKEN_SECRET)return jsonError(res,503,'Admin authentication is not configured on the server.');
  if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Administrator email verification is not configured.');
  const email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||'');
  if(email!==ADMIN_EMAIL||password!==ADMIN_PASSWORD)return jsonError(res,401,'Invalid administrator credentials.');
  const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();adminChallenges.set(challengeId,{email,code:otp,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});
  const sent=await sendMail(ADMIN_EMAIL,'ArveX administrator verification code',`Your ArveX administrator verification code is ${otp}. It expires in 10 minutes. If you did not request this, secure your account immediately.`);
  if(!sent){adminChallenges.delete(challengeId);return jsonError(res,502,'Unable to send the administrator verification code.');}
  res.json({ok:true,requiresTwoFactor:true,challengeId,expiresAt:Date.now()+OTP_TTL});
});

postOverrides.set('/api/admin/verify-otp',async(req,res)=>{
  if(rejectOrigin(req,res))return;
  const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),c=adminChallenges.get(id);
  if(!c||c.expiresAt<Date.now())return jsonError(res,401,'Administrator verification code expired. Start administrator sign-in again.');
  if(otp.length!==6)return jsonError(res,401,'Invalid administrator verification code.');
  c.attempts+=1;if(c.attempts>MAX_OTP_ATTEMPTS){adminChallenges.delete(id);return jsonError(res,401,'Too many verification attempts. Start administrator sign-in again.')}
  if(!validCode(otp,c))return jsonError(res,401,'Invalid administrator verification code.');
  adminChallenges.delete(id);const expiresAt=Date.now()+8*60*60*1000;const token=signAdminToken({role:'admin',email:ADMIN_EMAIL,exp:expiresAt});res.json({ok:true,token,expiresAt,user:{id:'admin-primary',name:'ArveX Administrator',email:ADMIN_EMAIL,role:'admin',provider:'email',emailVerified:true,createdAt:new Date().toISOString()}});
});

getOverrides.set('/api/auth/me',async(req,res)=>{const sid=getCookie(req,'arvex_otp_session'),session=sid?sessions.get(sid):null;if(!session||session.expiresAt<Date.now())return res.status(401).json({authenticated:false});const user=(await readUsers()).find(u=>u.id===session.userId);if(!user)return res.status(401).json({authenticated:false});res.json({authenticated:true,user:publicUser(user)});});

setInterval(()=>{const now=Date.now();for(const [id,c] of challenges)if(c.expiresAt<=now)challenges.delete(id);for(const [id,c] of adminChallenges)if(c.expiresAt<=now)adminChallenges.delete(id);for(const [id,s] of sessions)if(s.expiresAt<=now)sessions.delete(id)},60*1000).unref();