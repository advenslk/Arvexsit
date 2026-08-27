import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Server, Tag, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    selectedPlanForCheckout,
    locations,
    billingCycle,
    setBillingCycle,
    formatPrice,
    validateCoupon,
    navigateTo,
    currentUser,
    setAuthModalOpen,
    setAuthModalTab,
  } = useApp();

  const [serverName, setServerName] = useState('My ArveX Server');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.city || 'Singapore');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const plan = selectedPlanForCheckout;
  const basePrice = useMemo(() => {
    if (!plan) return 0;
    if (billingCycle === 'quarterly') return plan.quarterlyPrice || plan.monthlyPrice * 3 * 0.95;
    if (billingCycle === 'yearly') return plan.yearlyPrice || plan.monthlyPrice * 12 * 0.85;
    return plan.monthlyPrice;
  }, [plan, billingCycle]);
  const discount = coupon ? basePrice * coupon.percent / 100 : 0;
  const finalPrice = Math.max(0, basePrice - discount);

  if (!isCheckoutModalOpen || !plan) return null;

  const applyCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    setCouponError('');
    const result = validateCoupon(couponInput.trim());
    if (!result) {
      setCoupon(null);
      setCouponError('Invalid or expired coupon code.');
      return;
    }
    setCoupon({ code: result.code, percent: result.discountPercentage });
  };

  const continueToPayment = () => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return;
    }
    setIsCheckoutModalOpen(false);
    navigateTo('payment', {
      planId: plan.id,
      amount: finalPrice.toFixed(2),
      cycle: billingCycle,
      location: selectedLocation,
      serverName: serverName || 'My ArveX Server',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-[#11141e] p-6 shadow-2xl sm:p-8">
        <button onClick={() => setIsCheckoutModalOpen(false)} className="absolute right-5 top-5 rounded-xl bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="mb-7 flex items-center gap-3 pr-10"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10"><Zap className="h-5 w-5 text-cyan-300" /></div><div><h3 className="text-xl font-black text-white">Configure {plan.name}</h3><p className="text-xs text-slate-400">Secure payment before any service activation.</p></div></div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <label className="block text-xs font-semibold text-slate-300">Server name<input value={serverName} onChange={(e) => setServerName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0d14] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
            <div><div className="mb-2 text-xs font-semibold text-slate-300">Data center</div><div className="space-y-2">{locations.map((location) => <button key={location.id} type="button" onClick={() => setSelectedLocation(location.city)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-xs transition ${selectedLocation === location.city ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/5 bg-[#0b0d14] text-slate-400'}`}><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-cyan-300" />{location.name || location.city}</span><span className="text-emerald-400">{location.pingMs}ms</span></button>)}</div></div>
            <div><div className="mb-2 text-xs font-semibold text-slate-300">Billing cycle</div><div className="grid grid-cols-3 gap-2">{(['monthly', 'quarterly', 'yearly'] as const).map((cycle) => <button key={cycle} type="button" onClick={() => setBillingCycle(cycle)} className={`rounded-xl border px-2 py-2.5 text-xs font-bold capitalize ${billingCycle === cycle ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-white/10 bg-[#0b0d14] text-slate-400'}`}>{cycle}</button>)}</div></div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0d14] p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Server className="h-4 w-4 text-cyan-300" /> Included resources</div>
            <div className="space-y-2 text-xs text-slate-300"><div className="flex justify-between"><span>RAM</span><b>{plan.ram}</b></div><div className="flex justify-between"><span>CPU</span><b>{plan.cpu}</b></div><div className="flex justify-between"><span>Storage</span><b>{plan.storage}</b></div><div className="flex justify-between"><span>Players</span><b>{plan.players}</b></div></div>
            <form onSubmit={applyCoupon} className="mt-6"><div className="flex gap-2"><div className="relative flex-1"><Tag className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" /><input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="w-full rounded-xl border border-white/10 bg-[#141724] py-2.5 pl-9 pr-3 text-xs text-white outline-none" /></div><button className="rounded-xl bg-white/10 px-4 text-xs font-bold text-white">Apply</button></div>{couponError && <p className="mt-2 text-[10px] text-rose-400">{couponError}</p>}{coupon && <p className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400"><CheckCircle2 className="h-3 w-3" />{coupon.code} · {coupon.percent}% off</p>}</form>
            <div className="mt-6 border-t border-white/10 pt-4"><div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>{formatPrice(basePrice)}</span></div>{coupon && <div className="mt-1 flex justify-between text-xs text-emerald-400"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}<div className="mt-3 flex justify-between text-base font-black text-white"><span>Total</span><span className="text-cyan-300">{formatPrice(finalPrice)}</span></div></div>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4 text-xs leading-5 text-slate-400">Payment is processed by PayHere. ArveX will only treat an order as paid after the server verifies PayHere’s signed notification. Browser redirects cannot activate services.</div>
        <button onClick={continueToPayment} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 text-sm font-black text-black hover:bg-cyan-400"><CreditCard className="h-4 w-4" />Continue to secure payment<ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
};
