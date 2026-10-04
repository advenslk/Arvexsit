import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Zap,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Gauge,
  Layers,
} from 'lucide-react';

export const HardwarePage: React.FC = () => {
  const { comparisonRows, navigateTo } = useApp();

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
            <span className="text-white font-bold">Hardware Architecture</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>Zen 5 Architecture &amp; PCIe Gen5 Storage</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Hardware &amp; Performance Benchmarks
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              We refuse to run budget Xeon CPUs or SATA drives. Every HelzerX game server is powered by flagship AMD Ryzen 9 9950X processors boosting up to 5.7 GHz.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 3 Main Hardware Pillars in 3D White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-20">
          {/* Pillar 1: Ryzen 9 9950X */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] card-interactive-3d">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-1.5">
              AMD Ryzen 9 9950X
            </h3>
            <p className="text-xs text-blue-600 font-mono font-bold mb-3">
              5.7 GHz Boost Clock • 16 Cores / 32 Threads
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Game loops depend strictly on single-thread IPC. Zen 5 architecture delivers over 64% faster chunk calculations and zero dropped ticks during heavy mob spawning.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-mono">
              Single-Thread IPC: <span className="text-blue-600 font-bold">4,890 pts</span> (vs 2,900 on Xeon)
            </div>
          </div>

          {/* Pillar 2: PCIe Gen5 NVMe */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] card-interactive-3d">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-1.5">
              PCIe Gen5 NVMe SSDs
            </h3>
            <p className="text-xs text-emerald-600 font-mono font-bold mb-3">
              Up to 14,000 MB/s Read &amp; Write Speeds
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              World generation, player teleportation, and mod loading require continuous random 4K read operations. Gen5 drives eliminate world-saving microstutters entirely.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-mono">
              Random 4K IOPS: <span className="text-emerald-600 font-bold">2.4 Million IOPS</span>
            </div>
          </div>

          {/* Pillar 3: DDR5 ECC RAM */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] card-interactive-3d">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-1.5">
              DDR5 6000 MHz Memory
            </h3>
            <p className="text-xs text-purple-600 font-mono font-bold mb-3">
              Ultra Low-Latency On-Die ECC Subsystems
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Memory bus bottlenecks cause Java garbage-collection hitching. High-frequency DDR5 memory buffers keep heap allocation pauses under 2 milliseconds.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 font-mono">
              Memory Bandwidth: <span className="text-purple-600 font-bold">84.2 GB/s Dual-Channel</span>
            </div>
          </div>
        </div>

        {/* Real-time Hardware Telemetry Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Live Fleet Telemetry</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Global Node Performance Metrics
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">All Nodes Operating at Peak Frequency</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Average Core Temperature</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">54.2°C</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Liquid Cooled Racks</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Average Minecraft TPS</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">20.0 / 20.0</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Stable Under Heavy Load</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">NVMe Read Latency</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">0.03 ms</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Direct Bus Link</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Fleet Power Redundancy</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-1">2N+1 UPS</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Dual Generator Backup</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Why Ryzen 9 9950X Beats Legacy Hosting Providers
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct comparison of hardware specs between HelzerX, budget host providers, and standard cloud VPS providers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Feature / Metric</th>
                  <th className="py-3.5 px-4 text-blue-600 font-bold">HelzerX Cloud</th>
                  <th className="py-3.5 px-4">Budget Game Host</th>
                  <th className="py-3.5 px-4">Standard Cloud VPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">Processor Model</td>
                  <td className="py-4 px-4 font-bold text-blue-600">AMD Ryzen 9 9950X</td>
                  <td className="py-4 px-4 text-slate-500">Intel Xeon E5 / E-2288G</td>
                  <td className="py-4 px-4 text-slate-500">Shared vCPU (EPYC 7002)</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">Clock Speed</td>
                  <td className="py-4 px-4 font-bold text-blue-600">Up to 5.7 GHz</td>
                  <td className="py-4 px-4 text-slate-500">2.6 - 3.4 GHz</td>
                  <td className="py-4 px-4 text-slate-500">2.0 - 2.8 GHz (Throttled)</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">Storage Technology</td>
                  <td className="py-4 px-4 font-bold text-blue-600">PCIe Gen5 NVMe (14 GB/s)</td>
                  <td className="py-4 px-4 text-slate-500">SATA SSD (550 MB/s)</td>
                  <td className="py-4 px-4 text-slate-500">Network Ceph / SAN Storage</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">Memory Speed</td>
                  <td className="py-4 px-4 font-bold text-blue-600">DDR5 6000 MHz</td>
                  <td className="py-4 px-4 text-slate-500">DDR4 2400 MHz</td>
                  <td className="py-4 px-4 text-slate-500">DDR4 2666 MHz</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">DDoS Protection</td>
                  <td className="py-4 px-4 font-bold text-emerald-600">3.2 Tbps L3/L4/L7 Auto</td>
                  <td className="py-4 px-4 text-slate-500">Basic Nullroute (Player Disconnect)</td>
                  <td className="py-4 px-4 text-slate-500">Extra $15/mo Addon</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold font-display mb-2">
              Ready to experience true 20.0 TPS gameplay?
            </h3>
            <p className="text-sm text-blue-100 max-w-xl">
              Deploy your server in under 15 seconds on our AMD Ryzen 9 9950X cluster with automated invoicing and instant provisioning.
            </p>
          </div>
          <button
            onClick={() => navigateTo('plans')}
            className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-95 shrink-0 cursor-pointer"
          >
            Deploy Flagship Server
          </button>
        </div>

      </div>
    </div>
  );
};
