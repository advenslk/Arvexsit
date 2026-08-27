import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Terminal,
  FolderTree,
  Activity,
  Play,
  RotateCw,
  Square,
  Shield,
  Zap,
  Download,
  BarChart3,
  Lock,
  FileCode,
  CheckCircle2,
  Send,
  Sliders,
  Database,
  Calendar,
  Users,
  HardDrive,
  Network,
  Settings,
  User,
  LogOut,
  Folder,
} from 'lucide-react';

export const ControlPanelSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'console' | 'files' | 'activity'>('console');
  const [serverState, setServerState] = useState<'running' | 'offline' | 'restarting'>('running');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[14:10:02 INFO]: Loading properties...',
    '[14:10:03 INFO]: Default game type: SURVIVAL',
    '[14:10:04 INFO]: Generating keypair',
    '[14:10:05 INFO]: Starting Minecraft server on *:25565',
    '[14:10:06 INFO]: [Paper] Using 4 worker threads for worldgen',
    '[14:10:08 INFO]: Preparing level "world"',
    '[14:10:12 INFO]: Done (4.128s)! For help, type "help"',
    '[14:11:00 INFO]: Player Steve joined the game (198.51.100.12)',
    '[14:11:45 INFO]: Steve: Welcome to the server guys!',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [cpuUsage, setCpuUsage] = useState(14.2);
  const [ramUsage, setRamUsage] = useState(3.4);

  // Mock fluctuation
  useEffect(() => {
    if (serverState !== 'running') return;
    const interval = setInterval(() => {
      setCpuUsage((prev) => +(Math.random() * 8 + 12).toFixed(1));
      setRamUsage((prev) => +(3.2 + Math.random() * 0.4).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, [serverState]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const newLog = `[${new Date().toLocaleTimeString()} USER]: ${commandInput}`;
    setTerminalLogs((prev) => [...prev, newLog]);
    setCommandInput('');

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()} SERVER]: Command executed successfully.`,
      ]);
    }, 400);
  };

  const handlePowerAction = (action: 'start' | 'restart' | 'stop') => {
    if (action === 'start') {
      setServerState('running');
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()} DAEMON]: Server container starting...`,
        `[${new Date().toLocaleTimeString()} DAEMON]: Allocated 12GB DDR5 RAM, 4 vCPU cores.`,
      ]);
    } else if (action === 'restart') {
      setServerState('restarting');
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()} DAEMON]: Restart signal received. Saving world data...`,
      ]);
      setTimeout(() => {
        setServerState('running');
        setTerminalLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()} DAEMON]: Server reboot complete. Ready!`,
        ]);
      }, 1500);
    } else {
      setServerState('offline');
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()} DAEMON]: Server stopped cleanly.`,
      ]);
    }
  };

  return (
    <section id="control-panel" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Gamepad Icon with stylized horizontal ornament lines matching Screenshot 1 & 3 */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-white/20" />
        <div className="w-10 h-10 rounded-xl bg-[#131622] border border-white/10 flex items-center justify-center text-slate-300 shadow-lg">
          <Gamepad2 className="w-5 h-5" />
        </div>
        <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-white/20" />
      </div>

      {/* Section Titles */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-3">
          Powerful Control Panel
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Manage your game server with our intuitive, feature-rich control panel. Everything you need, right at your fingertips.
        </p>
      </div>

      {/* 4 Feature Cards (2x2 Grid) matching Screenshot 1 & 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Deploy</h4>
              <p className="text-xs text-slate-400">Launch servers in seconds</p>
            </div>
          </div>
        </div>

        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">One-Click Install</h4>
              <p className="text-xs text-slate-400">Mods & plugins made easy</p>
            </div>
          </div>
        </div>

        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Real-Time Stats</h4>
              <p className="text-xs text-slate-400">Monitor performance live</p>
            </div>
          </div>
        </div>

        <div className="bg-[#11131a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Access</h4>
              <p className="text-xs text-slate-400">2FA & role management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Control Panel Mockup (Pterodactyl Theme) matching Screenshot 1 & 3 */}
      <div className="rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl overflow-hidden">
        {/* Top Panel Bar */}
        <div className="bg-[#131620] px-4 py-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-200">
              ● Pterodactyl - Server
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              198.51.100.42:25565
            </span>
          </div>

          {/* Action Buttons: Start (Green), Restart (Yellow), Stop (Red) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePowerAction('start')}
              className={`p-1.5 rounded-lg border transition-all ${
                serverState === 'running'
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
              title="Start Server"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => handlePowerAction('restart')}
              className={`p-1.5 rounded-lg border transition-all ${
                serverState === 'restarting'
                  ? 'bg-amber-500 text-black border-amber-400 animate-spin'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
              title="Restart Server"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handlePowerAction('stop')}
              className={`p-1.5 rounded-lg border transition-all ${
                serverState === 'offline'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
              }`}
              title="Stop Server"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Panel Main Body with Sidebar + Stage */}
        <div className="grid grid-cols-12 min-h-[380px]">
          {/* Pterodactyl Left Sidebar */}
          <div className="col-span-12 md:col-span-3 bg-[#0a0c12] border-r border-white/5 p-3 space-y-1 text-xs text-slate-400">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 text-white font-medium">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Console</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Files</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Database className="w-3.5 h-3.5" />
              <span>Databases</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedules</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Backups</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Network className="w-3.5 h-3.5" />
              <span>Network</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Zap className="w-3.5 h-3.5" />
              <span>Startup</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </div>
          </div>

          {/* Right Main Stage Content */}
          <div className="col-span-12 md:col-span-9 p-4 flex flex-col justify-between bg-[#0e1017]">
            {/* Live Server Stats Cards Top Row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-[#141724] border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                <span
                  className={`text-xs font-bold font-mono ${
                    serverState === 'running'
                      ? 'text-emerald-400'
                      : serverState === 'restarting'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {serverState.toUpperCase()}
                </span>
              </div>
              <div className="bg-[#141724] border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block uppercase">CPU Load</span>
                <span className="text-xs font-bold font-mono text-cyan-300">
                  {serverState === 'running' ? `${cpuUsage}%` : '0.0%'}
                </span>
              </div>
              <div className="bg-[#141724] border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block uppercase">Memory (RAM)</span>
                <span className="text-xs font-bold font-mono text-indigo-300">
                  {serverState === 'running' ? `${ramUsage} GB / 12 GB` : '0 GB'}
                </span>
              </div>
            </div>

            {/* Console Log Window */}
            {activeTab === 'console' && (
              <div className="flex-1 flex flex-col justify-between bg-black/60 rounded-xl border border-white/10 p-3 font-mono text-xs text-slate-300 overflow-hidden">
                <div className="h-44 overflow-y-auto space-y-1 text-[11px] leading-relaxed pr-2">
                  {terminalLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`${
                        log.includes('INFO')
                          ? 'text-slate-300'
                          : log.includes('DAEMON')
                          ? 'text-cyan-400'
                          : log.includes('SERVER')
                          ? 'text-emerald-400'
                          : 'text-amber-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>

                {/* Console Command Input */}
                <form
                  onSubmit={handleSendCommand}
                  className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2"
                >
                  <span className="text-cyan-400 font-bold">$</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Type server command (e.g. op Steve, say hello, status)..."
                    className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded bg-white/10 hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* File Manager View */}
            {activeTab === 'files' && (
              <div className="flex-1 bg-black/60 rounded-xl border border-white/10 p-3 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-slate-400">
                  <span>Name</span>
                  <span>Size</span>
                </div>
                <div className="flex items-center justify-between hover:bg-white/5 p-1.5 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>plugins/</span>
                  </div>
                  <span className="text-slate-500">Directory</span>
                </div>
                <div className="flex items-center justify-between hover:bg-white/5 p-1.5 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-emerald-400" />
                    <span>world/</span>
                  </div>
                  <span className="text-slate-500">142.8 MB</span>
                </div>
                <div className="flex items-center justify-between hover:bg-white/5 p-1.5 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>server.properties</span>
                  </div>
                  <span className="text-slate-500">2.1 KB</span>
                </div>
                <div className="flex items-center justify-between hover:bg-white/5 p-1.5 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>paper.yml</span>
                  </div>
                  <span className="text-slate-500">8.4 KB</span>
                </div>
              </div>
            )}

            {/* Activity View */}
            {activeTab === 'activity' && (
              <div className="flex-1 bg-black/60 rounded-xl border border-white/10 p-3 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-[11px] text-slate-400 pb-2 border-b border-white/10">
                  Recent Audit Logs
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Server started by Admin</span>
                  <span className="text-slate-500">2 mins ago</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Backup created (world_auto_2026.tar.gz)</span>
                  <span className="text-slate-500">1 hour ago</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Plugin installed (Vault.jar)</span>
                  <span className="text-slate-500">3 hours ago</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Switch Pill Buttons matching Screenshot 1 & 3 */}
        <div className="bg-[#121520] px-4 py-3 border-t border-white/5 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'console'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white bg-[#1a1e2c]'
            }`}
          >
            Console
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'files'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white bg-[#1a1e2c]'
            }`}
          >
            File Manager
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'activity'
                ? 'bg-white text-black shadow-md'
                : 'text-slate-400 hover:text-white bg-[#1a1e2c]'
            }`}
          >
            Activity
          </button>
        </div>
      </div>
    </section>
  );
};
