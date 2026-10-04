import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  HardDrive,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClientServer {
  id: number;
  identifier: string;
  name: string;
  suspended: boolean;
  installed: boolean;
  limits: {
    memoryMb: number;
    diskMb: number;
    cpu: number;
  };
  allocation: {
    ip: string;
    alias: string | null;
    port: number;
  } | null;
  node: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface DashboardPayload {
  configured: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    provider?: string;
    emailVerified?: boolean;
  };
  servers: ClientServer[];
  panelUrl: string | null;
}

export const DashboardPage: React.FC = () => {
  const {
    navigateTo,
    setIsAuthModalOpen,
    setAuthModalTab,
    showNotification,
  } = useApp();

  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/client/dashboard', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setData(null);
        setError('Your secure session has expired. Please sign in again.');
        return;
      }

      if (!response.ok) {
        throw new Error(String(payload?.error || 'Unable to load your dashboard.'));
      }

      setData(payload as DashboardPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      showNotification('Could not copy the address.', 'error');
    }
  };

  const openLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-sm text-slate-400">Loading your secure client area…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.30),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_40%)]" />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                <LockKeyhole className="h-3.5 w-3.5" />
                Secure Client Area
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                Your infrastructure,
                <span className="block text-indigo-300">under your control.</span>
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-400">{error}</p>
              <button
                onClick={openLogin}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Sign in securely
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const servers = data.servers || [];
  const totalMemory = servers.reduce((sum, server) => sum + server.limits.memoryMb, 0);
  const totalDisk = servers.reduce((sum, server) => sum + server.limits.diskMb, 0);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(99,102,241,0.35),_transparent_32%),radial-gradient(circle_at_85%_10%,_rgba(168,85,247,0.25),_transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigateTo('home')} className="text-sm text-slate-400 transition hover:text-white">
              HelzerX Cloud
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {data.panelUrl && (
                <a
                  href={data.panelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Panel
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-14 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Authenticated client session
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Welcome, {data.user.name.split(' ')[0] || 'Customer'}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              One place for your HelzerX services, infrastructure allocations and account access.
              This dashboard displays only data returned for your authenticated account.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Active services', value: servers.length, icon: Server },
            { label: 'Allocated memory', value: totalMemory ? `${(totalMemory / 1024).toFixed(1)} GB` : '—', icon: Activity },
            { label: 'Allocated storage', value: totalDisk ? `${(totalDisk / 1024).toFixed(1)} GB` : '—', icon: HardDrive },
            { label: 'Account security', value: data.user.emailVerified ? 'Verified' : 'Review', icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
                <Icon className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="mt-4 text-2xl font-black text-slate-950">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Infrastructure</p>
              <h2 className="mt-1 text-2xl font-black">Your services</h2>
            </div>
            <button
              onClick={() => navigateTo('services-minecraft')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              <ShoppingCart className="h-4 w-4" />
              Order a service
            </button>
          </div>

          <div className="p-6">
            {!data.configured ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Globe2 className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-4 text-lg font-bold">Control plane is being connected</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  No placeholder servers are shown. Once the Pterodactyl integration is configured on the server,
                  your real services will appear here automatically.
                </p>
              </div>
            ) : servers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Server className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-4 text-lg font-bold">No active services</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  There are no Pterodactyl services assigned to this account. We will never display demo or fake
                  infrastructure here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {servers.map((server) => {
                  const address = server.allocation
                    ? `${server.allocation.alias || server.allocation.ip}:${server.allocation.port}`
                    : null;
                  const state = server.suspended
                    ? 'Suspended'
                    : server.installed
                    ? 'Provisioned'
                    : 'Installing';

                  return (
                    <article key={server.identifier} className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-300 hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${server.suspended ? 'bg-rose-500' : server.installed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <h3 className="truncate text-base font-bold">{server.name}</h3>
                          </div>
                          <p className="mt-1 font-mono text-[11px] text-slate-400">{server.identifier}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                          {state}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <span className="text-slate-500">Memory</span>
                          <strong className="mt-1 block text-slate-900">{server.limits.memoryMb ? `${(server.limits.memoryMb / 1024).toFixed(1)} GB` : '—'}</strong>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <span className="text-slate-500">Storage</span>
                          <strong className="mt-1 block text-slate-900">{server.limits.diskMb ? `${(server.limits.diskMb / 1024).toFixed(1)} GB` : '—'}</strong>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <span className="text-slate-500">CPU allocation</span>
                          <strong className="mt-1 block text-slate-900">{server.limits.cpu ? `${server.limits.cpu}%` : '—'}</strong>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <span className="text-slate-500">Node</span>
                          <strong className="mt-1 block truncate text-slate-900">{server.node || '—'}</strong>
                        </div>
                      </div>

                      {address && (
                        <button
                          onClick={() => void copy(address)}
                          className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-indigo-300"
                        >
                          <span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary address</span>
                            <span className="mt-1 block font-mono text-xs font-semibold text-slate-800">{address}</span>
                          </span>
                          {copied === address ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </button>
                      )}

                      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{server.createdAt ? new Date(server.createdAt).toLocaleDateString() : 'Date unavailable'}</span>
                        <span>Server data from Pterodactyl</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Security', text: 'Secrets stay server-side. Dashboard responses contain only account-scoped data.', icon: LockKeyhole },
            { title: 'Real infrastructure', text: 'No generated IPs, fake telemetry, fake console output or demo servers are rendered.', icon: Server },
            { title: 'Need a service?', text: 'Use the hosting catalog to place a real order and provision infrastructure.', icon: ShoppingCart },
          ].map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <Icon className="h-5 w-5 text-indigo-600" />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
