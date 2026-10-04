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
  ChevronRight,
  Search,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, formatPrice, openCheckout, plans, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Gaming', 'Cloud Compute', 'Dedicated', 'Web Solutions', 'Development', 'Storage'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-purple-600" />;
      case 'Server':
        return <Server className="w-6 h-6 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-600" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-amber-600" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-cyan-600" />;
      case 'HardDrive':
        return <HardDrive className="w-6 h-6 text-rose-600" />;
      default:
        return <Zap className="w-6 h-6 text-blue-600" />;
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
            <span className="text-white font-bold">Services Catalog</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Full Cloud Infrastructure Catalog</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Next-Gen Hosting Services
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Explore our complete portfolio of high-frequency game instances, dedicated bare-metal clusters, KVM cloud VPS, and ultra-reliable web storage.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SLA Metrics Bar in White 3D Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-20 relative z-20">
          {[
            { label: 'Instant Provisioning', val: '< 15 Seconds', icon: <Zap className="w-5 h-5 text-blue-600" /> },
            { label: 'Network Uptime SLA', val: '99.99%', icon: <Clock className="w-5 h-5 text-emerald-600" /> },
            { label: 'DDoS Scrubbing Capacity', val: '3.2+ Tbps', icon: <ShieldCheck className="w-5 h-5 text-indigo-600" /> },
            { label: 'Live Expert Support', val: '24/7/365', icon: <Headphones className="w-5 h-5 text-amber-600" /> },
          ].map((metric, i) => (
            <div key={i} className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] flex items-center gap-3 card-interactive-3d">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {metric.icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">{metric.label}</p>
                <p className="text-base font-extrabold text-slate-900 font-display">{metric.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 p-3 sm:p-4 rounded-3xl shadow-sm">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all services..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all card-interactive-3d flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getIcon(service.icon)}
                  </div>
                  {service.badge && (
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 font-display mb-2">{service.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{service.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  {(service.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 font-display">
                      {formatPrice(service.startingPrice || 4.99)}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">/mo</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConfigure(service)}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
