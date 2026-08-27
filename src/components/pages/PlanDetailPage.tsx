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
  Radio,
  ExternalLink,
  ChevronRight,
  Flame,
  LifeBuoy,
  RefreshCw,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const PlanDetailPage: React.FC = () => {
  const {
    currentRoute,
    plans,
    games,
    generalServices,
    locations,
    billingCycle,
    setBillingCycle,
    formatPrice,
    openCheckout,
    currency,
    navigateTo,
  } = useApp();

  const planSlug = currentRoute.params.planSlug || currentRoute.params.id;
  const serviceType = currentRoute.params.serviceType || 'minecraft';

  // Match the plan from real database state
  const plan = plans.find(
    (p) => p.slug === planSlug || p.id === planSlug
  ) || plans[0];

  const matchedGame = games.find((g) => g.id === plan?.gameId || g.slug === plan?.gameId);
  const matchedService = generalServices.find(
    (s) => s.category?.toLowerCase() === plan?.serviceType?.toLowerCase() || s.slug === plan?.serviceType
  );

  // Configuration Addons
  const [selectedLocation, setSelectedLocation] = useState<string>(
    locations[0]?.id || 'loc-sg'
  );
  const [includeDedicatedIp, setIncludeDedicatedIp] = useState<boolean>(false);
  const [includeDailyBackups, setIncludeDailyBackups] = useState<boolean>(true);
  const [includePrioritySupport, setIncludePrioritySupport] = useState<boolean>(false);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(billingCycle);

  if (!plan) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Server className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-white font-display mb-3">Plan Not Found</h1>
        <p className="text-slate-400 text-sm mb-8">
          The requested hosting plan is not available or has been updated in the catalog.
        </p>
        <button
          onClick={() => navigateTo('plans')}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all"
        >
          View All Active Plans
        </button>
      </div>
    );
  }

  // Price Calculation with Billing Cycle & Addons
  const getCycleMultiplier = (cycle: BillingCycle) => {
    if (cycle === 'quarterly') return 3 * 0.9;
    if (cycle === 'yearly') return 12 * 0.8;
    return 1;
  };

  const basePricePerMonth = () => {
    if (selectedCycle === 'quarterly') return plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9;
    if (selectedCycle === 'yearly') return plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8;
    return plan.monthlyPrice;
  };

  const addonsTotalMonthly =
    (includeDedicatedIp ? 2.5 : 0) +
    (includeDailyBackups ? 1.5 : 0) +
    (includePrioritySupport ? 4.0 : 0);

  const finalMonthlyPrice = basePricePerMonth() + addonsTotalMonthly;
  const totalBilledAmount = finalMonthlyPrice * (selectedCycle === 'quarterly' ? 3 : selectedCycle === 'yearly' ? 12 : 1);

  const handleOrder = () => {
    openCheckout(plan);
  };

  const faqs = [
    {
      q: `How fast is my ${plan.name} server deployed?`,
      a: 'Deployment is 100% automated. Your node is provisioned, containerized, and assigned dedicated ports in under 15 seconds after payment confirmation.',
    },
    {
      q: 'Can I upgrade or downgrade my RAM and CPU later?',
      a: 'Yes, seamless one-click scaling is supported in your Customer Dashboard without any data loss or IP changes.',
    },
    {
      q: 'What DDoS protection is included with this plan?',
      a: 'All plans include permanent Always-On ArveX Shield protection with 3.2+ Tbps multi-layer filtering against Layer 3/4 and Layer 7 game attacks.',
    },
    {
      q: 'Do I get full root / SFTP access to my server files?',
      a: 'Yes. You receive uninhibited SFTP access, web file manager, full database management, and custom startup flags control.',
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button
          onClick={() => {
            if (plan.serviceType === 'minecraft') navigateTo('services/minecraft');
            else if (plan.gameId) navigateTo('services/game-hosting', { gameSlug: plan.gameId });
            else navigateTo(`services/${plan.serviceType || 'vps'}`);
          }}
          className="hover:text-white transition-colors capitalize"
        >
          {matchedGame?.name || matchedService?.title || plan.serviceType || 'Hosting'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">{plan.name}</span>
      </nav>

      {/* Hero / Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {plan.tier || 'Enterprise'} Instance
            </span>
            {plan.popular && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Most Popular Choice
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Instant Deployment Ready
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
            {plan.name}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
            {plan.description ||
              `High-frequency cloud node engineered with ${plan.ram} dedicated memory, ${plan.cpu} compute power, and unmetered NVMe storage for enterprise gaming and production services.`}
          </p>

          {/* Quick Hardware Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <div className="bg-[#11131e] border border-white/5 p-3.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Memory</span>
              </div>
              <p className="text-lg font-bold text-white font-display">{plan.ram}</p>
              <p className="text-[10px] text-slate-500">DDR4/DDR5 ECC</p>
            </div>
            <div className="bg-[#11131e] border border-white/5 p-3.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>vCPU Cores</span>
              </div>
              <p className="text-lg font-bold text-white font-display">{plan.cpu}</p>
              <p className="text-[10px] text-slate-500">@ 4.5GHz+ Boost</p>
            </div>
            <div className="bg-[#11131e] border border-white/5 p-3.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Storage</span>
              </div>
              <p className="text-lg font-bold text-white font-display">{plan.storage}</p>
              <p className="text-[10px] text-slate-500">PCIe 4.0 NVMe</p>
            </div>
            <div className="bg-[#11131e] border border-white/5 p-3.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Protection</span>
              </div>
              <p className="text-lg font-bold text-white font-display">3.2+ Tbps</p>
              <p className="text-[10px] text-slate-500">ArveX Shield</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-b from-[#161926] to-[#0f111a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Configuration Price
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                In Stock ({plan.availability || 'Available'})
              </span>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#090a0f] p-1 rounded-xl border border-white/5 mb-6">
              {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedCycle === cycle
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cycle === 'monthly' ? '1 Mo' : cycle === 'quarterly' ? '3 Mo (-10%)' : '12 Mo (-20%)'}
                </button>
              ))}
            </div>

            {/* Price Output */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight">
                  {formatPrice(finalMonthlyPrice)}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>
              {selectedCycle !== 'monthly' && (
                <p className="text-xs text-slate-400 mt-1">
                  Billed {selectedCycle}: {formatPrice(totalBilledAmount)} (renews automatically)
                </p>
              )}
            </div>

            {/* CTA Order Button */}
            <button
              onClick={handleOrder}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group mb-4 cursor-pointer"
            >
              <span>Deploy {plan.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="space-y-2 text-xs text-slate-400 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant automated provisioning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>7-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-currency support (LKR, USD, EUR)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Addon Configuration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-7 bg-[#11131e] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white font-display mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Select Deployment Location
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Choose the lowest latency data center nearest to your target player base or audience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                      : 'bg-[#161926] border-white/5 text-slate-300 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{loc.flag}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{loc.city}, {loc.country}</p>
                      <p className="text-[10px] text-slate-400">{loc.dcName || 'Tier-3 Datacenter'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-cyan-300">
                    {loc.latency}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#11131e] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white font-display mb-2 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Configurable Addons
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enhance your deployment with optional dedicated network and backup extensions.
          </p>

          <div className="space-y-3">
            <label
              onClick={() => setIncludeDedicatedIp(!includeDedicatedIp)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                includeDedicatedIp ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-[#161926] border-white/5'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-white">Dedicated IPv4 Address</p>
                <p className="text-[11px] text-slate-400">Default port 25565 without port forward</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-cyan-300">+$2.50/mo</span>
              </div>
            </label>

            <label
              onClick={() => setIncludeDailyBackups(!includeDailyBackups)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                includeDailyBackups ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-[#161926] border-white/5'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-white">Automated Daily Offsite Backups</p>
                <p className="text-[11px] text-slate-400">7-day rolling snapshots in isolated cold storage</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-cyan-300">+$1.50/mo</span>
              </div>
            </label>

            <label
              onClick={() => setIncludePrioritySupport(!includePrioritySupport)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                includePrioritySupport ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-[#161926] border-white/5'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-white">Priority 15-Minute SLA Support</p>
                <p className="text-[11px] text-slate-400">Senior systems engineer queue routing</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-cyan-300">+$4.00/mo</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Included Plan Features & Architecture */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Everything Included with {plan.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(plan.features || [
            'Instant Pterodactyl v2 Control Panel',
            'Pure PCIe 4.0 NVMe SSD Storage Array',
            'Always-On 3.2+ Tbps DDoS Mitigation',
            'Full SFTP & Web File Management',
            'Automated Scheduled Restarts & Backups',
            '1-Click Modpack & Plugin Installers',
            'Unlimited MySQL Databases Included',
            'Dedicated Custom Subdomain (e.g. play.arvex.host)',
            '24/7/365 Technical Support by Gaming Engineers',
          ]).map((feat, idx) => (
            <div key={idx} className="bg-[#11131e] border border-white/5 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-slate-300 leading-relaxed">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#11131e] border border-white/5 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                {f.q}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-[#11131e] via-[#1a1f33] to-[#11131e] border border-cyan-500/20 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display mb-2">
            Ready to deploy {plan.name}?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Join thousands of active servers hosted on ArveX infrastructure. Instant activation with no setup fees.
          </p>
        </div>
        <button
          onClick={handleOrder}
          className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
        >
          Configure & Order Now
        </button>
      </div>
    </div>
  );
};
