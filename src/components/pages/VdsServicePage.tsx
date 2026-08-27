import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Server,
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
  Activity,
  Award,
  Lock,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const VdsServicePage: React.FC = () => {
  const {
    plans,
    billingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
  } = useApp();

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);

  const vdsPlans = plans.filter(
    (p) => p.serviceType === 'vds' || p.id.includes('vds') || p.tier === 'Premium'
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
        <span className="text-cyan-400 font-semibold">Virtual Dedicated Servers (VDS)</span>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-[#0c0e17] via-[#161227] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Cpu className="w-4 h-4" />
            <span>100% Dedicated CPU Cores &amp; Bare-Metal Slice Isolation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Virtual Dedicated <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Servers (VDS)
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Get the dedicated performance of bare metal with the flexibility of cloud virtualization. Guaranteed 100% CPU thread pin, dedicated RAM allocation, and isolated NVMe disks with zero noisy neighbors.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('vds-plans-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore VDS Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Zero Overprovisioning Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* VDS Plans Grid */}
      <div id="vds-plans-table" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">
              Virtual Dedicated Server Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each VDS includes pinned Ryzen 9 / EPYC cores and dedicated RAID-10 NVMe storage.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#11131e] p-1 rounded-xl border border-white/5 shrink-0">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeCycle === cycle
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vdsPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className="bg-[#11131e] border border-white/5 hover:border-purple-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white font-display">{plan.name}</h3>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
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
                      <span className="text-slate-400">Dedicated Cores</span>
                      <span className="font-semibold text-white">{plan.cpu} Pinned</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dedicated Memory</span>
                      <span className="font-semibold text-white">{plan.ram} ECC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Isolated NVMe</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Uplink</span>
                      <span className="font-semibold text-white">10 Gbps Unmetered</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Deploy VDS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('services/vds', { planSlug: plan.slug || plan.id })}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Dedicated Plan Specs
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
