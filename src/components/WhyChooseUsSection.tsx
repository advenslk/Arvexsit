import React from 'react';
import { Cpu, Gamepad2, Headphones, ShieldCheck, Zap, Server, CheckCircle2, Clock } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Header matching Screenshot 5 */}
      <div className="mb-12 max-w-3xl">
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-3">
          WHY CHOOSE US
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Everything you need to run a fast, reliable game server, built for Sri Lankan &amp; Global players.
        </p>
      </div>

      {/* Grid matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Latest Ryzen Hardware */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all" />

          <div>
            {/* Chip Visual Banner */}
            <div className="h-36 w-full rounded-2xl bg-gradient-to-r from-[#191d33] to-[#121422] border border-white/10 p-5 flex items-center justify-between mb-6 relative overflow-hidden">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">
                  Flagship Architecture
                </span>
                <span className="text-2xl font-black text-white font-display">
                  AMD RYZEN™ 9
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Up to 5.7 GHz 3D V-Cache
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Cpu className="w-9 h-9" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Latest Ryzen Hardware
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Powered by AMD Ryzen processors for maximum single-thread performance — the most important metric for Minecraft servers and multiplayer game tick rates.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> 20.0 TPS Guarantee
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> PCIe 5.0 NVMe SSDs
            </span>
          </div>
        </div>

        {/* Card 2: 100+ Games Supported */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all" />

          <div>
            {/* Quick Games Pills */}
            <div className="h-36 w-full rounded-2xl bg-gradient-to-r from-[#191d33] to-[#121422] border border-white/10 p-4 flex flex-wrap gap-2 items-center content-center mb-6">
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                🎮 Minecraft
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                🛡 Valheim
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                ⚡ Node.js
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                🦖 ARK: Survival
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                ⚙ Rust
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                🚗 GTA V FiveM
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">
              100+ Games Supported
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From Minecraft to Valheim, ARK, Rust, and Discord bots, spin up a server for any of your favourite games in seconds with our automated 1-click egg installers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant 30-sec Provisioning
            </span>
            <span className="flex items-center gap-1 text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Modpack Auto-Installer
            </span>
          </div>
        </div>

        {/* Card 3: 24/7 Support */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-600/20 transition-all" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Headphones className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">
              24/7 Real Human Support
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our team is always online and ready to help. Whether it&apos;s a plugin configuration error, BungeeCord setup, or Sri Lankan bank transfer validation, get fast assistance in Sinhala, Tamil, or English.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" /> &lt; 10 Min Average Response
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Discord &amp; Ticket Help
            </span>
          </div>
        </div>

        {/* Card 4: DDoS Protection */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-600/20 transition-all" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Always-ON DDoS Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our Always-ON 3.2 Tbps DDoS mitigation scrubs volumetric UDP floods, Minecraft handshake attacks, and Layer 7 botnets in under 1 second so your players never experience disconnects.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3.2+ Tbps Scrubbing
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero False-Positives
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
