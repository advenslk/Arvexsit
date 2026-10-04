import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

import {
  INITIAL_SITE_SETTINGS,
  INITIAL_SITE_IMAGES,
  INITIAL_GAMES,
  INITIAL_PLANS,
  INITIAL_GENERAL_SERVICES,
  INITIAL_TLDS,
  INITIAL_SERVER_LOCATIONS,
  INITIAL_COMPARISON_ROWS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_PARTNERS,
  INITIAL_REVIEWS,
  INITIAL_BLOG_POSTS,
  INITIAL_COUPONS,
  CURRENCIES,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_STATUS_COMPONENTS,
  INITIAL_STATUS_INCIDENTS,
  INITIAL_SERVER_NODES,
  INITIAL_ADMIN_USERS,
} from './src/data/initialData';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'auth-sessions.json');
const ORDERS_FILE = path.join(DATA_DIR, 'payment-orders.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const SECURITY_LOGS_FILE = path.join(DATA_DIR, 'security-logs.json');

async function appendSecurityLog(entry: {
  actor: string;
  type: string;
  provider?: string;
  ip?: string;
  userAgent?: string;
  details?: string;
  severity?: 'info' | 'warning' | 'critical';
}) {
  try {
    const logs = await readJson<any[]>(SECURITY_LOGS_FILE, []);
    logs.unshift({
      id: `sec-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      severity: entry.severity || 'info',
      ...entry,
    });
    if (logs.length > 500) logs.length = 500;
    await atomicWrite(SECURITY_LOGS_FILE, logs);
  } catch (err) {
    console.error('Error writing security log:', err);
  }
}

const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || 'admin@helzerx.cloud').trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || 'Admin@123456!');
const TOKEN_SECRET = String(process.env.ADMIN_TOKEN_SECRET || 'arvex-super-secret-production-admin-key-2026-v2-32chars');
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = String(process.env.RESEND_FROM || 'HelzerX Cloud <noreply@arvex.host>').trim();
const PAYHERE_MERCHANT_ID = String(process.env.PAYHERE_MERCHANT_ID || '1226999').trim();
const PAYHERE_MERCHANT_SECRET = String(process.env.PAYHERE_MERCHANT_SECRET || 'arvex-payhere-secret-dev').trim();
const PAYHERE_SANDBOX = String(process.env.PAYHERE_SANDBOX || 'true').toLowerCase() === 'true';
const USD_TO_LKR = Number(process.env.PAYHERE_USD_TO_LKR || 300);

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const OTP_TTL_MS = 10 * 60 * 1000;

interface SessionData {
  userId: string;
  role: 'admin' | 'customer';
  email: string;
  provider: string;
  createdAt: number;
  expiresAt: number;
}

interface OtpChallenge {
  type: 'admin' | 'register' | 'login' | 'reset';
  code: string;
  codeHash: string;
  email: string;
  user?: any;
  userId?: string;
  expiresAt: number;
  attempts: number;
}

const otpChallenges = new Map<string, OtpChallenge>();
const inMemorySessions = new Map<string, SessionData>();

// Helpers
async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function atomicWrite(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(temp, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temp, file);
}

function safeEqual(a: string | Buffer, b: string | Buffer): boolean {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function passwordHash(password: string, salt = crypto.randomBytes(16).toString('hex')): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derived) => {
      if (err) reject(err);
      else resolve(`${salt}:${derived.toString('hex')}`);
    });
  });
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  return safeEqual(await passwordHash(password, salt), `${salt}:${hash}`);
}

function signAdminToken(payload: { role: string; email: string; exp: number }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  try {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature || !TOKEN_SECRET) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
    if (!safeEqual(signature, expected)) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.role === 'admin' && Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

function parseCookies(req: Request): Record<string, string> {
  const header = String(req.headers.cookie || '');
  return Object.fromEntries(
    header.split(';').map((part) => {
      const idx = part.indexOf('=');
      if (idx < 0) return [part.trim(), ''];
      return [part.slice(0, idx).trim(), decodeURIComponent(part.slice(idx + 1).trim())];
    }).filter(([k]) => Boolean(k))
  );
}

function setSessionCookie(res: Response, sessionId: string) {
  res.setHeader('Set-Cookie', [
    `arvex_secure_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
    `arvex_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ]);
}

function clearSessionCookie(res: Response) {
  res.setHeader('Set-Cookie', [
    'arvex_secure_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    'arvex_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  ]);
}

function createSession(user: { id: string; role: 'admin' | 'customer'; email: string; provider?: string }): string {
  const id = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  const session: SessionData = {
    userId: user.id,
    role: user.role,
    email: user.email,
    provider: user.provider || 'email',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  inMemorySessions.set(id, session);
  return id;
}

function getSession(req: Request): SessionData | null {
  const cookies = parseCookies(req);
  const id = cookies.arvex_secure_session || cookies.arvex_session;
  if (!id) return null;
  const session = inMemorySessions.get(id);
  if (!session || session.expiresAt <= Date.now()) {
    if (id) inMemorySessions.delete(id);
    return null;
  }
  return session;
}

function publicUser(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
    email: user.email,
    role: user.role || 'customer',
    provider: user.provider || 'email',
    avatar: user.avatar || '',
    phone: user.phone || '',
    country: user.country || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    postalCode: user.postalCode || '',
    company: user.company || '',
    accountType: user.accountType || 'individual',
    createdAt: user.createdAt,
    emailVerified: Boolean(user.emailVerified),
  };
}

async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[HelzerX Email Delivery Simulation] To: ${to} | Subject: ${subject}\n${text}`);
    return true;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, text }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to send email via Resend:', err);
    return false;
  }
}

// Seed initial CMS config if empty or not found
async function ensureCmsConfigInitialized() {
  const current = await readJson<Record<string, unknown>>(CMS_FILE, {});
  if (!current.plans || !current.siteSettings) {
    const seed = {
      siteSettings: INITIAL_SITE_SETTINGS,
      siteImages: {
        ...INITIAL_SITE_IMAGES,
        logoUrl: 'https://www.image2url.com/r2/default/images/1787805975676-5a4d373d-c6bd-4d39-bb64-1336474f4a7a.png',
      },
      games: INITIAL_GAMES,
      plans: INITIAL_PLANS,
      generalServices: INITIAL_GENERAL_SERVICES,
      tlds: INITIAL_TLDS,
      locations: INITIAL_SERVER_LOCATIONS,
      comparisonRows: INITIAL_COMPARISON_ROWS,
      faqs: INITIAL_FAQS,
      testimonials: INITIAL_TESTIMONIALS,
      partners: INITIAL_PARTNERS,
      reviews: INITIAL_REVIEWS,
      blogPosts: INITIAL_BLOG_POSTS,
      coupons: INITIAL_COUPONS,
      currenciesList: CURRENCIES,
      currency: CURRENCIES[1] || CURRENCIES[0],
      paymentSettings: INITIAL_PAYMENT_SETTINGS,
      statusComponents: INITIAL_STATUS_COMPONENTS,
      statusIncidents: INITIAL_STATUS_INCIDENTS,
      serverNodes: INITIAL_SERVER_NODES,
      adminUsers: INITIAL_ADMIN_USERS,
    };
    await atomicWrite(CMS_FILE, seed);
    console.log('[HelzerX CMS] Seeded default CMS configuration to data/cms.json');
  }
}

async function start() {
  await ensureCmsConfigInitialized();

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // CORS and origin handling
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Health
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'arvex-hosting', time: new Date().toISOString() }));
  app.get('/api/payments/health', (_req, res) => res.json({ ok: true, service: 'arvex-payments', payhereConfigured: Boolean(PAYHERE_MERCHANT_ID) }));
  app.get('/api/automation/health', (_req, res) => res.json({ ok: true, service: 'arvex-automation' }));
  app.get('/automation-health', (_req, res) => res.json({ ok: true, service: 'arvex-automation' }));

  // CMS
  const PUBLIC_CMS_KEYS = new Set([
    'siteSettings', 'siteImages', 'games', 'plans', 'generalServices', 'tlds',
    'locations', 'comparisonRows', 'faqs', 'testimonials', 'partners', 'reviews',
    'blogPosts', 'currenciesList', 'currency', 'statusComponents', 'statusIncidents',
  ]);

  app.get('/api/cms/config', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    const config = await readJson<Record<string, unknown>>(CMS_FILE, {});
    const publicConfig: Record<string, unknown> = {};
    for (const key of PUBLIC_CMS_KEYS) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        publicConfig[key] = config[key];
      }
    }
    res.json(publicConfig);
  });

  app.post('/api/cms/config/:key', async (req, res) => {
    const { key } = req.params;
    const config = await readJson<Record<string, unknown>>(CMS_FILE, {});
    config[key] = req.body?.value;
    await atomicWrite(CMS_FILE, config);
    res.json({ ok: true, key });
  });

  app.delete('/api/cms/config/:key', async (req, res) => {
    const { key } = req.params;
    const config = await readJson<Record<string, unknown>>(CMS_FILE, {});
    delete config[key];
    await atomicWrite(CMS_FILE, config);
    res.json({ ok: true, key });
  });

  // Auth: me
  app.get('/api/auth/me', async (req, res) => {
    const session = getSession(req);
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (session?.role === 'admin' || verifyAdminToken(bearer || '')) {
      return res.json({
        authenticated: true,
        user: {
          id: 'admin-primary',
          name: 'HelzerX Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
          provider: 'email',
          emailVerified: true,
        },
      });
    }

    if (session) {
      const users = await readJson<any[]>(USERS_FILE, []);
      const user = users.find((u) => u.id === session.userId);
      if (user && !user.banned) {
        return res.json({ authenticated: true, user: publicUser(user) });
      }
    }

    return res.status(401).json({ authenticated: false });
  });

  app.get('/api/auth/session', (req, res) => {
    const session = getSession(req);
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    const isAdmin = session?.role === 'admin' || verifyAdminToken(bearer || '');
    res.json({ authenticated: Boolean(session || isAdmin), role: isAdmin ? 'admin' : session?.role || null });
  });

  // Admin login
  app.post('/api/admin/login', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!safeEqual(email, ADMIN_EMAIL) || !safeEqual(password, ADMIN_PASSWORD)) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const challengeId = crypto.randomBytes(24).toString('base64url');
    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    otpChallenges.set(challengeId, {
      type: 'admin',
      code,
      codeHash,
      email: ADMIN_EMAIL,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    await sendMail(ADMIN_EMAIL, 'HelzerX administrator verification code', `Your HelzerX verification code is: ${code}`);

    res.json({
      ok: true,
      requiresTwoFactor: true,
      challengeId,
      expiresAt: Date.now() + OTP_TTL_MS,
      message: RESEND_API_KEY
        ? 'A 6-digit verification code was sent to the administrator email.'
        : `Admin verification code generated: ${code}`,
      devCode: RESEND_API_KEY ? undefined : code,
    });
  });

  // Admin verify OTP
  app.post('/api/admin/verify-otp', async (req, res) => {
    const challengeId = String(req.body?.challengeId || '');
    const code = String(req.body?.code || '').replace(/\D/g, '');
    const challenge = otpChallenges.get(challengeId);

    if (!challenge || challenge.type !== 'admin' || challenge.expiresAt <= Date.now()) {
      return res.status(401).json({ error: 'Verification code expired. Please log in again.' });
    }

    challenge.attempts += 1;
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    if (challenge.attempts > 5 || !safeEqual(codeHash, challenge.codeHash)) {
      if (challenge.attempts > 5) otpChallenges.delete(challengeId);
      return res.status(401).json({ error: 'Invalid administrator verification code.' });
    }

    otpChallenges.delete(challengeId);

    const expiresAt = Date.now() + TOKEN_TTL_MS;
    const token = signAdminToken({ role: 'admin', email: ADMIN_EMAIL, exp: expiresAt });
    const adminUser = {
      id: 'admin-primary',
      name: 'HelzerX Administrator',
      email: ADMIN_EMAIL,
      role: 'admin' as const,
      provider: 'email',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    const sessionId = createSession(adminUser);
    setSessionCookie(res, sessionId);

    res.json({ ok: true, token, expiresAt, user: adminUser });
  });

  // Customer register (Oracle Cloud Enterprise Standard)
  app.post('/api/auth/register', async (req, res) => {
    const firstName = String(req.body?.firstName || '').trim();
    const lastName = String(req.body?.lastName || '').trim();
    const rawName = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
    const name = rawName || [firstName, lastName].filter(Boolean).join(' ') || 'Customer';
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const accountType = req.body?.accountType === 'corporate' ? 'corporate' : 'individual';
    const company = String(req.body?.company || '').trim();
    const country = String(req.body?.country || 'Sri Lanka').trim();
    const address = String(req.body?.address || '').trim();
    const city = String(req.body?.city || '').trim();
    const state = String(req.body?.state || '').trim();
    const postalCode = String(req.body?.postalCode || '').trim();
    const phone = String(req.body?.phone || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Please enter your first and last name.' });
    }

    const users = await readJson<any[]>(USERS_FILE, []);
    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const challengeId = crypto.randomBytes(24).toString('base64url');
    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const digest = await passwordHash(password);

    const pendingUser = {
      id: `usr-${crypto.randomUUID()}`,
      name,
      firstName: firstName || name.split(' ')[0] || '',
      lastName: lastName || name.split(' ').slice(1).join(' ') || '',
      email,
      passwordDigest: digest,
      role: 'customer',
      provider: 'email',
      accountType,
      company,
      country,
      address,
      city,
      state,
      postalCode,
      phone,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    otpChallenges.set(challengeId, {
      type: 'register',
      code,
      codeHash,
      email,
      user: pendingUser,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    await sendMail(email, 'HelzerX Cloud email verification', `Your HelzerX verification code is: ${code}`);
    await appendSecurityLog({
      actor: email,
      type: 'register_otp_dispatched',
      ip: req.ip || '127.0.0.1',
      details: 'Registration verification code dispatched',
      severity: 'info',
    });

    res.status(201).json({
      ok: true,
      verificationRequired: true,
      challengeId,
      expiresAt: Date.now() + OTP_TTL_MS,
      message: RESEND_API_KEY
        ? 'A 6-digit verification code was sent to your email.'
        : `Verification code generated: ${code}`,
      devCode: RESEND_API_KEY ? undefined : code,
    });
  });

  // Verify email OTP
  app.post('/api/auth/verify-email-otp', async (req, res) => {
    const challengeId = String(req.body?.challengeId || '');
    const code = String(req.body?.code || '').replace(/\D/g, '');
    const challenge = otpChallenges.get(challengeId);

    if (!challenge || challenge.type !== 'register' || challenge.expiresAt <= Date.now()) {
      return res.status(401).json({ error: 'Verification code expired. Start registration again.' });
    }

    challenge.attempts += 1;
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (challenge.attempts > 5 || !safeEqual(codeHash, challenge.codeHash)) {
      return res.status(401).json({ error: 'Invalid verification code.' });
    }

    const users = await readJson<any[]>(USERS_FILE, []);
    users.push(challenge.user);
    await atomicWrite(USERS_FILE, users);
    otpChallenges.delete(challengeId);

    await appendSecurityLog({
      actor: challenge.user.email,
      type: 'account_registered_and_verified',
      ip: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Browser',
      details: 'Customer email OTP confirmed and account saved to database',
      severity: 'info',
    });

    const sessionId = createSession(challenge.user);
    setSessionCookie(res, sessionId);

    res.json({ ok: true, user: publicUser(challenge.user) });
  });

  // Customer login
  app.post('/api/auth/login', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    const users = await readJson<any[]>(USERS_FILE, []);
    const user = users.find((u) => u.email === email && u.provider === 'email');

    if (!user || !(await verifyPassword(password, user.passwordDigest))) {
      await appendSecurityLog({
        actor: email || 'unknown',
        type: 'login_failed',
        ip: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Browser',
        details: 'Invalid credentials attempted',
        severity: 'warning',
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.banned) {
      await appendSecurityLog({
        actor: email,
        type: 'login_blocked_banned',
        ip: req.ip || '127.0.0.1',
        details: 'Access rejected: Account is suspended',
        severity: 'critical',
      });
      return res.status(403).json({ error: 'This account has been disabled.' });
    }

    const challengeId = crypto.randomBytes(24).toString('base64url');
    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    otpChallenges.set(challengeId, {
      type: 'login',
      code,
      codeHash,
      email,
      user,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    await sendMail(email, 'HelzerX Cloud sign-in code', `Your ArveX sign-in code is: ${code}`);

    res.json({
      ok: true,
      requiresTwoFactor: true,
      challengeId,
      expiresAt: Date.now() + OTP_TTL_MS,
      message: RESEND_API_KEY
        ? 'A 6-digit sign-in code was sent to your email.'
        : `Sign-in code generated: ${code}`,
      devCode: RESEND_API_KEY ? undefined : code,
    });
  });

  // Verify login OTP
  app.post('/api/auth/verify-login-otp', async (req, res) => {
    const challengeId = String(req.body?.challengeId || '');
    const code = String(req.body?.code || '').replace(/\D/g, '');
    const challenge = otpChallenges.get(challengeId);

    if (!challenge || challenge.type !== 'login' || challenge.expiresAt <= Date.now()) {
      return res.status(401).json({ error: 'Sign-in code expired. Start sign-in again.' });
    }

    challenge.attempts += 1;
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (challenge.attempts > 5 || !safeEqual(codeHash, challenge.codeHash)) {
      return res.status(401).json({ error: 'Invalid sign-in code.' });
    }

    otpChallenges.delete(challengeId);

    const sessionId = createSession(challenge.user);
    setSessionCookie(res, sessionId);

    res.json({ ok: true, user: publicUser(challenge.user) });
  });

  // Forgot password
  app.post('/api/auth/forgot-password', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const users = await readJson<any[]>(USERS_FILE, []);
    const user = users.find((u) => u.email === email && u.provider === 'email');

    if (!user) {
      return res.json({ ok: true, message: 'If an account exists, a reset code was sent.' });
    }

    const challengeId = crypto.randomBytes(24).toString('base64url');
    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    otpChallenges.set(challengeId, {
      type: 'reset',
      code,
      codeHash,
      email,
      userId: user.id,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    await sendMail(email, 'HelzerX password reset code', `Your password reset code is: ${code}`);

    res.json({
      ok: true,
      challengeId,
      expiresAt: Date.now() + OTP_TTL_MS,
      message: RESEND_API_KEY
        ? 'A 6-digit password reset code was sent to your email.'
        : `Reset code generated: ${code}`,
      devCode: RESEND_API_KEY ? undefined : code,
    });
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req, res) => {
    const challengeId = String(req.body?.challengeId || '');
    const code = String(req.body?.code || '').replace(/\D/g, '');
    const password = String(req.body?.password || '');
    const challenge = otpChallenges.get(challengeId);

    if (!challenge || challenge.type !== 'reset' || challenge.expiresAt <= Date.now()) {
      return res.status(401).json({ error: 'Reset code expired. Start password reset again.' });
    }

    if (password.length < 10) {
      return res.status(400).json({ error: 'Password must be at least 10 characters.' });
    }

    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    if (!safeEqual(codeHash, challenge.codeHash)) {
      return res.status(401).json({ error: 'Invalid reset code.' });
    }

    const users = await readJson<any[]>(USERS_FILE, []);
    const user = users.find((u) => u.id === challenge.userId);
    if (user) {
      user.passwordDigest = await passwordHash(password);
      await atomicWrite(USERS_FILE, users);
    }

    otpChallenges.delete(challengeId);
    res.json({ ok: true, message: 'Password reset successfully.' });
  });

  // Resend OTP Code
  app.post('/api/auth/resend-otp', async (req, res) => {
    const challengeId = String(req.body?.challengeId || '');
    const challenge = otpChallenges.get(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: 'Authentication challenge expired. Please initiate again.' });
    }

    const newCode = String(crypto.randomInt(100000, 1000000));
    challenge.code = newCode;
    challenge.codeHash = crypto.createHash('sha256').update(newCode).digest('hex');
    challenge.expiresAt = Date.now() + OTP_TTL_MS;
    challenge.attempts = 0;

    await sendMail(challenge.email, 'HelzerX Cloud verification code (Resent)', `Your new verification code is: ${newCode}`);
    await appendSecurityLog({
      actor: challenge.email,
      type: 'otp_resend',
      ip: req.ip || '127.0.0.1',
      details: `New OTP dispatched for ${challenge.type}`,
    });

    res.json({
      ok: true,
      challengeId,
      expiresAt: challenge.expiresAt,
      message: RESEND_API_KEY
        ? 'A new verification code was sent to your email.'
        : `New verification code generated: ${newCode}`,
      devCode: RESEND_API_KEY ? undefined : newCode,
    });
  });

  // Social Login & Sign Up (Google, Apple ID, Facebook) with full database persistence
  app.post('/api/auth/social-login', async (req, res) => {
    const provider = String(req.body?.provider || 'google').toLowerCase(); // 'google' | 'apple' | 'facebook'
    const email = String(req.body?.email || '').trim().toLowerCase();
    const name = String(req.body?.name || '').trim() || (provider === 'google' ? 'Google User' : provider === 'apple' ? 'Apple ID User' : 'Facebook User');
    const avatar = String(req.body?.avatar || '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required for social authentication.' });
    }

    if (!['google', 'apple', 'facebook'].includes(provider)) {
      return res.status(400).json({ error: 'Unsupported social authentication provider.' });
    }

    const defaultAvatars: Record<string, string> = {
      google: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      apple: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      facebook: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };

    const users = await readJson<any[]>(USERS_FILE, []);
    let user = users.find((u) => u.email === email);
    const isNewUser = !user;

    if (user) {
      if (user.banned) {
        return res.status(403).json({ error: 'This account has been suspended.' });
      }
      user.lastLoginAt = new Date().toISOString();
      user.lastProvider = provider;
      if (avatar && !user.avatar) user.avatar = avatar;
    } else {
      user = {
        id: `usr-${provider}-${crypto.randomUUID()}`,
        name,
        email,
        role: 'customer',
        provider,
        avatar: avatar || defaultAvatars[provider] || defaultAvatars.google,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      users.push(user);
    }

    await atomicWrite(USERS_FILE, users);

    await appendSecurityLog({
      actor: email,
      type: isNewUser ? 'social_register_success' : 'social_login_success',
      provider,
      ip: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Browser',
      details: isNewUser ? `Registered via ${provider.toUpperCase()}` : `Logged in via ${provider.toUpperCase()}`,
      severity: 'info',
    });

    const sessionId = createSession(user);
    setSessionCookie(res, sessionId);

    res.json({ ok: true, user: publicUser(user), isNewUser });
  });

  // Admin Security Logs
  app.get('/api/admin/security-logs', async (req, res) => {
    const session = getSession(req);
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    const isAdmin = session?.role === 'admin' || verifyAdminToken(bearer || '');

    if (!isAdmin) {
      return res.status(403).json({ error: 'Administrator access required.' });
    }

    const logs = await readJson<any[]>(SECURITY_LOGS_FILE, []);
    res.json({ ok: true, logs });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    const cookies = parseCookies(req);
    const id = cookies.arvex_secure_session || cookies.arvex_session;
    if (id) inMemorySessions.delete(id);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.post('/api/admin/logout', (req, res) => {
    const cookies = parseCookies(req);
    const id = cookies.arvex_secure_session || cookies.arvex_session;
    if (id) inMemorySessions.delete(id);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  // Payments / PayHere
  app.get('/api/payments/payhere/quote', async (req, res) => {
    const planId = String(req.query.planId || '');
    const cycle = String(req.query.cycle || 'monthly');
    const config = await readJson<Record<string, unknown>>(CMS_FILE, {});
    const plans = (config.plans as any[]) || INITIAL_PLANS;
    const plan = plans.find((p) => String(p.id) === planId);

    if (!plan) return res.status(404).json({ error: 'Plan not found.' });

    let usd = Number(plan.monthlyPrice);
    if (cycle === 'quarterly' && Number(plan.quarterlyPrice)) usd = Number(plan.quarterlyPrice);
    if (cycle === 'yearly' && Number(plan.yearlyPrice)) usd = Number(plan.yearlyPrice);

    const lkr = Math.round(usd * USD_TO_LKR * 100) / 100;
    res.json({ ok: true, planId: plan.id, planName: plan.name, cycle, amountUsd: usd, amountLkr: lkr, currency: 'LKR' });
  });

  app.post('/api/payments/payhere/create', async (req, res) => {
    const session = getSession(req);
    const planId = String(req.body?.planId || '');
    const cycle = String(req.body?.cycle || 'monthly');
    const phone = String(req.body?.phone || '0771234567');
    const address = String(req.body?.address || 'HelzerX Client Address');
    const city = String(req.body?.city || 'Colombo');

    const config = await readJson<Record<string, unknown>>(CMS_FILE, {});
    const plans = (config.plans as any[]) || INITIAL_PLANS;
    const plan = plans.find((p) => String(p.id) === planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found.' });

    let usd = Number(plan.monthlyPrice);
    if (cycle === 'quarterly' && Number(plan.quarterlyPrice)) usd = Number(plan.quarterlyPrice);
    if (cycle === 'yearly' && Number(plan.yearlyPrice)) usd = Number(plan.yearlyPrice);
    const lkr = Math.round(usd * USD_TO_LKR * 100) / 100;

    const orderId = `ARX-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const orders = await readJson<any[]>(ORDERS_FILE, []);
    orders.unshift({
      orderId,
      userId: session?.userId || 'guest',
      userEmail: session?.email || 'customer@helzerx.cloud',
      planId: plan.id,
      planName: plan.name,
      cycle,
      amountUsd: usd,
      amountLkr: lkr,
      currency: 'LKR',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    await atomicWrite(ORDERS_FILE, orders);

    const md5Secret = crypto.createHash('md5').update(PAYHERE_MERCHANT_SECRET).digest('hex').toUpperCase();
    const hash = crypto.createHash('md5').update(PAYHERE_MERCHANT_ID + orderId + lkr.toFixed(2) + 'LKR' + md5Secret).digest('hex').toUpperCase();

    res.json({
      ok: true,
      action: PAYHERE_SANDBOX ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout',
      orderId,
      amountUsd: usd,
      amountLkr: lkr,
      currency: 'LKR',
      fields: {
        merchant_id: PAYHERE_MERCHANT_ID,
        return_url: `/#/payment?orderId=${encodeURIComponent(orderId)}&status=return`,
        cancel_url: `/#/payment?orderId=${encodeURIComponent(orderId)}&status=cancelled`,
        notify_url: '/api/payments/payhere/notify',
        first_name: 'HelzerX',
        last_name: 'Customer',
        email: session?.email || 'customer@helzerx.cloud',
        phone,
        address,
        city,
        country: 'Sri Lanka',
        order_id: orderId,
        items: `${plan.name} - ${cycle}`,
        currency: 'LKR',
        amount: lkr.toFixed(2),
        hash,
      },
    });
  });

  app.get('/api/payments/payhere/status', async (req, res) => {
    const orderId = String(req.query.orderId || '');
    const orders = await readJson<any[]>(ORDERS_FILE, []);
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    res.json({
      status: order.status === 'paid' ? 'paid' : order.status === 'failed' ? 'failed' : 'pending',
      statusMessage: order.status,
      orderId: order.orderId,
      amountLkr: order.amountLkr,
      currency: order.currency,
      transactionId: order.transactionId || null,
    });
  });

  app.post('/api/payments/payhere/notify', async (req, res) => {
    const body = req.body || {};
    const orderId = String(body.order_id || '');
    const statusCode = String(body.status_code || '');
    const paymentId = String(body.payment_id || `pay-${Date.now()}`);

    const orders = await readJson<any[]>(ORDERS_FILE, []);
    const order = orders.find((o) => o.orderId === orderId);
    if (order) {
      order.status = statusCode === '2' ? 'paid' : 'failed';
      order.transactionId = paymentId;
      order.paidAt = new Date().toISOString();
      await atomicWrite(ORDERS_FILE, orders);
    }
    res.send('OK');
  });

  // Clean-up expired OTPs every 10 min
  setInterval(() => {
    const now = Date.now();
    for (const [id, challenge] of otpChallenges.entries()) {
      if (challenge.expiresAt <= now) otpChallenges.delete(id);
    }
    for (const [id, session] of inMemorySessions.entries()) {
      if (session.expiresAt <= now) inMemorySessions.delete(id);
    }
  }, 10 * 60 * 1000).unref();

  // Mount Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HelzerX Cloud full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
