import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  Gamepad2,
  Cpu,
  Globe,
  Bot,
  HardDrive,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  ChevronRight,
  Flame,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const PricingPage: React.FC = () => {
  const {
    plans,
    games,
    tlds,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
    currency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'all' | 'minecraft' | 'game-hosting' | 'vps' | 'vds' | 'web-hosting' | 'bot-hosting' | 'domains'
  >('all');

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(billingCycle);

  const categories = [
    { id: 'all', label: 'All Plans', icon: <Server className="w-4 h-4" /> },
    { id: 'minecraft', label: 'Minecraft', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
    { id: 'game-hosting', label: 'Game Hosting', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> },
    { id: 'vps', label: 'Cloud VPS', icon: <Cpu className="w-4 h-4 text-blue-500" /> },
    { id: 'vds', label: 'Virtual Dedicated (VDS)', icon: <Server className="w-4 h-4 text-indigo-500" /> },
    { id: 'web-hosting', label: 'Web Hosting', icon: <Globe className="w-4 h-4 text-amber-500" /> },
    { id: 'bot-hosting', label: 'Bot Hosting', icon: <Bot className="w-4 h-4 text-cyan-500" /> },
    { id: 'domains', label: 'Domains', icon: <Globe className="w-4 h-4 text-blue-600" /> },
  ];

  const filteredPlans = (plans || []).filter((plan) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'minecraft') return plan.serviceType === 'minecraft' || plan.gameId === 'minecraft';
    if (activeTab === 'game-hosting') return plan.gameId && plan.gameId !== 'minecraft';
    if (activeTab === 'vps') return plan.serviceType === 'vps' || plan.id.includes('vps');
    if (activeTab === 'vds') return plan.serviceType === 'vds' || plan.id.includes('vds');
    if (activeTab === 'web-hosting') return plan.serviceType === 'web-hosting' || plan.id.includes('web');
    if (activeTab === 'bot-hosting') return plan.serviceType === 'bot-hosting' || plan.id.includes('bot');
    return true;
  });

  const getCalculatedPrice = (plan: HostingPlan) => {
    if (selectedCycle === 'quarterly') {
      return plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9;
    }
    if (selectedCycle === 'yearly') {
      return plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8;
    }
    return plan.monthlyPrice;
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
            <span className="text-white font-bold">Pricing Directory</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Transparent Flat-Rate Cloud Pricing</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Hosting Plans &amp; Pricing
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              High-performance infrastructure tailored for game developers, community servers, and enterprise cloud operations with zero hidden fees.
            </p>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 p-1.5 rounded-full border border-white/30 backdrop-blur-md shadow-md">
              {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`py-2 px-5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedCycle === cycle
                      ? 'bg-white text-blue-700 shadow-md scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Plans Grid or Domains View */}
        {activeTab === 'domains' ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Domain Extensions &amp; Registration Pricing</h2>
              <p className="text-xs text-slate-500 mt-1">Instant DNS propagation with automated DNSSEC protection and free WHOIS privacy.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Extension</th>
                    <th className="py-3.5 px-4">Registration</th>
                    <th className="py-3.5 px-4">Renewal</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tlds.map((tld) => (
                    <tr key={tld.id} className="hover:bg-blue-50/40 transition">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 text-sm">{tld.extension}</td>
                      <td className="py-4 px-4 text-blue-600 font-bold text-sm">{formatPrice(tld.registerPrice)} / yr</td>
                      <td className="py-4 px-4 text-slate-500">{formatPrice(tld.renewPrice)} / yr</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => navigateTo('domains')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                        >
                          Register
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const calcPrice = getCalculatedPrice(plan);
              const isPopular = plan.isPopular || plan.isFeatured;
              return (
                <div
                  key={plan.id}
                  className={`bg-white border rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all card-interactive-3d flex flex-col justify-between relative ${
                    isPopular ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10' : 'border-slate-200/80 hover:border-blue-400'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-300" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 font-display">{plan.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{plan.subtitle || 'High-performance instance'}</p>
                      </div>
                    </div>

                    {/* Price display */}
                    <div className="my-6 pb-6 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
                          {formatPrice(calcPrice)}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">/mo</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Billed {selectedCycle}</p>
                    </div>

                    {/* Hardware specs row */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">RAM</p>
                        <p className="text-xs font-black text-slate-800 font-mono mt-0.5">{plan.ram}</p>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">CPU</p>
                        <p className="text-xs font-black text-slate-800 font-mono mt-0.5">{plan.cpu}</p>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Disk</p>
                        <p className="text-xs font-black text-slate-800 font-mono mt-0.5">{plan.storage}</p>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                      {(plan.features || []).slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Deploy Server Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateTo('dynamic-plan', { planSlug: plan.slug || plan.id })}
                      className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition cursor-pointer"
                    >
                      View Full Specifications
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
