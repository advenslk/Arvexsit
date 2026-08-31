import React from 'react';
import { Cpu, Headphones, ShieldCheck, CheckCircle2, Clock, Gamepad2, Server, Zap } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <style>{`
        @keyframes arvex-float-3d { 0%,100% { transform: translateY(0) rotateX(8deg) rotateY(-10deg); } 50% { transform: translateY(-9px) rotateX(-4deg) rotateY(12deg); } }
        @keyframes arvex-spin-3d { from { transform: rotateX(58deg) rotateZ(0deg); } to { transform: rotateX(58deg) rotateZ(360deg); } }
        @keyframes arvex-pulse-ring { 0%,100% { opacity:.25; transform: scale(.92); } 50% { opacity:.75; transform: scale(1.06); } }
        @keyframes arvex-orbit { from { transform: rotate(0deg) translateX(72px) rotate(0deg); } to { transform: rotate(360deg) translateX(72px) rotate(-360deg); } }
        @keyframes arvex-scan { 0% { transform: translateY(-110%); opacity:0; } 20%,80% { opacity:.7; } 100% { transform: translateY(210%); opacity:0; } }
        .arvex-3d-stage { perspective: 900px; transform-style: preserve-3d; }
        .arvex-3d-float { animation: arvex-float-3d 5s ease-in-out infinite; transform-style: preserve-3d; }
        .arvex-3d-ring { animation: arvex-spin-3d 10s linear infinite; transform-style: preserve-3d; }
        .arvex-pulse-ring { animation: arvex-pulse-ring 2.8s ease-in-out infinite; }
        .arvex-orbit { animation: arvex-orbit 7s linear infinite; }
        .arvex-orbit-reverse { animation: arvex-orbit 9s linear infinite reverse; }
        .arvex-scan { animation: arvex-scan 3.2s ease-in-out infinite; }
      `}</style>

      <div className="mb-12 max-w-3xl">
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-3">
          WHY CHOOSE US
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Everything you need to run a fast, reliable game server, built for Sri Lankan &amp; Global players.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Latest Ryzen Hardware */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all" />

          <div>
            <div className="arvex-3d-stage h-36 w-full rounded-2xl bg-gradient-to-br from-[#191d33] via-[#111426] to-[#0b0d18] border border-white/10 mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,.20),transparent_52%)]" />
              <div className="arvex-pulse-ring absolute w-28 h-28 rounded-full border border-purple-400/40" />
              <div className="arvex-3d-ring absolute w-28 h-28 rounded-full border border-dashed border-purple-400/40" />
              <div className="arvex-3d-float relative z-10 w-20 h-20 rounded-2xl border border-purple-300/40 bg-[#17132a]/90 shadow-[0_20px_45px_rgba(124,58,237,.35),inset_0_0_25px_rgba(168,85,247,.12)] flex items-center justify-center">
                <div className="absolute inset-2 rounded-xl border border-purple-400/20" />
                <Cpu className="w-10 h-10 text-purple-300" />
                <span className="absolute -bottom-5 text-[8px] tracking-[.25em] uppercase text-purple-300/80 whitespace-nowrap">3D Performance Core</span>
              </div>
              <div className="arvex-orbit absolute w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_15px_rgba(216,180,254,.9)]" />
              <div className="arvex-orbit-reverse absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_white]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">Latest Ryzen Hardware</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Powered by AMD Ryzen processors for maximum single-thread performance — the most important metric for Minecraft servers and multiplayer game tick rates.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-purple-300"><CheckCircle2 className="w-3.5 h-3.5" /> 20.0 TPS Guarantee</span>
            <span className="flex items-center gap-1 text-purple-300"><CheckCircle2 className="w-3.5 h-3.5" /> PCIe 5.0 NVMe SSDs</span>
          </div>
        </div>

        {/* Card 2: 100+ Games Supported */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all" />

          <div>
            <div className="arvex-3d-stage h-36 w-full rounded-2xl bg-gradient-to-br from-[#191d33] via-[#111426] to-[#0b0d18] border border-white/10 mb-6 relative overflow-hidden flex items-center justify-center">
              <div className="arvex-scan absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-purple-400/10 to-transparent pointer-events-none" />
              <div className="arvex-3d-float relative z-10 w-20 h-20 rounded-3xl border border-indigo-300/30 bg-[#14172a]/95 shadow-[0_20px_50px_rgba(79,70,229,.3),inset_0_0_30px_rgba(99,102,241,.10)] flex items-center justify-center">
                <div className="absolute inset-2 rounded-2xl border border-indigo-400/20" />
                <Gamepad2 className="w-9 h-9 text-indigo-300" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-300/30 flex items-center justify-center shadow-lg"><Server className="w-4 h-4 text-purple-200" /></div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-300/25 flex items-center justify-center shadow-lg"><Zap className="w-4 h-4 text-cyan-200" /></div>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-pulse [animation-delay:200ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse [animation-delay:400ms]" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">100+ Games Supported</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From Minecraft to Valheim, ARK, Rust, and Discord bots, spin up a server for any of your favourite games in seconds with our automated 1-click egg installers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-indigo-300"><CheckCircle2 className="w-3.5 h-3.5" /> Instant 30-sec Provisioning</span>
            <span className="flex items-center gap-1 text-indigo-300"><CheckCircle2 className="w-3.5 h-3.5" /> Modpack Auto-Installer</span>
          </div>
        </div>

        {/* Card 3: 24/7 Support */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-600/20 transition-all" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6"><Headphones className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">24/7 Real Human Support</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Our team is always online and ready to help. Whether it&apos;s a plugin configuration error, BungeeCord setup, or Sri Lankan bank transfer validation, get fast assistance in Sinhala, Tamil, or English.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400"><Clock className="w-3.5 h-3.5" /> &lt; 10 Min Average Response</span>
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Discord &amp; Ticket Help</span>
          </div>
        </div>

        {/* Card 4: DDoS Protection */}
        <div className="bg-[#111320] border border-white/10 hover:border-purple-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-600/20 transition-all" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6"><ShieldCheck className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">Always-ON DDoS Protection</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Our Always-ON 3.2 Tbps DDoS mitigation scrubs volumetric UDP floods, Minecraft handshake attacks, and Layer 7 botnets in under 1 second so your players never experience disconnects.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> 3.2+ Tbps Scrubbing</span>
            <span className="flex items-center gap-1 text-cyan-400"><CheckCircle2 className="w-3.5 h-3.5" /> Zero False-Positives</span>
          </div>
        </div>
      </div>
    </section>
  );
};
