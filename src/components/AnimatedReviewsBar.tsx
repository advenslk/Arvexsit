import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, CheckCircle2, Settings } from 'lucide-react';
import { CustomerReview } from '../types';

export const AnimatedReviewsBar: React.FC = () => {
  const { reviews, user, setIsAdminOpen } = useApp();

  const activeReviews: CustomerReview[] = (reviews || []).filter((r) => r.active !== false);
  const displayReviews = activeReviews.length > 0 ? activeReviews : [];

  // Calculate dynamic rating averages
  const totalReviews = displayReviews.length;
  const avgRating = totalReviews > 0
    ? (displayReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '4.9';

  // Duplicate for smooth infinite marquee
  const marqueeReviews = [...displayReviews, ...displayReviews];

  return (
    <section className="py-20 bg-gradient-to-b from-[#090a12] via-[#0d0f1c] to-[#090a12] relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        {/* Quick Admin customize shortcut */}
        {user?.role === 'admin' && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition-all shadow-md cursor-pointer"
              title="Manage Reviews in Admin Panel"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize Customer Reviews in Admin Panel</span>
            </button>
          </div>
        )}

        {/* Title matching Screenshot */}
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-2">
          PLAYERS DON&apos;T LIE.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-medium mb-6">
          Look at these verified reviews from authentic players and creators
        </p>

        {/* Trustpilot Rating Widget */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-2.5 rounded-2xl bg-[#121422] border border-white/10 shadow-xl">
          {/* 5 Green Trustpilot Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[3px] shadow-sm"
              >
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-black text-white">{avgRating}</span>
            <span className="text-slate-400">/ 5</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">
              Based on <strong className="text-white">{totalReviews || 37} verified reviews</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-white/10 text-xs font-bold text-white">
            <Star className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />
            <span>Trustpilot</span>
          </div>
        </div>
      </div>

      {/* Continuous Marquee Review Slider */}
      <div className="relative w-full overflow-hidden marquee-container">
        {/* Edge gradient masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#090a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#090a12] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee hover:pause flex items-stretch gap-6 py-4">
          {marqueeReviews.map((rev, idx) => {
            const avatarBgClass = rev.avatarBg || 'from-purple-600 to-indigo-700';
            const ratingCount = rev.rating || 5;

            return (
              <div
                key={`${rev.id || rev.name}-${idx}`}
                className="w-[340px] sm:w-[400px] bg-[#111320]/95 hover:bg-[#16192c] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 shrink-0 group"
              >
                <div>
                  {/* Header with avatar & name */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {rev.avatarImage ? (
                        <img
                          src={rev.avatarImage}
                          alt={rev.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-2xl object-cover border border-white/20 shadow-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarBgClass} text-white font-black text-xs flex items-center justify-center shadow-md border border-white/20 shrink-0`}
                        >
                          {rev.avatar || (rev.name ? rev.name.slice(0, 2).toUpperCase() : 'AR')}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {rev.name}
                          </h4>
                          {rev.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00b67a]" title="Verified Client" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {rev.role}
                        </p>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, st) => (
                        <div
                          key={st}
                          className={`w-3.5 h-3.5 ${
                            st < ratingCount ? 'bg-[#00b67a]' : 'bg-slate-700/50'
                          } flex items-center justify-center rounded-[2px]`}
                        >
                          <Star className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed italic mb-4">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>

                {/* Footer info */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                  {rev.serverType ? (
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-purple-300 border border-white/5">
                      {rev.serverType}
                    </span>
                  ) : (
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400">
                      Verified Host
                    </span>
                  )}
                  <span>{rev.date || 'Recently'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

