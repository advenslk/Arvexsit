import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostingPlan } from '../types';
import {
  Server,
  Cpu,
  HardDrive,
  Users,
  Zap,
  Shield,
  Layers,
  Headphones,
  Check,
  Sparkles,
  Flame,
} from 'lucide-react';

interface GameHostingPlansSectionProps {
  selectedGameId?: string;
  onSelectGame?: (gameId: string) => void;
}

export const GameHostingPlansSection: React.FC<GameHostingPlansSectionProps> = ({
  selectedGameId: propSelectedGameId,
  onSelectGame,
}) => {
  const {
    siteSettings,
    games,
    plans,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
  } = useApp();

  const [activeGameId, setActiveGameId] = useState<string>(
    propSelectedGameId || 'minecraft'
  );
  const [activeTier, setActiveTier] = useState<'All' | 'Starter' | 'Standard' | 'Premium'>('All');

  const currentGameId = propSelectedGameId || activeGameId;
  const currentGame = games.find((g) => g.id === currentGameId) || games[0];

  const handleGameTabClick = (gameId: string) => {
    setActiveGameId(gameId);
    if (onSelectGame) {
      onSelectGame(gameId);
    }
  };

  const gamePlans = plans.filter((p) => p.gameId === currentGameId);
  const filteredPlans = activeTier === 'All'
    ? gamePlans
    : gamePlans.filter((p) => p.tier === activeTier);

  const displayPlans = filteredPlans.length > 0 ? filteredPlans : gamePlans;

  const getPlanPrice = (plan: HostingPlan) => {
    if (billingCycle === 'quarterly') {
      return plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.95;
    }
    if (billingCycle === 'yearly') {
      return plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.85;
    }
    return plan.monthlyPrice;
  };

  return (
    <section id="plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header matching Screenshot 1 */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-display uppercase mb-3">
          {siteSettings.pricingSectionTitle}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          {siteSettings.pricingSectionSubtitle}
        </p>

        {/* Billing Cycle Toggle Pill (Mo / 3Mo / Yr) matching Screenshot 1 */}
        <div className="inline-flex items-center bg-[#131620] p-1 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mo
          </button>
          <button
            onClick={() => setBillingCycle('quarterly')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === 'quarterly'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3Mo
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              billingCycle === 'yearly'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Yr</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
              -15%
            </span>
          </button>
        </div>
      </div>

      {/* Featured Game Hero Card Banner matching Screenshot 1 */}
      {currentGame && (
        <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#111624] via-[#161c2e] to-[#0f121a] border border-white/10 shadow-2xl p-6 sm:p-8 min-h-[190px] flex flex-col justify-between">
          {/* Minecraft Character Artwork Banner on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-60 pointer-events-none overflow-hidden">
            <img
              src={currentGame.bannerImage || currentGame.image}
              alt={currentGame.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center [mask-image:linear-gradient(to_left,black_60%,transparent_100%)]"
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {currentGame.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Starting from {formatPrice(currentGame.startingPrice)}/month
                </p>
              </div>
            </div>

            {/* Tier Selectors (Starter / Standard / Premium) matching Screenshot 1 */}
            <div className="mt-4 flex items-center gap-2">
              {(['All', 'Starter', 'Standard', 'Premium'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-xl border transition-all ${
                    activeTier === tier
                      ? 'bg-white text-black border-white shadow-sm'
                      : 'bg-[#181d2a]/80 hover:bg-[#202738] text-slate-300 border-white/10'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Selector Pills matching Screenshot 1 */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {games.map((g) => {
          const isSelected = currentGameId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleGameTabClick(g.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-[#12151f] hover:bg-[#181c2b] text-slate-300 border-white/10'
              }`}
            >
              <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-slate-800 text-[10px]">
                🎮
              </span>
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* Pricing Cards Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {displayPlans.map((plan) => {
          const currentPrice = getPlanPrice(plan);
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#121622] border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/10'
                  : 'bg-[#0f121a] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular Star Sparkle Badge matching Screenshot 1 */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <div className="relative inline-flex items-center gap-1 bg-white text-black font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-lg">
                    <span className="text-cyan-600 text-xs">✦</span>
                    <span>{plan.badge || 'Popular'}</span>
                    <span className="text-cyan-600 text-xs">✦</span>
                  </div>
                </div>
              )}

              <div>
                {/* Plan Title & Subtitle */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1b202e] border border-white/10 flex items-center justify-center text-cyan-400 font-bold">
                    ⛏️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-400">{plan.subtitle}</p>
                  </div>
                </div>

                {/* Pricing Display */}
                <div className="flex items-baseline gap-2 mb-6">
                  {plan.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                      {formatPrice(currentPrice)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/month</span>
                  </div>
                </div>

                {/* 2x2 Specs Grid matching Screenshot 1 */}
                <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-white/5 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{plan.ram}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{plan.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{plan.storage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{plan.players}</span>
                  </div>
                </div>
              </div>

              {/* Get Started CTA Button matching Screenshot 1 */}
              <button
                id={`plan-get-started-${plan.id}`}
                onClick={() => openCheckout(plan)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                  plan.popular
                    ? 'bg-white hover:bg-slate-100 text-black shadow-white/10'
                    : 'bg-[#232938] hover:bg-[#2e364a] text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>

      {/* 4 Feature Capsules below plans matching Screenshot 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#12151f] border border-white/5 rounded-2xl p-3.5 text-center">
          <p className="text-xs font-bold text-white">Instant Setup</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready in seconds</p>
        </div>
        <div className="bg-[#12151f] border border-white/5 rounded-2xl p-3.5 text-center">
          <p className="text-xs font-bold text-white">DDoS Protection</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Enterprise-grade</p>
        </div>
        <div className="bg-[#12151f] border border-white/5 rounded-2xl p-3.5 text-center">
          <p className="text-xs font-bold text-white">Mod Support</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Easy installation</p>
        </div>
        <div className="bg-[#12151f] border border-white/5 rounded-2xl p-3.5 text-center">
          <p className="text-xs font-bold text-white">24/7 Support</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Always here to help</p>
        </div>
      </div>
    </section>
  );
};
