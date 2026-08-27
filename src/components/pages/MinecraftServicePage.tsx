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
  Box,
  Flame,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const MinecraftServicePage: React.FC = () => {
  const {
    plans,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
    locations,
  } = useApp();

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);
  const [activeEdition, setActiveEdition] = useState<'all' | 'java' | 'bedrock'>('all');

  // Custom RAM Slider
  const [sliderRam, setSliderRam] = useState<number>(8);

  const mcPlans = plans.filter(
    (p) => p.gameId === 'minecraft' || p.serviceType === 'minecraft'
  );

  const getCalculatedPrice = (plan: HostingPlan) => {
    if (activeCycle === 'quarterly') {
      return plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9;
    }
    if (activeCycle === 'yearly') {
      return plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8;
    }
    return plan.monthlyPrice;
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Minecraft Server Hosting</span>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0c0e17] via-[#121524] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Box className="w-4 h-4" />
            <span>High-Frequency Paper, Purpur, Forge & Fabric Nodes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Ultra-Low Latency <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Minecraft Server Hosting
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Power your survival worlds, network hubs, and heavy modpacks with AMD Ryzen 9 7950X / 9950X processors, DDR5 ECC memory, Gen4 NVMe arrays, and automatic 3.2+ Tbps Game DDoS filtering.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('mc-plans-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Minecraft Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Instant Setup &lt; 15s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editions Supported Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { title: 'Paper & Purpur', sub: 'Optimized Vanilla TPS', icon: <Zap className="w-4 h-4 text-cyan-400" /> },
          { title: 'Forge & Fabric', sub: 'Heavy Modpack Support', icon: <Box className="w-4 h-4 text-purple-400" /> },
          { title: 'Bedrock / Geyser', sub: 'Crossplay Mobile & PC', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
          { title: 'Bungee & Velocity', sub: 'Multi-Server Proxy Hubs', icon: <Server className="w-4 h-4 text-blue-400" /> },
        ].map((ed, idx) => (
          <div key={idx} className="bg-[#11131e] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              {ed.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{ed.title}</p>
              <p className="text-[11px] text-slate-400">{ed.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plans Section */}
      <div id="mc-plans-table" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">
              Minecraft Hosting Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select a tier below. Every plan opens its own dedicated plan page with full specifications.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mcPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className={`bg-[#11131e] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-cyan-500/40 relative group ${
                  plan.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/10' : 'border-white/5'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-black" />
                    Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white font-display">{plan.name}</h3>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {plan.ram}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white font-display">
                        {formatPrice(price)}
                      </span>
                      <span className="text-xs text-slate-400">/ mo</span>
                    </div>
                  </div>

                  <div className="space-y-2 py-3.5 border-t border-b border-white/5 mb-5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Memory</span>
                      <span className="font-semibold text-white">{plan.ram} DDR4/DDR5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">vCPU</span>
                      <span className="font-semibold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NVMe Storage</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Player Slots</span>
                      <span className="font-semibold text-white">{plan.players || 'Unlimited'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Instant Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('services/minecraft', { planSlug: plan.slug || plan.id })}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    View Plan Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
