import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ExternalLink, Zap, Settings } from 'lucide-react';
import { Partner } from '../types';

export const OfficialPartnersTicker: React.FC = () => {
  const { partners, navigateTo, user, setIsAdminOpen } = useApp();

  const activePartners: Partner[] = (partners || []).filter((p) => p.active !== false);

  // If no partners, fallback safely or show prompt
  const displayPartners = activePartners.length > 0 ? activePartners : [];

  // Double the array for seamless infinite marquee loop
  const marqueeItems = [...displayPartners, ...displayPartners];

  const handlePartnerClick = (item: Partner) => {
    if (item.url && item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo('partners');
    }
  };

  return (
    <div className="w-full py-6 bg-gradient-to-b from-[#090a12] via-[#0e101d] to-[#090a12] border-y border-purple-900/30 overflow-hidden relative marquee-container">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-20 bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Top Header matching Screenshot */}
      <div className="max-w-7xl mx-auto px-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-900/20">
          <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400 animate-pulse" />
          <span>OFFICIAL ARVEX PARTNERS</span>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Edit Partners in Admin Panel"
            >
              <Settings className="w-3 h-3" />
              <span>Customize Partners</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('partners')}
            className="text-xs text-slate-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Become an Official Partner</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Infinite Horizontal Animation Track */}
      <div className="relative w-full overflow-hidden mask-gradient">
        {/* Left and Right Fade Masks for smooth edge blending */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#090a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#090a12] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee hover:pause flex items-center gap-4 py-2">
          {marqueeItems.map((item, index) => {
            const accentClass = item.accent || 'from-cyan-400 to-indigo-500';
            const iconBgClass = item.iconBg || 'bg-cyan-500/10 text-cyan-400';

            return (
              <div
                key={`${item.id || item.name}-${index}`}
                onClick={() => handlePartnerClick(item)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#121422]/90 hover:bg-[#191d33] border ${
                  item.isSpecial
                    ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                    : 'border-white/5 hover:border-purple-500/40 shadow-md'
                } transition-all duration-200 cursor-pointer shrink-0 group`}
              >
                {/* Partner Logo / Badge Graphic */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm overflow-hidden shrink-0 ${iconBgClass} group-hover:scale-105 transition-transform`}
                >
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Fallback if image link fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : item.isSpecial ? (
                    <Award className="w-5 h-5 text-yellow-300 fill-yellow-400/20" />
                  ) : (
                    <span className="font-display tracking-tighter">
                      {item.name ? item.name.slice(0, 2).toUpperCase() : 'AR'}
                    </span>
                  )}
                </div>

                {/* Partner Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display font-extrabold text-sm sm:text-base tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${accentClass}`}
                    >
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                    {item.tagline || item.description || item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

