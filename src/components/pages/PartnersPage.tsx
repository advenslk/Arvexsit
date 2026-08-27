import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Star,
} from 'lucide-react';
import { Partner } from '../../types';

export const PartnersPage: React.FC = () => {
  const { partners, createPartnerApplication, navigateTo, showNotification } = useApp();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Content Creator / Streamer');
  const [platform, setPlatform] = useState<string>('YouTube');
  const [handleOrUrl, setHandleOrUrl] = useState<string>('');
  const [audienceSize, setAudienceSize] = useState<string>('5,000 - 25,000');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handleOrUrl.trim()) {
      showNotification('Please enter your project name and channel link.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createPartnerApplication({
        name: name.trim(),
        category,
        platform,
        url: handleOrUrl.trim(),
        description: description.trim(),
        followers: audienceSize,
      });

      setIsSubmitting(false);
      setName('');
      setHandleOrUrl('');
      setDescription('');
      showNotification('Partnership application submitted! Our team will review within 48h.', 'success');
    }, 600);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Creator &amp; Enterprise Partner Program</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0c0e17] via-[#10192e] to-[#0c0e17] p-8 sm:p-14 mb-16 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Award className="w-4 h-4" />
            <span>Official Creator &amp; Studio Sponsorships</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight mb-5">
            Partner with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              ArveX Cloud
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            We sponsor Minecraft networks, game studios, Discord bots, content creators, and competitive esports leagues with complimentary enterprise infrastructure, custom promo codes, and dedicated revenue sharing.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('apply-partner-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Up to 100% Server Sponsorship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Partners Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Featured Official Partners
        </h2>

        {partners.length === 0 ? (
          <div className="bg-[#11131e] border border-white/5 rounded-2xl p-12 text-center text-slate-400">
            <p>No featured partners listed yet. Apply below to become our next partner!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#11131e] border border-white/5 hover:border-cyan-500/40 rounded-2xl p-6 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {partner.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {partner.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {partner.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {partner.followers || '10,000+ Audience'}
                  </span>
                  {partner.url && (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <span>Visit Channel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Form */}
      <div id="apply-partner-form" className="max-w-3xl mx-auto bg-[#11131e] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
            Submit Partner Application
          </h2>
          <p className="text-xs text-slate-400">
            Tell us about your community, content channels, and infrastructure requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project / Channel Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CraftPulse Network"
                className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Partner Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Content Creator / Streamer">Content Creator / Streamer</option>
                <option value="Minecraft Server Network">Minecraft Server Network</option>
                <option value="Game Developer / Studio">Game Developer / Studio</option>
                <option value="Discord Bot Developer">Discord Bot Developer</option>
                <option value="Esports Organization">Esports Organization</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
                <option value="TikTok">TikTok</option>
                <option value="Discord">Discord Community</option>
                <option value="Custom Website">Custom Website</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Audience / Player Count</label>
              <select
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
                className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="1,000 - 5,000">1,000 - 5,000</option>
                <option value="5,000 - 25,000">5,000 - 25,000</option>
                <option value="25,000 - 100,000">25,000 - 100,000</option>
                <option value="100,000+">100,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel URL / Handle</label>
              <input
                type="text"
                required
                value={handleOrUrl}
                onChange={(e) => setHandleOrUrl(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pitch / Why Partner with ArveX?
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your server concept, past viewership stats, and requested hardware specs..."
              className="w-full bg-[#161926] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Send className="w-4 h-4" />
            <span>Submit Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};
