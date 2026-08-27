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

  const affiliateCode = user?.id ? user.id.replace('user-', 'arvex-') : 'arvex-vip';
  const affiliateUrl = `https://arvex.host/?ref=${affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    showNotification('Affiliate referral URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Affiliate &amp; Referral Partner Program</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#0c0e17] via-[#0f211d] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Gift className="w-4 h-4" />
            <span>15% Lifetime Recurring Monthly Commission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Earn with the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              ArveX Affiliate Program
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Recommend our blazing-fast game servers, Discord bot containers, and cloud VPS instances to your friends, Discord servers, and YouTube audience. Earn lifetime recurring commissions on every active renewal.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('affiliate-link-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Get Your Referral Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Instant Payouts via PayPal / Crypto / Bank</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div id="affiliate-link-card" className="max-w-3xl mx-auto bg-[#11131e] border border-emerald-500/30 rounded-3xl p-8 mb-16 shadow-2xl">
        <h2 className="text-xl font-bold text-white font-display mb-2">
          Your Unique Referral Link
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Share this link on your YouTube video descriptions, Discord announcements, or website banners.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#161926] p-2.5 rounded-2xl border border-white/10 mb-6">
          <input
            type="text"
            readOnly
            value={affiliateUrl}
            className="w-full bg-transparent border-none text-white font-mono text-xs px-3 py-2 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center text-xs">
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-slate-400 mb-1">Commission Rate</p>
            <p className="text-xl font-black text-emerald-400 font-display">15% Recurring</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-slate-400 mb-1">Cookie Window</p>
            <p className="text-xl font-black text-white font-display">90 Days</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-slate-400 mb-1">Payout Threshold</p>
            <p className="text-xl font-black text-white font-display">$20.00 Minimum</p>
          </div>
        </div>
      </div>
    </div>
  );
};
