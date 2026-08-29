import React, { useState } from 'react';
import { Activity, CheckCircle2, Globe2, Radio, Zap } from 'lucide-react';

interface NodeLocation {
  id: string;
  country: string;
  flag: string;
  city: string;
  hardware: string;
  ping: number;
  status: 'online' | 'coming_soon';
  x: number;
  y: number;
}

const locations: NodeLocation[] = [
  { id: 'lk', country: 'Sri Lanka', flag: '🇱🇰', city: 'Colombo Edge', hardware: 'AMD Ryzen 9 7950X', ping: 14, status: 'online', x: 72, y: 55 },
  { id: 'sg', country: 'Singapore', flag: '🇸🇬', city: 'Singapore Central', hardware: 'AMD Ryzen 9 9950X', ping: 18, status: 'online', x: 78, y: 60 },
  { id: 'in', country: 'India', flag: '🇮🇳', city: 'Mumbai', hardware: 'AMD EPYC 7R13', ping: 35, status: 'coming_soon', x: 68, y: 49 },
  { id: 'us', country: 'United States', flag: '🇺🇸', city: 'Dallas / US Central', hardware: 'AMD EPYC 9R14', ping: 156, status: 'online', x: 23, y: 42 },
  { id: 'de', country: 'Germany', flag: '🇩🇪', city: 'Frankfurt DC', hardware: 'AMD Ryzen 9 7950X3D', ping: 130, status: 'online', x: 49, y: 34 },
];

const routes = [
  'M23 42 C34 35 40 34 49 34',
  'M49 34 C57 35 62 42 68 49',
  'M68 49 C72 52 75 56 78 60',
  'M23 42 C40 51 58 56 78 60',
  'M49 34 C57 42 65 48 72 55',
];

export const OurLocationsMapSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('sg');

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-2xl sm:text-3xl"><span>🇱🇰</span><span>🇮🇳</span><span>🇸🇬</span><span>🇺🇸</span></div>
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-950/30 px-4 py-2 text-[10px] font-black uppercase tracking-[.24em] text-purple-200 shadow-[0_0_35px_rgba(168,85,247,.12)]">
          <Globe2 className="h-3.5 w-3.5" /> Global infrastructure
        </div>
        <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">Our Locations</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">Strategically placed servers with low-latency routes, live node health and premium hardware.</p>
      </div>

      <div className="arvex-3d-card relative overflow-hidden rounded-[30px] border border-white/10 bg-[#070a14]/90 p-3 shadow-[0_35px_120px_rgba(0,0,0,.65)] backdrop-blur-2xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,.16),transparent_42%)]" />
        <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-white/10 bg-[#040711] sm:h-[480px]">
          {/* Tech world map: dark continents + latitude/longitude grid + animated network routes. */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none" aria-label="ArveX global network map">
            <defs>
              <pattern id="latlon" width="8" height="7" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 7" fill="none" stroke="rgba(148,163,184,.10)" strokeWidth=".12" />
              </pattern>
              <linearGradient id="routeGlow" x1="0" x2="1">
                <stop offset="0" stopColor="#22c55e" stopOpacity=".1" />
                <stop offset=".5" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="1" stopColor="#22d3ee" stopOpacity=".25" />
              </linearGradient>
              <filter id="softGlow"><feGaussianBlur stdDeviation=".65" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <rect width="100" height="70" fill="url(#latlon)" />
            <path d="M3 17 C8 10 17 8 23 13 L28 22 25 30 28 38 24 49 20 58 16 51 15 43 10 38 8 30 4 27Z" fill="#111827" stroke="#334155" strokeWidth=".35" />
            <path d="M41 18 L46 15 51 17 54 21 51 25 46 24 43 28 39 24Z" fill="#111827" stroke="#334155" strokeWidth=".35" />
            <path d="M44 28 C49 26 54 29 55 35 L53 44 48 54 44 50 43 42 40 35Z" fill="#111827" stroke="#334155" strokeWidth=".35" />
            <path d="M53 17 C61 11 73 10 85 16 L94 25 90 31 82 32 77 28 70 30 64 25 57 24Z" fill="#111827" stroke="#334155" strokeWidth=".35" />
            <path d="M75 48 C81 45 88 47 91 52 L88 58 81 59 75 55Z" fill="#111827" stroke="#334155" strokeWidth=".35" />
            {routes.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="url(#routeGlow)" strokeWidth=".28" strokeDasharray="1.4 1.1" filter="url(#softGlow)" className="arvex-map-route" style={{ animationDelay: `${i * .45}s` }} />
            ))}
          </svg>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(2,4,12,.55)_100%)]" />

          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveNode(loc.id)}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              className={`arvex-map-node absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left backdrop-blur-xl transition-all ${activeNode === loc.id ? 'scale-110 border-purple-400/80 bg-purple-950/85 shadow-[0_0_45px_rgba(168,85,247,.48)]' : 'border-white/10 bg-[#0b1020]/90 hover:border-purple-400/50'}`}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className={`h-2 w-2 rounded-full ${loc.status === 'online' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.9)]' : 'bg-amber-400'}`} />
                <span className="text-[11px] font-bold text-white">{loc.flag} {loc.city}</span>
              </span>
              <span className="mt-1 block pl-4 font-mono text-[9px] text-purple-200">{loc.status === 'online' ? `${loc.ping} ms` : 'Coming Soon'}</span>
            </button>
          ))}

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-slate-400 backdrop-blur-xl">
            <Radio className="h-3.5 w-3.5 text-emerald-400" /> Live network telemetry
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-purple-400/20 bg-black/35 px-3 py-2 text-[9px] font-bold text-purple-200 backdrop-blur-xl">
            <Zap className="h-3.5 w-3.5" /> Encrypted backbone
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {locations.map((loc) => (
            <button key={loc.id} type="button" onClick={() => setActiveNode(loc.id)} className={`arvex-3d-button arvex-3d-button-dark rounded-2xl border p-4 text-left ${activeNode === loc.id ? 'border-purple-500/60 bg-purple-950/40' : 'border-white/5 bg-[#0b0f1b]'}`}>
              <div className="mb-2 flex items-center justify-between"><span>{loc.flag}</span><span className={`text-[9px] font-bold ${loc.status === 'online' ? 'text-emerald-300' : 'text-amber-300'}`}>{loc.status === 'online' ? `${loc.ping}ms` : 'Soon'}</span></div>
              <h4 className="text-xs font-bold text-white">{loc.city}</h4>
              <p className="mt-1 truncate font-mono text-[9px] text-slate-500">{loc.hardware}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[9px] font-bold uppercase tracking-[.16em] text-slate-500">
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Nodes online</span>
          <span className="inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-purple-400" /> Live routing</span>
          <span className="inline-flex items-center gap-2"><Radio className="h-3.5 w-3.5 text-cyan-400" /> DDoS protected</span>
        </div>
      </div>
    </section>
  );
};