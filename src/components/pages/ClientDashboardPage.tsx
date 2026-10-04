import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  CircleUserRound,
  Cloud,
  Copy,
  Database,
  Download,
  File,
  Folder,
  FolderPlus,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Play,
  RefreshCw,
  RotateCw,
  Save,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Square,
  Terminal,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type ServerInfo = {
  identifier: string;
  uuid: string;
  name: string;
  description: string;
  node: string;
  status: string;
  suspended: boolean;
  installing: boolean;
  transferring: boolean;
  limits: { memory: number; disk: number; cpu: number; swap: number };
  featureLimits: { databases: number; allocations: number; backups: number };
  permissions: string[];
  allocation: { ip: string; alias: string | null; port: number } | null;
  sftp: { ip: string; port: number } | null;
};

type PortalData = {
  connected: boolean;
  panelUrl: string | null;
  user: { id: string; name: string; email: string; emailVerified?: boolean };
  servers: ServerInfo[];
};

type Stats = {
  current_state?: string;
  is_suspended?: boolean;
  resources?: {
    memory_bytes?: number;
    cpu_absolute?: number;
    disk_bytes?: number;
    network_rx_bytes?: number;
    network_tx_bytes?: number;
    uptime?: number;
  };
};

type FileEntry = {
  name: string;
  mode: string;
  size: number;
  is_file: boolean;
  is_symlink?: boolean;
  mimetype?: string;
  modified_at?: string;
};

type Backup = {
  uuid: string;
  name: string;
  bytes: number;
  is_successful: boolean | null;
  is_locked: boolean;
  completed_at: string | null;
  created_at: string;
};

type Database = {
  id: number;
  name: string;
  username: string;
  connection_string: string;
  host?: { address?: string; port?: number };
};

type Tab = 'overview' | 'console' | 'files' | 'backups' | 'databases' | 'activity' | 'settings';

const fmtBytes = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
};

const fmtUptime = (ms: number) => {
  if (!ms) return '—';
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return [days ? `${days}d` : '', hours ? `${hours}h` : '', `${minutes}m`].filter(Boolean).join(' ');
};

