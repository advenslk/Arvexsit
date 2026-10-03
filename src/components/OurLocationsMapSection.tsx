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
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-3 shadow-sm">
          <Globe2 className="h-3.5 w-3.5" />
          <span>Global Infrastructure</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Our Server <span className="text-blue-600">Locations</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
          Strategically deployed cloud nodes with low-latency routes, live automated failover, and AMD Ryzen processors.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-6 text-left">
        <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-slate-800 bg-[#090e21] sm:h-[480px]">
          {/* Tech world map: dark continents + latitude/longitude grid + animated network routes. */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 70" preserveAspectRatio="none" aria-label="HelzerX Cloud global network map">
            <defs>
              <pattern id="latlon" width="8" height="7" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 7" fill="none" stroke="rgba(148,163,184,.12)" strokeWidth=".12" />
              </pattern>
              <linearGradient id="routeGlow" x1="0" x2="1">
                <stop offset="0" stopColor="#3b82f6" stopOpacity=".2" />
                <stop offset=".5" stopColor="#60a5fa" stopOpacity="1" />
                <stop offset="1" stopColor="#38bdf8" stopOpacity=".3" />
              </linearGradient>
            </defs>

            <rect width="100" height="70" fill="url(#latlon)" />

            {/* Approximate continent masses */}
            <path d="M12 18 Q16 12 28 15 Q34 22 28 32 Q20 38 15 30 Z" fill="#131d3d" opacity=".8" />
            <path d="M22 36 Q28 34 32 44 Q28 62 23 58 Q18 48 22 36 Z" fill="#131d3d" opacity=".8" />
            <path d="M44 14 Q56 12 58 24 Q52 30 46 28 Q43 22 44 14 Z" fill="#131d3d" opacity=".8" />
            <path d="M45 32 Q58 30 58 48 Q54 62 46 54 Q42 42 45 32 Z" fill="#131d3d" opacity=".8" />
            <path d="M60 12 Q82 10 86 28 Q78 44 68 40 Q62 26 60 12 Z" fill="#131d3d" opacity=".8" />
            <path d="M72 48 Q84 46 86 58 Q80 64 74 60 Z" fill="#131d3d" opacity=".8" />

            {/* Routed connectivity arcs */}
            {routes.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="url(#routeGlow)" strokeWidth=".4" strokeDasharray="1.2 1.2" />
            ))}

            {/* Nodes on map */}
            {locations.map((loc) => {
              const active = activeNode === loc.id;
              return (
                <g key={loc.id} className="cursor-pointer" onClick={() => setActiveNode(loc.id)}>
                  <circle cx={loc.x} cy={loc.y} r={active ? 3.5 : 2} fill={active ? 'rgba(59,130,246,0.35)' : 'rgba(56,189,248,0.2)'} />
                  <circle cx={loc.x} cy={loc.y} r={active ? 1.6 : 1} fill={active ? '#60a5fa' : '#38bdf8'} />
                </g>
              );
            })}
          </svg>

          {/* Active node floating tag */}
          <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-80 rounded-2xl bg-white/95 p-4 backdrop-blur-xl border border-slate-200 shadow-2xl text-slate-900">
            {(() => {
              const current = locations.find((l) => l.id === activeNode) || locations[0];
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 font-display text-sm font-extrabold">
                      <span>{current.flag}</span>
                      <span>{current.city}</span>
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {current.ping}ms Ping
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{current.hardware}</p>
                  <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Dedicated Corero 3.2Tbps DDoS Protection
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom Location Tabs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveNode(loc.id)}
              className={`rounded-2xl p-3 text-left border transition-all ${
                activeNode === loc.id
                  ? 'border-blue-600 bg-blue-50 text-slate-900 shadow-sm'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{loc.flag}</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">{loc.ping}ms</span>
              </div>
              <p className="text-xs font-bold truncate">{loc.city}</p>
              <p className="text-[10px] text-slate-400 truncate">{loc.country}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
