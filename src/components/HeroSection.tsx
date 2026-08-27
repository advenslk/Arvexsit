import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Gamepad2,
  Server,
  Bot,
  Globe,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo, plans, openCheckout, siteSettings } = useApp();

  const handleGetStarted = () => {
    navigateTo('services-minecraft');
  };

  const handleTestConnection = () => {
    navigateTo('locations');
  };

  const badgeText = siteSettings?.heroBadgeText || '#1 GAME SERVER HOSTING IN SRI LANKA 🇱🇰';
  const title1 = siteSettings?.heroTitleLine1 || 'MINECRAFT SERVER';
  const title2 = siteSettings?.heroTitleLine2 || 'HOSTING';
  const subtitle = siteSettings?.heroSubtitle || 'High-performance game hosting built for players who demand speed, stability, and total control with ultra-low latency Colombo and Singapore routes.';
  const ctaText = siteSettings?.heroCtaText || 'Get Started';
  const secondaryCtaText = siteSettings?.heroSecondaryCtaText || 'Test our connection';

  return (
    <section className="relative pt-8 pb-16 overflow-hidden bg-radial-gradient">
      {/* Background ambient radial glow matching Screenshot 5 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Top Sri Lanka Badge matching Screenshot 5 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider mb-6 shadow-xl shadow-purple-950/40 animate-pulse-subtle">
          <span>👑</span>
          <span>{badgeText}</span>
        </div>

        {/* Main Hero Headline matching Screenshot 5 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase font-display leading-[1.05] mb-6 max-w-4xl">
          {title1} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-300">
            {title2}
          </span>
        </h1>

        {/* Feature Checkpoints matching Screenshot 5 */}
        <div className="flex flex-col items-center sm:items-start max-w-md mx-auto space-y-2 mb-8 text-left">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Instant servers for your favourite games</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>24/7/365 customer support in Sinhala &amp; English</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Low Latency Singapore &amp; Colombo Locations</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Advanced Game DDOS Protection (3.2+ Tbps)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Powered by <strong className="text-purple-300">⚡ latest Ryzen hardware</strong>
            </span>
          </div>
        </div>

        {/* CTA Buttons matching Screenshot 5 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={handleGetStarted}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleTestConnection}
            className="px-6 py-3.5 rounded-2xl bg-[#131524] hover:bg-[#1b1f35] text-slate-300 hover:text-white border border-white/10 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{secondaryCtaText}</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>

        {/* 4 Quick Category Cards matching Screenshot 5 */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {/* Card 1: Game Servers */}
          <div
            onClick={() => navigateTo('services-minecraft')}
            className="bg-[#111320] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-display">
              GAME SERVERS
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Minecraft, Rust, Ark</p>
          </div>

          {/* Card 2: Discord Bots */}
          <div
            onClick={() => navigateTo('services-bot-hosting')}
            className="bg-[#111320] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-[#5865F2] mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-display">
              DISCORD BOTS
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">24/7 Node.js &amp; Python</p>
          </div>

          {/* Card 3: VPS Hosting */}
          <div
            onClick={() => navigateTo('services-vps')}
            className="bg-[#111320] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Server className="w-8 h-8" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-display">
              VPS HOSTING
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">AMD EPYC NVMe KVM</p>
          </div>

          {/* Card 4: DDoS Protection */}
          <div
            onClick={() => navigateTo('hardware')}
            className="bg-[#111320] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-display">
              DDOS PROTECTION
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">3.2 Tbps Always-ON</p>
          </div>
        </div>
      </div>
    </section>
  );
};
