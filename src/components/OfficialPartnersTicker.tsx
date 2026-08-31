import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ExternalLink, Zap, Settings } from 'lucide-react';
import { Partner } from '../types';

export const OfficialPartnersTicker: React.FC = () => {
  const { partners, navigateTo, user, setIsAdminOpen } = useApp();

  const activePartners: Partner[] = (partners || []).filter((p) => p.active !== false);
  const displayPartners = activePartners.length > 0 ? activePartners : [];
  const marqueeItems = [...displayPartners, ...displayPartners];

  const handlePartnerClick = (item: Partner) => {
    if (item.url && item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo('partners');
    }
  };

  return (
    <section className="relative w-full overflow-hidden border-y border-white/[0.06] bg-[#020207] py-5 sm:py-6">
      {/* Soft transition from the hero into the black partner strip */}
      <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-full bg-purple-600/[0.08] blur-3xl" />

      <div className="relative z-10 mx-auto mb-3 flex max-w-7xl items-center justify-between gap-3 px-4 sm:mb-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-950/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-purple-200 shadow-[0_0_25px_rgba(124,58,237,.12)] sm:px-4 sm:text-[10px]">
          <Zap className="h-3.5 w-3.5 animate-pulse text-purple-300" fill="currentColor" />
          <span>Official ArveX Partners</span>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/60 px-2.5 py-1 text-[11px] font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              title="Edit Partners in Admin Panel"
            >
              <Settings className="h-3 w-3" />
              <span>Customize Partners</span>
            </button>
          )}
          <button
            onClick={() => navigateTo('partners')}
            className="flex cursor-pointer items-center gap-1 text-[10px] font-medium text-slate-500 transition-colors hover:text-purple-300 sm:text-xs"
          >
            <span>Become an Official Partner</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#020207] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#020207] to-transparent sm:w-24" />

        <div className="animate-marquee flex w-max items-center gap-3 py-1 will-change-transform sm:gap-4">
          {marqueeItems.map((item, index) => {
            const accentClass = item.accent || 'from-cyan-400 to-indigo-500';
            const iconBgClass = item.iconBg || 'bg-cyan-500/10 text-cyan-400';

            return (
              <div
                key={`${item.id || item.name}-${index}`}
                onClick={() => handlePartnerClick(item)}
                className={`group flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl border bg-[#0b0c13]/95 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#11121c] sm:px-5 sm:py-3 ${
                  item.isSpecial
                    ? 'border-yellow-500/35 shadow-yellow-500/10'
                    : 'border-white/[0.06] hover:border-purple-500/30'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-black transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10 ${iconBgClass}`}>
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full rounded-xl object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : item.isSpecial ? (
                    <Award className="h-5 w-5 fill-yellow-400/20 text-yellow-300" />
                  ) : (
                    <span className="font-display tracking-tighter">{item.name ? item.name.slice(0, 2).toUpperCase() : 'AR'}</span>
                  )}
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`bg-gradient-to-r bg-clip-text font-display text-sm font-extrabold tracking-wide text-transparent sm:text-base ${accentClass}`}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="rounded border border-yellow-400/30 bg-yellow-400/10 px-1.5 py-0.5 text-[8px] font-bold text-yellow-300">{item.badge}</span>
                    )}
                  </div>
                  <span className="max-w-[180px] truncate text-[10px] font-medium text-slate-500 sm:max-w-[200px] sm:text-[11px]">
                    {item.tagline || item.description || item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
