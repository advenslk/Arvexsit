import React from 'react';
import { ArrowRight, Check, ChevronRight, Cloud, Gamepad2, Globe2, Server, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const heroFeatures = ['Instant deployment for supported games', '24/7 real human support', 'Singapore low-latency routes', 'Always-on DDoS protection'];
const quickServices = [
  { label: 'Game Hosting', detail: 'Minecraft, Rust, ARK & more', icon: Gamepad2, route: 'services-games' as const },
  { label: 'VPS Hosting', detail: 'Fast NVMe virtual servers', icon: Server, route: 'services-vps' as const },
  { label: 'Bot Hosting', detail: 'Node.js & Python 24/7', icon: Cloud, route: 'services-bot-hosting' as const },
  { label: 'Global Network', detail: 'Built for low-latency routes', icon: Globe2, route: 'locations' as const },
];

export const HeroSection: React.FC = () => {
  const { navigateTo, siteSettings } = useApp();
  const badgeText = siteSettings?.heroBadgeText || 'Premium hosting. Built for performance.';
  const title1 = siteSettings?.heroTitleLine1 || 'Build it. Host it.';
  const title2 = siteSettings?.heroTitleLine2 || 'No interruptions.';
  const subtitle = siteSettings?.heroSubtitle || 'High-performance game, VPS and bot hosting powered by modern infrastructure, reliable networking and simple control.';
  const ctaText = siteSettings?.heroCtaText || 'Get Started';
  const secondaryCtaText = siteSettings?.heroSecondaryCtaText || 'View Prices';

  return (
    <section className="relative isolate overflow-hidden bg-[#07080d] pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[160px]" />
        <div className="absolute left-1/2 top-1/3 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_5%,transparent_72%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-white/[0.035] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-200 shadow-xl shadow-purple-950/20 backdrop-blur-xl sm:text-xs">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-purple-500/15 text-purple-300"><Sparkles className="h-3 w-3" /></span>
              {badgeText}
            </div>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-black leading-[.95] tracking-[-0.05em] text-white sm:text-6xl lg:mx-0 lg:text-7xl xl:text-[82px]">
              {title1}
              <span className="mt-2 block bg-gradient-to-r from-purple-200 via-white to-indigo-300 bg-clip-text text-transparent">{title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base lg:mx-0 lg:text-lg">{subtitle}</p>
            <div className="mx-auto mt-7 grid max-w-2xl gap-2.5 text-left sm:grid-cols-2 lg:mx-0">
              {heroFeatures.map((feature) => <div key={feature} className="flex items-center gap-2.5 text-xs font-medium text-slate-300 sm:text-sm"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300"><Check className="h-3 w-3" /></span>{feature}</div>)}
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button onClick={() => navigateTo('services')} className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-700/25 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500">{ctaText}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
              <button onClick={() => navigateTo('pricing')} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-white/[0.06]">{secondaryCtaText}<ChevronRight className="h-4 w-4 text-purple-300" /></button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500 lg:justify-start sm:text-xs">
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-purple-400" /> Fast deployment</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> DDoS protected</span>
              <span className="inline-flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-purple-400" /> NVMe infrastructure</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-10 rounded-[50px] bg-purple-600/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0f18]/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <div className="rounded-[26px] border border-white/10 bg-[#090b12] p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/20"><Server className="h-4 w-4" /></div><div><p className="text-xs font-bold text-white">ArveX Infrastructure</p><p className="text-[10px] text-slate-500">Live network overview</p></div></div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Operational</div>
                </div>
                <div className="relative my-6 h-56 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/[0.07] to-indigo-500/[0.03]">
                  <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:32px_32px]" />
                  <div className="absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
                  <div className="absolute left-[15%] top-[25%] h-2.5 w-2.5 animate-pulse rounded-full bg-purple-300 shadow-[0_0_22px_6px_rgba(168,85,247,.45)]" />
                  <div className="absolute right-[20%] top-[38%] h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-300 shadow-[0_0_22px_6px_rgba(129,140,248,.45)] [animation-delay:700ms]" />
                  <div className="absolute left-[42%] bottom-[22%] h-2.5 w-2.5 animate-pulse rounded-full bg-fuchsia-300 shadow-[0_0_22px_6px_rgba(232,121,249,.35)] [animation-delay:1400ms]" />
                  <div className="absolute left-[16%] top-[26%] h-px w-[54%] rotate-[8deg] bg-gradient-to-r from-purple-400/0 via-purple-300/40 to-indigo-300/0" />
                  <div className="absolute left-[42%] bottom-[24%] h-px w-[37%] -rotate-[27deg] bg-gradient-to-r from-fuchsia-300/0 via-fuchsia-300/30 to-indigo-300/0" />
                  <div className="absolute inset-x-5 bottom-4 flex justify-between text-[9px] font-medium uppercase tracking-wider text-slate-600"><span>Singapore</span><span>Global Edge</span><span>EU / US</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">{[['99.99%','Uptime target'],['10 Gbps','Network'],['24/7','Support']].map(([value,label])=><div key={label} className="rounded-2xl border border-white/5 bg-white/[0.025] px-3 py-3.5"><p className="text-sm font-black text-white sm:text-base">{value}</p><p className="mt-1 text-[9px] uppercase tracking-wider text-slate-500">{label}</p></div>)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickServices.map(({label,detail,icon:Icon,route})=><button key={label} onClick={()=>navigateTo(route)} className="group rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-left transition-all hover:-translate-y-1 hover:border-purple-400/25 hover:bg-purple-500/[0.04]"><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-purple-300 transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></div><p className="text-xs font-bold text-white sm:text-sm">{label}</p><p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">{detail}</p></button>)}
        </div>
      </div>
    </section>
  );
};
