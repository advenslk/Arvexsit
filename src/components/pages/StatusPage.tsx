import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronRight,
  Server,
  Globe,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const StatusPage: React.FC = () => {
  const { statusComponents, statusIncidents, navigateTo } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Degraded Performance
          </span>
        );
      case 'outage':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Major Outage
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Scheduled Maintenance
          </span>
        );
      default:
        return (
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  const allOperational = (statusComponents || []).every((c) => c.status === 'operational');

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
            <span className="text-white font-bold">Network &amp; Node Status</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>Real-Time Fleet Heartbeat</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              HelzerX System Status
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Live monitoring of our global Pterodactyl daemon nodes, payment gateways, Anycast routing networks, and API services.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Overall Status Banner Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] -mt-20 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 card-interactive-3d">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              allOperational ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {allOperational ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                {allOperational ? 'All Systems Are Fully Operational' : 'Some Systems Are Experiencing Issues'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatic ping check refreshed every 15 seconds across our 4 global POPs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>99.99% 30-Day SLA</span>
          </div>
        </div>

        {/* Components Status Table */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">Core Infrastructure Components</h3>
              <p className="text-xs text-slate-500 mt-0.5">Physical hardware, game virtualization clusters, and network routers</p>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">{(statusComponents || []).length} Monitored Services</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(statusComponents || []).map((component) => (
              <div key={component.id} className="p-5 sm:px-8 flex items-center justify-between hover:bg-slate-50/60 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{component.name}</h4>
                    <p className="text-[11px] text-slate-400">{component.description || 'Infrastructure cluster'}</p>
                  </div>
                </div>
                <div>{getStatusBadge(component.status)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Incidents History */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 font-display mb-1">Past Incidents &amp; Maintenance Log</h3>
          <p className="text-xs text-slate-500 mb-6">Historical records of scheduled upgrades, node maintenance, and resolution post-mortems.</p>

          <div className="space-y-4">
            {(statusIncidents || []).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No incidents reported in the last 90 days. All systems running smooth.
              </div>
            ) : (
              (statusIncidents || []).map((inc) => (
                <div key={inc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{inc.title}</h4>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      Resolved
                    </span>
                    <span className="text-[11px] text-slate-400">Duration: 8 minutes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
