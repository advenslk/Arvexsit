import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Server,
  Cpu,
  HardDrive,
  Users,
  MapPin,
  Tag,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

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
    deployServer,
    setIsClientAreaOpen,
  } = useApp();

  const [serverName, setServerName] = useState('My ArveX Server');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.city || 'Dallas / New York');
  const [couponInput, setCouponInput] = useState('VOLTUS10');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>({
    code: 'VOLTUS10',
    percent: 10,
  });
  const [couponError, setCouponError] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionSuccess, setProvisionSuccess] = useState<any | null>(null);

  if (!isCheckoutModalOpen || !selectedPlanForCheckout) return null;

  const plan = selectedPlanForCheckout;

  // Base price calculation
  let basePrice = plan.monthlyPrice;
  if (billingCycle === 'quarterly') {
    basePrice = plan.quarterlyPrice ? plan.quarterlyPrice : plan.monthlyPrice * 3 * 0.95;
  } else if (billingCycle === 'yearly') {
    basePrice = plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice * 12 * 0.85;
  }

  const discountAmount = appliedCoupon ? (basePrice * appliedCoupon.percent) / 100 : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const validated = validateCoupon(couponInput);
    if (validated) {
      setAppliedCoupon({ code: validated.code, percent: validated.discountPercentage });
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleDeployNow = () => {
    setIsProvisioning(true);
    setProvisionProgress(10);

    const timer1 = setTimeout(() => setProvisionProgress(40), 500);
    const timer2 = setTimeout(() => setProvisionProgress(75), 1100);
    const timer3 = setTimeout(() => {
      setProvisionProgress(100);
      const newServer = deployServer(plan, selectedLocation, serverName);
      setProvisionSuccess(newServer);
      setIsProvisioning(false);
    }, 1800);
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setIsProvisioning(false);
    setProvisionProgress(0);
    setProvisionSuccess(null);
  };

  const handleOpenClientPanel = () => {
    handleClose();
    setIsClientAreaOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#11141e] border border-white/10 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {provisionSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-2">
              Server Deployed Successfully!
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Your high-performance AMD Ryzen node is now online and ready for players.
            </p>

            {/* Server Card Details */}
            <div className="rounded-2xl bg-[#0b0d14] border border-white/10 p-4 text-left mb-6 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Server Name:</span>
                <span className="text-white font-bold">{provisionSuccess.serverName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Connection IP:</span>
                <span className="text-cyan-400 font-bold">
                  {provisionSuccess.ipAddress}:{provisionSuccess.port}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-white">{provisionSuccess.location}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Allocated Hardware:</span>
                <span className="text-indigo-300">{plan.ram} · {plan.cpu}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold uppercase">ONLINE (20.0 TPS)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenClientPanel}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-black font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Open Server Console & Web Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isProvisioning ? (
          /* Provisioning Progress Animation */
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-6 animate-pulse">
              <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white font-display mb-2">
              Provisioning Game Server...
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Allocating dedicated NVMe storage, assigning clean DDoS-protected IP, and configuring Pterodactyl daemon.
            </p>

            <div className="w-full bg-[#0b0d14] rounded-full h-3 border border-white/10 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${provisionProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">{provisionProgress}% Complete</span>
          </div>
        ) : (
          /* Checkout Config Form */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                ⚡
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Configure & Deploy {plan.name}
                </h3>
                <p className="text-xs text-slate-400">{plan.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column: Server Config */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Server Name
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="e.g. Realm of Legends"
                    className="w-full bg-[#0b0d14] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Data Center Location
                  </label>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocation(`${loc.country} (${loc.city})`)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                          selectedLocation.includes(loc.city)
                            ? 'bg-[#1a1f2e] text-white border-cyan-400 shadow-sm'
                            : 'bg-[#0b0d14] text-slate-400 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{loc.flag}</span>
                          <span className="font-semibold text-white">{loc.name}</span>
                          <span className="text-[10px] text-slate-500">({loc.city})</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold text-[10px]">
                          {loc.pingMs}ms
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Plan Specs & Billing */}
              <div className="rounded-2xl bg-[#0b0d14] border border-white/10 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Included Specs
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{plan.ram}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{plan.cpu}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{plan.storage}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{plan.players}</span>
                    </div>
                  </div>

                  {/* Billing Cycle Radio */}
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Billing Cycle
                  </label>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#141724] text-slate-400 border-white/5'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('quarterly')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        billingCycle === 'quarterly'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#141724] text-slate-400 border-white/5'
                      }`}
                    >
                      Quarterly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        billingCycle === 'yearly'
                          ? 'bg-white text-black border-white'
                          : 'bg-[#141724] text-slate-400 border-white/5'
                      }`}
                    >
                      Yearly (-15%)
                    </button>
                  </div>

                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="mb-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Coupon code"
                          className="w-full bg-[#141724] border border-white/10 rounded-lg pl-9 pr-2 py-2 text-xs text-white uppercase placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#23293a] hover:bg-[#2d354a] text-slate-200 text-xs px-3 py-2 rounded-lg font-semibold border border-white/10"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-rose-400 mt-1">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Code {appliedCoupon.code} applied ({appliedCoupon.percent}% OFF)</span>
                      </p>
                    )}
                  </form>
                </div>

                {/* Price Breakdown & Total */}
                <div className="pt-3 border-t border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Discount ({appliedCoupon.percent}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-white/5">
                    <span>Total Due Today:</span>
                    <span className="text-cyan-300 font-display text-base font-extrabold">
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deploy Action Button */}
            <button
              id="confirm-deploy-server-btn"
              onClick={handleDeployNow}
              className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-black fill-current" />
              <span>Confirm Order & Instant Deploy ({formatPrice(finalPrice)})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
