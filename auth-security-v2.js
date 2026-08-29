import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

/*
 * ArveX Security V2
 *
 * Loaded before server.js. It replaces the legacy in-memory OTP/session
 * overrides with a persistent, server-authoritative authentication layer.
 * The website UI is intentionally left unchanged in this phase.
 */
const originalPost = express.application.post;
const originalGet = express.application.get;
const originalDelete = express.application.delete;
const postOverrides = new Map();
const getOverrides = new Map();
const deleteOverrides = new Map();

const DATA_DIR = path.resolve(process.env.AUTH_DATA_DIR || './data');
const USERS_FILE = path.resolve(process.env.AUTH_USERS_FILE || path.join(DATA_DIR, 'users.json'));
const SESSIONS_FILE = path.resolve(process.env.AUTH_SESSIONS_FILE || path.join(DATA_DIR, 'auth-sessions.json'));
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = String(process.env.RESEND_FROM || '').trim();
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const TOKEN_SECRET = String(process.env.ADMIN_TOKEN_SECRET || '').trim();
const PUBLIC_ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://arvex.host').replace(/\/$/, '');
const ALLOWED_ORIGINS = new Set([PUBLIC_ORIGIN, 'https://arvex.host', 'https://www.arvex.host']);

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_IDLE_MS = 24 * 60 * 60 * 1000;
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;
const MAX_OTP_REQUESTS = 6;

const otpChallenges = new Map();
const adminChallenges = new Map();
const rateLimits = new Map();
let sessionWriteQueue = Promise.resolve();

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') console.error(`Auth read error for ${file}:`, error.message);
    return fallback;
  }
}

async function atomicWrite(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.tmp-${process.pid}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temp, file);
}

const readUsers = () => readJson(USERS_FILE, []);
const writeUsers = users => atomicWrite(USERS_FILE, users);

