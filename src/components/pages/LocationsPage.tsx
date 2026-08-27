import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, CheckCircle2, ChevronRight, Globe2, Server, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-slate-400"><button onClick={() => navigateTo('home')} className="hover:text-white">Home</button><ChevronRight className="h-3.5 w-3.5 text-slate-600" /><span className="font-semibold text-purple-300">Global Network</span></nav>

      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300"><Globe2 className="h-3.5 w-3.5" />Global low-latency network</div>
        <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">OUR LOCATIONS</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Strategically placed infrastructure across major regions so your players connect to the nearest available edge.</p>
      </div>

      <section className="relative mb-16 overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0e17] p-5 shadow-2xl shadow-black/30 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,.14),transparent_45%)]" />
        <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-[24px] border border-white/5 bg-[#070910]">
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_38%_30%,rgba(139,92,246,.16),rgba(10,13,22,.95)_58%)] shadow-[inset_-35px_-20px_70px_rgba(0,0,0,.75),0_0_80px_rgba(124,58,237,.08)] sm:w-[40%]" />
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/10 animate-[spin_28s_linear_infinite]" />
          <div className="absolute left-1/2 top-1/2 h-[82%] w-[31%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/10 animate-[spin_20s_linear_infinite_reverse]" />
          {MAP_POINTS.map((point) => {
            const active = selectedKey === point.key;
            return <button key={point.key} onClick={() => setSelectedKey(point.key)} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: point.x, top: point.y }}>
              <span className={`relative block h-3 w-3 rounded-full ${active ? 'bg-purple-200 shadow-[0_0_24px_8px_rgba(168,85,247,.45)]' : 'bg-indigo-300 shadow-[0_0_15px_4px_rgba(129,140,248,.3)]'}`}><span className="absolute inset-[-7px] animate-ping rounded-full border border-purple-300/30" /></span>
              <span className={`mt-2 hidden whitespace-nowrap rounded-xl border px-2.5 py-1.5 text-[9px] backdrop-blur-md sm:block ${active ? 'border-purple-400/30 bg-purple-600/30 text-white' : 'border-white/10 bg-black/40 text-slate-400'}`}>{point.flag} {point.label}<br /><span className="text-[8px] text-slate-500">{point.latency}</span></span>
            </button>;
          })}
          <div className="absolute inset-x-5 bottom-4 flex justify-between text-[8px] uppercase tracking-[.18em] text-slate-700"><span>Americas</span><span>Europe</span><span>Asia</span></div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">{MAP_POINTS.map((point) => <button key={point.key} onClick={() => setSelectedKey(point.key)} className={`rounded-2xl border p-3 text-left transition ${selectedKey === point.key ? 'border-purple-400/30 bg-purple-500/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-white">{point.flag} {point.label}</span><span className="text-[10px] text-emerald-400">{point.latency}</span></div><p className="mt-1 text-[9px] text-slate-500">{point.country} · protected edge</p></button>)}</div>
      </section>

      <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-purple-300">Infrastructure</p><h2 className="mt-2 font-display text-2xl font-black text-white">Choose your nearest region</h2></div><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><ShieldCheck className="h-4 w-4 text-purple-400" />3.2 Tbps DDoS edge</div></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {availableLocations.map((loc) => {
          const point = MAP_POINTS.find((p) => loc.city.toLowerCase().includes(p.label.split(' ')[0].toLowerCase())) || MAP_POINTS[0];
          const ping = pingResults[loc.id]; const testing = testingId === loc.id;
          return <article key={loc.id} className={`rounded-3xl border bg-[#0e111b] p-5 transition ${selectedKey === point.key ? 'border-purple-400/30 shadow-xl shadow-purple-900/10' : 'border-white/5 hover:border-white/10'}`}>
            <div className="flex items-center justify-between"><span className="text-2xl">{loc.flag || point.flag}</span><span className="rounded-lg border border-purple-400/15 bg-purple-500/10 px-2 py-1 font-mono text-[9px] font-bold text-purple-300">{loc.code || point.label.toUpperCase()}</span></div>
            <h3 className="mt-4 font-display text-lg font-black text-white">{loc.city}, {loc.country}</h3>
            <p className="mt-1 text-xs text-slate-500">{loc.dcName || 'Enterprise carrier-neutral facility'}</p>
            <div className="my-4 space-y-2 border-y border-white/5 py-4 text-xs"><div className="flex justify-between"><span className="text-slate-500">DDoS protection</span><span className="font-semibold text-white">3.2 Tbps</span></div><div className="flex justify-between"><span className="text-slate-500">Network</span><span className="font-semibold text-white">10 Gbps</span></div><div className="flex justify-between"><span className="text-slate-500">Hardware</span><span className="font-semibold text-white">Ryzen / EPYC</span></div></div>
            <div className="mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.025] p-3"><span className="flex items-center gap-2 text-[11px] text-slate-500"><Activity className="h-3.5 w-3.5 text-purple-400" />Browser latency</span><span className="font-mono text-xs font-bold text-emerald-400">{testing ? 'Testing…' : ping ? `${ping} ms` : loc.latency}</span></div>
            <div className="grid grid-cols-2 gap-2"><button disabled={testing} onClick={() => runPingTest(loc.id, Number.parseInt(String(loc.latency).replace(/\D/g,'')) || 60)} className="rounded-xl bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10">Test Ping</button><button onClick={() => navigateTo('pricing')} className="rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-500"><Zap className="mr-1 inline h-3.5 w-3.5" />Deploy</button></div>
          </article>;
        })}
      </div>
      {availableLocations.length === 0 && <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-500"><CheckCircle2 className="mx-auto mb-3 h-6 w-6 text-emerald-400" />No regional nodes are currently configured.</div>}
    </div>
  );
};
