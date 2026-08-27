import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, siteSettings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Subtitle matching Screenshot 2 & 8 */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-3">
          Reputable Servers.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          See what our community has to say about their experience with {siteSettings.brandName}.
        </p>
      </div>

      {/* Testimonials Grid / Carousel */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((test) => (
            <div
              key={test.id}
              className="rounded-3xl bg-[#11131a] border border-white/5 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-white/15 transition-all"
            >
              <div>
                {/* 5 Stars matching Screenshot 2 & 8 */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  {test.quote}
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-[#1e2330] border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                  {test.avatarInitial}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {test.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator dots matching Screenshot 2 & 8 */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-5 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  );
};
