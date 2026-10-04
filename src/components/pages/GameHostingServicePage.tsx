import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Server,
  Cpu,
  HardDrive,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Layers,
  HelpCircle,
  Clock,
  Globe,
  ChevronRight,
  Terminal,
  Download,
  FolderSync,
  Play,
  RotateCcw,
  Search,
} from 'lucide-react';

export const GameHostingServicePage: React.FC = () => {
  const { games, plans, formatPrice, openCheckout, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = (games || []).filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Game Server Hosting Fleet</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>High-Frequency Gaming Fleet</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight mb-4 leading-tight">
              Dedicated Game Server Hosting
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Select a title below to view dedicated server specifications, 1-click modpack installers, custom versions, and automated instant deployment.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search supported game titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg text-left"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredGames.map((game) => {
            const matchedPlans = plans.filter((p) => p.gameId === game.id);
            const minPrice = matchedPlans.length > 0 ? Math.min(...matchedPlans.map((p) => p.monthlyPrice)) : 4.99;

            return (
              <div
                key={game.id}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-blue-300 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={game.bannerUrl || game.iconUrl || game.image}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-sm">
                      From {formatPrice(minPrice)}/mo
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display mb-1.5 group-hover:text-blue-600 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {game.description || `High-performance ${game.name} cloud server with instant setup.`}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('services/game-hosting', { gameSlug: game.slug || game.id })}
                      className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
                    >
                      <span>View {game.name} Server Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
