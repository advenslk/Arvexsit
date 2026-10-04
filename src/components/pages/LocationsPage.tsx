import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, CheckCircle2, ChevronRight, Globe2, Server, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

const MAP_POINTS = [
  { key: 'singapore', label: 'Singapore', country: 'Singapore', flag: '🇸🇬', x: '69%', y: '63%', latency: '18ms' },
  { key: 'mumbai', label: 'Mumbai', country: 'India', flag: '🇮🇳', x: '59%', y: '49%', latency: '42ms' },
  { key: 'frankfurt', label: 'Frankfurt', country: 'Germany', flag: '🇩🇪', x: '47%', y: '32%', latency: '130ms' },
  { key: 'dallas', label: 'Dallas / US Central', country: 'United States', flag: '🇺🇸', x: '20%', y: '42%', latency: '165ms' },
];

export const LocationsPage: React.FC = () => {
  const { locations, navigateTo } = useApp();
  const availableLocations = useMemo(() => locations.filter((loc) => !/sri\s*lanka|colombo/i.test(`${loc.city} ${loc.country}`)), [locations]);
  const [selectedKey, setSelectedKey] = useState('singapore');
  const [pingResults, setPingResults] = useState<Record<string, number>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const runPingTest = (id: string, fallback: number) => {
    setTestingId(id);
    window.setTimeout(() => {
      setPingResults((prev) => ({ ...prev, [id]: Math.max(8, fallback + Math.floor(Math.random() * 9) - 4) }));
      setTestingId(null);
    }, 500);
  };

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Global Network POPs</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Globe2 className="h-3.5 w-3.5 text-cyan-300" />
              <span>Low-Latency Anycast Routing</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Global Datacenter Locations
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Strategically placed cloud nodes with direct Tier-1 carrier cross-connects so your players connect to the closest physical edge.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Interactive Global Network Map Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] -mt-20 relative z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Global Core POPs</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Interactive Latency Map</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 4 Regions Operational • 3.2 Tbps DDoS Scrubbing</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] max-w-5xl mx-auto overflow-hidden rounded-2xl border border-slate-800 bg-[#090e21]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.18),transparent_60%)]" />
            
            {MAP_POINTS.map((point) => {
              const active = selectedKey === point.key;
              return (
                <button
                  key={point.key}
                  onClick={() => setSelectedKey(point.key)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left cursor-pointer transition-transform hover:scale-110"
                  style={{ left: point.x, top: point.y }}
                >
                  <span className={`relative block h-3.5 w-3.5 rounded-full ${
                    active ? 'bg-cyan-300 shadow-[0_0_24px_8px_rgba(56,189,248,0.6)]' : 'bg-blue-400 shadow-[0_0_15px_4px_rgba(96,165,250,0.4)]'
                  }`}>
                    <span className="absolute inset-[-6px] animate-ping rounded-full border border-blue-400/40" />
                  </span>
                  <span className={`mt-2 hidden whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs backdrop-blur-md sm:block font-bold ${
                    active ? 'border-cyan-400/40 bg-blue-600/70 text-white shadow-lg' : 'border-white/10 bg-slate-950/70 text-slate-300'
                  }`}>
                    {point.flag} {point.label} • <span className="text-cyan-300 font-mono">{point.latency}</span>
                  </span>
                </button>
              );
            })}

            <div className="absolute inset-x-5 bottom-4 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Americas (Dallas)</span>
              <span>Europe (Frankfurt)</span>
              <span>Asia (Singapore &amp; Mumbai)</span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MAP_POINTS.map((point) => (
              <button
                key={point.key}
                onClick={() => setSelectedKey(point.key)}
                className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
                  selectedKey === point.key
                    ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{point.flag} {point.label}</span>
                  <span className="text-[11px] font-mono font-bold text-blue-600">{point.latency}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{point.country} • Protected Edge</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Region Cards */}
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Fleet Details</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Choose Your Nearest Server Location
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Corero &amp; Path.net Protected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLocations.map((loc) => {
              const point = MAP_POINTS.find((p) => loc.city.toLowerCase().includes(p.label.split(' ')[0].toLowerCase())) || MAP_POINTS[0];
              const ping = pingResults[loc.id];
              const testing = testingId === loc.id;
              const isSelected = selectedKey === point.key;

              return (
                <div
                  key={loc.id}
                  className={`bg-white border rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all card-interactive-3d flex flex-col justify-between ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-blue-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{loc.flag || point.flag}</span>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 font-display">{loc.city}</h3>
                          <p className="text-xs text-slate-500">{loc.country}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6 space-y-1">
                      <p><strong>Hardware:</strong> AMD Ryzen 9 9950X (5.7 GHz)</p>
                      <p><strong>Network:</strong> 10 Gbps Uplink Per Node</p>
                      <p><strong>DDoS Defense:</strong> 3.2 Tbps L3/L4/L7</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Estimated Ping:</span>
                      <span className="font-mono font-bold text-blue-600">
                        {ping ? `${ping} ms` : testing ? 'Pinging...' : `${loc.pingMs || 25} ms`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => runPingTest(loc.id, loc.pingMs || 25)}
                        disabled={testing}
                        className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                      >
                        {testing ? 'Testing...' : 'Test Latency'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateTo('plans')}
                        className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/25 cursor-pointer"
                      >
                        Deploy Here
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
