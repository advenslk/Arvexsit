import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Server,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  Terminal,
} from 'lucide-react';
import { Location } from '../../types';

export const LocationsPage: React.FC = () => {
  const { locations, navigateTo } = useApp();
  const [selectedLoc, setSelectedLoc] = useState<Location>(locations[0]);
  const [pingResults, setPingResults] = useState<{ [id: string]: number }>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const runPingTest = (locId: string) => {
    setTestingId(locId);
    setTimeout(() => {
      // Generate realistic ping based on location
      const randomOffset = Math.floor(Math.random() * 8) - 4;
      const baseMap: { [id: string]: number } = {
        'loc-sg': 32,
        'loc-de': 118,
        'loc-us': 165,
        'loc-lk': 14,
        'loc-au': 88,
      };
      const base = baseMap[locId] || 65;
      setPingResults((prev) => ({ ...prev, [locId]: Math.max(5, base + randomOffset) }));
      setTestingId(null);
    }, 450);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Global Datacenters &amp; Anycast Points of Presence</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>Low-Latency Global Edge</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          World-Class Datacenter Locations
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Deploy your game nodes and VPS instances in Tier-3 enterprise facilities with 3.2 Tbps Corero DDoS protection, dual redundant 10Gbps uplinks, and BGP Anycast routing.
        </p>
      </div>

      {/* Datacenter Grid with Ping Tester */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {locations.map((loc) => {
          const livePing = pingResults[loc.id];
          const isTesting = testingId === loc.id;

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className={`bg-[#11131e] border rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                selectedLoc?.id === loc.id
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{loc.flag}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                    {loc.code || loc.id.replace('loc-', '').toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-1">
                  {loc.city}, {loc.country}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {loc.dcName || 'Equinix Tier-3 Carrier Neutral Facility'}
                </p>

                <div className="space-y-2 py-3 border-t border-b border-white/5 mb-4 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">DDoS Scrubbing</span>
                    <span className="font-semibold text-white">3.2 Tbps Filter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Uplink</span>
                    <span className="font-semibold text-white">10 Gbps Redundant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hardware Fleet</span>
                    <span className="font-semibold text-white">Ryzen 9 7950X3D</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Live Ping Box */}
                <div className="bg-[#161926] p-3 rounded-xl border border-white/5 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-400">Ping to Browser:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {isTesting ? 'Measuring...' : livePing ? `${livePing} ms` : loc.latency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      runPingTest(loc.id);
                    }}
                    disabled={isTesting}
                    className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                  >
                    Test Ping
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('pricing');
                    }}
                    className="py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all"
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
  );
};
