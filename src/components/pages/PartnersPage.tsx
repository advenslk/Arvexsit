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
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-blue-600 font-semibold">Creator &amp; Enterprise Partner Program</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Official Creator &amp; Studio Sponsorships</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-tight mb-5">
              Partner with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                HelzerX Cloud
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              We sponsor Minecraft networks, game studios, Discord bots, content creators, and competitive esports leagues with complimentary enterprise infrastructure, custom promo codes, and dedicated revenue sharing.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('apply-partner-form');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Apply for Partnership</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 px-4 py-3.5 rounded-xl shadow-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Up to 100% Server Sponsorship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Partners Grid */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-6">
            Featured Official Partners
          </h2>

          {partners.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
              <p>No featured partners listed yet. Apply below to become our next partner!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {partner.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {partner.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {partner.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      {partner.followers || '10,000+ Audience'}
                    </span>
                    {partner.url && (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
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
        <div id="apply-partner-form" className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-2">
              Submit Partner Application
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tell us about your community, content channels, and infrastructure requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Project / Channel Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CraftPulse Network"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Partner Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Twitch">Twitch</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Discord">Discord Community</option>
                  <option value="Custom Website">Custom Website</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Audience / Player Count</label>
                <select
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="1,000 - 5,000">1,000 - 5,000</option>
                  <option value="5,000 - 25,000">5,000 - 25,000</option>
                  <option value="25,000 - 100,000">25,000 - 100,000</option>
                  <option value="100,000+">100,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Channel URL / Handle</label>
                <input
                  type="text"
                  required
                  value={handleOrUrl}
                  onChange={(e) => setHandleOrUrl(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pitch / Why Partner with HelzerX?
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your server concept, past viewership stats, and requested hardware specs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
