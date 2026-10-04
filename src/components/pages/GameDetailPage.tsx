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
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
          <Gamepad2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 font-display mb-3">Game Not Found</h1>
          <button
            onClick={() => navigateTo('services/game-hosting')}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            View All Game Servers
          </button>
        </div>
      </div>
    );
  }

  const gameFeatures = [
    { title: '1-Click Modpack & Plugin Installer', desc: 'CurseForge, Modrinth, Paper, Purpur, Spigot, Forge, and Fabric instantly available.' },
    { title: 'Sub-15ms Low Latency Routing', desc: 'Direct BGP peering across Europe, North America, and Asia Pacific datacenters.' },
    { title: 'Automated Real-Time Backups', desc: 'Create manual restore points or schedule automated daily cloud backups.' },
    { title: 'Live Interactive Web Console', desc: 'Real-time stdout log streams with live command execution and player kick/ban manager.' },
    { title: 'Full SFTP & Database Access', desc: 'Direct secure FTP access and unlimited free MySQL databases for plugins.' },
    { title: 'HelzerX Game Shield (3.2+ Tbps)', desc: 'Engineered filtering specifically calibrated for game protocol UDP floods.' },
  ];

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <button onClick={() => navigateTo('services/game-hosting')} className="hover:text-white transition-colors cursor-pointer">Game Hosting</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">{game.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>High-Frequency Game Server</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight mb-4 leading-tight">
                {game.name} Server Hosting
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                {game.description ||
                  `Deploy high-performance ${game.name} dedicated instances powered by Ryzen 9 7950X / 9950X CPUs, ultra-fast NVMe storage, and enterprise DDoS mitigation.`}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('game-plans-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>View Available Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs text-white bg-white/15 border border-white/25 px-4 py-3 rounded-2xl backdrop-blur-md">
                  <Clock className="w-4 h-4 text-cyan-300" />
                  <span>Instant Setup &lt; 15 Seconds</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 p-2 backdrop-blur-md max-w-xs w-full">
                <img
                  src={game.bannerUrl || game.iconUrl || game.image}
                  alt={game.name}
                  className="w-full h-56 rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Plans for this Game */}
      <div id="game-plans-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mb-1">
              Available {game.name} Hosting Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select an optimized plan below. All plans are dynamically configured from our active server fleet.
            </p>
          </div>

          {/* Billing Cycle Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeCycle === cycle
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
              </button>
            ))}
          </div>
        </div>

        {gamePlans.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-sm">
            <Server className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-bold text-slate-900 mb-1">No specific plans listed for {game.name}</p>
            <p className="text-xs mb-4">You can deploy a high-performance custom game node or view our general fleet.</p>
            <button
              onClick={() => navigateTo('plans')}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20"
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
                  className={`bg-white border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative group shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl ${
                    plan.popular ? 'border-2 border-blue-500 -translate-y-1' : 'border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                      Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-black text-slate-900 font-display">{plan.name}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {plan.ram} RAM
                      </span>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900 font-display">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{plan.subtitle || 'Ultra-Fast Instance'}</p>
                    </div>

                    <div className="space-y-2.5 py-4 border-t border-b border-slate-100 mb-6 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-600" /> CPU</span>
                        <span className="font-semibold text-slate-900">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-emerald-600" /> Storage</span>
                        <span className="font-semibold text-slate-900">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-600" /> Player Slots</span>
                        <span className="font-semibold text-slate-900">{plan.players || 'Unlimited'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Protection</span>
                        <span className="font-semibold text-slate-900">3.2 Tbps DDoS</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Deploy Server</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo(`services/${plan.serviceType || 'game-hosting'}`, { planSlug: plan.slug || plan.id })}
                      className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Dedicated Plan Page
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feature Breakdown */}
        <div className="pt-6">
          <h2 className="text-2xl font-black text-slate-900 font-display mb-6">
            Enterprise Features Built for {game.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameFeatures.map((feat, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
