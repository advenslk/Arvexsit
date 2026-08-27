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
} from 'lucide-react';

export const StatusPage: React.FC = () => {
  const { statusComponents, statusIncidents, navigateTo } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Degraded Performance
          </span>
        );
      case 'outage':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Major Outage
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            Scheduled Maintenance
          </span>
        );
      default:
        return (
          <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  const allOperational = statusComponents.every((c) => c.status === 'operational');

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Infrastructure Systems Status</span>
      </nav>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-Time Node Telemetry</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          ArveX Systems Status
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          Live monitoring of global game clusters, VPS hypervisors, API gateways, and Anycast network routes.
        </p>

        {/* Global Status Pill */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between max-w-xl mx-auto ${
            allOperational
              ? 'bg-[#0f172a]/90 border-emerald-500/30 text-emerald-300 shadow-xl shadow-emerald-500/5'
              : 'bg-[#1e131d] border-amber-500/30 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3 text-left">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                allOperational ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <div>
              <p className="text-sm font-bold text-white">
                {allOperational ? 'All Systems Fully Operational' : 'Some Systems Experiencing Anomalies'}
              </p>
              <p className="text-xs text-slate-400">Zero active service disruptions detected</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded">
            99.99% SLA
          </span>
        </div>
      </div>

      {/* Component Services List */}
      <div className="max-w-4xl mx-auto bg-[#11131e] border border-white/5 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl">
        <h2 className="text-lg font-bold text-white font-display mb-6">
          Global System Components
        </h2>

        {statusComponents.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No status components configured.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {statusComponents.map((comp) => (
              <div key={comp.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{comp.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{comp.description}</p>
                </div>
                <div>{getStatusBadge(comp.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incidents & Maintenance Timeline */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Recent Incidents &amp; Maintenance Notices
        </h2>

        {statusIncidents.length === 0 ? (
          <div className="bg-[#11131e] border border-white/5 rounded-2xl p-8 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white mb-1">No incidents reported in the past 90 days</p>
            <p className="text-xs">All network routes and host nodes are running optimally.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {statusIncidents.map((inc) => (
              <div key={inc.id} className="bg-[#11131e] border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">#{inc.id}</span>
                    <h3 className="text-base font-bold text-white">{inc.title}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start sm:self-auto ${
                      inc.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{inc.message}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-white/5">
                  <span>Impact: <strong className="text-slate-400 capitalize">{inc.impact}</strong></span>
                  <span>Reported: {new Date(inc.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
