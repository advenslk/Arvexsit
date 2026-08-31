import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, CheckCircle2, Settings } from 'lucide-react';
import { CustomerReview } from '../types';

export const AnimatedReviewsBar: React.FC = () => {
  const { reviews, user, setIsAdminOpen } = useApp();
  const activeReviews: CustomerReview[] = (reviews || []).filter((r) => r.active !== false);
  const displayReviews = activeReviews.length > 0 ? activeReviews : [];
  const totalReviews = displayReviews.length;
  const avgRating = totalReviews > 0 ? (displayReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1) : '4.9';
  const marqueeReviews = [...displayReviews, ...displayReviews];
  return (
    <section className="py-20 bg-gradient-to-b from-[#090a12] via-[#0d0f1c] to-[#090a12] relative overflow-hidden">
      <style>{`@keyframes arvexReviewFloat{0%,100%{transform:translateY(0) rotateX(0deg)}50%{transform:translateY(-6px) rotateX(1.5deg)}}.arvexReviewCard{transform-style:preserve-3d;perspective:900px}.arvexReviewCard:hover{transform:translateY(-8px) rotateX(2deg) rotateY(-1deg);box-shadow:0 25px 70px rgba(88,28,135,.2)}.arvexReviewInner{animation:arvexReviewFloat 6s ease-in-out infinite}`}</style>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        {user?.role === 'admin' && <div className="mb-4 flex justify-center"><button onClick={() => setIsAdminOpen(true)} className="text-xs text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-3 py-1.5 rounded-xl"><Settings className="w-3.5 h-3.5 inline mr-1" />Customize Customer Reviews in Admin Panel</button></div>}
        <p className="text-xs uppercase tracking-[.28em] text-purple-400 font-bold mb-3">Real customer feedback</p>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase mb-2">OUR USERS REVIEWS.</h2>
        <p className="text-slate-400 text-sm sm:text-base font-medium mb-6">Real experiences from ArveX customers, creators and server owners.</p>
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-2.5 rounded-2xl bg-[#121422] border border-white/10 shadow-xl hover:-translate-y-1 transition-transform"><div className="flex items-center gap-1">{[1,2,3,4,5].map(s=><div key={s} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[3px]"><Star className="w-3.5 h-3.5 text-white fill-white" /></div>)}</div><div className="flex items-center gap-2 text-xs sm:text-sm"><span className="font-black text-white">{avgRating}</span><span className="text-slate-400">/ 5</span><span className="text-slate-500">•</span><span className="text-slate-300">Based on <strong className="text-white">{totalReviews || 37} verified reviews</strong></span></div><div className="flex items-center gap-1 pl-2 border-l border-white/10 text-xs font-bold text-white"><Star className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />Trustpilot</div></div>
      </div>
      <div className="relative w-full overflow-hidden marquee-container"><div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#090a12] to-transparent z-10 pointer-events-none" /><div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#090a12] to-transparent z-10 pointer-events-none" /><div className="animate-marquee hover:pause flex items-stretch gap-6 py-4">
        {marqueeReviews.map((rev, idx) => { const ratingCount=rev.rating||5; return <div key={`${rev.id||rev.name}-${idx}`} className="arvexReviewCard w-[340px] sm:w-[400px] bg-[#111320]/95 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 shrink-0 group"><div className="arvexReviewInner"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3">{rev.avatarImage?<img src={rev.avatarImage} alt={rev.name} referrerPolicy="no-referrer" className="w-11 h-11 rounded-2xl object-cover border border-white/20" />:<div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center border border-white/20">{rev.avatar||(rev.name?rev.name.slice(0,2).toUpperCase():'AR')}</div>}<div><div className="flex items-center gap-1.5"><h4 className="text-sm font-bold text-white">{rev.name}</h4>{rev.verified&&<CheckCircle2 className="w-3.5 h-3.5 text-[#00b67a]" />}</div><p className="text-[11px] text-slate-400">{rev.role}</p></div></div><div className="flex items-center gap-0.5">{Array.from({length:5}).map((_,st)=><div key={st} className={`w-3.5 h-3.5 ${st<ratingCount?'bg-[#00b67a]':'bg-slate-700/50'} flex items-center justify-center rounded-[2px]`}><Star className="w-2.5 h-2.5 text-white fill-white" /></div>)}</div></div><p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed italic mb-4">&ldquo;{rev.reviewText}&rdquo;</p></div><div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500"><span className="font-mono bg-white/5 px-2 py-0.5 rounded text-purple-300 border border-white/5">{rev.serverType||'Verified Host'}</span><span>{rev.date||'Recently'}</span></div></div>; })}
      </div></div>
    </section>
  );
};
