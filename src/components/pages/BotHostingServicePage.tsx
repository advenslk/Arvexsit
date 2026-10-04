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
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button onClick={() => navigateTo('services')} className="hover:text-blue-600 transition-colors font-medium">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-blue-600 font-semibold">Discord &amp; App Bot Hosting</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>24/7 Always-Online Bot Containers with Git Auto-Deploy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight mb-5">
              24/7 Discord &amp; App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                Bot Hosting
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Keep your Discord bots, automation scripts, and background APIs permanently online. Featuring GitHub auto-pull, Lavalink audio node support, and instant environment variables control.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('bot-plans-table');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>View Bot Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 px-4 py-3.5 rounded-xl shadow-xs">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span>Git Webhooks &amp; Auto-Restart</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Plans Section */}
        <div id="bot-plans-table" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display mb-2">
                Bot Hosting Plans
              </h2>
              <p className="text-sm text-slate-500">
                Isolated Docker containers with dedicated RAM and instant process restart triggers.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setActiveCycle(cycle)}
                  className={`py-1.5 px-3.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeCycle === cycle
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
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
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-slate-900 font-display">{plan.name}</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                        {plan.ram}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ mo</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-3.5 border-t border-b border-slate-100 mb-5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Dedicated RAM</span>
                        <span className="font-semibold text-slate-900">{plan.ram}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">CPU Slice</span>
                        <span className="font-semibold text-slate-900">{plan.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">NVMe SSD</span>
                        <span className="font-semibold text-slate-900">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Lavalink Audio</span>
                        <span className="font-semibold text-emerald-600">Supported</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Deploy Bot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo('services/bot-hosting', { planSlug: plan.slug || plan.id })}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
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
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 mb-16 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 font-display mb-2 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            Native Runtimes &amp; Frameworks
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Pre-configured runtime containers ready for immediate code deployment or git repository cloning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {supportedRuntimes.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{r.name}</p>
                  <p className="text-[11px] text-slate-500">{r.sub}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
