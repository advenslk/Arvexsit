import React from 'react';
import { ArrowRight, ChevronRight, Cloud, Gamepad2, Globe2, Server, ShieldCheck, Zap, Clock3, Database, Headphones, Sparkles, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const quickServices = [
  { label: 'Game Hosting', detail: 'Minecraft, Rust, ARK & more', icon: Gamepad2, route: 'services-games' as const },
  { label: 'VPS Hosting', detail: 'Fast NVMe virtual servers', icon: Server, route: 'services-vps' as const },
  { label: 'Bot Hosting', detail: 'Node.js & Python 24/7', icon: Cloud, route: 'services-bot-hosting' as const },
  { label: 'Global Network', detail: 'Low-latency routes worldwide', icon: Globe2, route: 'locations' as const },
];

const trustCards = [
  { value: '99.99%', label: 'Network uptime', icon: ShieldCheck },
  { value: 'NVMe', label: 'High-speed storage', icon: Database },
  { value: '< 1 min', label: 'Instant deployment', icon: Zap },
  { value: '24/7', label: 'Expert support', icon: Headphones },
];

export const HeroSection: React.FC = () => {
  const { navigateTo, siteSettings } = useApp();
  const title1 = siteSettings?.heroTitleLine1 || 'Building your digital world,';
  const title2 = siteSettings?.heroTitleLine2 || 'powering your future. No interruptions.';
  const subtitle = siteSettings?.heroSubtitle || 'High-performance game hosting built for players who demand speed, stability, and total control. No lag, no limits.';
  const ctaText = siteSettings?.heroCtaText || 'Get Started';
  const secondaryCtaText = siteSettings?.heroSecondaryCtaText || 'View Prices';

  return (
    <section className="relative min-h-[calc(100svh-68px)] overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-14 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(168,85,247,.20),transparent_42%)]" />

      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-300/25 bg-black/30 px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-purple-100 shadow-[0_0_40px_rgba(168,85,247,.18)] backdrop-blur-xl sm:text-[11px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300 shadow-[0_0_12px_rgba(168,85,247,1)]" />
            ArveX Hosting Infrastructure
            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
          </div>

          <h1 className="font-display text-[3.25rem] font-black leading-[.88] tracking-[-0.075em] text-white drop-shadow-[0_12px_55px_rgba(0,0,0,.95)] sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[98px]">
            {title1}
            <span className="mt-3 block bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">{title2}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-100/80 drop-shadow-[0_5px_25px_rgba(0,0,0,.95)] sm:mt-8 sm:text-base sm:leading-8 md:text-lg">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigateTo('pricing')} className="arvex-3d-button arvex-3d-button-dark group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-black/45 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl">
              {secondaryCtaText}<ChevronRight className="h-4 w-4 text-purple-200 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="arvex-cta-orbit relative">
              <span className="arvex-starburst" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => <Star key={i} className="arvex-cta-star" style={{ transform: `rotate(${i * 45}deg) translateY(-54px)` }} />)}
              </span>
              <button onClick={() => navigateTo('services')} className="arvex-3d-button arvex-3d-button-primary group relative inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-slate-950">
                <span className="absolute inset-0 rounded-2xl bg-purple-400/20 blur-xl" />
                <span className="relative">{ctaText}</span><ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 overflow-hidden rounded-[24px] border border-white/15 bg-black/30 shadow-[0_25px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl sm:grid-cols-4">
            {trustCards.map(({ value, label, icon: Icon }, index) => (
              <div key={label} className={`arvex-3d-card group relative px-4 py-5 transition-all duration-300 hover:bg-white/[0.055] sm:px-5 sm:py-6 ${index % 2 ? 'border-l border-white/10' : ''} ${index >= 2 ? 'border-t border-white/10 sm:border-t-0' : ''}`}>
                <Icon className="mx-auto mb-2 h-4 w-4 text-purple-300 transition-transform duration-300 group-hover:scale-125 group-hover:text-purple-200" />
                <p className="font-display text-xl font-black tracking-tight text-white sm:text-2xl">{value}</p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-300/60 sm:text-[9px]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/65 sm:text-[10px]">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Secure infrastructure</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
            <span className="inline-flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-purple-300" /> Instant deployment</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" />
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-blue-300" /> Always online</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 lg:mt-14">
          {quickServices.map(({ label, detail, icon: Icon, route }) => (
            <button key={label} onClick={() => navigateTo(route)} className="arvex-3d-button-dark arvex-3d-card group relative overflow-hidden rounded-2xl border border-white/12 bg-black/35 p-4 text-left backdrop-blur-2xl sm:p-5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-400/25" />
              <div className="relative mb-3 grid h-10 w-10 place-items-center rounded-xl border border-purple-300/20 bg-purple-950/50 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,.12)] transition-all duration-300 group-hover:scale-110 group-hover:border-purple-300/40">
                <Icon className="h-5 w-5" />
              </div>
              <p className="relative text-xs font-bold text-white sm:text-sm">{label}</p>
              <p className="relative mt-1 text-[10px] leading-4 text-slate-200/60 sm:text-xs">{detail}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};