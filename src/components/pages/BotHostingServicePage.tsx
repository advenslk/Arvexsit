import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Server,
  Cpu,
  HardDrive,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Layers,
  HelpCircle,
  Clock,
  Globe,
  ChevronRight,
  Terminal,
  Activity,
  Award,
  GitBranch,
  Code,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const BotHostingServicePage: React.FC = () => {
  const {
    plans,
    billingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
  } = useApp();

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);

  const botPlans = plans.filter(
    (p) => p.serviceType === 'bot-hosting' || p.id.includes('bot')
  );

  const getCalculatedPrice = (plan: HostingPlan) => {
    if (activeCycle === 'quarterly') {
      return plan.quarterlyPrice ? plan.quarterlyPrice / 3 : plan.monthlyPrice * 0.9;
    }
    if (activeCycle === 'yearly') {
      return plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice * 0.8;
    }
    return plan.monthlyPrice;
  };

  const supportedRuntimes = [
    { name: 'Node.js 18 / 20 / 22', sub: 'Discord.js, Sapphire, Eris' },
    { name: 'Python 3.10 - 3.12', sub: 'discord.py, Pycord, Nextcord' },
    { name: 'Java 17 / 21 LTS', sub: 'JDA, Discord4J, Lavalink' },
    { name: 'Go 1.22+', sub: 'DiscordGo, High Throughput' },
    { name: 'Rust', sub: 'Serenity, Twilight' },
    { name: 'C# / .NET 8', sub: 'DSharpPlus, Discord.Net' },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Discord &amp; Application Bot Hosting</span>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-[#0c0e17] via-[#141226] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Bot className="w-4 h-4" />
            <span>24/7 Always-Online Bot Containers with Git Auto-Deploy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            24/7 Discord &amp; App <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Bot Hosting
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Keep your Discord bots, automation scripts, and background APIs permanently online. Featuring GitHub auto-pull, Lavalink audio node support, and instant environment variables control.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('bot-plans-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>View Bot Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>Git Webhooks &amp; Auto-Restart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div id="bot-plans-table" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">
              Bot Hosting Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Isolated Docker containers with dedicated RAM and instant process restart triggers.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#11131e] p-1 rounded-xl border border-white/5 shrink-0">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeCycle === cycle
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {botPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className="bg-[#11131e] border border-white/5 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white font-display">{plan.name}</h3>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {plan.ram}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white font-display">
                        {formatPrice(price)}
                      </span>
                      <span className="text-xs text-slate-400">/ mo</span>
                    </div>
                  </div>

                  <div className="space-y-2 py-3.5 border-t border-b border-white/5 mb-5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dedicated RAM</span>
                      <span className="font-semibold text-white">{plan.ram}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">CPU Slice</span>
                      <span className="font-semibold text-white">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NVMe SSD</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Lavalink Audio</span>
                      <span className="font-semibold text-emerald-400">Supported</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Deploy Bot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('services/bot-hosting', { planSlug: plan.slug || plan.id })}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Dedicated Plan Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Languages */}
      <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8 mb-16">
        <h3 className="text-xl font-bold text-white font-display mb-2 flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-400" />
          Native Runtimes &amp; Frameworks
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Pre-configured runtime containers ready for immediate code deployment or git repository cloning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supportedRuntimes.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#161926] border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{r.name}</p>
                <p className="text-[11px] text-slate-400">{r.sub}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
