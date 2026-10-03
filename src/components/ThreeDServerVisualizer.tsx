import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
  HardDrive,
  Wifi,
  Terminal,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ThreeDCard } from './ThreeDCard';
import { useApp } from '../context/AppContext';

interface ServerBlade {
  id: string;
  name: string;
  location: string;
  ping: number;
  cpuModel: string;
  boostClock: string;
  ramUsage: string;
  status: 'optimal' | 'turbo' | 'standby';
  loadPercent: number;
  activePlayers: string;
}

const SERVER_BLADES: ServerBlade[] = [
  {
    id: 'blade-01',
    name: 'Dallas Zen-5 Hyper-Cluster',
    location: 'Dallas, TX · Equinix DA11',
    ping: 9,
    cpuModel: 'AMD Ryzen 9 9950X (Zen 5)',
    boostClock: '5.7 GHz Boost',
    ramUsage: '14.2 / 64 GB DDR5',
    status: 'turbo',
    loadPercent: 22,
    activePlayers: '1,420 Players Online',
  },
  {
    id: 'blade-02',
    name: 'Frankfurt Anycast Node #02',
    location: 'Frankfurt, DE · Interxion',
    ping: 18,
    cpuModel: 'AMD Ryzen 9 9950X3D',
    boostClock: '5.7 GHz Boost',
    ramUsage: '28.6 / 64 GB DDR5',
    status: 'optimal',
    loadPercent: 44,
    activePlayers: '2,890 Players Online',
  },
  {
    id: 'blade-03',
    name: 'Singapore Colombo Edge Hub',
    location: 'Singapore · Equinix SG1',
    ping: 14,
    cpuModel: 'AMD EPYC 9004 + Zen 5',
    boostClock: '5.5 GHz Boost',
    ramUsage: '36.8 / 128 GB DDR5',
    status: 'turbo',
    loadPercent: 38,
    activePlayers: '3,110 Players Online',
  },
];

