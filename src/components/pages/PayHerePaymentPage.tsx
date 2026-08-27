import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PAYHERE_CURRENCY = 'LKR';

function makeOrderId() {
  const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ARX-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export const PayHerePaymentPage: React.FC = () => {
  const { currentRoute, orders, currency, navigateTo, showNotification } = useApp();
  const routeOrderId = currentRoute.params.orderId;
  const statusParam = currentRoute.params.status;
  const order = orders.find((item) => item.id === routeOrderId) || orders[orders.length - 1];

  const [paymentOrderId, setPaymentOrderId] = useState(routeOrderId || '');
  const [status, setStatus] = useState<'ready' | 'creating' | 'waiting' | 'paid' | 'failed' | 'cancelled'>('ready');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Colombo');

  const amountLkr = useMemo(() => {
    if (!order) return 0;
    const raw = Number(order.amount || 0);
    return currency.code === PAYHERE_CURRENCY ? raw : raw * 300;
  }, [order, currency.code]);

  useEffect(() => {
    if (!routeOrderId && statusParam !== 'cancelled') setPaymentOrderId(makeOrderId());
    if (statusParam === 'cancelled') setStatus('cancelled');
  }, [routeOrderId, statusParam]);

  useEffect(() => {
    if (!paymentOrderId || status === 'paid' || status === 'failed' || status === 'cancelled') return;
    if (statusParam === 'return' || statusParam === 'success') setStatus('waiting');
    if (status !== 'waiting') return;

    let active = true;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/payments/payhere/status?orderId=${encodeURIComponent(paymentOrderId)}`, { credentials: 'include' });
        const data = await response.json();
        if (!active) return;
        if (data.status === 'paid') {
          setStatus('paid');
          showNotification('PayHere payment verified successfully.', 'success');
          return;
        }
        if (data.status === 'failed') {
          setStatus('failed');
          setError(data.statusMessage || 'PayHere reported a failed payment.');
          return;
        }
      } catch {
        // Continue polling; the payment gateway callback may arrive a few seconds later.
      }
      if (active && attempts < 30) window.setTimeout(poll, 3000);
      else if (active && attempts >= 30) setError('Payment verification is taking longer than expected. Check your dashboard shortly.');
    };
    poll();
    return () => { active = false; };
  }, [paymentOrderId, status, statusParam, showNotification]);

  const startPayment = async () => {
    if (!order) return;
    setError('');
    if (!/^\+?[0-9 ()-]{7,20}$/.test(phone.trim())) {
      setError('Enter a valid phone number for PayHere checkout.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      setError('Address and city are required by PayHere.');
      return;
    }

    const id = paymentOrderId || makeOrderId();
    setPaymentOrderId(id);
    setStatus('creating');

    try {
      const response = await fetch('/api/payments/payhere/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id,
          item: order.planName,
          customerName: order.customerName,
          email: order.customerEmail,
          phone,
          address,
          city,
          country: 'Sri Lanka',
          currency: PAYHERE_CURRENCY,
          amount: amountLkr,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create PayHere payment.');

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;
      form.style.display = 'none';
      Object.entries(data.fields || {}).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value ?? '');
        form.appendChild(input);
      });
      document.body.appendChild(form);
      setStatus('waiting');
      form.submit();
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Unable to start PayHere checkout.');
    }
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h1 className="text-2xl font-black text-white">No active order</h1>
          <p className="mt-2 text-sm text-slate-400">Choose a hosting plan before opening checkout.</p>
          <button onClick={() => navigateTo('pricing')} className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">View Plans</button>
        </div>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-[2rem] border border-emerald-400/20 bg-[#0d1215] p-8 text-center shadow-2xl sm:p-12">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
          <div className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Payment verified</div>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Your payment is confirmed</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400">PayHere has verified the transaction. Service provisioning must only happen from the verified server-side payment record.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
            <div className="flex justify-between gap-4"><span className="text-slate-500">Order</span><span className="font-mono font-bold text-white">{paymentOrderId}</span></div>
            <div className="mt-3 flex justify-between gap-4"><span className="text-slate-500">Plan</span><span className="font-bold text-cyan-300">{order.planName}</span></div>
            <div className="mt-3 flex justify-between gap-4"><span className="text-slate-500">Amount</span><span className="font-bold text-white">LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div>
          </div>
          <button onClick={() => navigateTo('dashboard')} className="mt-8 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-black text-black">Open Dashboard</button>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
          <Clock3 className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h1 className="text-2xl font-black text-white">Payment cancelled</h1>
          <p className="mt-2 text-sm text-slate-400">No payment was marked as successful. You can safely try again.</p>
          <button onClick={() => setStatus('ready')} className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white">Try Again</button>
        </div>
      </div>
    );
  }

  if (status === 'waiting') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-lg rounded-3xl border border-cyan-400/20 bg-white/[0.035] p-8 text-center shadow-2xl">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" />
          <h1 className="mt-5 text-2xl font-black text-white">Verifying your payment</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Do not refresh repeatedly. PayHere sends the final payment status to our secure server callback.</p>
          <div className="mt-5 rounded-xl bg-black/20 p-3 font-mono text-xs text-slate-500">{paymentOrderId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"><CreditCard className="h-7 w-7 text-cyan-300" /></div>
          <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">Secure PayHere Checkout</h1>
          <p className="mt-2 text-sm text-slate-400">{order.planName} · LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-3xl border border-white/10 bg-[#0e1119] p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-xs leading-5 text-slate-400">Your card details are entered directly on PayHere. ArveX does not collect or store card numbers, CVV or banking credentials.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-400">Phone number<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0771234567" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
              <label className="text-xs font-semibold text-slate-400">City<input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
            </div>
            <label className="mt-4 block text-xs font-semibold text-slate-400">Billing address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="No. 1, Galle Road" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>

            {error && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs text-red-300">{error}</div>}

            <button onClick={startPayment} disabled={status === 'creating'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 text-sm font-black text-black transition hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60">
              {status === 'creating' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
              {status === 'creating' ? 'Preparing secure checkout…' : `Continue to PayHere · LKR ${amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
            </button>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Order summary</div>
            <h2 className="mt-4 text-lg font-black text-white">{order.planName}</h2>
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between gap-3"><span className="text-slate-500">Customer</span><span className="text-right text-slate-200">{order.customerEmail}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500">Currency</span><span className="font-bold text-white">LKR</span></div>
              <div className="flex justify-between gap-3 border-t border-white/10 pt-4"><span className="font-bold text-slate-300">Total</span><span className="text-base font-black text-cyan-300">LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div>
            </div>
            <p className="mt-6 text-[11px] leading-5 text-slate-500">Order activation is based on the verified PayHere server notification, not the browser return page.</p>
          </aside>
        </div>
      </div>
    </div>
  );
};
