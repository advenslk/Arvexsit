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
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Web Hosting &amp; Cloud Sites</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>LiteSpeed Web Server &amp; Pure NVMe Cloud Storage</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-4">
              Ultra-Fast NVMe <br />
              <span className="text-cyan-200">
                Web Hosting
              </span>
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
              Turbocharge your websites and web applications with LiteSpeed caching, free SSL certificates, unlimited MySQL databases, and isolated cPanel / DirectAdmin environments.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('web-plans-table');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>View Web Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs text-white bg-white/15 border border-white/25 px-4 py-3.5 rounded-2xl backdrop-blur-md">
                <Lock className="w-4 h-4 text-cyan-300" />
                <span>Free SSL &amp; Daily Backups</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div id="web-plans-table">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 font-display mb-1">
                Web Hosting Plans
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                All plans include free SSL, email mailboxes, and automated daily backups.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0">
              {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setActiveCycle(cycle)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeCycle === cycle
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
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
                  className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 flex flex-col justify-between transition-all group shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-black text-slate-900 font-display">{plan.name}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {plan.storage}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-slate-500">/ mo</span>
                      </div>
                    </div>

                    <div className="space-y-2 py-3.5 border-t border-b border-slate-100 mb-5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Websites Hosted</span>
                        <span className="font-semibold text-slate-900">{plan.tier === 'Starter' ? '1 Website' : plan.tier === 'Standard' ? '5 Websites' : 'Unlimited'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">NVMe Storage</span>
                        <span className="font-semibold text-slate-900">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Bandwidth</span>
                        <span className="font-semibold text-slate-900">Unmetered</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Free SSL</span>
                        <span className="font-semibold text-emerald-600">Included</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Order Web Hosting</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigateTo('services/web-hosting', { planSlug: plan.slug || plan.id })}
                      className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
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
        <div className="pt-6">
          <h2 className="text-2xl font-black text-slate-900 font-display mb-6">
            Premium Web Hosting Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webFeatures.map((feat, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
