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
} from 'lucide-react';

export const HardwarePage: React.FC = () => {
  const { comparisonRows, navigateTo } = useApp();

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Zen 5 Architecture & PCIe Gen5</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Hardware & Performance Benchmarks
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          We refuse to run budget Xeon CPUs or SATA drives. Every ArveX game server is powered by flagship AMD Ryzen 9 9950X processors boosting up to 5.7 GHz.
        </p>
      </div>

      {/* 3 Main Hardware Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Pillar 1: Ryzen 9 9950X */}
        <div className="bg-[#0f111c] border border-cyan-500/30 rounded-3xl p-7 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white font-display mb-2">
            AMD Ryzen 9 9950X
          </h3>
          <p className="text-xs text-cyan-400 font-mono font-bold mb-3">
            5.7 GHz Boost Clock • 16 Cores / 32 Threads
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Game loops depend strictly on single-thread IPC. Zen 5 architecture delivers over 64% faster chunk calculations and zero dropped ticks during heavy mob spawning.
          </p>
          <div className="p-3 bg-[#090b12] rounded-xl border border-white/5 text-[11px] text-slate-300 font-mono">
            PassMark Single Thread: <span className="text-cyan-400 font-bold">4,890 pts</span> (vs 2,900 on Xeon)
          </div>
        </div>

        {/* Pillar 2: PCIe Gen5 NVMe */}
        <div className="bg-[#0f111c] border border-blue-500/30 rounded-3xl p-7 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
            <HardDrive className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white font-display mb-2">
            PCIe 5.0 NVMe Storage
          </h3>
          <p className="text-xs text-blue-400 font-mono font-bold mb-3">
            14,000 MB/s Sequential Reads • 1.5M IOPS
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            World saves, player profiles, and mod files load instantaneously. Disk I/O bottlenecks are completely eliminated, even with hundreds of players exploring new map areas simultaneously.
          </p>
          <div className="p-3 bg-[#090b12] rounded-xl border border-white/5 text-[11px] text-slate-300 font-mono">
            Read Throughput: <span className="text-blue-400 font-bold">14,000 MB/s</span> (vs 550 MB/s SATA)
          </div>
        </div>

        {/* Pillar 3: Corero SmartWall DDoS */}
        <div className="bg-[#0f111c] border border-emerald-500/30 rounded-3xl p-7 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white font-display mb-2">
            Corero SmartWall 3.2Tbps
          </h3>
          <p className="text-xs text-emerald-400 font-mono font-bold mb-3">
            Inline Hardware Scrubbing • &lt; 1 sec Response
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Zero routing delay and zero false positives. Game traffic is inspected at the silicon level, filtering UDP floods and Layer 7 bot attacks before they reach the game instance.
          </p>
          <div className="p-3 bg-[#090b12] rounded-xl border border-white/5 text-[11px] text-slate-300 font-mono">
            Mitigation Capacity: <span className="text-emerald-400 font-bold">3.2+ Terabits/sec</span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-16">
        <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight mb-2">
          Head-to-Head Provider Comparison
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          See how our enterprise hardware and pricing stack up against competitors.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-4 px-4">Provider</th>
                <th className="py-4 px-4">Price / GB RAM</th>
                <th className="py-4 px-4">Processor Type</th>
                <th className="py-4 px-4">Storage Technology</th>
                <th className="py-4 px-4 text-center">24/7 Live Support</th>
                <th className="py-4 px-4 text-center">3.2Tbps DDoS Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(comparisonRows || []).map((row) => (
                <tr
                  key={row.id}
                  className={`${
                    row.isCurrentHost
                      ? 'bg-cyan-500/10 font-semibold text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <td className="py-4 px-4 flex items-center gap-2">
                    <span className="font-bold">{row.provider}</span>
                    {row.isCurrentHost && (
                      <span className="bg-cyan-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        Your Host
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-300">
                    {row.pricePerGb}
                  </td>
                  <td className="py-4 px-4">{row.processor}</td>
                  <td className="py-4 px-4">{row.storage}</td>
                  <td className="py-4 px-4 text-center">
                    {row.support247 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.ddosProtection ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="text-center">
        <button
          onClick={() => navigateTo('plans')}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/25 inline-flex items-center gap-2 active:scale-95"
        >
          <span>Choose Your Game & Deploy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
