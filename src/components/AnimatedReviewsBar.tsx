import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, CheckCircle2, Settings, Quote } from 'lucide-react';
import { CustomerReview } from '../types';

export const AnimatedReviewsBar: React.FC = () => {
  const { reviews, user, setIsAdminOpen } = useApp();
  const activeReviews: CustomerReview[] = (reviews || []).filter((r) => r.active !== false);
  const displayReviews = activeReviews;
  const totalReviews = displayReviews.length;
  const avgRating = totalReviews > 0
    ? (displayReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '4.9';
  const marqueeReviews = displayReviews.length > 1 ? [...displayReviews, ...displayReviews] : displayReviews;

  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-[linear-gradient(180deg,#080912_0%,#0d0b18_48%,#080912_100%)] py-20 sm:py-24">
      <style>{`
        @keyframes arvexReviewFloat3D{0%,100%{transform:translate3d(0,0,0) rotateX(0deg) rotateY(0deg)}50%{transform:translate3d(0,-7px,0) rotateX(1.5deg) rotateY(-.5deg)}}
        @keyframes arvexReviewGlow{0%,100%{opacity:.28;transform:scale(.9)}50%{opacity:.65;transform:scale(1.12)}}
        @keyframes arvexReviewShine{0%{transform:translateX(-130%) skewX(-18deg)}55%,100%{transform:translateX(160%) skewX(-18deg)}}
        .arvex-review-track{display:flex;width:max-content;animation:marquee 38s linear infinite;}
        .arvex-review-track:hover{animation-play-state:paused}
        .arvex-review-card{position:relative;transform-style:preserve-3d;perspective:1000px;animation:arvexReviewFloat3D 6s ease-in-out infinite;}
        .arvex-review-card:nth-child(2n){animation-delay:-1.4s}.arvex-review-card:nth-child(3n){animation-delay:-2.8s}
        .arvex-review-card:hover{animation-play-state:paused;transform:translate3d(0,-10px,35px) rotateX(3deg) rotateY(-2deg)!important;box-shadow:0 32px 90px rgba(88,28,135,.30),0 0 45px rgba(168,85,247,.12)}
        .arvex-review-glow{animation:arvexReviewGlow 4s ease-in-out infinite}
        .arvex-review-shine{animation:arvexReviewShine 6s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.arvex-review-track,.arvex-review-card,.arvex-review-glow,.arvex-review-shine{animation:none!important}}
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto mb-12 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {user?.role === 'admin' && (
          <div className="mb-4 flex justify-center">
            <button onClick={() => setIsAdminOpen(true)} className="rounded-xl border border-cyan-500/30 bg-cyan-950/70 px-3 py-1.5 text-xs text-cyan-400">
              <Settings className="mr-1 inline h-3.5 w-3.5" />Customize Customer Reviews in Admin Panel
            </button>
          </div>
        )}
        <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-purple-400">Real customer feedback</p>
        <h2 className="mb-2 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">OUR USERS REVIEWS.</h2>
        <p className="mb-6 text-sm font-medium text-slate-400 sm:text-base">Real experiences from ArveX customers, creators and server owners.</p>
        <div className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#121422]/90 px-5 py-2.5 shadow-[0_18px_55px_rgba(0,0,0,.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => <div key={s} className="grid h-5 w-5 place-items-center rounded-[3px] bg-[#00b67a]"><Star className="h-3.5 w-3.5 fill-white text-white" /></div>)}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-black text-white">{avgRating}</span><span className="text-slate-400">/ 5</span><span className="text-slate-500">•</span>
            <span className="text-slate-300">Based on <strong className="text-white">{totalReviews || 0} verified reviews</strong></span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3 text-xs font-bold text-white">
            <Star className="h-4 w-4 fill-[#00b67a] text-[#00b67a]" />Trustpilot
          </div>
        </div>
      </div>

      {displayReviews.length > 0 ? (
        <div className="relative w-full overflow-hidden py-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-[#080912] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-[#080912] to-transparent sm:w-16" />
          <div className="arvex-review-track items-stretch gap-5 px-6 sm:gap-6 sm:px-10">
            {marqueeReviews.map((rev, idx) => {
              const ratingCount = Math.max(0, Math.min(5, rev.rating || 5));
              const initials = rev.avatar || (rev.name ? rev.name.slice(0, 2).toUpperCase() : 'AR');
              return (
                <article key={`${rev.id || rev.name}-${idx}`} className="arvex-review-card group w-[320px] shrink-0 sm:w-[390px]">
                  <div className="absolute -inset-2 rounded-[30px] bg-purple-500/10 blur-2xl arvex-review-glow" />
                  <div className="relative flex min-h-[245px] flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(22,25,42,.98),rgba(10,12,23,.98))] p-5 shadow-[0_24px_70px_rgba(0,0,0,.42)] ring-1 ring-white/[0.025] backdrop-blur-2xl sm:p-6">
                    <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent arvex-review-shine" />
                    <div className="relative z-10">
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {rev.avatarImage ? (
                            <img src={rev.avatarImage} alt={rev.name} referrerPolicy="no-referrer" className="h-12 w-12 shrink-0 rounded-2xl border border-white/20 object-cover shadow-[0_8px_25px_rgba(0,0,0,.35)]" />
                          ) : (
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-purple-300/20 bg-gradient-to-br from-purple-600/80 to-indigo-700/80 text-xs font-black text-white shadow-[0_8px_25px_rgba(124,58,237,.25)]">{initials}</div>
                          )}
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-1.5">
                              <h4 className="truncate text-sm font-black text-white sm:text-base">{rev.name}</h4>
                              {rev.verified && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                            </div>
                            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400 sm:text-[11px]">{rev.role}</p>
                          </div>
                        </div>
                        <Quote className="h-7 w-7 shrink-0 text-purple-400/25" />
                      </div>

                      <div className="mb-4 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, st) => (
                          <span key={st} className={`grid h-4 w-4 place-items-center rounded-[3px] ${st < ratingCount ? 'bg-[#00b67a]' : 'bg-slate-700/50'}`}>
                            <Star className="h-2.5 w-2.5 fill-white text-white" />
                          </span>
                        ))}
                        <span className="ml-2 text-[10px] font-bold text-emerald-300">Verified</span>
                      </div>

                      <p className="text-left text-xs leading-6 text-slate-200/85 sm:text-[13px]">&ldquo;{rev.reviewText}&rdquo;</p>
                    </div>

                    <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[10px] text-slate-500">
                      <span className="rounded-lg border border-purple-400/10 bg-purple-500/[0.08] px-2 py-1 font-mono text-purple-300">{rev.serverType || 'Verified Host'}</span>
                      <span>{rev.date || 'Recently'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-6 text-center text-sm text-slate-500">Customer reviews will appear here once published from the admin panel.</div>
      )}
    </section>
  );
};
