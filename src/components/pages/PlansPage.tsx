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
  ChevronRight,
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
    navigateTo,
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
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Game &amp; Cloud Plans</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>High-Frequency Game &amp; Cloud Servers</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Simple, Transparent Hosting Plans
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Zero hidden fees, instant 15-second deployment, and enterprise AMD Ryzen 9 9950X hardware with guaranteed low tick jitter.
            </p>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 p-1.5 rounded-full border border-white/30 backdrop-blur-md shadow-md">
              {(['monthly', 'quarterly', 'yearly'] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`py-2 px-5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                    billingCycle === cycle
                      ? 'bg-white text-blue-700 shadow-md scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{cycle}</span>
                  {cycle === 'quarterly' && <span className="ml-1 text-[10px] text-cyan-200">(-10%)</span>}
                  {cycle === 'yearly' && <span className="ml-1 text-[10px] text-emerald-200">(-20%)</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Game Selector Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {(games || []).map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGameId(game.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                selectedGameId === game.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
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

        {/* Tier Filter Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Tier:</span>
            {(['All', 'Starter', 'Standard', 'Premium'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === tier
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredPlans.length}</span> plans for <span className="font-bold text-blue-600">{activeGame.name}</span>
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
                      ? 'bg-white border-2 border-blue-500 shadow-[0_20px_45px_-10px_rgba(37,99,235,0.18)] -translate-y-2'
                      : 'bg-white border border-slate-200/90 hover:border-blue-300 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black tracking-wider px-4 py-1 rounded-full uppercase shadow-md">
                      {plan.badge || 'Most Popular'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-slate-900 font-display">
                        {plan.name}
                      </h3>
                      {plan.tier && (
                        <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {plan.tier}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mb-6">
                      {plan.subtitle || `${activeGame.name} Dedicated Instance`}
                    </p>

                    {/* Pricing Box */}
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 font-display">
                          {formatPrice(calculatedMonthly)}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      {billingCycle !== 'monthly' && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                          Billed {billingCycle}
                        </span>
                      )}
                    </div>

                    {/* Core Hardware Badges */}
                    <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Server className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{plan.ram}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <HardDrive className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{plan.storage}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Users className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{plan.players}</span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                      {(plan.features || [
                        'Instant Automated Setup',
                        'Corero 3.2Tbps DDoS Protection',
                        '1-Click Modpack & Plugin Installer',
                        'Unmetered NVMe Gen5 Bandwidth',
                        'Automated Cloud Backups',
                      ]).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Trigger */}
                  <button
                    onClick={() => openCheckout(plan)}
                    className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                    }`}
                  >
                    <span>Order Now &amp; Configure</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-4">No plans match the selected tier filter.</p>
              <button
                onClick={() => setSelectedTier('All')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Interactive Custom Resource Slider Configurator */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.06)] mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Hardware Slider</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                Build Your Custom Server Specs
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your exact RAM, CPU vCores, NVMe storage, and network addons.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Price</span>
              <div className="flex items-baseline">
                <span className="text-3xl sm:text-4xl font-black text-blue-600 font-display">
                  {formatPrice(customMonthlyPrice)}
                </span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
            {/* RAM Slider */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Memory (DDR5 ECC)</span>
                </span>
                <span className="text-sm font-black text-blue-600 font-display font-mono">
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
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>4 GB</span>
                <span>32 GB</span>
                <span>64 GB</span>
              </div>
            </div>

            {/* CPU Slider */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>vCPU (Ryzen 9 9950X)</span>
                </span>
                <span className="text-sm font-black text-indigo-600 font-display font-mono">
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
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>2 vCores</span>
                <span>8 vCores</span>
                <span>16 vCores</span>
              </div>
            </div>

            {/* NVMe Storage Slider */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>NVMe PCIe 5.0 Disk</span>
                </span>
                <span className="text-sm font-black text-emerald-600 font-display font-mono">
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
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>30 GB</span>
                <span>250 GB</span>
                <span>500 GB</span>
              </div>
            </div>
          </div>

          {/* Addon Checkboxes & Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeDedicatedIp}
                  onChange={(e) => setIncludeDedicatedIp(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span>Dedicated IPv4 Address (+{formatPrice(2.5)})</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeBackups}
                  onChange={(e) => setIncludeBackups(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span>Automated Hourly Cloud Backups (+{formatPrice(1.5)})</span>
              </label>
            </div>

            <button
              onClick={handleCustomCheckout}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Deploy Custom Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
