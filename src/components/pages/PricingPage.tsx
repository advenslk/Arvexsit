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
    { id: 'minecraft', label: 'Minecraft', icon: <Zap className="w-4 h-4 text-cyan-400" /> },
    { id: 'game-hosting', label: 'Game Hosting', icon: <Gamepad2 className="w-4 h-4 text-purple-400" /> },
    { id: 'vps', label: 'Cloud VPS', icon: <Cpu className="w-4 h-4 text-blue-400" /> },
    { id: 'vds', label: 'Virtual Dedicated (VDS)', icon: <Server className="w-4 h-4 text-pink-400" /> },
    { id: 'web-hosting', label: 'Web Hosting', icon: <Globe className="w-4 h-4 text-amber-400" /> },
    { id: 'bot-hosting', label: 'Bot Hosting', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
    { id: 'domains', label: 'Domains', icon: <Globe className="w-4 h-4 text-indigo-400" /> },
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
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Pricing Directory</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Enterprise Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Hosting Plans &amp; Pricing
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          High-performance infrastructure tailored for game developers, community servers, and enterprise cloud operations. Every plan has a dedicated configuration page.
        </p>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1.5 bg-[#11131e] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setSelectedCycle(cycle)}
              className={`py-2 px-4 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedCycle === cycle
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeTab === cat.id
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-md'
                : 'bg-[#11131e] border-white/5 text-slate-400 hover:text-white hover:border-white/15'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Plans Grid or Domains Table */}
      {activeTab === 'domains' ? (
        <div className="bg-[#11131e] border border-white/5 rounded-2xl overflow-hidden p-6">
          <h2 className="text-lg font-bold text-white mb-4">Domain Name Pricing Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161926] text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Extension</th>
                  <th className="py-3 px-4">Registration</th>
                  <th className="py-3 px-4">Renewal</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {tlds.map((tld) => (
                  <tr key={tld.id}>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{tld.extension}</td>
                    <td className="py-3.5 px-4 text-cyan-400 font-semibold">{formatPrice(tld.registerPrice)} / yr</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatPrice(tld.renewPrice)} / yr</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => navigateTo('domains')}
                        className="px-3 py-1 rounded bg-cyan-500 text-black font-bold text-[11px]"
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
      ) : filteredPlans.length === 0 ? (
        <div className="bg-[#11131e] border border-white/5 rounded-2xl p-12 text-center text-slate-400">
          <Server className="w-12 h-12 mx-auto mb-3 text-slate-500" />
          <p className="text-base font-bold text-white mb-1">No plans available in this category yet</p>
          <p className="text-xs">Plans can be added in real-time from the admin management suite.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className={`bg-[#11131e] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-cyan-500/40 relative group ${
                  plan.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/5' : 'border-white/5'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-black" />
                    Popular
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
                    <p className="text-[11px] text-slate-500">{plan.subtitle || 'High-Frequency Cloud Instance'}</p>
                  </div>

                  <div className="space-y-2 py-3.5 border-t border-b border-white/5 mb-5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Memory</span>
                      <span className="font-semibold text-white">{plan.ram}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">vCPU</span>
                      <span className="font-semibold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Storage</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">DDoS Scrubbing</span>
                      <span className="font-semibold text-white">3.2 Tbps</span>
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
                    onClick={() => {
                      if (plan.serviceType === 'minecraft') navigateTo('services/minecraft', { planSlug: plan.slug || plan.id });
                      else if (plan.gameId) navigateTo('services/game-hosting', { gameSlug: plan.gameId });
                      else navigateTo(`services/${plan.serviceType || 'vps'}`, { planSlug: plan.slug || plan.id });
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    View Plan Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
