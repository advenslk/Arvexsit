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
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

const CMS_KEYS = new Set([
  'siteSettings', 'siteImages', 'games', 'plans', 'generalServices', 'tlds',
  'locations', 'comparisonRows', 'faqs', 'testimonials', 'partners', 'reviews',
  'blogPosts', 'coupons', 'currenciesList', 'currency', 'paymentSettings',
  'statusComponents', 'statusIncidents', 'serverNodes', 'adminUsers'
]);

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
  await fs.writeFile(temp, JSON.stringify(config, null, 2), 'utf8');
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
    if (!body || !signature) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
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

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'arvex-cms', time: new Date().toISOString() }));

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin authentication is not configured on the server.' });
  }
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }
  const token = signToken({ role: 'admin', email, exp: Date.now() + TOKEN_TTL_MS });
  return res.json({ ok: true, token, expiresAt: Date.now() + TOKEN_TTL_MS });
});

app.get('/api/cms/config', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await readConfig());
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
  for (const key of CMS_KEYS) if (Object.prototype.hasOwnProperty.call(incoming, key)) clean[key] = incoming[key];
  await writeConfig(clean);
  res.json({ ok: true, keys: Object.keys(clean) });
});

// API routes are handled above. Static assets remain served by Nginx in the recommended deployment.
app.listen(PORT, '127.0.0.1', () => {
  console.log(`ArveX CMS API listening on 127.0.0.1:${PORT}`);
});
