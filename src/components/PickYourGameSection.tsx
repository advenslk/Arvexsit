import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';

interface GameCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  badge?: string;
  image: string;
  priceLkr: number;
  priceUsd: number;
}

export const PickYourGameSection: React.FC = () => {
  const { navigateTo, currency, formatPrice, openCheckout, plans } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const games: GameCard[] = [
    {
      id: 'mc',
      name: 'MINECRAFT',
      slug: 'minecraft',
      category: 'Java & Bedrock Crossplay',
      badge: 'Popular #1',
      priceLkr: 350,
      priceUsd: 1.25,
    },
    {
      id: 'hytale',
      name: 'HYTALE',
      slug: 'hytale',
      category: 'Next-Gen RPG Sandbox',
      badge: 'Pre-order 2026',
      priceLkr: 1200,
      priceUsd: 4.5,
    },
    {
      id: 'rust',
      name: 'RUST',
      slug: 'rust',
      category: 'Extreme High-Tick Survival',
      badge: 'AMD 7950X',
      priceLkr: 2400,
      priceUsd: 8.9,
    },
    {
      id: 'palworld',
      name: 'PALWORLD',
      slug: 'palworld',
      category: 'Dedicated Co-op & Dedicated Servers',
      badge: 'Hot',
      priceLkr: 1800,
      priceUsd: 6.5,
    },
    {
      id: 'valheim',
      name: 'VALHEIM',
      slug: 'valheim',
      category: 'Viking Survival Co-Op',
      priceLkr: 1400,
      priceUsd: 5.0,
    },
    {
      id: 'ark',
      name: 'ARK: SURVIVAL ASCENDED',
      slug: 'ark-sa',
      category: 'Unreal Engine 5 Mega-Nodes',
      priceLkr: 3200,
      priceUsd: 11.5,
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCardClick = (game: GameCard) => {
    if (game.slug === 'minecraft') {
      navigateTo('services-minecraft');
    } else {
      navigateTo('services-games');
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header matching Screenshot 4 */}
      <div className="flex items-end justify-between mb-8 pb-3 border-b border-white/5">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            SUPPORTED GAMES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
            PICK YOUR GAME
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('games')}
            className="text-xs sm:text-sm text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl bg-[#141624] hover:bg-[#1f233a] text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl bg-[#141624] hover:bg-[#1f233a] text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Games Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() => handleCardClick(g)}
            className="w-[280px] sm:w-[340px] shrink-0 rounded-3xl bg-[#111320] border border-white/10 hover:border-purple-500/50 overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group snap-start relative"
          >
            {/* Image Container with Dark Gradient Overlay matching Screenshot 4 */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden">
              <img
                src={g.image}
                alt={g.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111320] via-black/40 to-transparent" />

              {/* Top Badge */}
              {g.badge && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-purple-900/90 border border-purple-400/40 text-purple-200 text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  {g.badge}
                </div>
              )}

              {/* Game Title on Image bottom */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight uppercase drop-shadow-md">
                  {g.name}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/5 bg-[#111320]">
              <div>
                <p className="text-xs text-slate-400">{g.category}</p>
                <p className="text-sm font-black text-purple-300 font-display mt-0.5">
                  Starting at {currency.code === 'LKR' ? `Rs. ${g.priceLkr}` : `$${g.priceUsd}`}/mo
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-purple-600/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
