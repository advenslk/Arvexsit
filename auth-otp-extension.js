import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

// This extension is preloaded before server.js. It replaces the public
// email-auth route registrations while leaving CMS, payments and admin routes intact.
const originalPost = express.application.post;
const originalGet = express.application.get;
const challenges = new Map();
const sessions = new Map();
const USERS_FILE = path.resolve(process.env.AUTH_USERS_FILE || './data/users.json');
const OTP_TTL = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || '';

async function readUsers(){try{return JSON.parse(await fs.readFile(USERS_FILE,'utf8'));}catch{return []}}
async function writeUsers(users){await fs.mkdir(path.dirname(USERS_FILE),{recursive:true});const tmp=`${USERS_FILE}.tmp-${process.pid}`;await fs.writeFile(tmp,JSON.stringify(users,null,2),{encoding:'utf8',mode:0o600});await fs.rename(tmp,USERS_FILE)}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){return new Promise((resolve,reject)=>crypto.scrypt(password,salt,64,{N:16384,r:8,p:1},(e,d)=>e?reject(e):resolve(`${salt}:${d.toString('hex')}`)))}
async function verifyPassword(password,stored){const [salt,hash]=String(stored||'').split(':');if(!salt||!hash)return false;const derived=await hashPassword(password,salt);return crypto.timingSafeEqual(Buffer.from(derived),Buffer.from(`${salt}:${hash}`))}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function validPassword(v){return typeof v==='string'&&v.length>=10&&v.length<=128&&/[A-Za-z]/.test(v)&&/\d/.test(v)}
async function sendMail(to,subject,text){if(!RESEND_API_KEY||!RESEND_FROM)return false;const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:RESEND_FROM,to:[to],subject,text})});return r.ok}
function code(){return String(crypto.randomInt(100000,1000000))}
function normalizeOtp(v){return String(v ?? '').normalize('NFKC').replace(/\s+/g,'').replace(/[^0-9]/g,'').slice(0,6)}
function codeHash(v){return crypto.createHash('sha256').update(normalizeOtp(v),'utf8').digest('hex')}
function validCode(input,expectedHash){const actual=Buffer.from(codeHash(input),'utf8');const expected=Buffer.from(String(expectedHash||''),'utf8');return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected)}
function setCookie(res,id){res.setHeader('Set-Cookie',`arvex_otp_session=${encodeURIComponent(id)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`)}
function getCookie(req){return String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('arvex_otp_session='))?.split('=').slice(1).join('=')}
function publicUser(u){return{id:u.id,name:u.name,email:u.email,role:u.role||'customer',provider:u.provider||'email',avatar:u.avatar||'',createdAt:u.createdAt,emailVerified:Boolean(u.emailVerified)}}
function jsonError(res,status,error){return res.status(status).json({error})}

const postOverrides = new Map();
const getOverrides = new Map();
express.application.post = function(route,...handlers){const override=postOverrides.get(route);return override?originalPost.call(this,route,override):originalPost.call(this,route,...handlers)};
express.application.get = function(route,...handlers){const override=getOverrides.get(route);return override?originalGet.call(this,route,override):originalGet.call(this,route,...handlers)};

postOverrides.set('/api/auth/register', async(req,res)=>{
  const name=String(req.body?.name||'').trim().replace(/\s+/g,' '),email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||'');
  if(name.length<2||name.length>80||!validEmail(email)||!validPassword(password))return jsonError(res,400,'Use a valid name, email and a password of at least 10 characters containing letters and numbers.');
  if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM.');
  const users=await readUsers();if(users.some(u=>u.email===email))return jsonError(res,409,'An account with that email already exists.');
  const user={id:`usr-${crypto.randomUUID()}`,name,email,passwordDigest:await hashPassword(password),role:'customer',provider:'email',emailVerified:false,createdAt:new Date().toISOString()};
  const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'register',user,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});
  const sent=await sendMail(email,'ArveX Hosting email verification',`Hi ${name},\n\nYour ArveX Hosting verification code is ${otp}.\n\nThis code expires in 10 minutes. If you did not create this account, ignore this email.`);
  if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the verification code.');}
  res.status(201).json({ok:true,verificationRequired:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'Account created. A 6-digit verification code was sent to your email.'});
});

postOverrides.set('/api/auth/verify-email-otp',async(req,res)=>{const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),c=challenges.get(id);if(!c||c.type!=='register'||c.expiresAt<Date.now())return jsonError(res,401,'Verification code expired.');if(otp.length!==6)return jsonError(res,401,'Invalid verification code.');if(++c.attempts>MAX_OTP_ATTEMPTS||!validCode(otp,c.codeHash)){if(c.attempts>MAX_OTP_ATTEMPTS)challenges.delete(id);return jsonError(res,401,'Invalid verification code.')}c.user.emailVerified=true;const users=await readUsers();users.push(c.user);await writeUsers(users);challenges.delete(id);const sid=crypto.randomBytes(32).toString('base64url');sessions.set(sid,{userId:c.user.id,expiresAt:Date.now()+7*24*60*60*1000});setCookie(res,sid);res.json({ok:true,user:publicUser(c.user)});});

