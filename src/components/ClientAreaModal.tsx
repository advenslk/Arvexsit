import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Server,
  Play,
  RotateCw,
  Square,
  Terminal,
  Activity,
  Send,
  Cpu,
  HardDrive,
  Copy,
  Check,
  Zap,
  Globe,
  User,
} from 'lucide-react';

export const ClientAreaModal: React.FC = () => {
  const {
    isClientAreaOpen,
    setIsClientAreaOpen,
    userServers,
    updateServerPowerState,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const [selectedServerId, setSelectedServerId] = useState<string>(
    userServers[0]?.id || ''
  );
  const [consoleLogs, setConsoleLogs] = useState<Record<string, string[]>>({
    'srv-demo-1': [
      '[14:00:10 INFO]: Server starting in SURVIVAL mode...',
      '[14:00:12 INFO]: Loaded 28 plugins (Vault, EssentialsX, CoreProtect, WorldEdit, LuckPerms)',
      '[14:00:14 INFO]: World world is preparing spawn area 100%',
      '[14:00:15 INFO]: [Paper] Server online on 198.51.100.42:25565 (20.0 TPS)',
      '[14:02:18 INFO]: Steve joined the game.',
      '[14:03:00 INFO]: Alex joined the game.',
    ],
  });
  const [commandInput, setCommandInput] = useState('');
  const [copiedIp, setCopiedIp] = useState(false);

  if (!isClientAreaOpen) return null;

  const currentServer =
    userServers.find((s) => s.id === selectedServerId) || userServers[0];

  const handleCopyIp = () => {
    if (!currentServer) return;
    navigator.clipboard.writeText(`${currentServer.ipAddress}:${currentServer.port}`);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handlePower = (action: 'running' | 'restarting' | 'stopped') => {
    if (!currentServer) return;
    updateServerPowerState(currentServer.id, action);
    const time = new Date().toLocaleTimeString();
    const log =
      action === 'running'
        ? `[${time} DAEMON]: Server start sequence initiated.`
        : action === 'restarting'
        ? `[${time} DAEMON]: Rebooting node container...`
        : `[${time} DAEMON]: Server stopped cleanly.`;

    setConsoleLogs((prev) => ({
      ...prev,
      [currentServer.id]: [...(prev[currentServer.id] || []), log],
    }));
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || !currentServer) return;
    const time = new Date().toLocaleTimeString();
    const userLog = `[${time} USER]: ${commandInput}`;
    const serverLog = `[${time} SERVER]: Executed "${commandInput}".`;

    setConsoleLogs((prev) => ({
      ...prev,
      [currentServer.id]: [...(prev[currentServer.id] || []), userLog, serverLog],
    }));
    setCommandInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#10131e] border border-white/10 p-6 sm:p-8 shadow-2xl my-8 min-h-[550px] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Client Control Panel
              </h3>
              <p className="text-xs text-slate-400">
                Manage your active game servers, live console, and power states
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClientAreaOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {userServers.length === 0 ? (
          <div className="text-center py-16">
            <Server className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Active Servers Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              You don't have any deployed servers right now. Choose a game hosting plan to launch your first server!
            </p>
            <button
              onClick={() => {
                setIsClientAreaOpen(false);
                const el = document.getElementById('plans');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Explore Hosting Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 my-6 flex-1">
            {/* Server List Sidebar */}
            <div className="col-span-12 md:col-span-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                My Game Servers ({userServers.length})
              </span>

              {userServers.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServerId(srv.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    (currentServer?.id === srv.id)
                      ? 'bg-[#181d2c] border-cyan-400 shadow-md'
                      : 'bg-[#0c0e16] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs truncate max-w-[130px]">
                      {srv.serverName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                        srv.status === 'running'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                          : srv.status === 'restarting'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">{srv.gameName}</p>
                  <p className="text-[10px] font-mono text-cyan-400 mt-1">
                    {srv.ipAddress}:{srv.port}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Server Stage */}
            {currentServer && (
              <div className="col-span-12 md:col-span-8 bg-[#0c0e16] rounded-2xl border border-white/10 p-5 flex flex-col justify-between">
                {/* Top Status and Power Controls */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          {currentServer.serverName}
                        </h4>
                        <span className="text-xs text-slate-400">({currentServer.gameName})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-cyan-400 font-bold">
                          {currentServer.ipAddress}:{currentServer.port}
                        </span>
                        <button
                          onClick={handleCopyIp}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Copy IP"
                        >
                          {copiedIp ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Power Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePower('running')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          currentServer.status === 'running'
                            ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20 hover:bg-emerald-900/40'
                        }`}
                        title="Start Server"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => handlePower('restarting')}
                        className="p-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/20 hover:bg-amber-900/40 transition-all text-xs"
                        title="Restart Server"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePower('stopped')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          currentServer.status === 'stopped'
                            ? 'bg-rose-500 text-white border-rose-400'
                            : 'bg-rose-950/40 text-rose-300 border-rose-500/20 hover:bg-rose-900/40'
                        }`}
                        title="Stop Server"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Resource Gauges */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#141724] p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">CPU Usage</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {currentServer.status === 'running' ? `${currentServer.cpuUsage}%` : '0%'}
                      </span>
                    </div>
                    <div className="bg-[#141724] p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Memory</span>
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {currentServer.status === 'running'
                          ? `${currentServer.ramUsageGb} GB / ${currentServer.planName}`
                          : '0 GB'}
                      </span>
                    </div>
                    <div className="bg-[#141724] p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Location</span>
                      <span className="text-xs font-mono text-slate-300 truncate block">
                        {currentServer.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Console Logs */}
                <div className="bg-black/80 rounded-xl border border-white/10 p-3 flex flex-col justify-between font-mono text-[11px] h-48">
                  <div className="overflow-y-auto space-y-1 text-slate-300 pr-2">
                    {(consoleLogs[currentServer.id] || [
                      '[14:00:00 INFO]: Connected to Pterodactyl daemon socket.',
                      '[14:00:01 INFO]: Server ready.',
                    ]).map((l, i) => (
                      <div key={i} className="leading-tight">
                        {l}
                      </div>
                    ))}
                  </div>

                  {/* Command sender */}
                  <form
                    onSubmit={handleSendCommand}
                    className="pt-2 border-t border-white/10 flex items-center gap-2 mt-2"
                  >
                    <span className="text-cyan-400 font-bold">$</span>
                    <input
                      type="text"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      placeholder="Type command (e.g. say hello, whitelist add player, help)..."
                      className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded bg-white/10 hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Logged in as {currentUser?.email || 'Guest Client'}</span>
          <button
            onClick={() => setIsClientAreaOpen(false)}
            className="text-white hover:underline"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
