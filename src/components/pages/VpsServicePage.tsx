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
  Clock,
  Globe,
  ChevronRight,
  Terminal,
  Activity,
  Award,
  Key,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const VpsServicePage: React.FC = () => {
  const {
    plans,
    billingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
    locations,
  } = useApp();

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);
  const [selectedOs, setSelectedOs] = useState<string>('Ubuntu 24.04 LTS');

  const vpsPlans = plans.filter(
    (p) => p.serviceType === 'vps' || p.id.includes('vps')
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

  const osOptions = [
    { name: 'Ubuntu 24.04 LTS', category: 'Linux' },
    { name: 'Debian 12 Bookworm', category: 'Linux' },
    { name: 'AlmaLinux 9', category: 'Enterprise' },
    { name: 'Rocky Linux 9', category: 'Enterprise' },
    { name: 'Windows Server 2022', category: 'Windows' },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Cloud VPS Hosting</span>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c0e17] via-[#131627] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Server className="w-4 h-4" />
            <span>KVM Virtualization &amp; Pure NVMe Gen4 Storage</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            High-Performance <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Cloud VPS Hosting
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Scalable, root-access KVM virtual servers engineered on AMD EPYC / Ryzen 9 hardware with unmetered 10Gbps uplink, automated OS installations, and enterprise BGP DDoS mitigation.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('vps-plans-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>View VPS Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Full Root &amp; VNC Console</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div id="vps-plans-table" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">
              Cloud VPS Pricing &amp; Specifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every VPS plan opens its own dedicated specification page. Scale resources anytime from the dashboard.
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
          {vpsPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className={`bg-[#11131e] border rounded-2xl p-6 flex flex-col justify-between transition-all hover:border-cyan-500/40 relative group ${
                  plan.popular ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/10' : 'border-white/5'
                }`}
              >
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
                      <span className="text-slate-400">vCPU Cores</span>
                      <span className="font-semibold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">RAM</span>
                      <span className="font-semibold text-white">{plan.ram} ECC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NVMe SSD</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Bandwidth</span>
                      <span className="font-semibold text-white">Unmetered 10Gbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dedicated IPv4</span>
                      <span className="font-semibold text-white">1 IPv4 + /64 IPv6</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Deploy VPS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('services/vps', { planSlug: plan.slug || plan.id })}
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

      {/* Operating Systems Support */}
      <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8 mb-16">
        <h3 className="text-xl font-bold text-white font-display mb-2">
          Supported Operating Systems &amp; 1-Click Images
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Deploy any Linux distribution or Windows Server in seconds. Custom ISO mounting is also supported via your client area.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {osOptions.map((os, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#161926] border border-white/5 text-center">
              <p className="text-xs font-bold text-white mb-0.5">{os.name}</p>
              <span className="text-[10px] text-cyan-400 uppercase font-semibold">{os.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