const api = async (url: string, init: RequestInit = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    ...init,
    headers: { Accept: 'application/json', ...(init.headers || {}) },
  });
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(String(body?.error || `Request failed (${response.status})`));
  return body;
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-3xl border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.06)] ${className}`}>{children}</div>
);

export const ClientDashboardPage: React.FC = () => {
  const { navigateTo, setAuthModalTab, setIsAuthModalOpen, logout } = useApp();
  const [portal, setPortal] = useState<PortalData | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [connectOpen, setConnectOpen] = useState(false);
  const [clientKey, setClientKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState('');

  const selected = portal?.servers.find((server) => server.identifier === selectedId) || portal?.servers[0] || null;

  const loadPortal = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/client/portal') as PortalData;
      setPortal(data);
      setSelectedId((current) => current && data.servers.some((s) => s.identifier === current) ? current : data.servers[0]?.identifier || '');
    } catch (err) {
      if (err instanceof Error && /Authentication required|Session is no longer valid/.test(err.message)) {
        setAuthModalTab('login');
        setIsAuthModalOpen(true);
      } else {
        setError(err instanceof Error ? err.message : 'Unable to load client dashboard.');
      }
    } finally {
      setLoading(false);
    }
  }, [setAuthModalTab, setIsAuthModalOpen]);

  useEffect(() => { void loadPortal(); }, [loadPortal]);

  const connect = async () => {
    if (!clientKey.trim()) return;
    setBusy('connect');
    setError('');
    try {
      await api('/api/client/pterodactyl/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: clientKey.trim() }),
      });
      setClientKey('');
      setConnectOpen(false);
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect.');
    } finally {
      setBusy('');
    }
  };

  const disconnect = async () => {
    if (!window.confirm('Disconnect the Pterodactyl client key from this HelzerX account?')) return;
    setBusy('disconnect');
    try {
      await api('/api/client/pterodactyl/connect', { method: 'DELETE' });
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disconnect.');
    } finally {
      setBusy('');
    }
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(''), 1500);
    } catch { setError('Copy failed.'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" /><p className="mt-3 text-sm font-semibold text-slate-500">Loading secure client area…</p></div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <Card className="max-w-lg p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h1 className="mt-4 text-2xl font-black">Client area unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error || 'Please sign in again.'}</p>
          <button onClick={() => { setAuthModalTab('login'); setIsAuthModalOpen(true); }} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Sign in</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fd] text-slate-900">
      <section className="relative overflow-hidden bg-[#1b4bd6] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_90%_5%,rgba(124,58,237,0.30),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => navigateTo('home')} className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 hover:text-white"><ArrowLeft className="h-4 w-4" />HelzerX Cloud</button>
            <div className="flex items-center gap-2">
              <button onClick={() => void loadPortal()} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"><RefreshCw className="h-3.5 w-3.5" />Refresh</button>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"><LogOut className="h-3.5 w-3.5" />Sign out</button>
            </div>
          </div>
          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]"><ShieldCheck className="h-3.5 w-3.5" />Private client control plane</div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Welcome back, {portal.user.name.split(' ')[0] || 'Customer'}.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">Real services, live resource usage and real Pterodactyl controls — no demo servers, generated telemetry or mock console output.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        {error && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

        {!portal.connected ? (
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-7 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"><KeyRound className="h-3.5 w-3.5" />Connect live infrastructure</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight">Your Pterodactyl services are ready to connect.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Create a Client API key in your Pterodactyl account and connect it here. The key is encrypted on the HelzerX server and is never sent back to your browser after connection.</p>
                <button onClick={() => setConnectOpen(true)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"><KeyRound className="h-4 w-4" />Connect Pterodactyl</button>
                {portal.panelUrl && <a href={`${portal.panelUrl}/account/api`} target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Open API Keys</a>}
              </div>
              <div className="bg-slate-950 p-7 text-white sm:p-10">
                <Lock className="h-6 w-6 text-blue-300" />
                <h3 className="mt-4 text-lg font-black">Security boundary</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>• Key encrypted at rest with the server secret.</li>
                  <li>• Account email is verified against Pterodactyl before storing.</li>
                  <li>• Browser never receives the Client API key.</li>
                  <li>• API responses are scoped to your authenticated session.</li>
                </ul>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Services', String(portal.servers.length), Server],
                ['Allocated RAM', `${(portal.servers.reduce((n, s) => n + s.limits.memory, 0) / 1024).toFixed(1)} GB`, Activity],
                ['Storage', `${(portal.servers.reduce((n, s) => n + s.limits.disk, 0) / 1024).toFixed(1)} GB`, HardDrive],
                ['Account', portal.user.emailVerified ? 'Verified' : 'Review', ShieldCheck],
              ].map(([label, value, Icon]: any) => (
                <Card key={String(label)} className="p-5">
                  <div className="flex items-center justify-between"><span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</span><Icon className="h-4 w-4 text-blue-600" /></div>
                  <div className="mt-3 text-2xl font-black">{value}</div>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
              <Card className="h-fit p-3">
                <div className="px-3 pb-3 pt-2"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">Infrastructure</p><p className="mt-1 text-sm font-black">{portal.servers.length} service{portal.servers.length === 1 ? '' : 's'}</p></div>
                {portal.servers.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-5 text-center"><Cloud className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-xs font-bold text-slate-500">No active services</p></div>
                ) : portal.servers.map((server) => (
                  <button key={server.identifier} onClick={() => { setSelectedId(server.identifier); setTab('overview'); }} className={`mb-2 w-full rounded-2xl border p-3 text-left transition ${selected?.identifier === server.identifier ? 'border-blue-300 bg-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${server.suspended ? 'bg-rose-500' : server.installing ? 'bg-amber-500' : 'bg-emerald-500'}`} /><span className="truncate text-xs font-black">{server.name}</span></div>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">{server.identifier}</p>
                  </button>
                ))}
                <button onClick={() => setConnectOpen(true)} className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-3 py-3 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600"><KeyRound className="h-3.5 w-3.5" />Connection</button>
              </Card>

              <div className="min-w-0">
                {selected ? <ServerWorkspace server={selected} tab={tab} setTab={setTab} busy={busy} setBusy={setBusy} onRefresh={loadPortal} copied={copied} copyText={copyText} error={error} setError={setError} /> : (
                  <Card className="p-10 text-center"><Server className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-black">No services assigned</h2><p className="mt-2 text-sm text-slate-500">There is no real Pterodactyl service assigned to this account.</p><button onClick={() => navigateTo('services')} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white">Browse hosting</button></Card>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Pterodactyl Client API connected securely</span>
              <button onClick={disconnect} disabled={busy === 'disconnect'} className="inline-flex items-center gap-2 font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50">{busy === 'disconnect' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}Disconnect</button>
            </div>
          </>
        )}
      </main>

      {connectOpen && <ConnectModal panelUrl={portal.panelUrl} value={clientKey} show={showKey} busy={busy === 'connect'} setValue={setClientKey} setShow={setShowKey} onClose={() => setConnectOpen(false)} onConnect={connect} />}
    </div>
  );
};

