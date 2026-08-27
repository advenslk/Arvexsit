import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

export const MakeTheSwitchSection: React.FC = () => {
  const { siteSettings, openCheckout, plans } = useApp();
  const [copied, setCopied] = useState(false);

  // Live ticking countdown timer matching Screenshot 2 & 9
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '14',
    minutes: '45',
    seconds: '13',
  });

  useEffect(() => {
    let targetTime = new Date(siteSettings.switchCountdownTarget).getTime();
    if (isNaN(targetTime) || targetTime <= Date.now()) {
      targetTime = Date.now() + 14 * 3600 * 1000 + 45 * 60 * 1000 + 13 * 1000;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [siteSettings.switchCountdownTarget]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(siteSettings.switchCouponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimDiscount = () => {
    const popularPlan = plans.find((p) => p.popular) || plans[0];
    if (popularPlan) {
      openCheckout(popularPlan);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Title & Subtitle matching Screenshot 2 & 9 */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display mb-3">
          {siteSettings.switchSectionTitle}
        </h2>
        <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed mb-12">
          {siteSettings.switchSectionSubtitle}
        </p>

        {/* Promo Box matching Screenshot 2 & 9 */}
        <div className="relative inline-block w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#151824] to-[#0f1118] border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mb-2">
            SAVE {siteSettings.switchDiscountPercent}%
          </div>

          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
            USE COUPON CODE
          </div>

          {/* Coupon Code Pill */}
          <div className="inline-flex items-center gap-2 bg-black/60 border border-white/15 px-5 py-2 rounded-2xl mb-6 shadow-inner">
            <span className="font-mono font-extrabold text-lg sm:text-xl text-white tracking-widest">
              {siteSettings.switchCouponCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copy coupon code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-4">
            EXPIRES IN
          </div>

          {/* Countdown Clock Display matching Screenshot 2 & 9 */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-white mb-8">
            <div>
              <div className="text-3xl sm:text-4xl font-black">{timeLeft.days}</div>
              <div className="text-[10px] text-slate-500 font-sans tracking-widest uppercase mt-1">
                DAYS
              </div>
            </div>
            <span className="text-2xl text-slate-600 font-bold mb-4">:</span>
            <div>
              <div className="text-3xl sm:text-4xl font-black">{timeLeft.hours}</div>
              <div className="text-[10px] text-slate-500 font-sans tracking-widest uppercase mt-1">
                HRS
              </div>
            </div>
            <span className="text-2xl text-slate-600 font-bold mb-4">:</span>
            <div>
              <div className="text-3xl sm:text-4xl font-black">{timeLeft.minutes}</div>
              <div className="text-[10px] text-slate-500 font-sans tracking-widest uppercase mt-1">
                MIN
              </div>
            </div>
            <span className="text-2xl text-slate-600 font-bold mb-4">:</span>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400">
                {timeLeft.seconds}
              </div>
              <div className="text-[10px] text-slate-500 font-sans tracking-widest uppercase mt-1">
                SEC
              </div>
            </div>
          </div>

          {/* Instant Claim Button */}
          <button
            onClick={handleClaimDiscount}
            className="w-full bg-white hover:bg-slate-100 text-black font-bold text-sm py-3 rounded-2xl transition-all shadow-xl hover:shadow-cyan-500/10 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Claim 10% Discount & Deploy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