export const ThreeDServerVisualizer: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedBlade, setSelectedBlade] = useState<ServerBlade>(SERVER_BLADES[0]);
  const [activeTab, setActiveTab] = useState<'metrics' | 'terminal'>('metrics');

  return (
    <div className="relative mx-auto max-w-5xl stage-3d my-10 px-4">
      {/* 3D Floating Server Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 3D Panel: Server Blade Selector */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Interactive 3D Nodes
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-ping" />
              Live Mesh
            </span>
          </div>

          {SERVER_BLADES.map((blade) => {
            const isSelected = selectedBlade.id === blade.id;
            return (
              <ThreeDCard
                key={blade.id}
                maxTilt={6}
                scale={1.01}
                onClick={() => setSelectedBlade(blade)}
                className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                  isSelected
                    ? 'bg-white text-slate-900 border-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] ring-2 ring-cyan-400'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20 backdrop-blur-md'
                }`}
              >
                <div style={{ transform: 'translateZ(15px)' }} className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-white/10 text-cyan-300'
                      }`}
                    >
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-xs sm:text-sm leading-tight">
                        {blade.name}
                      </h4>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-500' : 'text-blue-100/70'}`}>
                        {blade.location}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {blade.ping}ms
                  </span>
                </div>

                <div
                  style={{ transform: 'translateZ(10px)' }}
                  className={`mt-3 pt-2.5 flex items-center justify-between border-t text-[11px] font-medium ${
                    isSelected ? 'border-slate-100 text-slate-600' : 'border-white/10 text-blue-100'
                  }`}
                >
                  <span className="font-mono text-[10px]">{blade.boostClock}</span>
                  <span className="font-bold text-[10px]">{blade.activePlayers}</span>
                </div>
              </ThreeDCard>
            );
          })}

          <div className="mt-2 rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-md text-white text-xs flex items-center justify-between">
            <span className="text-blue-100 text-[11px]">Hardware Scrubbing</span>
            <span className="font-black text-cyan-300 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" /> Corero 3.2 Tbps
            </span>
          </div>
        </div>

        {/* Right 3D Centerpiece: Simulated 3D Hypervisor Chassis & Hologram */}
        <div className="lg:col-span-8">
          <ThreeDCard
            maxTilt={8}
            scale={1.01}
            className="h-full rounded-3xl bg-white p-6 sm:p-8 text-slate-800 border-2 border-white/95 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] flex flex-col justify-between"
          >
            {/* Top Bar of the 3D Chassis */}
            <div style={{ transform: 'translateZ(25px)' }} className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-500/30">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                      {selectedBlade.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      Tier 4 Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedBlade.location} · 99.99% Network SLA
                  </p>
                </div>
              </div>

              {/* Segmented Mode Tab */}
              <div className="hidden sm:inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className={`rounded-lg px-3 py-1 transition ${
                    activeTab === 'metrics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  3D Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('terminal')}
                  className={`rounded-lg px-3 py-1 transition ${
                    activeTab === 'terminal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Live Logs
                </button>
              </div>
            </div>

            {/* Middle Section: 3D Visual Chassis Display or Terminal */}
            <div style={{ transform: 'translateZ(20px)' }} className="my-6">
              {activeTab === 'metrics' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Gauge 1: CPU Clock */}
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50/60 to-slate-50 p-4 border border-blue-100 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold">CPU Frequency</span>
                      <Zap className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-2xl text-slate-900">5.70</span>
                      <span className="text-xs font-bold text-blue-600">GHz Turbo</span>
                    </div>
                    <div className="mt-3 w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 font-medium">Zen-5 Dedicated Clock Core</p>
                  </div>

                  {/* Gauge 2: DDR5 Memory Bus */}
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50/60 to-slate-50 p-4 border border-indigo-100 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold">Memory Bandwidth</span>
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-2xl text-slate-900">6000</span>
                      <span className="text-xs font-bold text-indigo-600">MT/s DDR5</span>
                    </div>
                    <div className="mt-3 w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${selectedBlade.loadPercent + 20}%` }} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 font-medium">{selectedBlade.ramUsage}</p>
                  </div>

                  {/* Gauge 3: NVMe I/O Throughput */}
                  <div className="rounded-2xl bg-gradient-to-br from-cyan-50/60 to-slate-50 p-4 border border-cyan-100 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-bold">NVMe PCIe 5.0</span>
                      <HardDrive className="h-3.5 w-3.5 text-cyan-600" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-2xl text-slate-900">14,200</span>
                      <span className="text-xs font-bold text-cyan-600">MB/s Read</span>
                    </div>
                    <div className="mt-3 w-full bg-cyan-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-600 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 font-medium">Sub-0.02ms Read Latency</p>
                  </div>
                </div>
              ) : (
                /* Interactive Simulated Terminal */
                <div className="rounded-2xl bg-[#0a0d16] p-4 text-left font-mono text-xs text-slate-300 border border-slate-800 shadow-inner overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-[10px] text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-slate-400">helzerx-hypervisor-node ~ wings daemon v1.11.8</span>
                  </div>
                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="text-emerald-400">[SYSTEM] AMD Ryzen 9 9950X microcode initialized (16 cores, 32 threads @ 5.7GHz)</p>
                    <p className="text-cyan-300">[BGP] Anycast prefix 198.51.100.0/24 announced to 12 tier-1 upstream carriers</p>
                    <p className="text-slate-400">[SHIELD] Corero SmartWall 3.2Tbps inspection active: 0 dropped legitimate packets</p>
                    <p className="text-blue-300">[CONTAINER] Automated Docker socket ready for sub-30 second provisioning</p>
                    <p className="text-amber-300 animate-pulse">&gt; Ready for user server deployment...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom 3D Actions & CTA */}
            <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Automated Setup (30s)
                </span>
                <span className="text-slate-300">•</span>
                <span>Corero 3.2Tbps Protected</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigateTo('plans')}
                  className="btn-3d flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25 transition active:scale-95"
                >
                  <span>Deploy On This Node</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </ThreeDCard>
        </div>

      </div>
    </div>
  );
};