postOverrides.set('/api/auth/login',async(req,res)=>{const email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||''),users=await readUsers(),user=users.find(u=>u.email===email&&u.provider==='email');if(!user||!await verifyPassword(password,user.passwordDigest))return jsonError(res,401,'Invalid email or password.');if(!user.emailVerified)return jsonError(res,403,'Please verify your email address before signing in.');if(user.banned)return jsonError(res,403,'This account has been disabled.');if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM.');const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'login',user,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});const sent=await sendMail(email,'ArveX Hosting sign-in code',`Your ArveX Hosting sign-in code is ${otp}. It expires in 10 minutes.`);if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the sign-in code.')}res.json({ok:true,requiresTwoFactor:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'A 6-digit sign-in code was sent to your email.'});});

postOverrides.set('/api/auth/verify-login-otp',async(req,res)=>{const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),c=challenges.get(id);if(!c||c.type!=='login'||c.expiresAt<Date.now())return jsonError(res,401,'Sign-in code expired.');if(otp.length!==6)return jsonError(res,401,'Invalid sign-in code.');if(++c.attempts>MAX_OTP_ATTEMPTS||!validCode(otp,c.codeHash)){if(c.attempts>MAX_OTP_ATTEMPTS)challenges.delete(id);return jsonError(res,401,'Invalid sign-in code.')}challenges.delete(id);const sid=crypto.randomBytes(32).toString('base64url');sessions.set(sid,{userId:c.user.id,expiresAt:Date.now()+7*24*60*60*1000});setCookie(res,sid);res.json({ok:true,user:publicUser(c.user)});});

postOverrides.set('/api/auth/forgot-password',async(req,res)=>{const email=String(req.body?.email||'').trim().toLowerCase(),users=await readUsers(),user=users.find(u=>u.email===email&&u.provider==='email');if(!user)return res.json({ok:true,message:'If an account exists, a reset code has been sent.'});if(!RESEND_API_KEY||!RESEND_FROM)return jsonError(res,503,'Password reset email is not configured.');const challengeId=crypto.randomBytes(24).toString('base64url'),otp=code();challenges.set(challengeId,{type:'reset',userId:user.id,codeHash:codeHash(otp),expiresAt:Date.now()+OTP_TTL,attempts:0});const sent=await sendMail(email,'ArveX Hosting password reset code',`Your ArveX Hosting password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`);if(!sent){challenges.delete(challengeId);return jsonError(res,502,'Unable to send the reset code.')}res.json({ok:true,challengeId,expiresAt:Date.now()+OTP_TTL,message:'A password reset code was sent to your email.'});});

postOverrides.set('/api/auth/reset-password',async(req,res)=>{const id=String(req.body?.challengeId||'').trim(),otp=normalizeOtp(req.body?.code),password=String(req.body?.password||''),c=challenges.get(id);if(!c||c.type!=='reset'||c.expiresAt<Date.now())return jsonError(res,401,'Reset code expired.');if(!validPassword(password))return jsonError(res,400,'Password must be at least 10 characters and contain letters and numbers.');if(otp.length!==6)return jsonError(res,401,'Invalid reset code.');if(++c.attempts>MAX_OTP_ATTEMPTS||!validCode(otp,c.codeHash)){if(c.attempts>MAX_OTP_ATTEMPTS)challenges.delete(id);return jsonError(res,401,'Invalid reset code.')}const users=await readUsers(),user=users.find(u=>u.id===c.userId);if(!user)return jsonError(res,404,'Account not found.');user.passwordDigest=await hashPassword(password);user.emailVerified=true;await writeUsers(users);challenges.delete(id);res.json({ok:true});});

getOverrides.set('/api/auth/me',async(req,res)=>{const sid=getCookie(req),session=sid?sessions.get(sid):null;if(!session||session.expiresAt<Date.now())return res.status(401).json({authenticated:false});const user=(await readUsers()).find(u=>u.id===session.userId);if(!user)return res.status(401).json({authenticated:false});res.json({authenticated:true,user:publicUser(user)});});

setInterval(()=>{const now=Date.now();for(const [id,c] of challenges)if(c.expiresAt<=now)challenges.delete(id);for(const [id,s] of sessions)if(s.expiresAt<=now)sessions.delete(id)},60*1000).unref();
