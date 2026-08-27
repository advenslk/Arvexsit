import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 5000);
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms.json');
const TOKEN_SECRET = String(process.env.ADMIN_TOKEN_SECRET || '').trim();
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

if (!TOKEN_SECRET || TOKEN_SECRET.length < 32) {
  console.warn('ADMIN_TOKEN_SECRET is missing or shorter than 32 characters. Set a strong secret in production.');
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

const CMS_KEYS = new Set([
  'siteSettings', 'siteImages', 'games', 'plans', 'generalServices', 'tlds',
  'locations', 'comparisonRows', 'faqs', 'testimonials', 'partners', 'reviews',
  'blogPosts', 'coupons', 'currenciesList', 'currency', 'paymentSettings',
  'statusComponents', 'statusIncidents', 'serverNodes', 'adminUsers'
]);

// Only content that is safe for public visitors is exposed by GET /api/cms/config.
// Secrets, credentials, internal admin data and payment configuration must never be public.
const PUBLIC_CMS_KEYS = new Set([
  'siteSettings', 'siteImages', 'games', 'plans', 'generalServices', 'tlds',
  'locations', 'comparisonRows', 'faqs', 'testimonials', 'partners', 'reviews',
  'blogPosts', 'currenciesList', 'currency', 'statusComponents', 'statusIncidents'
]);

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;

function getClientKey(req) {
  return String(req.headers['cf-connecting-ip'] || req.ip || 'unknown');
}

function isRateLimited(req) {
  const key = getClientKey(req);
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.startedAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { startedAt: now, count: 0 });
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedLogin(req) {
  const key = getClientKey(req);
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.startedAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { startedAt: now, count: 1 });
  } else {
    entry.count += 1;
  }
}

function clearLoginAttempts(req) {
  loginAttempts.delete(getClientKey(req));
}

async function readConfig() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('CMS read error:', error);
    return {};
  }
}

async function writeConfig(config) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temp = `${DATA_FILE}.tmp`;
  await fs.writeFile(temp, JSON.stringify(config, null, 2), { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temp, DATA_FILE);
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature || !TOKEN_SECRET) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.role === 'admin' && Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return res.status(401).json({ error: 'Administrator authentication required.' });
  next();
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'arvex-cms', time: new Date().toISOString() }));

app.post('/api/admin/login', (req, res) => {
  if (isRateLimited(req)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !TOKEN_SECRET) {
    return res.status(503).json({ error: 'Admin authentication is not configured on the server.' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const emailOk = email === ADMIN_EMAIL;
  const passwordOk = password === ADMIN_PASSWORD;

  if (!emailOk || !passwordOk) {
    recordFailedLogin(req);
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  clearLoginAttempts(req);
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const token = signToken({ role: 'admin', email, exp: expiresAt });
  return res.json({ ok: true, token, expiresAt });
});

app.get('/api/cms/config', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const config = await readConfig();
  const publicConfig = {};
  for (const key of PUBLIC_CMS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(config, key)) publicConfig[key] = config[key];
  }
  res.json(publicConfig);
});

app.post('/api/cms/config/:key', requireAdmin, async (req, res) => {
  const { key } = req.params;
  if (!CMS_KEYS.has(key)) return res.status(400).json({ error: 'Unsupported CMS key.' });
  const config = await readConfig();
  config[key] = req.body?.value;
  await writeConfig(config);
  res.json({ ok: true, key });
});

app.delete('/api/cms/config/:key', requireAdmin, async (req, res) => {
  const { key } = req.params;
  if (!CMS_KEYS.has(key)) return res.status(400).json({ error: 'Unsupported CMS key.' });
  const config = await readConfig();
  delete config[key];
  await writeConfig(config);
  res.json({ ok: true, key });
});

app.post('/api/cms/import', requireAdmin, async (req, res) => {
  const incoming = req.body?.config;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return res.status(400).json({ error: 'Invalid CMS configuration.' });
  }
  const clean = {};
  for (const key of CMS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(incoming, key)) clean[key] = incoming[key];
  }
  await writeConfig(clean);
  res.json({ ok: true, keys: Object.keys(clean) });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`ArveX CMS API listening on 127.0.0.1:${PORT}`);
});
