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
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Hundreds of Supported Titles</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Game Server Directory
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Select from our curated lineup of high-performance multiplayer games. Every instance includes 1-click modpacks, automated updates, and NVMe Gen5 storage.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games, mods, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121422] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-[#11131e] text-slate-400 hover:text-white border border-white/5'
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
            className="group relative rounded-3xl bg-[#0f111c] border border-white/10 hover:border-cyan-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
          >
            {/* Game Cover Image Header */}
            <div className="relative h-48 w-full overflow-hidden bg-black/40">
              <img
                src={game.bannerImage || game.image}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f111c] via-[#0f111c]/40 to-transparent" />

              {game.popular && (
                <div className="absolute top-3 right-3 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-black" />
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
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {game.shortDescription || 'High-performance game hosting with instant setup, DDoS filtering, and full FTP access.'}
                </p>

                {/* Player count / Active nodes metric */}
                {game.activePlayers && (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl mb-4">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold">{game.activePlayers}</span>
                  </div>
                )}
              </div>

              {/* Bottom Row */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Starting from</span>
                  <span className="text-base font-bold text-white font-display">
                    {formatPrice(game.startingPrice || 8.0)}
                    <span className="text-[11px] text-slate-400 font-normal">/mo</span>
                  </span>
                </div>

                <button
                  onClick={() => handleDeployGame(game.id)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md"
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
  );
};
