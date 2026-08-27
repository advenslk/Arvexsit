import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, Sparkles, Cpu, Zap, ShieldCheck } from 'lucide-react';

export const HardwareComparisonSection: React.FC = () => {
  const { comparisonRows, siteSettings } = useApp();

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Subtitle matching Screenshot 4 & 8 */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-4">
          Unmatched Speed, Incredible Value.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Experience powerhouse performance with our AMD Ryzen 9950X™ servers. Lightning-fast spin-ups, unbeatable uptime, and ultra low latency make every gaming session seamless all for just $3 per gigabyte.
        </p>
      </div>

      {/* Comparison Table Container matching Screenshot 4 & 8 */}
      <div className="rounded-3xl bg-[#10121a] border border-white/10 shadow-2xl overflow-x-auto p-4 sm:p-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-slate-400">
              <th className="py-4 px-4">Provider</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Processor</th>
              <th className="py-4 px-4">Storage</th>
              <th className="py-4 px-4 text-center">24/7 Support</th>
              <th className="py-4 px-4 text-center">DDoS Protection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
            {comparisonRows.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${
                  row.isCurrentHost
                    ? 'bg-gradient-to-r from-cyan-950/40 via-[#131a29]/60 to-transparent font-medium'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Provider Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {row.isCurrentHost ? (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
                        DX
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 text-xs shrink-0">
                        {row.provider.charAt(0)}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          row.isCurrentHost ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {row.isCurrentHost ? siteSettings.brandName : row.provider}
                      </span>

                      {row.badge && (
                        <span className="inline-flex items-center gap-1 bg-white text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                          <span className="text-cyan-600 text-xs">✦</span>
                          <span>{row.badge}</span>
                          <span className="text-cyan-600 text-xs">✦</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Price Column */}
                <td className="py-4 px-4 font-mono font-bold text-white">
                  {row.pricePerGb}
                </td>

                {/* Processor Column */}
                <td className="py-4 px-4 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{row.processor}</span>
                  </div>
                </td>

                {/* Storage Column */}
                <td className="py-4 px-4 font-medium text-slate-300">
                  {row.storage}
                </td>

                {/* 24/7 Support Column */}
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    {row.support247 ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </td>

                {/* DDoS Protection Column */}
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    {row.ddosProtection ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