const ConnectModal: React.FC<{
  panelUrl: string | null; value: string; show: boolean; busy: boolean;
  setValue: (v: string) => void; setShow: (v: boolean) => void; onClose: () => void; onConnect: () => void;
}> = ({ panelUrl, value, show, busy, setValue, setShow, onClose, onConnect }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white p-7 shadow-2xl">
      <div className="flex items-start justify-between"><div><span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">Secure connection</span><h2 className="mt-3 text-2xl font-black">Connect Pterodactyl</h2></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      <p className="mt-3 text-sm leading-6 text-slate-500">Use a Client API key from your own Pterodactyl account. It must belong to the same email as this HelzerX account.</p>
      <label className="mt-6 block text-xs font-black uppercase tracking-wider text-slate-500">Client API key</label>
      <div className="mt-2 flex gap-2"><input value={value} onChange={(e) => setValue(e.target.value)} type={show ? 'text' : 'password'} autoComplete="off" placeholder="ptlc_…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /><button onClick={() => setShow(!show)} className="rounded-xl border border-slate-200 px-4 text-xs font-bold">{show ? 'Hide' : 'Show'}</button></div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-500"><b className="text-slate-700">Where:</b> {panelUrl ? <><a href={`${panelUrl}/account/api`} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">Pterodactyl → Account → API Keys</a> and create a Client key.</> : 'Open your Pterodactyl panel → Account → API Keys.'}</div>
      <button onClick={onConnect} disabled={busy || !value.trim()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}Connect securely</button>
    </div>
  </div>
);

const ServerWorkspace: React.FC<{
  server: ServerInfo; tab: Tab; setTab: (tab: Tab) => void; busy: string; setBusy: (v: string) => void;
  onRefresh: () => Promise<void>; copied: string; copyText: (v: string) => void; error: string; setError: (v: string) => void;
}> = ({ server, tab, setTab, busy, setBusy, onRefresh, copied, copyText, setError }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [powerBusy, setPowerBusy] = useState('');
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [wsState, setWsState] = useState('offline');
  const wsRef = useRef<WebSocket | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [directory, setDirectory] = useState('/');
  const [fileSearch, setFileSearch] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [backups, setBackups] = useState<Backup[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [notice, setNotice] = useState('');

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setNotice('');
    try { await fn(); } catch (err) { setError(err instanceof Error ? err.message : 'Action failed.'); }
    finally { setBusy(''); }
  };

  const refreshStats = useCallback(async () => {
    try { const body = await api(`/api/client/server/${server.identifier}/resources`) as Stats; setStats(body); } catch {}
  }, [server.identifier]);

  useEffect(() => {
    setStats(null);
    void refreshStats();
    const timer = window.setInterval(() => { void refreshStats(); }, 5000);
    return () => window.clearInterval(timer);
  }, [refreshStats]);

  useEffect(() => {
    setConsoleLines([]);
    setWsState('offline');
    wsRef.current?.close();
    wsRef.current = null;
    if (tab !== 'console') return;
    let cancelled = false;
    const connectWs = async () => {
      try {
        const data = await api(`/api/client/server/${server.identifier}/websocket`);
        if (cancelled) return;
        const socket = new WebSocket(data.data.socket);
        wsRef.current = socket;
        socket.onopen = () => {
          setWsState('connecting');
          socket.send(JSON.stringify({ event: 'auth', args: [data.data.token] }));
          window.setTimeout(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ event: 'send logs', args: [null] })), 500);
          window.setTimeout(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ event: 'send stats', args: [null] })), 700);
        };
        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.event === 'auth success') setWsState('online');
            if (message.event === 'console output') setConsoleLines((prev) => [...prev.slice(-499), String(message.args?.[0] || '')]);
            if (message.event === 'status') setStats((prev) => ({ ...(prev || {}), current_state: String(message.args?.[0] || '') }));
            if (message.event === 'stats') setStats(message.args?.[0] || message.args?.[1] || message);
            if (message.event === 'token expiring') {
              void api(`/api/client/server/${server.identifier}/websocket`).then(() => {}).catch(() => {});
            }
          } catch {}
        };
        socket.onerror = () => setWsState('error');
        socket.onclose = () => setWsState('offline');
      } catch { setWsState('error'); }
    };
    void connectWs();
    return () => { cancelled = true; wsRef.current?.close(); wsRef.current = null; };
  }, [tab, server.identifier]);

  const power = async (signal: 'start' | 'stop' | 'restart' | 'kill') => {
    setPowerBusy(signal);
    try {
      await api(`/api/client/server/${server.identifier}/power`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signal }) });
      await refreshStats();
      await onRefresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Power action failed.'); }
    finally { setPowerBusy(''); }
  };

  const sendCommand = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    setCommand('');
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN && wsState === 'online') {
        wsRef.current.send(JSON.stringify({ event: 'send command', args: [value] }));
      } else {
        await api(`/api/client/server/${server.identifier}/command`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: value }) });
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Command failed.'); }
  };

  const loadFiles = useCallback(async (dir = directory) => {
    setFileLoading(true);
    try {
      const data = await api(`/api/client/server/${server.identifier}/files?directory=${encodeURIComponent(dir)}`);
      setFiles(Array.isArray(data?.data) ? data.data.map((x: any) => x.attributes || x) : []);
      setDirectory(dir);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load files.'); }
    finally { setFileLoading(false); }
  }, [server.identifier, directory, setError]);

  useEffect(() => { if (tab === 'files') void loadFiles('/'); }, [tab, server.identifier]);

  const openFile = async (entry: FileEntry) => {
    const path = directory === '/' ? `/${entry.name}` : `${directory.replace(/\/$/, '')}/${entry.name}`;
    if (!entry.is_file) return void loadFiles(path);
    setEditingFile(path);
    setFileLoading(true);
    try { const text = await fetch(`/api/client/server/${server.identifier}/file?file=${encodeURIComponent(path)}`, { credentials: 'include', cache: 'no-store' }).then(async (r) => { if (!r.ok) throw new Error('Unable to read file.'); return r.text(); }); setFileContent(text); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to read file.'); }
    finally { setFileLoading(false); }
  };

  const saveFile = async () => {
    if (!editingFile) return;
    await run('save-file', async () => {
      await api(`/api/client/server/${server.identifier}/file/write`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: editingFile, content: fileContent }) });
      setNotice('File saved.');
    });
  };

  const deleteEntry = async (entry: FileEntry) => {
    if (!window.confirm(`Delete ${entry.name}? This cannot be undone.`)) return;
    await run('delete-file', async () => {
      await api(`/api/client/server/${server.identifier}/file/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ root: directory, files: [entry.name] }) });
      await loadFiles(directory);
    });
  };

  const createFolder = async () => {
    if (!newFolder.trim()) return;
    await run('folder', async () => {
      await api(`/api/client/server/${server.identifier}/file/folder`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ root: directory, name: newFolder.trim() }) });
      setNewFolder('');
      await loadFiles(directory);
    });
  };

  const loadBackups = async () => {
    const data = await api(`/api/client/server/${server.identifier}/backups`);
    setBackups(Array.isArray(data?.data) ? data.data.map((x: any) => x.attributes || x) : []);
  };
  useEffect(() => { if (tab === 'backups') void loadBackups().catch((e) => setError(e.message)); }, [tab, server.identifier]);

  const loadDatabases = async () => {
    const data = await api(`/api/client/server/${server.identifier}/databases`);
    setDatabases(Array.isArray(data?.data) ? data.data.map((x: any) => x.attributes || x) : []);
  };
  useEffect(() => { if (tab === 'databases') void loadDatabases().catch((e) => setError(e.message)); }, [tab, server.identifier]);

  const loadActivity = async () => {
    const data = await api(`/api/client/server/${server.identifier}/activity`);
    setActivity(Array.isArray(data?.data) ? data.data.map((x: any) => x.attributes || x) : []);
  };
  useEffect(() => { if (tab === 'activity') void loadActivity().catch((e) => setError(e.message)); }, [tab, server.identifier]);

  const filteredFiles = useMemo(() => files.filter((entry) => entry.name.toLowerCase().includes(fileSearch.toLowerCase())), [files, fileSearch]);

  const address = server.allocation ? `${server.allocation.alias || server.allocation.ip}:${server.allocation.port}` : 'No allocation';
  const currentState = stats?.current_state || server.status || 'unknown';
  const memory = Number(stats?.resources?.memory_bytes || 0);
  const disk = Number(stats?.resources?.disk_bytes || 0);
  const cpu = Number(stats?.resources?.cpu_absolute || 0);

  const tabs: Array<[Tab, React.ElementType, string]> = [
    ['overview', LayoutDashboard, 'Overview'],
    ['console', Terminal, 'Console'],
    ['files', Folder, 'Files'],
    ['backups', HardDrive, 'Backups'],
    ['databases', Database, 'Databases'],
    ['activity', Activity, 'Activity'],
    ['settings', Settings, 'Settings'],
  ];

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-3 w-3 rounded-full ${currentState === 'running' ? 'bg-emerald-500' : currentState === 'offline' || currentState === 'stopped' ? 'bg-slate-300' : 'bg-amber-500'}`} /><h2 className="truncate text-2xl font-black">{server.name}</h2></div><p className="mt-1 font-mono text-[11px] text-slate-400">{server.identifier} · {server.node || 'Node unavailable'}</p></div>
          <div className="flex flex-wrap gap-2">
            <button disabled={Boolean(powerBusy) || server.suspended} onClick={() => void power('start')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"><Play className="h-3.5 w-3.5 fill-current" />Start</button>
            <button disabled={Boolean(powerBusy) || server.suspended} onClick={() => void power('restart')} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 hover:bg-amber-100 disabled:opacity-50"><RotateCw className={`h-3.5 w-3.5 ${powerBusy === 'restart' ? 'animate-spin' : ''}`} />Restart</button>
            <button disabled={Boolean(powerBusy) || server.suspended} onClick={() => void power('stop')} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-100 disabled:opacity-50"><Square className="h-3.5 w-3.5 fill-current" />Stop</button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <button onClick={() => copyText(address)} className="rounded-2xl bg-slate-50 p-3 text-left hover:bg-blue-50"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Address</span><strong className="mt-1 block truncate font-mono text-xs">{address}</strong>{copied === address && <span className="text-[10px] text-emerald-600">Copied</span>}</button>
          <div className="rounded-2xl bg-slate-50 p-3"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CPU</span><strong className="mt-1 block text-sm">{cpu.toFixed(1)}%</strong></div>
          <div className="rounded-2xl bg-slate-50 p-3"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">RAM</span><strong className="mt-1 block text-sm">{fmtBytes(memory)} / {fmtBytes(server.limits.memory * 1024 * 1024)}</strong></div>
          <div className="rounded-2xl bg-slate-50 p-3"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Disk</span><strong className="mt-1 block text-sm">{fmtBytes(disk)} / {fmtBytes(server.limits.disk * 1024 * 1024)}</strong></div>
        </div>
      </div>

      <div className="overflow-x-auto border-b border-slate-100 bg-slate-50/70 px-3 py-2">
        <div className="flex min-w-max gap-1">{tabs.map(([key, Icon, label]) => <button key={key} onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition ${tab === key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-white/70'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>
      </div>

      <div className="min-h-[480px] p-5 sm:p-6">
        {tab === 'overview' && <OverviewPanel server={server} stats={stats} state={currentState} onRefresh={refreshStats} />}
        {tab === 'console' && <ConsolePanel lines={consoleLines} command={command} setCommand={setCommand} onSubmit={sendCommand} state={wsState} />}
        {tab === 'files' && <FilesPanel directory={directory} files={filteredFiles} loading={fileLoading} search={fileSearch} setSearch={setFileSearch} newFolder={newFolder} setNewFolder={setNewFolder} onFolder={createFolder} onOpen={openFile} onDelete={deleteEntry} onUp={() => loadFiles(directory === '/' ? '/' : directory.split('/').slice(0, -1).join('/') || '/')} editingFile={editingFile} content={fileContent} setContent={setFileContent} onSave={saveFile} onCloseEditor={() => setEditingFile(null)} busy={busy === 'save-file' || busy === 'delete-file' || busy === 'folder'} />}
        {tab === 'backups' && <BackupsPanel backups={backups} busy={busy} run={run} reload={loadBackups} serverId={server.identifier} />}
        {tab === 'databases' && <DatabasesPanel databases={databases} onReload={loadDatabases} />}
        {tab === 'activity' && <ActivityPanel activity={activity} />}
        {tab === 'settings' && <SettingsPanel server={server} panelUrl={null} />}
      </div>
    </Card>
  );
};

const OverviewPanel: React.FC<{ server: ServerInfo; stats: Stats | null; state: string; onRefresh: () => Promise<void> }> = ({ server, stats, state, onRefresh }) => {
  const r = stats?.resources;
  return <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-3">
      <Metric title="CPU" value={`${Number(r?.cpu_absolute || 0).toFixed(1)}%`} note={`Limit ${server.limits.cpu || 'unlimited'}%`} />
      <Metric title="Memory" value={fmtBytes(Number(r?.memory_bytes || 0))} note={`Limit ${fmtBytes(server.limits.memory * 1024 * 1024)}`} />
      <Metric title="Disk" value={fmtBytes(Number(r?.disk_bytes || 0))} note={`Limit ${fmtBytes(server.limits.disk * 1024 * 1024)}`} />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5 shadow-none"><div className="flex items-center justify-between"><h3 className="font-black">Live state</h3><button onClick={() => void onRefresh()} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><RefreshCw className="h-4 w-4" /></button></div><p className="mt-3 text-2xl font-black capitalize">{state}</p><p className="mt-1 text-xs text-slate-500">Uptime: {fmtUptime(Number(r?.uptime || 0))}</p></Card>
      <Card className="p-5 shadow-none"><h3 className="font-black">Allocation</h3><p className="mt-3 font-mono text-sm">{server.allocation ? `${server.allocation.alias || server.allocation.ip}:${server.allocation.port}` : 'Not allocated'}</p><p className="mt-2 text-xs text-slate-500">SFTP: {server.sftp ? `${server.sftp.ip}:${server.sftp.port}` : 'Unavailable'}</p></Card>
    </div>
    <div className="grid gap-4 md:grid-cols-3">{[['Databases', server.featureLimits.databases], ['Backups', server.featureLimits.backups], ['Allocations', server.featureLimits.allocations]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>)}</div>
  </div>;
};

const Metric: React.FC<{ title: string; value: string; note: string }> = ({ title, value, note }) => <Card className="p-5 shadow-none"><div className="flex items-center gap-2 text-xs font-black text-slate-500"><Activity className="h-4 w-4 text-blue-600" />{title}</div><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></Card>;

const ConsolePanel: React.FC<{ lines: string[]; command: string; setCommand: (v: string) => void; onSubmit: (e: React.FormEvent) => void; state: string }> = ({ lines, command, setCommand, onSubmit, state }) => (
  <div className="overflow-hidden rounded-2xl bg-[#070a12] text-slate-200">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="flex items-center gap-2 text-xs font-black"><span className={`h-2 w-2 rounded-full ${state === 'online' ? 'bg-emerald-400' : state === 'error' ? 'bg-rose-400' : 'bg-amber-400'}`} />Live console · {state}</div><Terminal className="h-4 w-4 text-slate-500" /></div>
    <pre className="h-[360px] overflow-auto p-4 font-mono text-[11px] leading-5 text-slate-300">{lines.length ? lines.join('\n') : 'Waiting for real server console output…'}</pre>
    <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 p-3"><span className="rounded-xl bg-white/5 px-3 py-2.5 font-mono text-xs text-emerald-400">$</span><input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Send a real server command…" className="min-w-0 flex-1 rounded-xl bg-white/5 px-3 py-2.5 font-mono text-xs text-white outline-none placeholder:text-slate-600" /><button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white">Send</button></form>
  </div>
);

const FilesPanel: React.FC<{
  directory: string; files: FileEntry[]; loading: boolean; search: string; setSearch: (v: string) => void; newFolder: string; setNewFolder: (v: string) => void; onFolder: () => void; onOpen: (e: FileEntry) => void; onDelete: (e: FileEntry) => void; onUp: () => void; editingFile: string | null; content: string; setContent: (v: string) => void; onSave: () => void; onCloseEditor: () => void; busy: boolean;
}> = ({ directory, files, loading, search, setSearch, newFolder, setNewFolder, onFolder, onOpen, onDelete, onUp, editingFile, content, setContent, onSave, onCloseEditor, busy }) => (
  <div className="space-y-4">
    {editingFile ? (
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Editing</p><p className="truncate font-mono text-xs font-bold">{editingFile}</p></div><div className="flex gap-2"><button onClick={onCloseEditor} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">Close</button><button onClick={onSave} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"><Save className="h-3.5 w-3.5" />Save</button></div></div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} spellCheck={false} className="h-[420px] w-full resize-none bg-[#0b1020] p-4 font-mono text-xs leading-5 text-slate-200 outline-none" />
      </div>
    ) : (
      <>
        <div className="flex flex-wrap gap-2"><button onClick={onUp} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">Up</button><div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="h-3.5 w-3.5 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files" className="w-full py-2 text-xs outline-none" /></div><input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="New folder" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none" /><button onClick={onFolder} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"><FolderPlus className="h-3.5 w-3.5" />Create</button></div>
        <div className="rounded-2xl border border-slate-200 overflow-hidden"><div className="border-b border-slate-100 bg-slate-50 px-4 py-3 font-mono text-xs font-bold">{directory}</div>{loading ? <div className="p-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-600" /></div> : files.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">No files returned by Pterodactyl.</div> : <div>{files.map((entry) => <div key={entry.name} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"><button onClick={() => onOpen(entry)} className="flex min-w-0 flex-1 items-center gap-3 text-left">{entry.is_file ? <File className="h-4 w-4 text-slate-400" /> : <Folder className="h-4 w-4 text-blue-500" />}<span className="truncate text-xs font-bold">{entry.name}</span></button><span className="hidden w-24 text-right text-[10px] text-slate-400 sm:block">{entry.is_file ? fmtBytes(entry.size) : 'folder'}</span>{entry.is_file && <button onClick={() => void onDelete(entry)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>}</div>)}</div>}</div>
      </>
    )}
  </div>
);

const BackupsPanel: React.FC<{ backups: Backup[]; busy: string; run: (l: string, fn: () => Promise<void>) => Promise<void>; reload: () => Promise<void>; serverId: string }> = ({ backups, busy, run, reload, serverId }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h3 className="text-lg font-black">Backups</h3><p className="text-xs text-slate-500">Real backups from Pterodactyl.</p></div><button onClick={() => void run('backup-create', async () => { await api(`/api/client/server/${serverId}/backups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `HelzerX backup ${new Date().toISOString()}`, is_locked: false }) }); await reload(); })} disabled={Boolean(busy)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"><Save className="h-3.5 w-3.5" />Create backup</button></div>
    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">{backups.length ? backups.map((backup) => <div key={backup.uuid} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-sm font-black">{backup.name || backup.uuid}</p><p className="mt-1 text-[11px] text-slate-400">{fmtBytes(backup.bytes)} · {backup.completed_at ? new Date(backup.completed_at).toLocaleString() : 'Processing'} {backup.is_locked ? '· Locked' : ''}</p></div><div className="flex gap-2"><button onClick={() => void run('restore', async () => { if (!window.confirm('Restore this backup? This can replace current files.')) return; await api(`/api/client/server/${serverId}/backups/${backup.uuid}/restore`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ truncate: true }) }); })} className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">Restore</button><button onClick={() => void run('delete-backup', async () => { if (!window.confirm('Delete this backup permanently?')) return; await api(`/api/client/server/${serverId}/backups/${backup.uuid}`, { method: 'DELETE' }); await reload(); })} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">Delete</button></div></div>) : <div className="p-10 text-center text-sm text-slate-400">No backups returned by Pterodactyl.</div>}</div>
  </div>
);

const DatabasesPanel: React.FC<{ databases: Database[]; onReload: () => Promise<void> }> = ({ databases, onReload }) => (
  <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-lg font-black">Databases</h3><p className="text-xs text-slate-500">Database access is read from your real Pterodactyl account.</p></div><button onClick={() => void onReload()} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /></button></div><div className="grid gap-3 md:grid-cols-2">{databases.length ? databases.map((db) => <Card key={db.id} className="p-5 shadow-none"><div className="flex items-center gap-3"><Database className="h-5 w-5 text-blue-600" /><div><p className="font-black">{db.name}</p><p className="text-xs text-slate-400">{db.username}</p></div></div><p className="mt-4 rounded-xl bg-slate-50 p-3 font-mono text-[11px]">{db.connection_string || 'Connection details supplied by panel'}</p></Card>) : <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">No databases returned by Pterodactyl.</div>}</div></div>
);

const ActivityPanel: React.FC<{ activity: any[] }> = ({ activity }) => (
  <div><div className="mb-4"><h3 className="text-lg font-black">Activity</h3><p className="text-xs text-slate-500">Real Pterodactyl activity records.</p></div><div className="space-y-2">{activity.length ? activity.map((item, i) => <div key={item.id || i} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black">{item.event || item.action || 'Activity'}</p><span className="text-[10px] text-slate-400">{item.timestamp || item.created_at ? new Date(item.timestamp || item.created_at).toLocaleString() : ''}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{item.description || item.actor || 'Pterodactyl activity record'}</p></div>) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">No activity returned.</div>}</div>
);

function SettingsPanel(props) {
  const { server, panelUrl } = props;
  return (
  <div className="space-y-5"><div><h3 className="text-lg font-black">Server settings</h3><p className="text-xs leading-6 text-slate-500">This area only exposes information the connected Client API account can safely read. Administrative build/egg changes stay in Pterodactyl and are never faked here.</p></div><div className="grid gap-4 md:grid-cols-2"><Card className="p-5 shadow-none"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Identifier</p><p className="mt-2 font-mono text-xs">{server.identifier}</p><p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">UUID</p><p className="mt-2 break-all font-mono text-xs">{server.uuid}</p></Card><Card className="p-5 shadow-none"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Resource limits</p><p className="mt-2 text-sm font-bold">CPU {server.limits.cpu || 'Unlimited'}% · RAM {fmtBytes(server.limits.memory * 1024 * 1024)} · Disk {fmtBytes(server.limits.disk * 1024 * 1024)}</p><p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Permissions</p><p className="mt-2 text-xs text-slate-500">{server.permissions.length ? server.permissions.join(', ') : 'Panel did not return permission details.'}</p></Card></div>{panelUrl && <a href={panelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white">Open full Pterodactyl panel <ChevronRight className="h-4 w-4" /></a>}</div>
  );
}
