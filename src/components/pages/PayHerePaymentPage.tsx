import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const makeOrderId = () => `ARX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

export const PayHerePaymentPage: React.FC = () => {
  const { currentRoute, plans, currentUser, navigateTo, showNotification } = useApp();
  const params = currentRoute.params;
  const plan = plans.find((item) => item.id === params.planId) || plans[0];
  const [amountUsd, setAmountUsd] = useState(Number(params.amount || plan?.monthlyPrice || 0));
  const [amountLkr, setAmountLkr] = useState(Math.max(0, amountUsd * 300));
  const customerEmail = currentUser?.email || '';
  const customerName = currentUser?.name || 'ArveX Customer';
  const [paymentOrderId, setPaymentOrderId] = useState(params.orderId || makeOrderId());
  const [status, setStatus] = useState<'ready' | 'creating' | 'waiting' | 'paid' | 'failed' | 'cancelled'>('ready');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Colombo');
  const cycle = params.cycle || 'monthly';

  useEffect(() => {
    if (params.orderId) setPaymentOrderId(params.orderId);
    if (params.status === 'cancelled') setStatus('cancelled');
    if (params.status === 'return' || params.status === 'success') setStatus('waiting');
  }, [params.orderId, params.status]);

  useEffect(() => {
    if (!plan?.id || !['monthly', 'quarterly', 'yearly'].includes(cycle)) return;
    let active = true;
    fetch(`/api/payments/payhere/quote?planId=${encodeURIComponent(plan.id)}&cycle=${encodeURIComponent(cycle)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load the current price.');
        if (active) { setAmountUsd(Number(data.amountUsd)); setAmountLkr(Number(data.amountLkr)); }
      })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load the current price.'); });
    return () => { active = false; };
  }, [plan?.id, cycle]);

  useEffect(() => {
    if (status !== 'waiting' || !paymentOrderId) return;
    let active = true;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/payments/payhere/status?orderId=${encodeURIComponent(paymentOrderId)}`, { credentials: 'same-origin' });
        const data = await response.json();
        if (!active) return;
        if (data.status === 'paid') { setStatus('paid'); showNotification('PayHere payment verified successfully.', 'success'); return; }
        if (data.status === 'failed') { setStatus('failed'); setError(data.statusMessage || 'PayHere reported a failed payment.'); return; }
      } catch {}
      if (active && attempts < 40) window.setTimeout(poll, 3000);
      else if (active) setError('Verification is taking longer than expected. Your payment will remain pending until PayHere confirms it.');
    };
    poll();
    return () => { active = false; };
  }, [paymentOrderId, status, showNotification]);

  const startPayment = async () => {
    if (!currentUser) { setError('Please sign in before making a payment.'); return; }
    if (!plan || !customerEmail) { setError('Your account details could not be loaded. Please sign in again.'); return; }
    if (!/^\+?[0-9 ()-]{7,20}$/.test(phone.trim())) { setError('Enter a valid phone number.'); return; }
    if (!address.trim() || !city.trim()) { setError('Address and city are required by PayHere.'); return; }
    setError(''); setStatus('creating');
    const id = paymentOrderId || makeOrderId();
    setPaymentOrderId(id);
    try {
      const response = await fetch('/api/payments/payhere/create', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, planId: plan.id, cycle, phone, address, city }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create PayHere payment.');
      setAmountUsd(Number(data.amountUsd)); setAmountLkr(Number(data.amountLkr));
      const form = document.createElement('form'); form.method = 'POST'; form.action = data.action; form.style.display = 'none';
      Object.entries(data.fields || {}).forEach(([key, value]) => { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = String(value ?? ''); form.appendChild(input); });
      document.body.appendChild(form); form.submit();
    } catch (err) { setStatus('failed'); setError(err instanceof Error ? err.message : 'Unable to start PayHere checkout.'); }
  };

  if (!currentUser) return <div className="min-h-[70vh] flex items-center justify-center px-6"><div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center"><LockKeyhole className="mx-auto mb-4 h-12 w-12 text-cyan-400" /><h1 className="text-2xl font-black text-white">Sign in required</h1><p className="mt-2 text-sm text-slate-400">Sign in to your ArveX account before starting a secure payment.</p><button onClick={() => navigateTo('home')} className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">Return to ArveX</button></div></div>;
  if (status === 'paid') return <div className="min-h-[75vh] flex items-center justify-center px-6 py-16"><div className="w-full max-w-2xl rounded-[2rem] border border-emerald-400/20 bg-[#0d1215] p-8 text-center shadow-2xl sm:p-12"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" /><div className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Payment verified</div><h1 className="mt-3 text-3xl font-black text-white">Payment confirmed</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400">PayHere has verified the transaction on the ArveX server. Service activation must only follow this verified payment record.</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm"><div className="flex justify-between gap-4"><span className="text-slate-500">Payment order</span><span className="font-mono font-bold text-white">{paymentOrderId}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-500">Plan</span><span className="font-bold text-cyan-300">{plan?.name}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-500">Amount</span><span className="font-bold text-white">LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div></div><button onClick={() => navigateTo('dashboard')} className="mt-8 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-black text-black">Open Dashboard</button></div></div>;
  if (status === 'waiting') return <div className="min-h-[70vh] flex items-center justify-center px-6"><div className="max-w-lg rounded-3xl border border-cyan-400/20 bg-white/[0.035] p-8 text-center shadow-2xl"><Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-400" /><h1 className="mt-5 text-2xl font-black text-white">Verifying your payment</h1><p className="mt-2 text-sm leading-6 text-slate-400">PayHere is sending the final signed status to our server. Do not treat the browser return alone as proof of payment.</p><div className="mt-5 rounded-xl bg-black/20 p-3 font-mono text-xs text-slate-500">{paymentOrderId}</div></div></div>;
  if (status === 'cancelled') return <div className="min-h-[70vh] flex items-center justify-center px-6"><div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center"><Clock3 className="mx-auto mb-4 h-12 w-12 text-amber-400" /><h1 className="text-2xl font-black text-white">Payment cancelled</h1><p className="mt-2 text-sm text-slate-400">No successful payment was recorded.</p><button onClick={() => setStatus('ready')} className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white">Try Again</button></div></div>;

  return <div className="min-h-[75vh] px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><div className="mb-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"><CreditCard className="h-7 w-7 text-cyan-300" /></div><h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">Secure PayHere Checkout</h1><p className="mt-2 text-sm text-slate-400">{plan?.name} · LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p></div><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><div className="rounded-3xl border border-white/10 bg-[#0e1119] p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" /><p className="text-xs leading-5 text-slate-400">Card details are entered directly on PayHere. ArveX does not collect card numbers, CVV or banking credentials.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-400">Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0771234567" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label><label className="text-xs font-semibold text-slate-400">City<input value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label></div><label className="mt-4 block text-xs font-semibold text-slate-400">Billing address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="No. 1, Galle Road" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>{error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs text-red-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}<button onClick={startPayment} disabled={status === 'creating' || amountLkr <= 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 text-sm font-black text-black transition hover:bg-cyan-400 disabled:opacity-60">{status === 'creating' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}{status === 'creating' ? 'Preparing secure checkout…' : `Continue to PayHere · LKR ${amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}</button></div><aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.035] p-6"><div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Order summary</div><h2 className="mt-4 text-lg font-black text-white">{plan?.name}</h2><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between gap-3"><span className="text-slate-500">Account</span><span className="text-right text-slate-200">{customerEmail}</span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Cycle</span><span className="font-bold text-white capitalize">{cycle}</span></div><div className="flex justify-between gap-3 border-t border-white/10 pt-4"><span className="font-bold text-slate-300">Total</span><span className="text-base font-black text-cyan-300">LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span></div></div><p className="mt-6 text-[11px] leading-5 text-slate-500">Payment is activated only after the signed PayHere server notification is verified.</p></aside></div></div></div>;
};
