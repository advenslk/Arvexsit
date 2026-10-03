import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Wifi,
  CreditCard,
  Lock,
  Globe2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThreeDCard } from './ThreeDCard';
import { ThreeDServerVisualizer } from './ThreeDServerVisualizer';

export const HeroSection: React.FC = () => {
  const { navigateTo, setIsAuthModalOpen, setAuthModalTab } = useApp();
  const [emailInput, setEmailInput] = useState('');

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    } else {
      navigateTo('plans');
    }
  };

  return (
    <section className="relative isolate overflow-hidden gabrun-hero-gradient pt-8 pb-20 sm:pt-14 sm:pb-32 text-white">
      {/* 3D Background Decorative Rings & Ambient Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="gabrun-grid-lines absolute inset-0 opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-blue-400/25 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/2 left-8 w-[420px] h-[420px] rounded-full bg-cyan-300/20 blur-[110px]" />
        <div className="absolute bottom-10 right-8 w-[450px] h-[450px] rounded-full bg-indigo-500/25 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header 3D Pill Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform hover:scale-105 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span className="tracking-wide">HelzerX Cloud Deployment Faster</span>
          </div>
        </div>

        {/* Main Hero Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[70px] leading-[1.08] drop-shadow-sm">
            Make Your Cloud Hosting Fast
            <br />
            and Secure, with{' '}
            <span className="inline-flex items-center align-middle gap-2.5 px-3.5 py-1.5 mx-1 rounded-2xl bg-white/20 border border-white/35 backdrop-blur-md shadow-2xl text-white transform hover:scale-105 transition-transform">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-md">
                <Server className="h-5 w-5" />
              </span>
              <span className="font-display font-black tracking-tight">HelzerX</span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-blue-100 font-normal leading-relaxed">
            High-performance game and cloud server hosting built for developers and gamers who demand
            blazing speed, 99.99% uptime, zero lag, and instant automated provisioning.
          </p>

          {/* Interactive Search / Email Pill Input */}
          <form
            onSubmit={handleGetStarted}
            className="mx-auto mt-9 flex max-w-md items-center rounded-full bg-white/20 p-1.5 backdrop-blur-xl border border-white/35 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all focus-within:border-white focus-within:bg-white/25 focus-within:scale-[1.02]"
          >
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your email or server domain..."
              className="w-full bg-transparent px-5 py-2.5 text-sm text-white placeholder-blue-100/70 outline-none font-medium"
            />
            <button
              type="submit"
              className="btn-3d flex items-center gap-2 rounded-full bg-[#0b0f19] px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-900 active:scale-95 shrink-0"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>Get Started</span>
            </button>
          </form>

          {/* Quick trust checkmarks */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-blue-100 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" /> Instant 60s Setup
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" /> Corero 3.2Tbps DDoS Defense
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" /> 24/7 Expert Support
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Trio of 3D Floating Glass Cards (Signature Gabrun Look) */}
        {/* ---------------------------------------------------- */}
        <div className="mt-16 relative mx-auto max-w-5xl stage-3d">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Card: 3D Floating Plan Spec Showcase */}
            <div className="md:col-span-4">
              <ThreeDCard maxTilt={10} glare={true} className="rounded-3xl bg-white p-6 text-slate-800 border border-white/95 card-3d-left animate-float-left shadow-xl">
                <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                      +10k Active
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">Node #01</span>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Purpose Plan</p>
                  <div className="flex items-baseline justify-between mt-1 mb-4">
                    <h3 className="font-display text-xl font-black text-slate-900">Developer Node</h3>
                    <div className="text-right">
                      <span className="font-display text-3xl font-black text-slate-900">$99</span>
                      <span className="text-xs font-medium text-slate-400">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs text-slate-600 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-600" /> 8 vCPU Ryzen 9
                      </span>
                      <span className="font-bold text-slate-900">Dedicated</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600" /> 16GB DDR5 RAM
                      </span>
                      <span className="font-bold text-slate-900">ECC Clustered</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" /> Corero Scrubbing
                      </span>
                      <span className="font-bold text-emerald-600">3.2 Tbps</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('plans')}
                    className="mt-5 w-full rounded-2xl bg-blue-50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-sm"
                  >
                    Choose This Plan
                  </button>
                </div>
              </ThreeDCard>
            </div>

            {/* Center Hero Card: 3D Elevated Server Provisioning / Payment */}
            <div className="md:col-span-5 z-20">
              <ThreeDCard maxTilt={12} scale={1.03} glare={true} className="rounded-3xl bg-white p-7 text-slate-800 border-2 border-white/95 card-3d-center animate-float-center shadow-2xl">
                <div style={{ transform: 'translateZ(25px)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/30">
                        HX
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block leading-tight">Instant Provision</span>
                        <span className="text-xs font-extrabold text-slate-900">Dallas High-Speed Node</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live 9ms
                    </span>
                  </div>

                  {/* Glowing Value Box */}
                  <div className="my-5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 p-4 border border-blue-100/80 shadow-inner">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-time Performance</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-display text-3xl font-black text-slate-900">$3,050.00</span>
                      <span className="text-xs font-bold text-blue-600">USD Value / 99.99%</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-6 w-9 rounded-md bg-blue-600/10 border border-blue-200 flex items-center justify-center shadow-xs">
                        <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div className="h-6 w-9 rounded-md bg-amber-500/10 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-700">
                        PP
                      </div>
                      <div className="h-6 w-9 rounded-md bg-emerald-500/10 border border-emerald-200 flex items-center justify-center text-[9px] font-bold text-emerald-700">
                        LKR
                      </div>
                      <Wifi className="h-4 w-4 ml-auto text-slate-400 rotate-90 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1 font-medium">
                    <span>Active Core Boost</span>
                    <span className="font-black text-slate-900 font-mono text-xs">5.7 GHz Boost</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('checkout')}
                    className="btn-3d w-full rounded-2xl bg-[#0b0f19] py-3.5 text-xs font-extrabold text-white hover:bg-slate-900 transition flex items-center justify-center gap-2"
                  >
                    <span>Deploy Server Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </ThreeDCard>
            </div>

            {/* Right Card: 3D Floating User Console Status Card */}
            <div className="md:col-span-3">
              <ThreeDCard maxTilt={10} glare={true} className="rounded-3xl bg-white p-6 text-slate-800 border border-white/95 card-3d-right animate-float-right shadow-xl">
                <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      alt="John Clayton"
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Welcome back</span>
                      <span className="text-xs font-extrabold text-slate-900 truncate block">John Clayton</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 mb-3 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Hosting</span>
                    <span className="font-display text-lg font-black text-slate-900 mt-0.5 block">$3,050.00 <span className="text-[10px] text-slate-400 font-normal">USD</span></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">
                      <span className="text-emerald-700 font-bold block">CPU Load</span>
                      <span className="font-black text-slate-900 text-xs">14.2%</span>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2 border border-blue-100">
                      <span className="text-blue-700 font-bold block">RAM Usage</span>
                      <span className="font-black text-slate-900 text-xs">4.2 GB</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Node Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Running
                    </span>
                  </div>
                </div>
              </ThreeDCard>
            </div>

          </div>
        </div>

        {/* Interactive 3D Server Node Cluster Visualizer */}
        <div className="mt-14">
          <ThreeDServerVisualizer />
        </div>

      </div>
    </section>
  );
};
