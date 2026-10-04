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
  const customerName = currentUser?.name || 'HelzerX Customer';
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
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to load the current price.'); if (active) { setAmountUsd(Number(data.amountUsd)); setAmountLkr(Number(data.amountLkr)); } })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load the current price.'); });
    return () => { active = false; };
  }, [plan?.id, cycle]);

  useEffect(() => {
    if (status !== 'waiting' || !paymentOrderId) return;
    let active = true; let attempts = 0;
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
    const id = paymentOrderId || makeOrderId(); setPaymentOrderId(id);
    try {
      const response = await fetch('/api/payments/payhere/create', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-Customer-Email': customerEmail, 'X-Customer-Name': customerName },
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

  if (!currentUser) {
    return (
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">Sign In Required</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your HelzerX customer account before starting a secure PayHere transaction.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-sm font-bold text-white shadow-md cursor-pointer"
          >
            Return to HelzerX
          </button>
        </div>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Payment Verified
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            Payment Confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
            PayHere has verified the transaction on the HelzerX server. Your service provisioning is initiated.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-xs text-slate-600 space-y-2.5">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Payment Order ID:</span>
              <span className="font-mono font-bold text-slate-900">{paymentOrderId}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Hosting Plan:</span>
              <span className="font-bold text-blue-700">{plan?.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Total Settled:</span>
              <span className="font-bold text-slate-900">
                LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigateTo('dashboard')}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 cursor-pointer"
          >
            Open Client Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === 'waiting') {
    return (
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full rounded-3xl border border-blue-200 bg-white p-8 text-center shadow-xl">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h1 className="mt-5 text-2xl font-black text-slate-900 font-display">
            Verifying Your Payment
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            PayHere is sending the signed payment confirmation status to our secure server webhook.
          </p>
          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono text-xs text-slate-500">
            {paymentOrderId}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Clock3 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            No transaction charges were completed. You can restart checkout at any time.
          </p>
          <button
            onClick={() => setStatus('ready')}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-sm font-bold text-white shadow-md cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-3">
            <CreditCard className="w-3.5 h-3.5 text-cyan-300" />
            <span>Sri Lanka Central Bank Approved Gateway</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Secure PayHere Checkout
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {plan?.name} · LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Payment Form Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" />
              <p className="text-xs leading-5 text-slate-700">
                Card credentials are entered directly inside PayHere&apos;s PCI-DSS compliant iframe. HelzerX never stores card numbers.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-700">
                Mobile Phone <span className="text-rose-500">*</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0771234567"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </label>

              <label className="text-xs font-bold text-slate-700">
                City <span className="text-rose-500">*</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </label>
            </div>

            <label className="mt-4 block text-xs font-bold text-slate-700">
              Billing Address <span className="text-rose-500">*</span>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. 1, Galle Road"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </label>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                {error}
              </div>
            )}

            <button
              onClick={startPayment}
              disabled={status === 'creating' || amountLkr <= 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {status === 'creating' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LockKeyhole className="h-4 w-4" />
              )}
              {status === 'creating'
                ? 'Preparing secure checkout…'
                : `Continue to PayHere · LKR ${amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
            </button>
          </div>

          {/* Order Summary Aside */}
          <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Order Summary
            </div>
            <h2 className="mt-3 text-lg font-black text-slate-900 font-display">
              {plan?.name}
            </h2>
            <div className="mt-5 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Account</span>
                <span className="text-right text-slate-800 font-semibold truncate max-w-[150px]">
                  {customerEmail}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Cycle</span>
                <span className="font-bold text-slate-800 capitalize">{cycle}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-base font-black text-blue-600">
                  LKR {amountLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <p className="mt-6 text-[11px] leading-5 text-slate-400">
              Payment is activated instantly when PayHere confirms the signed transaction.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};
