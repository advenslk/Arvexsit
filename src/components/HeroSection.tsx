import React from 'react';
import { ArrowRight, ChevronRight, Cloud, Gamepad2, Globe2, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';

const quickServices = [
  { label: 'Game Hosting', detail: 'Minecraft, Rust, ARK & more', icon: Gamepad2, route: 'services-games' as const },
  { label: 'VPS Hosting', detail: 'Fast NVMe virtual servers', icon: Server, route: 'services-vps' as const },
  { label: 'Bot Hosting', detail: 'Node.js & Python 24/7', icon: Cloud, route: 'services-bot-hosting' as const },
  { label: 'Global Network', detail: 'Built for low-latency routes', icon: Globe2, route: 'locations' as const },
];

export const HeroSection: React.FC = () => {
  const { navigateTo, siteSettings } = useApp();
  const title1 = siteSettings?.heroTitleLine1 || 'Build it. Host it.';
  const title2 = siteSettings?.heroTitleLine2 || 'No interruptions.';
  const subtitle = siteSettings?.heroSubtitle || 'High-performance game hosting built for players who demand speed, stability, and total control — no lag, no limits.';
  const ctaText = siteSettings?.heroCtaText || 'Get Started';
  const secondaryCtaText = siteSettings?.heroSecondaryCtaText || 'View Prices';

  return (
    <section className="relative isolate overflow-hidden bg-[#07080d] pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[650px] w-[1100px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[170px]" />
        <div className="absolute left-1/2 top-[35%] h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_8%,transparent_74%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <button type="button" onClick={() => navigateTo('services-games')} className="group relative mx-auto mb-10 flex w-full max-w-6xl items-center justify-between overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-r from-[#16231b] via-[#17283a] to-[#111827] px-5 py-4 text-left shadow-2xl shadow-black/30 transition-all hover:-translate-y-0.5 hover:border-purple-400/30 sm:px-8 sm:py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(34,197,94,.16),transparent_28%),radial-gradient(circle_at_85%_50%,rgba(59,130,246,.18),transparent_30%)]" />
            <div className="relative flex min-w-0 items-center gap-4">
              <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-display text-xl font-black tracking-tight text-white sm:text-3xl">HYTALE</div>
              <span className="hidden h-8 w-px bg-white/15 sm:block" />
              <span className="truncate text-xs font-black uppercase tracking-[0.08em] text-white sm:text-sm md:text-base">View Hytale Servers</span>
            </div>
            <div className="relative ml-3 shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-lg sm:px-6 sm:py-2.5 sm:text-sm">Learn More</div>
          </button>

          <div className="mx-auto max-w-5xl">
            <h1 className="font-display text-5xl font-black leading-[.93] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[78px] xl:text-[88px]">
              {title1}
              <span className="mt-2 block bg-gradient-to-r from-purple-100 via-white to-indigo-300 bg-clip-text text-transparent">{title2}</span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 md:text-lg">{subtitle}</p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigateTo('pricing')} className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-white/[0.07]">{secondaryCtaText}<ChevronRight className="h-4 w-4 text-purple-300" /></button>
              <button onClick={() => navigateTo('services')} className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-700/30 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500">{ctaText}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickServices.map(({ label, detail, icon: Icon, route }) => (
            <button key={label} onClick={() => navigateTo(route)} className="group rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-left transition-all hover:-translate-y-1 hover:border-purple-400/25 hover:bg-purple-500/[0.04]">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-purple-300 transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></div>
              <p className="text-xs font-bold text-white sm:text-sm">{label}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">{detail}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
