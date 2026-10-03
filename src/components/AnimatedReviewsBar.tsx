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
    <section className="relative overflow-hidden border-y border-slate-200 bg-[#f8fafc] py-20 sm:py-24 text-slate-800">
      <div className="relative z-10 mx-auto mb-12 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {user?.role === 'admin' && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm"
            >
              <Settings className="mr-1 inline h-3.5 w-3.5" />
              Customize Customer Reviews in Admin Panel
            </button>
          </div>
        )}

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-3 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
          <span>Real Customer Feedback</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Loved by Thousands of <span className="text-blue-600">Gamers &amp; Devs</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-500 font-medium">
          Real feedback from HelzerX Cloud server owners, clans, and cloud teams worldwide.
        </p>

        {/* Rating summary pill */}
        <div className="mt-6 inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="grid h-5 w-5 place-items-center rounded bg-[#00b67a]">
                <Star className="h-3.5 w-3.5 fill-white text-white" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-black text-slate-900">{avgRating}</span>
            <span className="text-slate-400">/ 5</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">
              Based on <strong className="text-slate-900">{totalReviews || 120} verified reviews</strong>
            </span>
          </div>
        </div>
      </div>

      {displayReviews.length > 0 ? (
        <div className="relative w-full overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#f8fafc] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#f8fafc] to-transparent" />

          <div className="animate-marquee flex items-stretch gap-6 px-6">
            {marqueeReviews.map((rev, idx) => {
              const ratingCount = Math.max(0, Math.min(5, rev.rating || 5));
              const initials = rev.avatar || (rev.name ? rev.name.slice(0, 2).toUpperCase() : 'AR');
              return (
                <article
                  key={`${rev.id || rev.name}-${idx}`}
                  className="w-[320px] shrink-0 sm:w-[380px] rounded-3xl bg-white p-6 border border-slate-200 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {rev.avatarImage ? (
                          <img
                            src={rev.avatarImage}
                            alt={rev.name}
                            referrerPolicy="no-referrer"
                            className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 text-left">
                          <div className="flex items-center gap-1.5">
                            <h4 className="truncate text-sm font-bold text-slate-900">{rev.name}</h4>
                            {rev.verified && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                          </div>
                          <p className="text-[11px] font-medium text-slate-400">{rev.role}</p>
                        </div>
                      </div>
                      <Quote className="h-6 w-6 text-slate-300 shrink-0" />
                    </div>

                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, st) => (
                        <span
                          key={st}
                          className={`grid h-3.5 w-3.5 place-items-center rounded ${
                            st < ratingCount ? 'bg-[#00b67a]' : 'bg-slate-200'
                          }`}
                        >
                          <Star className="h-2 w-2 fill-white text-white" />
                        </span>
                      ))}
                      <span className="ml-2 text-[10px] font-bold text-emerald-600">Verified</span>
                    </div>

                    <p className="text-left text-xs leading-relaxed text-slate-600">
                      &ldquo;{rev.reviewText}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {rev.serverType || 'Cloud Host'}
                    </span>
                    <span>{rev.date || 'Recently'}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-6 text-center text-sm text-slate-500">
          Customer reviews will appear here once published from the admin panel.
        </div>
      )}
    </section>
  );
};
