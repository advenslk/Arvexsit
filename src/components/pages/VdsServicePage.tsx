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
            <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Virtual Dedicated Servers (VDS)</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>100% Dedicated CPU Cores &amp; Bare-Metal Slice Isolation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-4">
              Virtual Dedicated <br />
              <span className="text-cyan-200">
                Servers (VDS)
              </span>
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
              Get the dedicated performance of bare metal with the flexibility of cloud virtualization. Guaranteed 100% CPU thread pin, dedicated RAM allocation, and isolated NVMe disks with zero noisy neighbors.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('vds-plans-table');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Explore VDS Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs text-white bg-white/15 border border-white/25 px-4 py-3.5 rounded-2xl backdrop-blur-md">
                <Lock className="w-4 h-4 text-cyan-300" />
                <span>Zero Overprovisioning Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VDS Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div id="vds-plans-table">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 font-display mb-1">
                Virtual Dedicated Server Plans
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Each VDS includes pinned Ryzen 9 / EPYC cores and dedicated RAID-10 NVMe storage.
              </p>
            </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vdsPlans.map((plan) => {
              const price = getCalculatedPrice(plan);
              return (
                <div
                  key={plan.id}
                  className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 flex flex-col justify-between transition-all group shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-black text-slate-900 font-display">{plan.name}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {plan.ram}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-slate-500">/ mo</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-3.5 border-t border-b border-slate-100 mb-5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Dedicated Cores</span>
                        <span className="font-semibold text-slate-900">{plan.cpu} Pinned</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Dedicated Memory</span>
                        <span className="font-semibold text-slate-900">{plan.ram} ECC</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Isolated NVMe</span>
                        <span className="font-semibold text-slate-900">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Uplink</span>
                        <span className="font-semibold text-slate-900">10 Gbps Unmetered</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Deploy VDS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo('services/vds', { planSlug: plan.slug || plan.id })}
                      className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
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
    </div>
  );
};
