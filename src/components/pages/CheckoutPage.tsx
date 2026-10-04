import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Cpu, HardDrive,
  KeyRound, LockKeyhole, MapPin, Package, Receipt, Server, ShieldCheck,
  Sparkles, Tag, UserRound, WalletCards, Zap
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

const cycleLabel: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

const runtimeOptions = (plan: HostingPlan) => {
  if (plan.gameId === 'minecraft' || plan.serviceType === 'minecraft') {
    return ['PaperMC Latest', 'Vanilla Latest', 'Fabric Latest', 'Forge Latest', 'Bedrock Latest'];
  }
  if (plan.serviceType === 'vps' || plan.serviceType === 'vds') {
    return ['Ubuntu 24.04 LTS', 'Ubuntu 22.04 LTS', 'Debian 12', 'Windows Server'];
  }
  return ['Standard runtime', 'Latest stable release'];
};

export const CheckoutPage: React.FC = () => {
  const {
    currentRoute, plans, selectedPlanForCheckout, locations, currentUser,
    navigateTo, validateCoupon, showNotification
  } = useApp();

  const planId = currentRoute.params.planId || currentRoute.params.orderId;
  const plan = plans.find((p) => p.id === planId) || selectedPlanForCheckout;

  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [serverName, setServerName] = useState('My HelzerX Server');
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  const [runtime, setRuntime] = useState(plan ? runtimeOptions(plan)[0] : '');
  const [dedicatedIp, setDedicatedIp] = useState(false);
  const [dailyBackups, setDailyBackups] = useState(false);
  const [notes, setNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Colombo');
  const [busy, setBusy] = useState(false);

  const basePrice = useMemo(() => {
    if (!plan) return 0;
    if (cycle === 'quarterly') return plan.quarterlyPrice ?? plan.monthlyPrice * 3 * 0.9;
    if (cycle === 'yearly') return plan.yearlyPrice ?? plan.monthlyPrice * 12 * 0.8;
    return plan.monthlyPrice;
  }, [plan, cycle]);

  const discount = coupon ? basePrice * coupon.percent / 100 : 0;
  const totalUsd = Math.max(0, basePrice - discount);
  const totalLkrEstimate = Math.round(totalUsd * 305 * 100) / 100;
  const selectedLocation = locations.find((l) => l.id === locationId) || locations[0];

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim();
    setCouponError('');
    if (!code) {
      setCoupon(null);
      return;
    }
    const found = validateCoupon(code);
    if (!found) {
      setCoupon(null);
      setCouponError('Invalid or expired coupon code.');
      return;
    }
    setCoupon({ code: found.code, percent: found.discountPercentage });
    showNotification(`Coupon ${found.code} applied — ${found.discountPercentage}% off.`, 'success');
  };

  const startPayHere = async () => {
    if (!currentUser) {
      showNotification('Please sign in before checkout.', 'error');
      return;
    }
    if (!plan) return;
    if (!serverName.trim()) {
      showNotification('Enter a server name.', 'error');
      return;
    }
    if (!phone.trim() || !/^\+?[0-9 ()-]{7,20}$/.test(phone.trim())) {
      showNotification('Enter a valid phone number.', 'error');
      return;
    }
    if (!address.trim() || !city.trim()) {
      showNotification('Billing address and city are required for PayHere.', 'error');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/payments/payhere/create', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          cycle,
          couponCode: coupon?.code || '',
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          configuration: {
            location: selectedLocation?.name || selectedLocation?.city || '',
            hostname: serverName.trim(),
            osOrVersion: runtime,
            dedicatedIp,
            dailyBackups,
            customNotes: notes.trim(),
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to create secure payment.');

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
      form.submit();
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Unable to start PayHere checkout.', 'error');
      setBusy(false);
    }
  };

  if (!plan) {
    return (
      <div className="gabrun-light-canvas min-h-screen px-6 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <Package className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Plan not found</h1>
          <p className="mt-2 text-sm text-slate-500">Choose a hosting plan again to continue.</p>
          <button onClick={() => navigateTo('plans')} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Back to Plans</button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="gabrun-light-canvas min-h-screen px-6 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <LockKeyhole className="mx-auto h-10 w-10 text-blue-600" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Sign in to continue</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Your order and payment must belong to an authenticated HelzerX customer account.</p>
          <button onClick={() => navigateTo('home')} className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white">Return to HelzerX</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gabrun-light-canvas min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-8 pb-20 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute left-1/2 top-1/3 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-400/25 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-blue-100">
            <button onClick={() => navigateTo('home')} className="hover:text-white">Home</button>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <button onClick={() => navigateTo('plans')} className="hover:text-white">Plans</button>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="font-bold text-white">Configure & Checkout</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> Secure service configuration
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Build your {plan.name}.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Configure the service clearly, review the exact order total, then continue to the real PayHere gateway. Card details never enter HelzerX.
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.18)] sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">01 · Service</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">Your selected plan</h2>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Starting price</p>
                  <p className="text-xl font-black text-blue-700">${plan.monthlyPrice.toFixed(2)} <span className="text-xs font-semibold">/mo</span></p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['RAM', plan.ram, Server],
                  ['CPU', plan.cpu, Cpu],
                  ['Storage', plan.storage, HardDrive],
                  ['Players', plan.players, UserRound],
                ].map(([label, value, Icon]: any) => (
                  <div key={String(label)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-black text-slate-800">{String(value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-xs font-black text-emerald-800">Included with this plan</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {(plan.features || []).slice(0, 8).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-emerald-900/80"><Check className="h-3.5 w-3.5" />{feature}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">02 · Billing</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">Choose your billing cycle</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((item) => {
                  const value = item === 'monthly' ? plan.monthlyPrice : item === 'quarterly' ? (plan.quarterlyPrice ?? plan.monthlyPrice * 3 * 0.9) : (plan.yearlyPrice ?? plan.monthlyPrice * 12 * 0.8);
                  const saving = item === 'quarterly' ? 'Save 10%' : item === 'yearly' ? 'Save 20%' : 'Flexible';
                  return (
                    <button key={item} type="button" onClick={() => setCycle(item)} className={`rounded-2xl border p-4 text-left transition ${cycle === item ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/10' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                      <div className="flex items-center justify-between"><span className="text-sm font-black">{cycleLabel[item]}</span>{cycle === item && <Check className="h-4 w-4 text-blue-600" />}</div>
                      <p className="mt-2 text-lg font-black text-slate-900">${value.toFixed(2)}</p>
                      <p className="mt-1 text-[10px] font-bold text-emerald-600">{saving}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">03 · Deployment</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Configure your service</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">
                  Server name
                  <input value={serverName} onChange={(e) => setServerName(e.target.value)} maxLength={80} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
                </label>

                <label className="text-xs font-bold text-slate-700">
                  Runtime / OS
                  <select value={runtime} onChange={(e) => setRuntime(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white">
                    {runtimeOptions(plan).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Datacenter</span>
                  <span className="text-[10px] font-bold text-emerald-600">Live location data</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {locations.map((location) => (
                    <button key={location.id} type="button" onClick={() => setLocationId(location.id)} className={`rounded-2xl border p-4 text-left transition ${locationId === location.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-blue-200'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm font-black text-slate-800"><MapPin className="h-4 w-4 text-blue-600" />{location.name || location.city}</span>
                        <span className="text-xs font-black text-emerald-600">{location.pingMs}ms</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{location.city}, {location.country}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setDedicatedIp((v) => !v)} className={`rounded-2xl border p-4 text-left ${dedicatedIp ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between"><span className="text-sm font-black">Dedicated IP</span><span className={`h-5 w-9 rounded-full p-1 ${dedicatedIp ? 'bg-blue-600' : 'bg-slate-200'}`}><span className={`block h-3 w-3 rounded-full bg-white transition ${dedicatedIp ? 'translate-x-4' : ''}`} /></span></div>
                  <p className="mt-1 text-xs text-slate-500">Store as a deployment requirement for the order.</p>
                </button>
                <button type="button" onClick={() => setDailyBackups((v) => !v)} className={`rounded-2xl border p-4 text-left ${dailyBackups ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between"><span className="text-sm font-black">Daily backups</span><span className={`h-5 w-9 rounded-full p-1 ${dailyBackups ? 'bg-blue-600' : 'bg-slate-200'}`}><span className={`block h-3 w-3 rounded-full bg-white transition ${dailyBackups ? 'translate-x-4' : ''}`} /></span></div>
                  <p className="mt-1 text-xs text-slate-500">Attach the backup requirement to your order.</p>
                </button>
              </div>

              <label className="mt-5 block text-xs font-bold text-slate-700">
                Deployment notes <span className="font-normal text-slate-400">(optional)</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3} placeholder="Anything our provisioning team should know…" className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
              </label>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">04 · Billing details</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Where should PayHere send the receipt?</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">Phone
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0771234567" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
                </label>
                <label className="text-xs font-bold text-slate-700">City
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
                </label>
              </div>
              <label className="mt-5 block text-xs font-bold text-slate-700">Billing address
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="No. 1, Galle Road" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
              </label>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <UserRound className="h-5 w-5 text-blue-600" />
                <div><p className="text-xs font-black text-slate-800">{currentUser.name}</p><p className="text-xs text-slate-500">{currentUser.email}</p></div>
                <ShieldCheck className="ml-auto h-5 w-5 text-emerald-600" />
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_-20px_rgba(15,23,42,0.25)]">
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200"><Receipt className="h-4 w-4" /> Order summary</div>
                <h2 className="mt-4 text-2xl font-black">{plan.name}</h2>
                <p className="mt-1 text-xs text-blue-200">{plan.subtitle}</p>
              </div>

              <div className="p-6">
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between gap-4"><span className="text-slate-400">Billing</span><span className="font-bold capitalize">{cycle}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-400">Location</span><span className="font-bold text-right">{selectedLocation?.name || 'Select location'}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-400">Runtime</span><span className="max-w-[180px] text-right font-bold">{runtime}</span></div>
                  {dedicatedIp && <div className="flex justify-between gap-4 text-blue-700"><span>Dedicated IP</span><span>Requested</span></div>}
                  {dailyBackups && <div className="flex justify-between gap-4 text-blue-700"><span>Daily backups</span><span>Requested</span></div>}
                </div>

                <form onSubmit={applyCoupon} className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1"><Tag className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" /><input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500" /></div>
                    <button className="rounded-xl bg-slate-900 px-4 text-xs font-bold text-white">Apply</button>
                  </div>
                  {couponError && <p className="mt-2 text-[10px] font-semibold text-rose-600">{couponError}</p>}
                  {coupon && <p className="mt-2 text-[10px] font-bold text-emerald-600">{coupon.code} · {coupon.percent}% discount</p>}
                </form>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>${basePrice.toFixed(2)}</span></div>
                  {coupon && <div className="mt-2 flex justify-between text-xs font-bold text-emerald-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pay today</p><p className="mt-1 text-3xl font-black text-slate-900">${totalUsd.toFixed(2)}</p></div>
                    <div className="text-right"><p className="text-[10px] text-slate-400">Estimated LKR</p><p className="text-lg font-black text-blue-600">Rs. {totalLkrEstimate.toLocaleString('en-LK')}</p></div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" /><p className="text-[11px] leading-5 text-slate-600">The final amount is recalculated on the HelzerX server before PayHere creates the payment. Your browser cannot change the payable amount.</p></div>
                </div>

                <button type="button" onClick={startPayHere} disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
                  {busy ? <Zap className="h-4 w-4 animate-pulse" /> : <WalletCards className="h-4 w-4" />}
                  {busy ? 'Preparing secure PayHere…' : `Continue to PayHere · Rs. ${totalLkrEstimate.toLocaleString('en-LK')}`}
                  {!busy && <ArrowRight className="h-4 w-4" />}
                </button>
                <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">You will enter card / wallet details on PayHere&apos;s secure gateway, not on this website.</p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-emerald-600" /><div><p className="text-xs font-black">Secure payment flow</p><p className="text-[10px] text-slate-400">Server-verified PayHere callback</p></div></div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400"><Check className="h-3.5 w-3.5 text-emerald-500" /> No card details stored by HelzerX</div>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400"><Check className="h-3.5 w-3.5 text-emerald-500" /> Signed payment notification required</div>
            </section>

            <button onClick={() => navigateTo('plans')} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to plans</button>
          </aside>
        </div>
      </main>
    </div>
  );
};