async function readSessions() {
  const value = await readJson(SESSIONS_FILE, {});
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function queueSessionWrite(mutator) {
  sessionWriteQueue = sessionWriteQueue.then(async () => {
    const sessions = await readSessions();
    await mutator(sessions);
    await atomicWrite(SESSIONS_FILE, sessions);
  });
  return sessionWriteQueue;
}

function sessionDigest(id) {
  return crypto.createHash('sha256').update(String(id), 'utf8').digest('hex');
}

async function createPersistentSession({ userId, role, email, provider = 'email' }) {
  const id = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  await queueSessionWrite(sessions => {
    sessions[sessionDigest(id)] = { userId, role, email, provider, createdAt: now, lastSeenAt: now, expiresAt: now + SESSION_TTL_MS };
  });
  return id;
}

async function getPersistentSession(req, touch = true) {
  const id = getCookie(req, 'arvex_secure_session');
  if (!id) return null;
  const digest = sessionDigest(id);
  const sessions = await readSessions();
  const session = sessions[digest];
  const now = Date.now();
  if (!session || Number(session.expiresAt) <= now || now - Number(session.lastSeenAt || session.createdAt || 0) > SESSION_IDLE_MS) {
    if (session) await queueSessionWrite(store => { delete store[digest]; });
    return null;
  }
  if (touch) {
    await queueSessionWrite(store => {
      if (store[digest]) store[digest].lastSeenAt = now;
    });
  }
  return { id, digest, ...session };
}

async function revokeSessionById(id) {
  if (!id) return;
  const digest = sessionDigest(id);
  await queueSessionWrite(sessions => { delete sessions[digest]; });
}

async function revokeUserSessions(userId) {
  await queueSessionWrite(sessions => {
    for (const [digest, session] of Object.entries(sessions)) {
      if (session.userId === userId) delete sessions[digest];
    }
  });
}

async function revokeAdminSessions() {
  await queueSessionWrite(sessions => {
    for (const [digest, session] of Object.entries(sessions)) {
      if (session.role === 'admin') delete sessions[digest];
    }
  });
}

function setSessionCookie(res, id) {
  res.setHeader('Set-Cookie', `arvex_secure_session=${encodeURIComponent(id)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'arvex_secure_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}

function getCookie(req, name) {
  const header = String(req.headers.cookie || '');
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return '';
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, derived) => {
    if (error) reject(error); else resolve(`${salt}:${derived.toString('hex')}`);
  }));
}

async function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  return safeEqual(await passwordHash(password, salt), `${salt}:${hash}`);
}

function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function validPassword(value) { return typeof value === 'string' && value.length >= 10 && value.length <= 128 && /[A-Za-z]/.test(value) && /\d/.test(value); }
function otpCode() { return String(crypto.randomInt(100000, 1000000)); }
function otpHash(value) { return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex'); }

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'customer',
    provider: user.provider || 'email',
    avatar: user.avatar || '',
    createdAt: user.createdAt,
    emailVerified: Boolean(user.emailVerified),
  };
}

function jsonError(res, status, error) { return res.status(status).json({ error }); }

function originAllowed(req) {
  const origin = String(req.headers.origin || '').replace(/\/$/, '');
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function rejectOrigin(req, res) {
  if (!originAllowed(req)) return jsonError(res, 403, 'Cross-origin request blocked.');
  return false;
}

function clientKey(req) {
  return String(req.headers['cf-connecting-ip'] || req.ip || 'unknown');
}

function limited(bucket, req, max) {
  const key = `${bucket}:${clientKey(req)}`;
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now - entry.startedAt > RATE_WINDOW_MS) {
    rateLimits.set(key, { startedAt: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

async function sendMail(to, subject, text) {
  if (!RESEND_API_KEY || !RESEND_FROM) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', 'User-Agent': 'ArveX-Hosting/1.0' },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, text }),
    });
    return response.ok;
  } catch { return false; }
}

function signAdminToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyAdminToken(token) {
  try {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature || !TOKEN_SECRET) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
    if (!safeEqual(signature, expected)) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.role === 'admin' && Number(payload.exp) > Date.now() && payload.email === ADMIN_EMAIL;
  } catch { return false; }
}

async function authenticate(req) {
  const session = await getPersistentSession(req);
  if (session) return session;
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (verifyAdminToken(bearer)) return { role: 'admin', email: ADMIN_EMAIL, userId: 'admin-primary', provider: 'email', token: true };
  return null;
}

function installOverrides() {
  express.application.post = function(route, ...handlers) {
    const override = postOverrides.get(route);
    return override ? originalPost.call(this, route, override) : originalPost.call(this, route, ...handlers);
  };
  express.application.get = function(route, ...handlers) {
    const override = getOverrides.get(route);
    return override ? originalGet.call(this, route, override) : originalGet.call(this, route, ...handlers);
  };
  express.application.delete = function(route, ...handlers) {
    const override = deleteOverrides.get(route);
    return override ? originalDelete.call(this, route, override) : originalDelete.call(this, route, ...handlers);
  };
}

postOverrides.set('/api/auth/register', async (req, res) => {
  if (rejectOrigin(req, res) || limited('register', req, MAX_LOGIN_ATTEMPTS)) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (name.length < 2 || name.length > 80 || !validEmail(email) || !validPassword(password)) return jsonError(res, 400, 'Use a valid name, email and a password of at least 10 characters containing letters and numbers.');
  if (!RESEND_API_KEY || !RESEND_FROM) return jsonError(res, 503, 'Email verification is not configured on the server.');
  const users = await readUsers();
  if (users.some(user => user.email === email)) return jsonError(res, 409, 'An account with that email already exists.');
  const user = { id: `usr-${crypto.randomUUID()}`, name, email, passwordDigest: await passwordHash(password), role: 'customer', provider: 'email', emailVerified: false, createdAt: new Date().toISOString() };
  const challengeId = crypto.randomBytes(24).toString('base64url');
  const code = otpCode();
  otpChallenges.set(challengeId, { type: 'register', user, codeHash: otpHash(code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  const sent = await sendMail(email, 'ArveX Hosting email verification', `Hi ${name},\n\nYour ArveX Hosting verification code is ${code}.\n\nThis code expires in 10 minutes.`);
  if (!sent) { otpChallenges.delete(challengeId); return jsonError(res, 502, 'Unable to send the verification code.'); }
  res.status(201).json({ ok: true, verificationRequired: true, challengeId, expiresAt: Date.now() + OTP_TTL_MS, message: 'A 6-digit verification code was sent to your email.' });
});

postOverrides.set('/api/auth/verify-email-otp', async (req, res) => {
  if (rejectOrigin(req, res) || limited('otp', req, MAX_OTP_REQUESTS)) return res.status(429).json({ error: 'Too many verification attempts. Please try again later.' });
  const id = String(req.body?.challengeId || '');
  const code = String(req.body?.code || '').replace(/\D/g, '');
  const challenge = otpChallenges.get(id);
  if (!challenge || challenge.type !== 'register' || challenge.expiresAt <= Date.now()) return jsonError(res, 401, 'Verification code expired. Start registration again.');
  challenge.attempts += 1;
  if (challenge.attempts > MAX_OTP_ATTEMPTS) { otpChallenges.delete(id); return jsonError(res, 401, 'Too many verification attempts.'); }
  if (code.length !== 6 || !safeEqual(otpHash(code), challenge.codeHash)) return jsonError(res, 401, 'Invalid verification code.');
  challenge.user.emailVerified = true;
  const users = await readUsers();
  if (users.some(user => user.email === challenge.user.email)) return jsonError(res, 409, 'An account with that email already exists.');
  users.push(challenge.user);
  await writeUsers(users);
  otpChallenges.delete(id);
  const sessionId = await createPersistentSession({ userId: challenge.user.id, role: 'customer', email: challenge.user.email });
  setSessionCookie(res, sessionId);
  res.json({ ok: true, user: publicUser(challenge.user) });
});

postOverrides.set('/api/auth/login', async (req, res) => {
  if (rejectOrigin(req, res) || limited('login', req, MAX_LOGIN_ATTEMPTS)) return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const users = await readUsers();
  const user = users.find(candidate => candidate.email === email && candidate.provider === 'email');
  if (!user || !await verifyPassword(password, user.passwordDigest)) return jsonError(res, 401, 'Invalid email or password.');
  if (!user.emailVerified) return jsonError(res, 403, 'Please verify your email address before signing in.');
  if (user.banned) return jsonError(res, 403, 'This account has been disabled.');
  if (!RESEND_API_KEY || !RESEND_FROM) return jsonError(res, 503, 'Email sign-in verification is not configured on the server.');
  const challengeId = crypto.randomBytes(24).toString('base64url');
  const code = otpCode();
  otpChallenges.set(challengeId, { type: 'login', user, codeHash: otpHash(code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  const sent = await sendMail(email, 'ArveX Hosting sign-in code', `Your ArveX Hosting sign-in code is ${code}. It expires in 10 minutes.`);
  if (!sent) { otpChallenges.delete(challengeId); return jsonError(res, 502, 'Unable to send the sign-in code.'); }
  res.json({ ok: true, requiresTwoFactor: true, challengeId, expiresAt: Date.now() + OTP_TTL_MS, message: 'A 6-digit sign-in code was sent to your email.' });
});

postOverrides.set('/api/auth/verify-login-otp', async (req, res) => {
  if (rejectOrigin(req, res) || limited('otp', req, MAX_OTP_REQUESTS)) return res.status(429).json({ error: 'Too many verification attempts. Please try again later.' });
  const id = String(req.body?.challengeId || '');
  const code = String(req.body?.code || '').replace(/\D/g, '');
  const challenge = otpChallenges.get(id);
  if (!challenge || challenge.type !== 'login' || challenge.expiresAt <= Date.now()) return jsonError(res, 401, 'Sign-in code expired. Start sign-in again.');
  challenge.attempts += 1;
  if (challenge.attempts > MAX_OTP_ATTEMPTS) { otpChallenges.delete(id); return jsonError(res, 401, 'Too many verification attempts.'); }
  if (code.length !== 6 || !safeEqual(otpHash(code), challenge.codeHash)) return jsonError(res, 401, 'Invalid sign-in code.');
  otpChallenges.delete(id);
  const sessionId = await createPersistentSession({ userId: challenge.user.id, role: 'customer', email: challenge.user.email, provider: challenge.user.provider });
  setSessionCookie(res, sessionId);
  res.json({ ok: true, user: publicUser(challenge.user) });
});

postOverrides.set('/api/auth/forgot-password', async (req, res) => {
  if (rejectOrigin(req, res)) return;
  const email = String(req.body?.email || '').trim().toLowerCase();
  const users = await readUsers();
  const user = users.find(candidate => candidate.email === email && candidate.provider === 'email');
  if (!user) return res.json({ ok: true, message: 'If an account exists, a reset code has been sent.' });
  if (!RESEND_API_KEY || !RESEND_FROM) return jsonError(res, 503, 'Password reset email is not configured.');
  const challengeId = crypto.randomBytes(24).toString('base64url');
  const code = otpCode();
  otpChallenges.set(challengeId, { type: 'reset', userId: user.id, codeHash: otpHash(code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  const sent = await sendMail(email, 'ArveX Hosting password reset code', `Your ArveX Hosting password reset code is ${code}. It expires in 10 minutes.`);
  if (!sent) { otpChallenges.delete(challengeId); return jsonError(res, 502, 'Unable to send the reset code.'); }
  res.json({ ok: true, challengeId, expiresAt: Date.now() + OTP_TTL_MS, message: 'A password reset code was sent to your email.' });
});

postOverrides.set('/api/auth/reset-password', async (req, res) => {
  if (rejectOrigin(req, res)) return;
  const id = String(req.body?.challengeId || '');
  const code = String(req.body?.code || '').replace(/\D/g, '');
  const password = String(req.body?.password || '');
  const challenge = otpChallenges.get(id);
  if (!challenge || challenge.type !== 'reset' || challenge.expiresAt <= Date.now()) return jsonError(res, 401, 'Reset code expired. Start password reset again.');
  if (!validPassword(password)) return jsonError(res, 400, 'Password must be at least 10 characters and contain letters and numbers.');
  challenge.attempts += 1;
  if (challenge.attempts > MAX_OTP_ATTEMPTS) { otpChallenges.delete(id); return jsonError(res, 401, 'Too many reset attempts.'); }
  if (code.length !== 6 || !safeEqual(otpHash(code), challenge.codeHash)) return jsonError(res, 401, 'Invalid reset code.');
  const users = await readUsers();
  const user = users.find(candidate => candidate.id === challenge.userId);
  if (!user) return jsonError(res, 404, 'Account not found.');
  user.passwordDigest = await passwordHash(password);
  user.emailVerified = true;
  await writeUsers(users);
  await revokeUserSessions(user.id);
  otpChallenges.delete(id);
  res.json({ ok: true });
});

postOverrides.set('/api/admin/login', async (req, res) => {
  if (rejectOrigin(req, res) || limited('admin-login', req, MAX_LOGIN_ATTEMPTS)) return res.status(429).json({ error: 'Too many administrator login attempts. Please try again later.' });
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !TOKEN_SECRET) return jsonError(res, 503, 'Admin authentication is not configured on the server.');
  if (!RESEND_API_KEY || !RESEND_FROM) return jsonError(res, 503, 'Administrator email verification is not configured.');
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!safeEqual(email, ADMIN_EMAIL) || !safeEqual(password, ADMIN_PASSWORD)) return jsonError(res, 401, 'Invalid administrator credentials.');
  const challengeId = crypto.randomBytes(24).toString('base64url');
  const code = otpCode();
  adminChallenges.set(challengeId, { codeHash: otpHash(code), expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
  const sent = await sendMail(ADMIN_EMAIL, 'ArveX administrator verification code', `Your ArveX administrator verification code is ${code}. It expires in 10 minutes. If you did not request this, secure your account immediately.`);
  if (!sent) { adminChallenges.delete(challengeId); return jsonError(res, 502, 'Unable to send the administrator verification code.'); }
  res.json({ ok: true, requiresTwoFactor: true, challengeId, expiresAt: Date.now() + OTP_TTL_MS });
});

postOverrides.set('/api/admin/verify-otp', async (req, res) => {
  if (rejectOrigin(req, res) || limited('admin-otp', req, MAX_OTP_REQUESTS)) return res.status(429).json({ error: 'Too many administrator verification attempts.' });
  const id = String(req.body?.challengeId || '');
  const code = String(req.body?.code || '').replace(/\D/g, '');
  const challenge = adminChallenges.get(id);
  if (!challenge || challenge.expiresAt <= Date.now()) return jsonError(res, 401, 'Administrator verification code expired. Start administrator sign-in again.');
  challenge.attempts += 1;
  if (challenge.attempts > MAX_OTP_ATTEMPTS) { adminChallenges.delete(id); return jsonError(res, 401, 'Too many verification attempts.'); }
  if (code.length !== 6 || !safeEqual(otpHash(code), challenge.codeHash)) return jsonError(res, 401, 'Invalid administrator verification code.');
  adminChallenges.delete(id);
  await revokeAdminSessions();
  const sessionId = await createPersistentSession({ userId: 'admin-primary', role: 'admin', email: ADMIN_EMAIL });
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const token = signAdminToken({ role: 'admin', email: ADMIN_EMAIL, exp: expiresAt });
  setSessionCookie(res, sessionId);
  res.json({ ok: true, token, expiresAt, user: { id: 'admin-primary', name: 'ArveX Administrator', email: ADMIN_EMAIL, role: 'admin', provider: 'email', emailVerified: true, createdAt: new Date().toISOString() } });
});

getOverrides.set('/api/auth/me', async (req, res) => {
  const auth = await authenticate(req);
  if (!auth) return res.status(401).json({ authenticated: false });
  if (auth.role === 'admin') return res.json({ authenticated: true, user: { id: 'admin-primary', name: 'ArveX Administrator', email: ADMIN_EMAIL, role: 'admin', provider: 'email', emailVerified: true } });
  const users = await readUsers();
  const user = users.find(candidate => candidate.id === auth.userId);
  if (!user || user.banned) {
    if (auth.id) await revokeSessionById(auth.id);
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, user: publicUser(user) });
});

postOverrides.set('/api/auth/logout', async (req, res) => {
  const id = getCookie(req, 'arvex_secure_session');
  if (id) await revokeSessionById(id);
  clearSessionCookie(res);
  res.json({ ok: true });
});

postOverrides.set('/api/admin/logout', async (req, res) => {
  const id = getCookie(req, 'arvex_secure_session');
  if (id) await revokeSessionById(id);
  clearSessionCookie(res);
  res.json({ ok: true });
});

getOverrides.set('/api/auth/session', async (req, res) => {
  const auth = await authenticate(req);
  res.json({ authenticated: Boolean(auth), role: auth?.role || null });
});

installOverrides();
console.log('[ArveX Security V2] persistent authentication layer loaded');
