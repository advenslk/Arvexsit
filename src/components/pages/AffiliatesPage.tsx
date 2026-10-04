import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Gift,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const AffiliatesPage: React.FC = () => {
  const { user, formatPrice, navigateTo, showNotification } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  const affiliateCode = user?.id ? user.id.replace('user-', 'helzerx-') : 'helzerx-vip';
  const affiliateUrl = `https://helzerx.cloud/?ref=${affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    showNotification('Affiliate referral URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

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
            <span className="text-blue-600 font-semibold">Affiliate &amp; Referral Partner Program</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>15% Lifetime Recurring Monthly Commission</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight mb-5">
              Earn with the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">
                HelzerX Affiliate Program
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Recommend our blazing-fast game servers, Discord bot containers, and cloud VPS instances to your friends, Discord servers, and YouTube audience. Earn lifetime recurring commissions on every active renewal.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('affiliate-link-card');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Get Your Referral Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 px-4 py-3.5 rounded-xl shadow-xs">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Instant Payouts via PayPal / Crypto / Bank</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Referral Link Box */}
        <div id="affiliate-link-card" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 mb-16 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mb-2">
            Your Unique Referral Link
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Share this link on your YouTube video descriptions, Discord announcements, or website banners.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-6">
            <input
              type="text"
              readOnly
              value={affiliateUrl}
              className="w-full bg-transparent border-none text-slate-900 font-mono text-xs sm:text-sm px-3 py-2 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 mb-1 font-medium">Commission Rate</p>
              <p className="text-xl font-black text-emerald-600 font-display">15% Recurring</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 mb-1 font-medium">Cookie Window</p>
              <p className="text-xl font-black text-slate-900 font-display">90 Days</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-500 mb-1 font-medium">Payout Threshold</p>
              <p className="text-xl font-black text-slate-900 font-display">$20.00 Minimum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
