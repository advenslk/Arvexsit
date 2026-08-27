import React, { useState } from 'react';
import { Globe, Radio, Activity, CheckCircle2, Zap } from 'lucide-react';

interface NodeLocation {
  id: string;
  country: string;
  flag: string;
  city: string;
  hardware: string;
  ping: number;
  status: 'online' | 'coming_soon';
  coords: { x: number; y: number }; // percentage on map
}

export const OurLocationsMapSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('sg');

  const locations: NodeLocation[] = [
    {
      id: 'lk',
      country: 'Sri Lanka',
      flag: '🇱🇰',
      city: 'Colombo Edge',
      hardware: 'AMD Ryzen 9 7950X',
      ping: 14,
      status: 'online',
      coords: { x: 72, y: 58 },
    },
    {
      id: 'sg',
      country: 'Singapore',
      flag: '🇸🇬',
      city: 'Singapore Central',
      hardware: 'AMD Ryzen 9 9950X',
      ping: 18,
      status: 'online',
      coords: { x: 78, y: 62 },
    },
    {
      id: 'in',
      country: 'India',
      flag: '🇮🇳',
      city: 'Mumbai',
      hardware: 'AMD EPYC 7R13',
      ping: 35,
      status: 'coming_soon',
      coords: { x: 68, y: 52 },
    },
    {
      id: 'us',
      country: 'United States',
      flag: '🇺🇸',
      city: 'Dallas / US Central',
      hardware: 'AMD EPYC 9R14',
      ping: 156,
      status: 'online',
      coords: { x: 24, y: 42 },
    },
    {
      id: 'de',
      country: 'Germany',
      flag: '🇩🇪',
      city: 'Frankfurt DC',
      hardware: 'AMD Ryzen 9 7950X3D',
      ping: 130,
      status: 'online',
      coords: { x: 50, y: 35 },
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Header matching Screenshot 4 */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl mb-3">
          <span>🇱🇰</span>
          <span>🇮🇳</span>
          <span>🇸🇬</span>
          <span>🇺🇸</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-3">
          OUR LOCATIONS
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Strategically placed servers so you always connect to the fastest node near you.
        </p>
      </div>

      {/* Interactive Map & Nodes Card */}
      <div className="bg-[#0e101d] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* World Map Grid Outline SVG */}
        <div className="relative w-full h-80 sm:h-[420px] rounded-2xl bg-[#090b14] border border-white/5 overflow-hidden flex items-center justify-center">
          {/* Subtle World Map SVG Silhouette */}
          <svg
            className="w-full h-full opacity-20 text-slate-400 object-cover"
            viewBox="0 0 1000 500"
            fill="currentColor"
          >
            {/* Americas */}
            <path d="M150,120 Q190,100 230,130 Q270,160 250,220 Q230,260 260,320 Q280,380 250,440 Q220,400 200,320 Q170,250 140,200 Z" />
            {/* Europe */}
            <path d="M470,100 Q530,90 550,140 Q540,190 490,190 Q460,170 470,100 Z" />
            {/* Africa */}
            <path d="M480,210 Q540,200 560,260 Q570,340 520,420 Q480,380 470,300 Q460,240 480,210 Z" />
            {/* Asia */}
            <path d="M580,90 Q720,80 840,140 Q880,220 800,280 Q720,260 670,220 Q610,200 580,90 Z" />
            {/* Australia */}
            <path d="M800,350 Q880,340 890,400 Q860,450 810,430 Q780,390 800,350 Z" />
          </svg>

          {/* Interactive Node Pins matching Screenshot 4 */}
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setActiveNode(loc.id)}
              style={{ top: `${loc.coords.y}%`, left: `${loc.coords.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              {/* Pin Bubble */}
              <div
                className={`relative px-3 py-1.5 rounded-xl border flex items-center gap-2 shadow-2xl transition-all ${
                  activeNode === loc.id
                    ? 'bg-purple-950/95 border-purple-400 text-white scale-110 shadow-purple-500/30'
                    : 'bg-[#121422]/90 border-white/10 hover:border-purple-500/50 text-slate-300'
                }`}
              >
                {/* Ping Pulse */}
                {loc.status === 'online' ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}

                <span className="text-xs">{loc.flag}</span>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold leading-none">{loc.city}</span>
                  <span className="text-[9px] text-purple-300 font-mono mt-0.5">
                    {loc.status === 'online' ? `${loc.ping} ms` : 'Coming Soon'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nodes Grid Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveNode(loc.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeNode === loc.id
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40'
                  : 'bg-[#121422] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{loc.flag}</span>
                {loc.status === 'online' ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {loc.ping}ms
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white mt-1">{loc.city}</h4>
              <p className="text-[10px] text-slate-400 font-mono truncate">{loc.hardware}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
