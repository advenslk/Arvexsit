import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Gamepad2,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const GamesPage: React.FC = () => {
  const { games, formatPrice, navigateTo } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Sandbox & Survival',
    'Action & Survival',
    'Competitive FPS',
    'Open World RPG',
    'Upcoming RPG & Sandbox',
  ];

  const filteredGames = (games || []).filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      (g.shortDescription && g.shortDescription.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || g.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleDeployGame = (gameId: string) => {
    navigateTo('plans');
  };

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
            <span className="text-blue-300/60">/</span>
            <span className="text-white font-bold">Game Catalog</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>Hundreds of Supported Game Titles</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Game Server Directory
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              Select from our curated lineup of high-performance multiplayer games. Every instance includes 1-click modpacks, automated updates, and NVMe Gen5 storage.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search games, mods, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors shadow-xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Games Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1"
            >
              {/* Game Cover Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={game.bannerImage || game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {game.popular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Popular</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-8 h-8 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                      {game.category}
                    </span>
                    <h3 className="text-base font-black text-white font-display truncate">
                      {game.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {game.shortDescription || 'High-performance game hosting with instant setup, DDoS filtering, and full FTP access.'}
                  </p>

                  {/* Player count / Active nodes metric */}
                  {game.activePlayers && (
                    <div className="flex items-center gap-2 text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl mb-4">
                      <Users className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                      <span className="font-semibold">{game.activePlayers}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting from</span>
                    <span className="text-base font-bold text-slate-900 font-display">
                      {formatPrice(game.startingPrice || 8.0)}
                      <span className="text-[11px] text-slate-500 font-normal">/mo</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeployGame(game.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <span>View Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
