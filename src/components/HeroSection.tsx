import React from 'react';
import { ArrowRight, ChevronRight, Cloud, Gamepad2, Globe2, Server, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const quickServices = [
  { label: 'Game Hosting', detail: 'Minecraft, Rust, ARK & more', icon: Gamepad2, route: 'services-games' as const },
  { label: 'VPS Hosting', detail: 'Fast NVMe virtual servers', icon: Server, route: 'services-vps' as const },
  { label: 'Bot Hosting', detail: 'Node.js & Python 24/7', icon: Cloud, route: 'services-bot-hosting' as const },
  { label: 'Global Network', detail: 'Low-latency routes worldwide', icon: Globe2, route: 'locations' as const },
];

const HYTALE_ART = 'https://pbs.twimg.com/media/G5-qASnWcAANXO0.jpg';

export const HeroSection: React.FC = () => {
  const { navigateTo, siteSettings } = useApp();
  const title1 = siteSettings?.heroTitleLine1 || 'Build it. Host it.';
  const title2 = siteSettings?.heroTitleLine2 || 'No interruptions.';
  const subtitle = siteSettings?.heroSubtitle || 'Premium game, VPS and infrastructure hosting engineered for speed, stability, and complete control.';
  const ctaText = siteSettings?.heroCtaText || 'Get Started';
  const secondaryCtaText = siteSettings?.heroSecondaryCtaText || 'View Prices';

  return (
    <section className="relative isolate overflow-hidden bg-[#05060a] pb-16 pt-5 sm:pb-24 sm:pt-7 lg:pb-28 lg:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-180px] h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-purple-700/[0.13] blur-[150px]" />
        <div className="absolute left-[10%] top-[45%] h-[380px] w-[380px] rounded-full bg-indigo-600/[0.07] blur-[130px]" />
        <div className="absolute right-[8%] top-[30%] h-[330px] w-[330px] rounded-full bg-fuchsia-600/[0.055] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black_12%,transparent_76%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <button type="button" onClick={() => navigateTo('services-games')} className="group relative mx-auto mb-12 flex h-[92px] w-full max-w-6xl items-center overflow-hidden rounded-[22px] border border-white/10 bg-[#111722] text-left shadow-[0_18px_70px_rgba(0,0,0,.45)] transition-all hover:-translate-y-0.5 hover:border-purple-400/40 sm:h-[116px]">
            <img src={HYTALE_ART} alt="Hytale" className="absolute inset-0 h-full w-full object-cover object-[50%_43%] opacity-95 transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(34,197,94,.15),transparent_28%),radial-gradient(circle_at_82%_50%,rgba(59,130,246,.14),transparent_30%)]" />
            <div className="relative flex w-full items-center justify-between px-4 sm:px-8">
              <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <div className="rounded-xl border border-white/15 bg-black/45 px-3 py-2 shadow-2xl backdrop-blur-sm sm:px-5 sm:py-2.5">
                  <span className="font-display text-xl font-black tracking-[-0.04em] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,.8)] sm:text-3xl">HYTALE</span>
                </div>
                <span className="hidden h-9 w-px bg-white/25 sm:block" />
                <div className="hidden sm:block"><p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/60">ArveX Hosting</p><p className="mt-0.5 text-sm font-black uppercase tracking-[0.08em] text-white md:text-base">Hytale Server Hosting</p></div>
              </div>
              <div className="relative ml-3 shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 shadow-xl transition-all group-hover:bg-slate-100 sm:px-6 sm:py-3 sm:text-sm">Learn More</div>
            </div>
          </button>

          <div className="mx-auto max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-500/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-200 sm:text-[11px]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" /> ArveX Hosting Infrastructure</div>
            <h1 className="font-display text-[3.25rem] font-black leading-[.91] tracking-[-0.065em] text-white sm:text-6xl md:text-7xl lg:text-[82px] xl:text-[92px]">
              {title1}<span className="mt-2 block bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">{title2}</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-400 sm:mt-8 sm:text-base sm:leading-8 md:text-lg">{subtitle}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigateTo('pricing')} className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.08]">{secondaryCtaText}<ChevronRight className="h-4 w-4 text-purple-300" /></button>
              <button onClick={() => navigateTo('services')} className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-slate-950 shadow-[0_12px_45px_rgba(124,58,237,.18)] transition-all hover:-translate-y-1 hover:bg-slate-100">{ctaText}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl">
            {[['99.99%', 'Network uptime'], ['NVMe', 'High-speed storage'], ['24/7', 'Expert support']].map(([value, label], index) => <div key={label} className={`px-3 py-4 sm:px-6 sm:py-5 ${index ? 'border-l border-white/10' : ''}`}><p className="font-display text-lg font-black tracking-tight text-white sm:text-2xl">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px]">{label}</p></div>)}
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 sm:text-[11px]"><ShieldCheck className="h-4 w-4 text-emerald-400/70" /> Secure infrastructure <span className="h-1 w-1 rounded-full bg-slate-700" /><Zap className="h-3.5 w-3.5 text-purple-400/70" /> Instant deployment</div>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickServices.map(({ label, detail, icon: Icon, route }) => <button key={label} onClick={() => navigateTo(route)} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-purple-400/25 hover:bg-purple-500/[0.045] sm:p-5"><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-purple-300 transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></div><p className="text-xs font-bold text-white sm:text-sm">{label}</p><p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">{detail}</p></button>)}
        </div>
      </div>
    </section>
  );
};
