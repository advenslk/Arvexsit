import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  RotateCw,
  Zap,
  ShieldCheck,
  Gauge,
  Headphones,
  Cpu,
  Globe2,
  Signal,
  Sparkles,
} from 'lucide-react';

export const ServerLocationsSection: React.FC = () => {
  const { locations } = useApp();
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]?.id || 'loc-us');
  const [isPinging, setIsPinging] = useState(false);
  const [pings, setPings] = useState<Record<string, number>>({
    'loc-us': 18,
    'loc-de': 24,
    'loc-sg': 38,
    'loc-au': 44,
    'loc-uk': 22,
  });

  const handleRefreshPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPings({
        'loc-us': Math.floor(Math.random() * 8 + 14),
        'loc-de': Math.floor(Math.random() * 8 + 20),
        'loc-sg': Math.floor(Math.random() * 10 + 34),
        'loc-au': Math.floor(Math.random() * 12 + 40),
        'loc-uk': Math.floor(Math.random() * 6 + 19),
      });
      setIsPinging(false);
    }, 600);
  };

  return (
    <section id="locations" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Map Pin Header with Lines and Refresh Button matching Screenshot 3 & 5 */}
      <div className="relative flex items-center justify-center gap-4 mb-4">
        <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-white/20" />
        <div className="w-10 h-10 rounded-xl bg-[#131622] border border-white/10 flex items-center justify-center text-slate-300 shadow-lg">
          <MapPin className="w-5 h-5 text-slate-300" />
        </div>
        <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-white/20" />

        {/* Live Ping Refresh button on the right */}
        <button
          onClick={handleRefreshPing}
          disabled={isPinging}
          className="absolute right-0 p-2 rounded-xl bg-[#131622] border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all"
          title="Test network latency"
        >
          <RotateCw className={`w-4 h-4 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-3">
          Global Server Locations
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Strategically placed servers worldwide for minimal latency and maximum performance.
        </p>
      </div>

      {/* Interactive Dotted World Map matching Screenshot 3 & 5 */}
      <div className="relative mb-16 rounded-3xl bg-[#0b0d14] border border-white/10 p-6 sm:p-10 shadow-2xl min-h-[380px] sm:min-h-[460px] overflow-hidden flex items-center justify-center">
        {/* World Map Dotted Matrix Vector SVG */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <svg
            className="w-full h-full object-contain"
            viewBox="0 0 1000 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* North America */}
            <circle cx="200" cy="150" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="230" cy="170" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="260" cy="180" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="210" cy="200" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="250" cy="210" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="280" cy="190" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="180" cy="160" r="2.5" fill="#ffffff" opacity="0.5" />
            <circle cx="240" cy="140" r="2.5" fill="#ffffff" opacity="0.5" />

            {/* Europe */}
            <circle cx="500" cy="140" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="520" cy="160" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="490" cy="170" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="530" cy="180" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="550" cy="150" r="2.5" fill="#ffffff" opacity="0.5" />

            {/* Asia & Singapore */}
            <circle cx="700" cy="180" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="740" cy="220" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="770" cy="290" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="800" cy="240" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="730" cy="270" r="2.5" fill="#ffffff" opacity="0.5" />

            {/* Australia */}
            <circle cx="850" cy="380" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="870" cy="390" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="830" cy="410" r="3" fill="#ffffff" opacity="0.8" />

            {/* Decorative dot matrix grid */}
            {Array.from({ length: 45 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 22) % 950 + 30}
                cy={((i * 17) % 440) + 30}
                r="1.5"
                fill="#38bdf8"
                opacity="0.3"
              />
            ))}
          </svg>
        </div>

        {/* Pulsing Beacon Tags on the map matching Screenshot 3 & 5 */}
        <div className="relative z-10 w-full h-full min-h-[300px] flex flex-wrap items-center justify-around gap-6 p-4">
          {locations.map((loc) => {
            const isSelected = selectedLocation === loc.id;
            const currentPing = pings[loc.id] || loc.pingMs;

            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`group cursor-pointer rounded-2xl p-2.5 sm:p-3 transition-all duration-300 flex items-center gap-3 border shadow-xl ${
                  isSelected
                    ? 'bg-[#181d2c] border-cyan-400/80 shadow-cyan-500/20 scale-105'
                    : 'bg-[#121520]/90 hover:bg-[#181c2b] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Ping Pulse Beacon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <div className="absolute w-6 h-6 rounded-full bg-cyan-400/30 animate-ping" />
                </div>

                {/* Country Flag & Info */}
                <div className="flex items-center gap-2">
                  <span className="text-base">{loc.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{loc.name}</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {currentPing}ms
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{loc.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Feature Boxes below map matching Screenshot 3 & 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Instant Setup */}
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Instant Setup</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get your server up and running in seconds. No complicated configurations.
              </p>
            </div>
          </div>
        </div>

        {/* Box 2: DDoS Protection with Star Accents matching Screenshot 3 & 4 */}
        <div className="relative bg-[#11131a] border border-white/10 rounded-2xl p-5 shadow-lg overflow-hidden group">
          {/* Star Sparkle accents matching screenshot */}
          <span className="absolute top-2 left-2 text-cyan-300 text-xs animate-pulse">✦</span>
          <span className="absolute top-2 right-2 text-white text-xs animate-pulse delay-100">✦</span>
          <span className="absolute bottom-2 left-2 text-slate-400 text-xs animate-pulse delay-200">✦</span>
          <span className="absolute bottom-2 right-2 text-cyan-300 text-xs animate-pulse delay-300">✦</span>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">DDoS Protection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enterprise protection keeps your server online and secure against any attack.
              </p>
            </div>
          </div>
        </div>

        {/* Box 3: 99.9% Uptime */}
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              <Gauge className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">99.9% Uptime</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our redundant infrastructure ensures your server stays online.
              </p>
            </div>
          </div>
        </div>

        {/* Box 4: 24/7 Support */}
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              <Headphones className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">24/7 Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Expert support team available around the clock to help with any issues.
              </p>
            </div>
          </div>
        </div>

        {/* Box 5: Powerful Hardware */}
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Powerful Hardware</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance NVMe SSDs and latest-gen CPUs for lag-free gaming.
              </p>
            </div>
          </div>
        </div>

        {/* Box 6: Global Locations */}
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a1d2b] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              <Globe2 className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Global Locations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multiple data centers worldwide to ensure low latency for all players.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
