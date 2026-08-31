import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HostingPlan } from '../types';
import { Server, Cpu, HardDrive, Users, CheckCircle2, Flame, Zap, ShieldCheck, Package, ArrowRight } from 'lucide-react';

interface GameHostingPlansSectionProps { selectedGameId?: string; onSelectGame?: (gameId: string) => void; }

export const GameHostingPlansSection: React.FC<GameHostingPlansSectionProps> = ({ selectedGameId: propSelectedGameId, onSelectGame }) => {
  const { siteSettings, games, plans, billingCycle, setBillingCycle, formatPrice, openCheckout } = useApp();
  const [activeGameId, setActiveGameId] = useState(propSelectedGameId || 'minecraft');
  const [activeTier, setActiveTier] = useState<'All'|'Starter'|'Standard'|'Premium'>('All');
  const currentGameId = propSelectedGameId || activeGameId;
  const currentGame = games.find(g => g.id === currentGameId) || games[0];
  const gamePlans = plans.filter(p => p.gameId === currentGameId);
  const filteredPlans = activeTier === 'All' ? gamePlans : gamePlans.filter(p => p.tier === activeTier);
  const displayPlans = filteredPlans.length > 0 ? filteredPlans : gamePlans;
  const getPlanPrice = (plan: HostingPlan) => billingCycle === 'quarterly' ? (plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * .95) : billingCycle === 'yearly' ? (plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * .85) : plan.monthlyPrice;

  return <section id="plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <style>{`@keyframes arvexPlanFloat{0%,100%{transform:translateY(0) rotateX(0deg) rotateY(0deg)}50%{transform:translateY(-5px) rotateX(1deg) rotateY(-1deg)}}@keyframes arvexCoreSpin{from{transform:rotateX(62deg) rotateZ(0)}to{transform:rotateX(62deg) rotateZ(360deg)}}@keyframes arvexCorePulse{0%,100%{transform:scale(.9);opacity:.25}50%{transform:scale(1.08);opacity:.75}}.arvexPlan3D{transform-style:preserve-3d;perspective:1000px}.arvexPlanCard{transform-style:preserve-3d;transition:transform .45s ease,box-shadow .45s ease,border-color .45s ease}.arvexPlanCard:hover{transform:translateY(-9px) rotateX(2deg) rotateY(-1deg);box-shadow:0 25px 65px rgba(88,28,135,.2)}.arvexPlanFloat{animation:arvexPlanFloat 5s ease-in-out infinite}.arvexCoreSpin{animation:arvexCoreSpin 10s linear infinite}.arvexCorePulse{animation:arvexCorePulse 3s ease-in-out infinite}`}</style>

    <div className="text-center max-w-3xl mx-auto mb-10">
      <p className="text-xs uppercase tracking-[.28em] text-purple-400 font-bold mb-2">Premium game infrastructure</p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-display uppercase mb-3">{siteSettings.pricingSectionTitle}</h2>
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">{siteSettings.pricingSectionSubtitle}</p>
      <div className="inline-flex items-center bg-[#131620] p-1 rounded-full border border-white/10 shadow-inner">
        {(['monthly','quarterly','yearly'] as const).map(c => <button key={c} onClick={() => setBillingCycle(c)} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${billingCycle===c?'bg-white text-black shadow-md':'text-slate-400 hover:text-white'}`}>{c==='monthly'?'Mo':c==='quarterly'?'3Mo':'Yr'}{c==='yearly'&&<span className="ml-1 text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full">-15%</span>}</button>)}
      </div>
    </div>

    {currentGame && <div className="arvexPlan3D relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#101624] via-[#171a31] to-[#0c1019] border border-white/10 shadow-2xl p-6 sm:p-8 min-h-[190px] flex items-center justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(139,92,246,.20),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(34,211,238,.10),transparent_25%)]" />
      <div className="arvexPlanFloat relative z-10 max-w-xl">
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"><Flame className="w-5 h-5" /></div><div><h3 className="text-2xl sm:text-3xl font-bold text-white font-display">{currentGame.name}</h3><p className="text-xs text-slate-300 font-medium">Starting from {formatPrice(currentGame.startingPrice)}/month</p></div></div>
        <div className="mt-4 flex items-center gap-2">{(['All','Starter','Standard','Premium'] as const).map(t=><button key={t} onClick={()=>setActiveTier(t)} className={`text-xs font-semibold px-4 py-1.5 rounded-xl border transition-all ${activeTier===t?'bg-white text-black border-white':'bg-[#181d2a]/80 text-slate-300 border-white/10 hover:bg-[#202738]'}`}>{t}</button>)}</div>
      </div>
      <div className="hidden sm:flex relative w-48 h-40 items-center justify-center [perspective:900px]" aria-hidden="true"><div className="arvexCorePulse absolute w-32 h-32 rounded-full border border-purple-400/30" /><div className="arvexCoreSpin absolute w-32 h-32 rounded-full border border-dashed border-purple-400/40" /><div className="arvexCoreSpin absolute w-44 h-20 rounded-[50%] border border-cyan-400/20" style={{animationDuration:'13s',animationDirection:'reverse'}} /><div className="arvexPlanFloat relative w-20 h-20 rounded-2xl bg-[#15172b] border border-purple-300/40 shadow-[0_20px_50px_rgba(124,58,237,.35)] flex items-center justify-center"><Server className="w-9 h-9 text-purple-300" /></div></div>
    </div>}

    <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">{games.map(g=>{const selected=currentGameId===g.id;return <button key={g.id} onClick={()=>{setActiveGameId(g.id);onSelectGame?.(g.id)}} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${selected?'bg-white text-black border-white shadow-lg':'bg-[#12151f] hover:bg-[#181c2b] text-slate-300 border-white/10'}`}><span className={`w-4 h-4 rounded-full flex items-center justify-center ${selected?'bg-black/10':'bg-white/5'}`}><GameIcon name={g.name}/></span><span>{g.name}</span></button>})}</div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">{displayPlans.map((plan,idx)=>{const price=getPlanPrice(plan);return <div key={plan.id} className={`arvexPlanCard relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${plan.popular?'bg-[#121622] border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/10':'bg-[#0f121a] border border-white/10 hover:border-purple-400/30'}`} style={{animationDelay:`${idx*120}ms`}}>
      {plan.popular&&<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20"><div className="inline-flex items-center gap-1 bg-white text-black font-extrabold text-[11px] px-3.5 py-1 rounded-full shadow-lg"><Zap className="w-3 h-3 text-cyan-600" />{plan.badge||'Popular'}<Zap className="w-3 h-3 text-cyan-600" /></div></div>}
      <div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#1b202e] border border-white/10 flex items-center justify-center text-cyan-400"><Package className="w-5 h-5" /></div><div><h4 className="text-lg font-bold text-white tracking-tight">{plan.name}</h4><p className="text-xs text-slate-400">{plan.subtitle}</p></div></div>
      <div className="flex items-baseline gap-2 mb-6">{plan.originalPrice&&<span className="text-sm text-slate-500 line-through">{formatPrice(plan.originalPrice)}</span>}<div className="flex items-baseline"><span className="text-3xl sm:text-4xl font-extrabold text-white font-display">{formatPrice(price)}</span><span className="text-xs text-slate-400 ml-1">/month</span></div></div>
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-white/5 mb-6 text-xs text-slate-300"><div className="flex items-center gap-2"><Server className="w-4 h-4 text-slate-400 shrink-0" />{plan.ram}</div><div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-slate-400 shrink-0" />{plan.cpu}</div><div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-slate-400 shrink-0" />{plan.storage}</div><div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400 shrink-0" />{plan.players}</div></div></div>
      <button id={`plan-get-started-${plan.id}`} onClick={()=>openCheckout(plan)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 ${plan.popular?'bg-white hover:bg-slate-100 text-black':'bg-[#232938] hover:bg-[#2e364a] text-white'}`}>Get Started<ArrowRight className="w-3.5 h-3.5" /></button>
    </div>})}</div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[['Instant Setup', 'Ready in seconds', Zap],['DDoS Protection','Enterprise-grade',ShieldCheck],['Mod Support','Easy installation',Package],['24/7 Support','Always here to help',CheckCircle2]].map(([title,sub,Icon])=>{const I=Icon as React.ElementType;return <div key={title as string} className="arvexPlanCard bg-[#12151f] border border-white/5 rounded-2xl p-3.5 text-center hover:border-purple-400/25"><I className="w-4 h-4 mx-auto mb-1 text-purple-300" /><p className="text-xs font-bold text-white">{title as string}</p><p className="text-[11px] text-slate-400 mt-0.5">{sub as string}</p></div>})}</div>
  </section>;
};

const GameIcon: React.FC<{name:string}> = ({name}) => <span className="text-[8px] font-black text-slate-300">{name.slice(0,1).toUpperCase()}</span>;
