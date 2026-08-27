import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  Power,
  RefreshCw,
  Terminal,
  Activity,
  HardDrive,
  Cpu,
  Copy,
  Check,
  Plus,
  Play,
  Square,
  ShieldCheck,
  ExternalLink,
  LifeBuoy,
  FileCode,
  FolderOpen,
  Database,
  Users,
  Settings,
  Receipt,
  Download,
  Upload,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { DeployedServer } from '../../types';

export const DashboardPage: React.FC = () => {
  const {
    deployedServers,
    toggleServerPower,
    updateServerPowerState,
    addServerLog,
    deleteServer,
    navigateTo,
    user,
    orders,
    formatPrice,
    currency,
    showNotification,
  } = useApp();

  const [selectedServerId, setSelectedServerId] = useState<string>(
    deployedServers[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'console' | 'files' | 'backups' | 'plugins' | 'billing' | 'settings'>('console');
  const [commandInput, setCommandInput] = useState('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // File Manager Mock State
  const [files, setFiles] = useState([
    { name: 'server.properties', size: '1.4 KB', type: 'config', modified: '2 mins ago' },
    { name: 'paper.yml', size: '8.2 KB', type: 'config', modified: '10 mins ago' },
    { name: 'spigot.yml', size: '3.1 KB', type: 'config', modified: '10 mins ago' },
    { name: 'plugins/', size: '48.5 MB', type: 'folder', modified: '1 hour ago' },
    { name: 'world/', size: '342.1 MB', type: 'folder', modified: 'Just now' },
    { name: 'world_nether/', size: '84.0 MB', type: 'folder', modified: '4 hours ago' },
    { name: 'eula.txt', size: '42 B', type: 'text', modified: '1 day ago' },
  ]);

  // Plugins catalog
  const [installedPlugins, setInstalledPlugins] = useState([
    { name: 'EssentialsX', version: '2.20.1', desc: 'Core server commands, economy & warps', status: 'active' },
    { name: 'LuckPerms', version: '5.4.102', desc: 'Advanced permissions manager & Web editor', status: 'active' },
    { name: 'WorldEdit', version: '7.3.0', desc: 'In-game voxel map editor & clipboard tool', status: 'active' },
    { name: 'Vault', version: '1.7.3', desc: 'Economy & chat bridge framework', status: 'active' },
    { name: 'GeyserMC', version: '2.2.0', desc: 'Bedrock & Java crossplay bridge', status: 'active' },
  ]);

  const activeServer =
    (deployedServers || []).find((s) => s.id === selectedServerId) ||
    deployedServers[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || !activeServer) return;

    addServerLog(activeServer.id, commandInput.trim());

    // Realistic server console responses
    const cmd = commandInput.trim().toLowerCase();
    setTimeout(() => {
      if (cmd === 'list' || cmd === 'players') {
        addServerLog(activeServer.id, `[SERVER CONSOLE]: 14/80 players online: Kasun_LK, Steve, Alex, Notch, VoidGamer, Dino`);
      } else if (cmd === 'tps' || cmd === 'status') {
        addServerLog(activeServer.id, `[SERVER CONSOLE]: TPS: 20.0 (100% stable) • Tick Duration: 4.1ms • Allocated RAM: 3.8GB / 8.0GB`);
      } else if (cmd === 'help') {
        addServerLog(activeServer.id, `[SERVER CONSOLE]: Commands: tps, list, reload, op, ban, say, stop, restart, spark`);
      } else if (cmd.startsWith('say ')) {
        addServerLog(activeServer.id, `[Server] ${commandInput.trim().slice(4)}`);
      } else {
        addServerLog(activeServer.id, `[SERVER CONSOLE]: Command '${cmd}' executed on thread #1.`);
      }
    }, 300);

    setCommandInput('');
  };

  const handleInstallPlugin = (pluginName: string) => {
    showNotification(`Installed ${pluginName}! Restart server to load classes.`, 'success');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-purple-900/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>ArveX Pterodactyl Node Manager</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
            Client Server Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time server telemetry, AMD Ryzen thread performance, live console terminal, and automated billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('services-minecraft')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Another Node</span>
          </button>
        </div>
      </div>

      {deployedServers.length > 0 && activeServer ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Servers List */}
          <div className="space-y-3 lg:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Your Active Nodes ({deployedServers.length})
            </span>
            {deployedServers.map((srv) => (
              <button
                key={srv.id}
                onClick={() => setSelectedServerId(srv.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeServer.id === srv.id
                    ? 'bg-[#15172b] border-purple-500/80 shadow-lg shadow-purple-950/50'
                    : 'bg-[#0f111e] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                    {srv.serverName}
                  </h4>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      srv.status === 'running'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-purple-300 font-mono">
                  {srv.ipAddress}:{srv.port}
                </p>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {srv.planName} • {srv.location}
                </span>
              </button>
            ))}

            {/* Quick Support Ticket */}
            <div className="p-4 rounded-2xl bg-[#0e101d] border border-purple-500/20 text-xs mt-4">
              <span className="font-bold text-white block mb-1">Need Pterodactyl Support?</span>
              <p className="text-slate-400 text-[11px] mb-3">
                Our Sri Lankan engineering team is active 24/7 on WhatsApp &amp; Discord.
              </p>
              <a
                href="https://wa.me/94770000000"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Main Content: Server Telemetry & Tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Bar: Server Details & Power Controls */}
            <div className="bg-[#0f111e] border border-purple-900/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white font-display">
                    {activeServer.serverName}
                  </h2>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      activeServer.status === 'running'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {activeServer.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>
                    IP: {activeServer.ipAddress}:{activeServer.port}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(`${activeServer.ipAddress}:${activeServer.port}`)
                    }
                    className="text-purple-400 hover:text-purple-300"
                    title="Copy Address"
                  >
                    {copiedIp ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Power Actions */}
              <div className="flex items-center gap-2">
                {activeServer.status === 'running' ? (
                  <>
                    <button
                      onClick={() => {
                        updateServerPowerState(activeServer.id, 'restarting');
                        showNotification('Server restart signal sent.', 'info');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restart</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleServerPower(activeServer.id, 'offline');
                        showNotification('Stopping server gracefully...', 'info');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Square className="w-3.5 h-3.5 fill-rose-400" />
                      <span>Stop</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      toggleServerPower(activeServer.id, 'running');
                      showNotification('Booting server node...', 'success');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Start Node</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resource Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0f111e] border border-purple-900/30 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-purple-400" />
                    <span>Memory Usage</span>
                  </span>
                  <span className="font-mono text-purple-300 font-bold">
                    {activeServer.ramUsagePercent || 38}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeServer.ramUsagePercent || 38}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                  {((activeServer.ramMb * (activeServer.ramUsagePercent || 38)) / 102400).toFixed(1)} GB / {(activeServer.ramMb / 1024).toFixed(0)} GB DDR5
                </span>
              </div>

              <div className="bg-[#0f111e] border border-purple-900/30 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>CPU Thread Load</span>
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {activeServer.cpuUsagePercent || 14}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeServer.cpuUsagePercent || 14}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                  Ryzen 9 7950X ({activeServer.cpuCores} Allocated Cores)
                </span>
              </div>

              <div className="bg-[#0f111e] border border-purple-900/30 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NVMe PCIe 5.0 Disk</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {activeServer.diskUsagePercent || 22}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeServer.diskUsagePercent || 22}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                  {((activeServer.diskGb * (activeServer.diskUsagePercent || 22)) / 100).toFixed(1)} GB / {activeServer.diskGb} GB Total
                </span>
              </div>
            </div>

            {/* Navigation Tabs for Dashboard */}
            <div className="flex items-center gap-2 border-b border-purple-900/30 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Live Console</span>
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'files'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>File Manager &amp; SFTP</span>
              </button>

              <button
                onClick={() => setActiveTab('plugins')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'plugins'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Plugins &amp; Modpacks</span>
              </button>

              <button
                onClick={() => setActiveTab('billing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'billing'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Invoices &amp; PayHere Receipts</span>
              </button>
            </div>

            {/* TAB 1: Console */}
            {activeTab === 'console' && (
              <div className="bg-[#0b0c16] border border-purple-900/40 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-[#121424] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white font-mono">
                      pterodactyl@arvex-node-sg01:~$
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    TPS: 20.0 (100%)
                  </span>
                </div>

                <div className="p-4 h-72 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5 scrollbar-none bg-[#090a12]">
                  {(activeServer.logs || []).map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-600 select-none">
                        [{new Date().toLocaleTimeString()}]
                      </span>
                      <span
                        className={
                          log.includes('WARN')
                            ? 'text-amber-400'
                            : log.includes('ERROR')
                            ? 'text-rose-400'
                            : log.includes('Done') || log.includes('online') || log.includes('TPS')
                            ? 'text-emerald-400'
                            : 'text-purple-200'
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendCommand} className="p-3 bg-[#121424] border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Type server command (e.g., list, tps, op player, save-all)..."
                    className="flex-1 bg-[#090a12] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-purple-600/30 transition-all"
                  >
                    Execute
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: File Manager */}
            {activeTab === 'files' && (
              <div className="bg-[#0f111e] border border-purple-900/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">SFTP Root: /home/container</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showNotification('File uploaded to server root.', 'success')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#141626] hover:bg-[#1a1d30] border border-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{f.type === 'folder' ? '📁' : '📄'}</span>
                        <span className="font-mono text-white font-medium">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                        <span>{f.size}</span>
                        <span>{f.modified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Plugins */}
            {activeTab === 'plugins' && (
              <div className="bg-[#0f111e] border border-purple-900/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h3 className="text-sm font-bold text-white font-display">
                    Installed 1-Click Spigot / Paper Plugins
                  </h3>
                  <span className="text-xs text-purple-300">{installedPlugins.length} Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {installedPlugins.map((pl, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#141626] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{pl.name}</h4>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          v{pl.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{pl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Billing & Invoices */}
            {activeTab === 'billing' && (
              <div className="bg-[#0f111e] border border-purple-900/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h3 className="text-sm font-bold text-white font-display">
                    Sri Lankan &amp; Global Invoices
                  </h3>
                  <span className="text-xs text-emerald-400">All Invoices Paid</span>
                </div>

                <div className="space-y-2 text-xs">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-4 rounded-2xl bg-[#141626] border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-bold text-purple-300">{o.id}</span>
                          <h4 className="text-white font-semibold mt-0.5">{o.planName}</h4>
                          <span className="text-[10px] text-slate-400">{o.hostname} • {o.billingCycle}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-white block">
                            {formatPrice(o.amount)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#141626] border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-purple-300">INV-84920</span>
                        <h4 className="text-white font-semibold mt-0.5">Minecraft 1GB Node (Monthly)</h4>
                        <span className="text-[10px] text-slate-400">PayHere LKR Verified</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">Rs. 350.00</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                          PAID
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0f111e] border border-purple-900/30 rounded-3xl p-8">
          <Server className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Active Nodes Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            You don&apos;t have any active servers yet. Choose a plan starting at Rs. 350/mo.
          </p>
          <button
            onClick={() => navigateTo('services-minecraft')}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30"
          >
            Deploy Minecraft Server
          </button>
        </div>
      )}
    </div>
  );
};
