import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Server,
  Cpu,
  Globe,
  Bot,
  HardDrive,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Headphones,
  Sliders,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, formatPrice, openCheckout, plans, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Gaming', 'Cloud Compute', 'Dedicated', 'Web Solutions', 'Development', 'Storage'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-cyan-400" />;
      case 'Server':
        return <Server className="w-6 h-6 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-amber-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-purple-400" />;
      case 'HardDrive':
        return <HardDrive className="w-6 h-6 text-rose-400" />;
      default:
        return <Zap className="w-6 h-6 text-cyan-400" />;
    }
  };

  const filteredServices = (services || []).filter((srv) => {
    const matchCat = selectedCategory === 'All' || srv.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && srv.active;
  });

  const handleConfigure = (service: any) => {
    if (service.id === 'srv-game') {
      navigateTo('plans');
    } else {
      const matchedPlan = plans.find((p) => p.gameId === 'vps' || p.id.includes('vps')) || plans[0];
      if (matchedPlan) openCheckout(matchedPlan);
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Full SaaS Infrastructure Catalog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Next-Gen Hosting Services
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore our complete portfolio of high-frequency game instances, dedicated bare-metal clusters, KVM cloud VPS, and ultra-reliable web storage.
        </p>
      </div>

      {/* SLA Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Instant Provisioning', val: '< 15 Seconds', icon: <Zap className="w-4 h-4 text-cyan-400" /> },
          { label: 'Network Uptime SLA', val: '99.99%', icon: <Clock className="w-4 h-4 text-emerald-400" /> },
          { label: 'DDoS Scrubbing Capacity', val: '3.2+ Tbps', icon: <ShieldCheck className="w-4 h-4 text-blue-400" /> },
          { label: 'Live Expert Support', val: '24/7/365', icon: <Headphones className="w-4 h-4 text-amber-400" /> },
        ].map((metric, i) => (
          <div key={i} className="bg-[#11131e] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              {metric.icon}
            </div>
            <div>
              <p className="text-[11px] text-slate-400">{metric.label}</p>
              <p className="text-sm font-bold text-white font-display">{metric.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-[#121422] text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search all services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121422] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group relative rounded-3xl bg-[#0f111c] border border-white/10 hover:border-cyan-500/40 p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 overflow-hidden"
          >
            {srv.image && (
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#161a29] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(srv.icon)}
                </div>
                {srv.badge && (
                  <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {srv.badge}
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {srv.category || 'Infrastructure'}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {srv.title}
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {srv.description}
              </p>

              {/* Features List */}
              <div className="space-y-2.5 mb-8 text-xs text-slate-300">
                {(srv.features || []).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Price & Button */}
            <div className="pt-5 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Starting from</span>
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-white font-display">
                    {formatPrice(srv.startingPrice || 9.99)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/month</span>
                </div>
              </div>

              <button
                onClick={() => handleConfigure(srv)}
                className="bg-white hover:bg-slate-100 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 active:scale-95 shadow-md"
              >
                <span>Deploy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Custom Solutions Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#121626] to-[#0c0e18] border border-cyan-500/20 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            Custom Enterprise Infrastructure
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight mb-3">
            Need a custom BGP Anycast network or Multi-TB Dedicated cluster?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We engineer bespoke hardware setups, multi-gigabit uplinks, and dedicated Layer 7 mitigation rules for massive esports tournaments and game studios.
          </p>
        </div>

        <button
          onClick={() => navigateTo('tickets')}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 shrink-0 flex items-center gap-2 active:scale-95"
        >
          <Headphones className="w-4 h-4" />
          <span>Contact Enterprise Architects</span>
        </button>
      </div>
    </div>
  );
};
