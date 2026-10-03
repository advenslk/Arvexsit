import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostingPlan } from '../types';
import { Server, Cpu, HardDrive, Users, CheckCircle2, Flame, Zap, ShieldCheck, Package, ArrowRight } from 'lucide-react';
import { ThreeDCard } from './ThreeDCard';

interface GameHostingPlansSectionProps {
  selectedGameId?: string;
  onSelectGame?: (gameId: string) => void;
}

export const GameHostingPlansSection: React.FC<GameHostingPlansSectionProps> = ({
  selectedGameId: propSelectedGameId,
  onSelectGame,
}) => {
  const { siteSettings, games, plans, billingCycle, setBillingCycle, formatPrice, openCheckout } = useApp();
  const [activeGameId, setActiveGameId] = useState(propSelectedGameId || 'minecraft');
  const [activeTier, setActiveTier] = useState<'All' | 'Starter' | 'Standard' | 'Premium'>('All');

  const currentGameId = propSelectedGameId || activeGameId;
  const currentGame = games.find((g) => g.id === currentGameId) || games[0];
  const gamePlans = plans.filter((p) => p.gameId === currentGameId);
  const filteredPlans = activeTier === 'All' ? gamePlans : gamePlans.filter((p) => p.tier === activeTier);
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : gamePlans;

  const getPlanPrice = (plan: HostingPlan) =>
    billingCycle === 'quarterly'
      ? plan.quarterlyPrice
        ? plan.quarterlyPrice / 3
        : plan.monthlyPrice * 0.95
      : billingCycle === 'yearly'
      ? plan.yearlyPrice
        ? plan.yearlyPrice / 12
        : plan.monthlyPrice * 0.85
      : plan.monthlyPrice;

  return (
    <section id="plans" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-left">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-3 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>Configured for Performance</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          {siteSettings.pricingSectionTitle || 'Choose Your Game Server Plan'}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
          {siteSettings.pricingSectionSubtitle || 'All plans include DDoS protection, instant setup, NVMe SSDs and 24/7 support.'}
        </p>

        {/* Billing cycle pill switcher */}
        <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
          {(['monthly', 'quarterly', 'yearly'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setBillingCycle(c)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === c ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c === 'monthly' ? 'Monthly' : c === 'quarterly' ? 'Quarterly' : 'Yearly'}
              {c === 'yearly' && (
                <span className="ml-1.5 text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                  -15%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start sm:justify-center">
        {games.map((g) => {
          const selected = currentGameId === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setActiveGameId(g.id);
                onSelectGame?.(g.id);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                selected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-12 stage-3d">
        {displayPlans.map((plan) => {
          const price = getPlanPrice(plan);
          return (
            <ThreeDCard
              key={plan.id}
              maxTilt={plan.popular ? 10 : 7}
              scale={plan.popular ? 1.025 : 1.015}
              glare={true}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-white border-2 border-blue-600 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.22)]'
                  : 'bg-white border border-slate-200/90 shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div style={{ transform: 'translateZ(25px)' }} className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-extrabold text-[11px] px-4 py-1 rounded-full shadow-md">
                    <Zap className="w-3 h-3 fill-white" />
                    <span>{plan.badge || 'Most Popular'}</span>
                  </div>
                </div>
              )}

              <div style={{ transform: 'translateZ(15px)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-slate-900 tracking-tight">{plan.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{plan.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-6">
                  {plan.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                      {formatPrice(price)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1 font-medium">/mo</span>
                  </div>
                </div>

                <div className="space-y-3 py-4 border-t border-b border-slate-100 mb-6 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-600 shrink-0" /> RAM
                    </span>
                    <span className="font-bold text-slate-900">{plan.ram}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 shrink-0" /> CPU
                    </span>
                    <span className="font-bold text-slate-900">{plan.cpu}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-blue-600 shrink-0" /> Storage
                    </span>
                    <span className="font-bold text-slate-900">{plan.storage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" /> Player Slots
                    </span>
                    <span className="font-bold text-slate-900">{plan.players}</span>
                  </div>
                </div>
              </div>

              <div style={{ transform: 'translateZ(20px)' }}>
                <button
                  type="button"
                  id={`plan-get-started-${plan.id}`}
                  onClick={() => openCheckout(plan)}
                  className={`btn-3d w-full py-3.5 rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : 'bg-[#0b0f19] hover:bg-slate-900 text-white'
                  }`}
                >
                  <span>Deploy Server</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ThreeDCard>
          );
        })}
      </div>

      {/* Feature Micro-Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Instant 60s Setup', 'Automated provisioning', Zap],
          ['Corero 3.2Tbps DDoS', 'Continuous packet filtering', ShieldCheck],
          ['1-Click Modpacks', 'All versions supported', Package],
          ['24/7 Expert Staff', 'Live discord support desk', CheckCircle2],
        ].map(([title, sub, Icon]) => {
          const I = Icon as React.ElementType;
          return (
            <div
              key={title as string}
              className="rounded-2xl bg-white border border-slate-200/80 p-4 text-left shadow-sm hover:border-blue-200 transition"
            >
              <I className="w-5 h-5 mb-2 text-blue-600" />
              <p className="text-xs font-bold text-slate-900">{title as string}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{sub as string}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
