import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Server,
  Cpu,
  HardDrive,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Layers,
  HelpCircle,
  Clock,
  Globe,
  ChevronRight,
  Terminal,
  Download,
  FolderSync,
  Play,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { GameService, HostingPlan, BillingCycle } from '../../types';

export const GameDetailPage: React.FC = () => {
  const {
    currentRoute,
    games,
    plans,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
  } = useApp();

  const gameSlug = currentRoute.params.gameSlug || currentRoute.params.id || 'minecraft';
  const game = games.find((g) => g.slug === gameSlug || g.id === gameSlug) || games[0];

  const gamePlans = plans.filter((p) => p.gameId === game?.id);

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);

  if (!game) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-white font-display mb-3">Game Not Found</h1>
        <button
          onClick={() => navigateTo('services/game-hosting')}
          className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm"
        >
          View All Game Servers
        </button>
      </div>
    );
  }

  const gameFeatures = [
    { title: '1-Click Modpack & Plugin Installer', desc: 'CurseForge, Modrinth, Paper, Purpur, Spigot, Forge, and Fabric instantly available.' },
    { title: 'Sub-15ms Low Latency Routing', desc: 'Direct BGP peering across Europe, North America, and Asia Pacific datacenters.' },
    { title: 'Automated Real-Time Backups', desc: 'Create manual restore points or schedule automated daily cloud backups.' },
    { title: 'Live Interactive Web Console', desc: 'Real-time stdout log streams with live command execution and player kick/ban manager.' },
    { title: 'Full SFTP & Database Access', desc: 'Direct secure FTP access and unlimited free MySQL databases for plugins.' },
    { title: 'ArveX Game Shield (3.2+ Tbps)', desc: 'Engineered filtering specifically calibrated for game protocol UDP floods.' },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services/game-hosting')} className="hover:text-white transition-colors">Game Hosting</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">{game.name}</span>
      </nav>

      {/* Game Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0d0f18] p-8 sm:p-12 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/90 to-transparent z-10" />
        <img
          src={game.bannerUrl || game.iconUrl}
          alt={game.name}
          className="absolute right-0 top-0 bottom-0 w-full lg:w-2/3 h-full object-cover opacity-25 lg:opacity-40"
        />

        <div className="relative z-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>High-Frequency Game Server</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
            {game.name} Server Hosting
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            {game.description ||
              `Deploy high-performance ${game.name} dedicated instances powered by Ryzen 9 7950X / 9950X CPUs, ultra-fast NVMe storage, and enterprise DDoS mitigation.`}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('game-plans-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>View Available Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Instant Setup &lt; 15 Seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans for this Game */}
      <div id="game-plans-grid" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Available {game.name} Hosting Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select an optimized plan below. All plans are dynamically configured from our active server fleet.
            </p>
          </div>

          {/* Billing Cycle Selector */}
          <div className="flex items-center gap-1 bg-[#11131e] p-1 rounded-xl border border-white/5 shrink-0">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeCycle === cycle
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
              </button>
            ))}
          </div>
        </div>

        {gamePlans.length === 0 ? (
          <div className="bg-[#11131e] border border-white/5 rounded-2xl p-8 text-center text-slate-400">
            <Server className="w-10 h-10 mx-auto mb-3 text-slate-500" />
            <p className="text-sm font-semibold text-white mb-1">No specific plans listed for {game.name}</p>
            <p className="text-xs mb-4">You can deploy a high-performance custom game node or view our general fleet.</p>
            <button
              onClick={() => navigateTo('plans')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
            >
              Browse All Active Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamePlans.map((plan) => {
              const price =
                activeCycle === 'quarterly'
                  ? plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9
                  : activeCycle === 'yearly'
                  ? plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8
                  : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`bg-[#11131e] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-cyan-500/40 relative group ${
                    plan.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/5' : 'border-white/5'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-wider">
                      Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                      <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {plan.ram} RAM
                      </span>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white font-display">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{plan.subtitle || 'Ultra-Fast Instance'}</p>
                    </div>

                    <div className="space-y-2.5 py-4 border-t border-b border-white/5 mb-6 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU</span>
                        <span className="font-semibold text-white">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-blue-400" /> Storage</span>
                        <span className="font-semibold text-white">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400" /> Player Slots</span>
                        <span className="font-semibold text-white">{plan.players || 'Unlimited'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Protection</span>
                        <span className="font-semibold text-white">3.2 Tbps DDoS</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Deploy Server</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo(`services/${plan.serviceType || 'game-hosting'}`, { planSlug: plan.slug || plan.id })}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                    >
                      View Dedicated Plan Page
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature Breakdown */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Enterprise Features Built for {game.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#11131e] border border-white/5 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
