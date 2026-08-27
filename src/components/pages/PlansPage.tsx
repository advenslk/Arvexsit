import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
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
} from 'lucide-react';
import { HostingPlan } from '../../types';

export const PlansPage: React.FC = () => {
  const {
    games,
    plans,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
    currency,
  } = useApp();

  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');
  const [selectedTier, setSelectedTier] = useState<'All' | 'Starter' | 'Standard' | 'Premium'>('All');

  // Custom Slider Configurator
  const [customRam, setCustomRam] = useState<number>(8);
  const [customCpu, setCustomCpu] = useState<number>(4);
  const [customStorage, setCustomStorage] = useState<number>(80);
  const [includeDedicatedIp, setIncludeDedicatedIp] = useState<boolean>(true);
  const [includeBackups, setIncludeBackups] = useState<boolean>(true);

  const activeGame = (games || []).find((g) => g.id === selectedGameId) || games[0];

  const filteredPlans = (plans || []).filter((plan) => {
    const matchGame = plan.gameId === selectedGameId;
    const matchTier = selectedTier === 'All' || plan.tier === selectedTier;
    return matchGame && matchTier;
  });

  const getCalculatedPrice = (plan: HostingPlan) => {
    let base = plan.monthlyPrice;
    if (billingCycle === 'quarterly') {
      base = plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9;
    } else if (billingCycle === 'yearly') {
      base = plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8;
    }
    return base;
  };

  // Calculate Custom Configurator Price
  const customMonthlyPrice = Math.round((customRam * 1.5 + customCpu * 2.0 + customStorage * 0.08 + (includeDedicatedIp ? 2.5 : 0) + (includeBackups ? 1.5 : 0)) * 100) / 100;

  const handleCustomCheckout = () => {
    const customPlan: HostingPlan = {
      id: 'custom-' + Date.now(),
      slug: 'custom-build-' + Date.now(),
      serviceType: 'game-hosting',
      gameId: selectedGameId,
      name: `Custom ${activeGame?.name || 'Node'} Instance`,
      subtitle: `${activeGame?.name || 'High-Performance'} Server`,
      monthlyPrice: customMonthlyPrice,
      ram: `${customRam} GB DDR5 RAM`,
      cpu: `${customCpu} vCPU Ryzen 9 9950X`,
      storage: `${customStorage} GB PCIe 5.0 NVMe`,
      players: 'Custom Allocated',
      tier: 'Premium',
      popular: true,
      badge: 'Custom Build',
      features: [
        'Custom Ryzen 9 9950X CPU Cores',
        'PCIe 5.0 NVMe High-IOPS Container',
        includeDedicatedIp ? 'Dedicated IPv4 Included' : 'Shared Port Allocation',
        includeBackups ? 'Automated Hourly Cloud Backups' : 'Standard Backup Scheduler',
        'Corero 3.2Tbps DDoS Protection',
      ],
    };
    openCheckout(customPlan);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Frequency Game & Cloud Servers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Simple, Transparent Hosting Plans
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Zero hidden fees, instant 15-second deployment, and enterprise AMD Ryzen 9 9950X hardware with guaranteed low tick jitter.
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {(games || []).map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGameId(game.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedGameId === game.id
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-[#11131e] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-5 h-5 rounded-lg object-cover"
            />
            <span>{game.name}</span>
          </button>
        ))}
      </div>

      {/* Billing Cycle Switcher & Tier Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div className="flex items-center gap-1.5 bg-[#10121d] p-1.5 rounded-2xl border border-white/10">
          {(['monthly', 'quarterly', 'yearly'] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                billingCycle === cycle
                  ? 'bg-white text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{cycle}</span>
              {cycle === 'quarterly' && (
                <span className="ml-1.5 text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                  -10%
                </span>
              )}
              {cycle === 'yearly' && (
                <span className="ml-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter Tier:</span>
          {(['All', 'Starter', 'Standard', 'Premium'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTier === tier
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const calculatedMonthly = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#13192b] to-[#0c0e18] border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/15 -translate-y-2'
                    : 'bg-[#0f111c] border border-white/10 hover:border-white/25 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-[11px] font-black tracking-wider px-4 py-1 rounded-full uppercase shadow-lg">
                    {plan.badge || 'Most Popular'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-white font-display">
                      {plan.name}
                    </h3>
                    {plan.tier && (
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {plan.tier}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    {plan.subtitle || `${activeGame.name} Dedicated Instance`}
                  </p>

                  {/* Pricing Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-[#090b12] border border-white/5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-display">
                        {formatPrice(calculatedMonthly)}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                    {billingCycle !== 'monthly' && (
                      <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                        Billed {billingCycle}
                      </span>
                    )}
                  </div>

                  {/* Core Hardware Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{plan.ram}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{plan.storage}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{plan.players}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-8 text-xs text-slate-300">
                    {(plan.features || [
                      'Instant Automated Setup',
                      'Corero 3.2Tbps DDoS Protection',
                      '1-Click Modpack & Plugin Installer',
                      'Unmetered NVMe Gen5 Bandwidth',
                      'Automated Cloud Backups',
                    ]).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => openCheckout(plan)}
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                    plan.popular
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25'
                      : 'bg-white hover:bg-slate-100 text-black shadow-white/5'
                  }`}
                >
                  <span>Order Now & Configure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-12 bg-[#0f111c] rounded-3xl border border-white/10">
            <p className="text-sm text-slate-400 mb-4">No plans match the selected tier filter.</p>
            <button
              onClick={() => setSelectedTier('All')}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Interactive Custom Resource Slider Configurator */}
      <div className="bg-[#0f111c] border border-cyan-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Hardware Slider</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Build Your Custom Server Specs
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your exact RAM, CPU vCores, NVMe storage, and network addons.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Price</span>
            <div className="flex items-baseline">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-display">
                {formatPrice(customMonthlyPrice)}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
          {/* RAM Slider */}
          <div className="bg-[#141724] p-5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Memory (DDR5 ECC)</span>
              </span>
              <span className="text-sm font-black text-cyan-400 font-display font-mono">
                {customRam} GB
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              step="2"
              value={customRam}
              onChange={(e) => setCustomRam(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span>4 GB</span>
              <span>32 GB</span>
              <span>64 GB</span>
            </div>
          </div>

          {/* CPU Slider */}
          <div className="bg-[#141724] p-5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>vCPU (Ryzen 9 9950X)</span>
              </span>
              <span className="text-sm font-black text-blue-400 font-display font-mono">
                {customCpu} Cores
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="1"
              value={customCpu}
              onChange={(e) => setCustomCpu(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span>2 vCores</span>
              <span>8 vCores</span>
              <span>16 vCores</span>
            </div>
          </div>

          {/* NVMe Storage Slider */}
          <div className="bg-[#141724] p-5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>NVMe PCIe 5.0 Disk</span>
              </span>
              <span className="text-sm font-black text-emerald-400 font-display font-mono">
                {customStorage} GB
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="500"
              step="10"
              value={customStorage}
              onChange={(e) => setCustomStorage(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span>30 GB</span>
              <span>250 GB</span>
              <span>500 GB</span>
            </div>
          </div>
        </div>

        {/* Addon Checkboxes & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeDedicatedIp}
                onChange={(e) => setIncludeDedicatedIp(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span>Dedicated IPv4 Address (+{formatPrice(2.5)})</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeBackups}
                onChange={(e) => setIncludeBackups(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span>Automated Hourly Cloud Backups (+{formatPrice(1.5)})</span>
            </label>
          </div>

          <button
            onClick={handleCustomCheckout}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Deploy Custom Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
