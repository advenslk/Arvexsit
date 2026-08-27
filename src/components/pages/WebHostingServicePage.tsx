import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
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
  ChevronRight,
  Lock,
  Mail,
  Database,
  FileCode,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const WebHostingServicePage: React.FC = () => {
  const {
    plans,
    billingCycle,
    formatPrice,
    openCheckout,
    navigateTo,
  } = useApp();

  const [activeCycle, setActiveCycle] = useState<BillingCycle>(billingCycle);

  const webPlans = plans.filter(
    (p) => p.serviceType === 'web-hosting' || p.id.includes('web')
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

  const webFeatures = [
    { title: 'LiteSpeed Enterprise Web Server', desc: 'Up to 12x faster TTFB compared to traditional Apache/Nginx stacks with LSCache built-in.' },
    { title: 'Free Automated SSL Certificates', desc: 'Automatic Let\'s Encrypt Wildcard certificates provisioned for all your domains and subdomains.' },
    { title: '1-Click WordPress & App Installer', desc: 'Deploy WordPress, Nextcloud, Ghost, Joomla, and 400+ applications in one click.' },
    { title: 'Multi-Version PHP & Node.js', desc: 'Easily toggle PHP 7.4 through 8.3, Node.js 18-22, Python, and Ruby per directory.' },
    { title: 'Unlimited Business Mailboxes', desc: 'Professional @yourdomain.com email with SpamAssassin, Webmail, IMAP, and SMTP.' },
    { title: 'Daily Automated Cloud Backups', desc: 'Automated 30-day offsite snapshot retention with 1-click single-file or database restore.' },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Web Hosting &amp; Cloud Sites</span>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#0c0e17] via-[#1a1710] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Globe className="w-4 h-4" />
            <span>LiteSpeed Web Server &amp; Pure NVMe Cloud Storage</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Ultra-Fast NVMe <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400">
              Web Hosting
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Turbocharge your websites and web applications with LiteSpeed caching, free SSL certificates, unlimited MySQL databases, and isolated cPanel / DirectAdmin environments.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('web-plans-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>View Web Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Free SSL &amp; Daily Backups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div id="web-plans-table" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">
              Web Hosting Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              All plans include free SSL, email mailboxes, and automated daily backups.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#11131e] p-1 rounded-xl border border-white/5 shrink-0">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeCycle === cycle
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly (-10%)' : 'Yearly (-20%)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {webPlans.map((plan) => {
            const price = getCalculatedPrice(plan);
            return (
              <div
                key={plan.id}
                className="bg-[#11131e] border border-white/5 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white font-display">{plan.name}</h3>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {plan.storage}
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
                      <span className="text-slate-400">Websites Hosted</span>
                      <span className="font-semibold text-white">{plan.tier === 'Starter' ? '1 Website' : plan.tier === 'Standard' ? '5 Websites' : 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NVMe Storage</span>
                      <span className="font-semibold text-white">{plan.storage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Bandwidth</span>
                      <span className="font-semibold text-white">Unmetered</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Free SSL</span>
                      <span className="font-semibold text-emerald-400">Included</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openCheckout(plan)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Order Web Hosting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigateTo('services/web-hosting', { planSlug: plan.slug || plan.id })}
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

      {/* Feature Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Premium Web Hosting Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#11131e] border border-white/5 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
