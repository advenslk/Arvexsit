import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PAYHERE_PORT || 5001);
const PUBLIC_ORIGIN = String(process.env.PUBLIC_ORIGIN || 'https://arvex.host').replace(/\/$/, '');
const MERCHANT_ID = String(process.env.PAYHERE_MERCHANT_ID || '').trim();
const MERCHANT_SECRET = String(process.env.PAYHERE_MERCHANT_SECRET || '').trim();
const SANDBOX = String(process.env.PAYHERE_SANDBOX || 'true').toLowerCase() === 'true';
const DATA_DIR = path.join(__dirname, 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payhere-payments.json');
const CREATE_WINDOW_MS = 15 * 60 * 1000;
const createAttempts = new Map();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));

function md5(value) {
  return crypto.createHash('md5').update(String(value), 'utf8').digest('hex').toUpperCase();
}

function timingSafe(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function amount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 100000000) throw new Error('Invalid amount');
  return n.toFixed(2);
}

async function readPayments() {
  try { return JSON.parse(await fs.readFile(PAYMENTS_FILE, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') console.error(error); return {}; }
}

async function writePayments(data) {
  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  const tmp = `${PAYMENTS_FILE}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
  await fs.rename(tmp, PAYMENTS_FILE);
}

function clientKey(req) {
  return String(req.headers['cf-connecting-ip'] || req.ip || 'unknown');
}

function limited(req) {
  const key = clientKey(req);
  const now = Date.now();
  const old = createAttempts.get(key);
  if (!old || now - old.startedAt > CREATE_WINDOW_MS) {
    createAttempts.set(key, { startedAt: now, count: 1 });
    return false;
  }
  old.count += 1;
  return old.count > 20;
}

function configError() {
  return !MERCHANT_ID || !MERCHANT_SECRET || !/^\d+$/.test(MERCHANT_ID);
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.get('/api/payments/health', (_req, res) => {
  res.json({ ok: true, provider: 'payhere', configured: !configError(), sandbox: SANDBOX });
});

app.post('/api/payments/payhere/create', async (req, res) => {
  try {
    if (limited(req)) return res.status(429).json({ error: 'Too many payment attempts. Please try again later.' });
    if (configError()) return res.status(503).json({ error: 'PayHere is not configured on the server.' });

    const body = req.body || {};
    const orderId = String(body.orderId || '').trim();
    const item = String(body.item || '').trim().slice(0, 120);
    const customerName = String(body.customerName || '').trim().replace(/\s+/g, ' ');
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const address = String(body.address || 'Online order').trim().slice(0, 200);
    const city = String(body.city || 'Colombo').trim().slice(0, 80);
    const country = String(body.country || 'Sri Lanka').trim().slice(0, 80);
    const currency = String(body.currency || 'LKR').trim().toUpperCase();
    const total = amount(body.amount);

    if (!/^ARX-[A-Z0-9-]{6,80}$/.test(orderId)) return res.status(400).json({ error: 'Invalid order ID.' });
    if (!item || !customerName || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Customer and order details are required.' });
    if (!['LKR', 'USD'].includes(currency)) return res.status(400).json({ error: 'PayHere supports only configured LKR/USD checkout for this integration.' });
    if (currency === 'LKR' && Number(total) < 10) return res.status(400).json({ error: 'Minimum LKR payment is 10.00.' });

    const payments = await readPayments();
    const existing = payments[orderId];
    if (existing && ['paid', 'pending'].includes(existing.status)) {
      if (existing.amount !== total || existing.currency !== currency) return res.status(409).json({ error: 'Order amount mismatch.' });
      return res.json(existing.checkout);
    }

    const firstLast = customerName.split(' ');
    const firstName = firstLast.shift()?.slice(0, 60) || 'ArveX';
    const lastName = firstLast.join(' ').slice(0, 60) || 'Customer';
    const secretHash = md5(MERCHANT_SECRET);
    const hash = md5(`${MERCHANT_ID}${orderId}${total}${currency}${secretHash}`);
    const action = SANDBOX ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout';

    const checkout = {
      action,
      fields: {
        merchant_id: MERCHANT_ID,
        return_url: `${PUBLIC_ORIGIN}/#/payment?orderId=${encodeURIComponent(orderId)}&status=return`,
        cancel_url: `${PUBLIC_ORIGIN}/#/payment?orderId=${encodeURIComponent(orderId)}&status=cancelled`,
        notify_url: `${PUBLIC_ORIGIN}/api/payments/payhere/notify`,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        country,
        order_id: orderId,
        items: item,
        currency,
        amount: total,
        hash,
        custom_1: 'arvex-hosting',
        custom_2: 'checkout-v1'
      }
    };

    payments[orderId] = {
      orderId,
      amount: total,
      currency,
      item,
      email,
      customerName,
      status: 'pending',
      provider: 'payhere',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checkout
    };
    await writePayments(payments);
    return res.json(checkout);
  } catch (error) {
    console.error('PayHere create error:', error);
    return res.status(400).json({ error: 'Unable to create the payment request.' });
  }
});

app.post('/api/payments/payhere/notify', async (req, res) => {
  try {
    if (configError()) return res.status(503).send('PayHere is not configured.');
    const p = req.body || {};
    const merchantId = String(p.merchant_id || '');
    const orderId = String(p.order_id || '');
    const paymentId = String(p.payment_id || '');
    const payhereAmount = String(p.payhere_amount || '');
    const payhereCurrency = String(p.payhere_currency || '').toUpperCase();
    const statusCode = String(p.status_code || '');
    const md5sig = String(p.md5sig || '').toUpperCase();

    const expected = md5(`${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${md5(MERCHANT_SECRET)}`);
    if (!timingSafe(md5sig, expected)) return res.status(400).send('Invalid signature.');
    if (!timingSafe(merchantId, MERCHANT_ID)) return res.status(400).send('Invalid merchant.');
    if (!orderId || !paymentId) return res.status(400).send('Invalid notification.');

    const payments = await readPayments();
    const record = payments[orderId];
    if (!record) return res.status(404).send('Unknown order.');
    if (record.amount !== amount(payhereAmount) || record.currency !== payhereCurrency) return res.status(400).send('Amount or currency mismatch.');

    const successful = statusCode === '2';
    const nextStatus = successful ? 'paid' : statusCode === '0' ? 'pending' : 'failed';
    if (record.status !== 'paid' || successful) {
      record.status = nextStatus;
      record.paymentId = paymentId;
      record.statusCode = statusCode;
      record.statusMessage = String(p.status_message || '').slice(0, 200);
      record.updatedAt = new Date().toISOString();
      if (successful) record.paidAt = record.paidAt || record.updatedAt;
      await writePayments(payments);
    }
    return res.status(200).send('OK');
  } catch (error) {
    console.error('PayHere notify error:', error);
    return res.status(500).send('Server error.');
  }
});

app.get('/api/payments/payhere/status', async (req, res) => {
  const orderId = String(req.query.orderId || '').trim();
  if (!/^ARX-[A-Z0-9-]{6,80}$/.test(orderId)) return res.status(400).json({ error: 'Invalid order ID.' });
  const payments = await readPayments();
  const record = payments[orderId];
  if (!record) return res.status(404).json({ error: 'Payment not found.' });
  const safe = { orderId: record.orderId, amount: record.amount, currency: record.currency, item: record.item, status: record.status, paymentId: record.paymentId || null, paidAt: record.paidAt || null, provider: record.provider };
  return res.json(safe);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`ArveX PayHere service listening on 127.0.0.1:${PORT} (${SANDBOX ? 'sandbox' : 'live'})`);
});
