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
  Cpu,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  const stats = [
    { label: 'Active Game Servers Hosted', value: '18,500+' },
    { label: 'Global Network Capacity', value: '3.2 Tbps' },
    { label: 'Average Support Response', value: '< 12 Mins' },
    { label: 'Monthly Uptime SLA', value: '99.99%' },
  ];

  const values = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: 'Zero Latency Commitment',
      description: 'We invest exclusively in flagship AMD Ryzen 9 9950X processors and PCIe Gen5 NVMe storage arrays across Tier-4 datacenter locations.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Always-On DDoS Mitigation',
      description: 'Layer 3/4/7 automated scrubbing filters malicious attack traffic before it ever touches your server instance or impacts your community.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      title: 'Human-First Support 24/7',
      description: 'No automated bots or unhelpful copy-pasted responses. Our specialized server engineers assist you in under 12 minutes on live chat and tickets.',
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-600" />,
      title: 'Transparent Cloud Billing',
      description: 'No hidden setup fees, predatory renewal price hikes, or bandwidth overages. Predictable flat-rate pricing with instant automated invoicing.',
    },
  ];

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
            <span className="text-white font-bold">About HelzerX Cloud</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Built by Gamers &amp; Infrastructure Engineers</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Empowering the Next Generation of Online Communities
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              HelzerX Cloud was founded with a singular mission: to eliminate lag, noisy-neighbor slowdowns, and overpriced hosting. Today, we power thousands of Minecraft networks, multiplayer studios, Discord bots, and production web apps worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Main Body Content on Light Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Key Stats Bar in 3D Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 -mt-20 relative z-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] text-center card-interactive-3d">
              <p className="text-2xl sm:text-4xl font-black text-slate-900 font-display tracking-tight text-blue-600 mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Our Origins</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-4">
              Frustrated by low-tick servers, we built the hosting platform we always wanted.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              In 2021, our founders were running competitive Minecraft tournaments and enterprise Discord bots. Repeatedly, budget server hosts overbooked CPUs, throttled disk I/O, and hid behind automated ticket queues when game servers crashed.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              We took a radically different path: dedicated bare-metal nodes, single-tenant core allocations, and custom Pterodactyl orchestration that provisions game servers in under 15 seconds.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('hardware')}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>View Hardware Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-300" />
              <span>The HelzerX Quality Standard</span>
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <span><strong>No CPU Overcommit:</strong> Guaranteed physical clock cycles on genuine AMD Ryzen 9 9950X hardware.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <span><strong>Corero &amp; Path.net Anti-DDoS:</strong> Automatic mitigation that keeps your game online during multi-gigabit attacks.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <span><strong>One-Click Backups:</strong> Automated daily snapshot backups saved across redundant offsite storage locations.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <span><strong>Full Root &amp; SFTP Access:</strong> Absolute control over server configurations, custom JARs, plugins, and startup flags.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Our Principles</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Built on Uncompromising Reliability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all card-interactive-3d">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Network Callout */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Global Datacenter Presence</span>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display mb-2">
              Low-latency routing across North America, Europe, Asia &amp; Oceania
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Strategically placed POPs with premium Tier-1 transit providers (Lumen, Telia, NTT) ensure ultra-crisp tickrates for your players anywhere on Earth.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('locations')}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Test Looking Glass
            </button>
            <button
              onClick={() => navigateTo('pricing')}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
