import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Zap,
  Server,
  Users,
  ChevronRight,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  const stats = [
    { label: 'Active Game Servers Hosted', value: '18,500+' },
    { label: 'Global Network Capacity', value: '3.2 Tbps' },
    { label: 'Average Support Response', value: '< 12 Mins' },
    { label: 'Monthly Uptime SLA', value: '99.99%' },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">About ArveX Cloud Infrastructure</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0c0e17] via-[#10172e] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-4 h-4" />
            <span>Built by Gamers &amp; Cloud Engineers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Empowering the Next Generation of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Online Communities
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            ArveX Hosting was founded with a singular mission: to eliminate lag, noisy-neighbor slowdowns, and overpriced hosting. Today, we power thousands of Minecraft networks, multiplayer studios, Discord bots, and production web apps worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigateTo('pricing')}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Infrastructure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
            >
              Contact Leadership
            </button>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {stats.map((st, i) => (
          <div key={i} className="bg-[#11131e] border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-3xl sm:text-4xl font-black text-cyan-400 font-display mb-1">{st.value}</p>
            <p className="text-xs text-slate-400">{st.label}</p>
          </div>
        ))}
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Uncompromising Performance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We exclusively run AMD Ryzen 9 7950X3D and EPYC Milan processors paired with enterprise PCIe Gen4 NVMe arrays for instantaneous chunk loading and rock-solid 20 TPS.
          </p>
        </div>

        <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">3.2 Tbps DDoS Scrubbing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Custom BGP scrubbing profiles filter volumetric attacks, Layer 7 HTTP floods, and game protocol exploits in under 1 second without dropping genuine player packets.
          </p>
        </div>

        <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Real Human Engineering Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No scripted bots or delayed queues. Our technical support staff consists of seasoned server administrators and Linux systems engineers available 24/7/365.
          </p>
        </div>
      </div>
    </div>
  );
};
