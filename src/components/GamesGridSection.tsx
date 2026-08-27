import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Flame, Users, ArrowUpRight } from 'lucide-react';

interface GamesGridSectionProps {
  onSelectGame?: (gameId: string) => void;
}

export const GamesGridSection: React.FC<GamesGridSectionProps> = ({ onSelectGame }) => {
  const { siteSettings, games, formatPrice } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter(
    (g) =>
      g.status === 'active' &&
      (g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGameClick = (gameId: string) => {
    if (onSelectGame) {
      onSelectGame(gameId);
    }
    const plansEl = document.getElementById('plans');
    plansEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="games" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header matching Screenshot 5 */}
      <div className="mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-2">
          {siteSettings.gamesSectionTitle}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mb-6">
          {siteSettings.gamesSectionSubtitle}
        </p>

        {/* Game Search Bar matching Screenshot 5 */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="game-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a game"
            className="w-full bg-[#12151e] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>

      {/* Games Cards Grid matching Screenshot 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="group relative overflow-hidden rounded-2xl bg-[#11131a] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
          >
            {/* Image Container with 16:9 aspect */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
              <img
                src={game.image}
                alt={game.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-[#11131a]/40 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {game.popular && (
                  <span className="bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 fill-black" />
                    Hot
                  </span>
                )}
                <span className="bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10">
                  {game.category}
                </span>
              </div>

              {/* Price Tag in image corner */}
              <div className="absolute bottom-3 right-3 bg-[#0d0f16]/90 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                From <span className="text-cyan-400 font-bold">{formatPrice(game.startingPrice)}</span>/mo
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  {game.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {game.shortDescription || game.activePlayers}
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-cyan-500 group-hover:text-black text-slate-400 flex items-center justify-center transition-all shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No games found matching "{searchTerm}". Try searching for Minecraft, Rust, or CS2.
        </div>
      )}
    </section>
  );
};
