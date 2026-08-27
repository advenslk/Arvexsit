import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Shield,
  Layers,
  DollarSign,
  Gamepad2,
  Settings,
  HelpCircle,
  BookOpen,
  Tag,
  MapPin,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  ExternalLink,
  Flame,
  Handshake,
  Star,
  MessageSquare,
  Award,
} from 'lucide-react';
import { ServiceItem, HostingPlan, GameItem, FaqItem, BlogPost, ComparisonRow, ServerLocation, Partner, CustomerReview } from '../types';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    siteSettings,
    updateSiteSettings,
    services,
    addService,
    updateService,
    deleteService,
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    games,
    addGame,
    updateGame,
    deleteGame,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    comparisonRows,
    updateComparisonRow,
    locations,
    updateLocation,
    resetToDefaults,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'services' | 'plans' | 'games' | 'content' | 'partners' | 'reviews' | 'discounts' | 'faqs' | 'blog' | 'locations' | 'advanced'
  >('overview');

  const [saveNotification, setSaveNotification] = useState('');

  // Editing Modals / Forms States
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  const [editingPlan, setEditingPlan] = useState<HostingPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);

  const [editingGame, setEditingGame] = useState<GameItem | null>(null);
  const [isAddingGame, setIsAddingGame] = useState(false);

  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);

  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  // Local copy of Site Settings for the Content Tab
  const [localSettings, setLocalSettings] = useState({ ...siteSettings });

  if (!isAdminOpen) return null;

  const showSaveToast = (msg = 'Changes saved successfully to live website!') => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(''), 3500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(localSettings);
    showSaveToast('General Website Content and Brand settings updated!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#0d0f17] border border-white/15 p-4 sm:p-8 shadow-2xl my-4 min-h-[85vh] flex flex-col justify-between text-slate-200">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-black flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  ArveX Master Admin Panel
                </h2>
                <span className="bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  LIVE EDIT MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instantly edit, customize, add, and remove anything on your hosting website without touching code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveNotification && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveNotification}</span>
              </div>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-white/10 scrollbar-none text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard', icon: BarChart3 },
            { id: 'services', label: 'Services', icon: Layers, count: services.length },
            { id: 'plans', label: 'Hosting Plans', icon: DollarSign, count: plans.length },
            { id: 'games', label: 'Games Catalog', icon: Gamepad2, count: games.length },
            { id: 'content', label: 'Hero & Content', icon: Settings },
            { id: 'partners', label: 'Official Partners', icon: Handshake, count: partners.length },
            { id: 'reviews', label: 'Customer Reviews', icon: Star, count: reviews.length },
            { id: 'discounts', label: 'Coupons & Switch', icon: Tag },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length },
            { id: 'blog', label: 'Blog Articles', icon: BookOpen, count: blogPosts.length },
            { id: 'locations', label: 'Locations & Nodes', icon: MapPin },
            { id: 'advanced', label: 'Backup & Reset', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md font-bold'
                    : 'bg-[#141724] text-slate-400 hover:text-slate-200 hover:bg-[#1c2132]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Tab Contents */}
        <div className="flex-1 py-6 overflow-y-auto max-h-[60vh] pr-1">

          {/* TAB 1: OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#131622] border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Total Services</span>
                  <p className="text-2xl font-bold text-white font-display mt-1">{services.length}</p>
                </div>
                <div className="bg-[#131622] border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Active Hosting Plans</span>
                  <p className="text-2xl font-bold text-cyan-400 font-display mt-1">{plans.length}</p>
                </div>
                <div className="bg-[#131622] border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Supported Games</span>
                  <p className="text-2xl font-bold text-indigo-400 font-display mt-1">{games.length}</p>
                </div>
                <div className="bg-[#131622] border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-slate-400">Active Promo Code</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {siteSettings.switchCouponCode} ({siteSettings.switchDiscountPercent}%)
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#131622] border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-2">Quick Site Customization Guide</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Every section of ArveX Hosting is fully dynamic. Any changes you make here are instantly saved to your browser's persistent storage and rendered live on the website.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setActiveAdminTab('services')}
                    className="p-3 rounded-xl bg-[#1b2030] hover:bg-[#23293e] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">Manage Services</span>
                      <span className="text-slate-400 text-[11px]">Edit VPS, Dedicated, Domains</span>
                    </div>
                    <Layers className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('plans')}
                    className="p-3 rounded-xl bg-[#1b2030] hover:bg-[#23293e] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">Manage Hosting Plans</span>
                      <span className="text-slate-400 text-[11px]">Pricing, RAM, CPU specs</span>
                    </div>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('content')}
                    className="p-3 rounded-xl bg-[#1b2030] hover:bg-[#23293e] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">Edit Hero & Headlines</span>
                      <span className="text-slate-400 text-[11px]">Titles, Subtitles, CTAs</span>
                    </div>
                    <Settings className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES MANAGEMENT */}
          {activeAdminTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Services Management</h3>
                  <p className="text-xs text-slate-400">Add, edit, remove, and customize all hosting services.</p>
                </div>
                <button
                  onClick={() => setIsAddingService(true)}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Service Cards Grid in Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div
                    key={serv.id}
                    className="p-4 rounded-2xl bg-[#131622] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white">{serv.title}</span>
                          {serv.badge && (
                            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              {serv.badge}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          ${serv.startingPrice}/mo
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{serv.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(serv.features || []).map((f, i) => (
                          <span
                            key={i}
                            className="bg-black/40 text-[10px] text-slate-300 px-2 py-0.5 rounded border border-white/5"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                      <button
                        onClick={() => setEditingService(serv)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteService(serv.id);
                          showSaveToast('Service deleted.');
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HOSTING PLANS MANAGEMENT */}
          {activeAdminTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Hosting Plans & Pricing</h3>
                  <p className="text-xs text-slate-400">Configure prices, hardware specs, and popular flags.</p>
                </div>
                <button
                  onClick={() => setIsAddingPlan(true)}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Plan</span>
                </button>
              </div>

              {/* Plans Table in Admin */}
              <div className="rounded-2xl bg-[#131622] border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400">
                    <tr>
                      <th className="p-3">Plan Name</th>
                      <th className="p-3">Game</th>
                      <th className="p-3">Monthly Price</th>
                      <th className="p-3">RAM / CPU</th>
                      <th className="p-3">NVMe / Players</th>
                      <th className="p-3">Popular</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {plans.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white">
                          {p.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{p.subtitle}</span>
                        </td>
                        <td className="p-3 text-slate-300 capitalize">{p.gameId}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">${p.monthlyPrice}</td>
                        <td className="p-3 text-slate-300">{p.ram} / {p.cpu}</td>
                        <td className="p-3 text-slate-300">{p.storage} / {p.players}</td>
                        <td className="p-3">
                          {p.popular ? (
                            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              YES ✦
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">No</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingPlan(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                deletePlan(p.id);
                                showSaveToast('Plan deleted.');
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GAMES CATALOG */}
          {activeAdminTab === 'games' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Games Catalog</h3>
                  <p className="text-xs text-slate-400">Add games, upload cover artworks, and set starting prices.</p>
                </div>
                <button
                  onClick={() => setIsAddingGame(true)}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Game</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((g) => (
                  <div key={g.id} className="p-3 rounded-2xl bg-[#131622] border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={g.image}
                        alt={g.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-white text-xs">{g.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{g.category}</span>
                        <span className="text-[10px] font-mono text-cyan-400">${g.startingPrice}/mo</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingGame(g)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteGame(g.id);
                          showSaveToast('Game deleted.');
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HERO & WEBSITE CONTENT */}
          {activeAdminTab === 'content' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Hero & Content Customization</h3>
                  <p className="text-xs text-slate-400">Modify branding, headlines, hero subheadings, and partner text.</p>
                </div>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Content</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={localSettings.brandName}
                    onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Top Badge Text</label>
                  <input
                    type="text"
                    value={localSettings.heroBadgeText}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroBadgeText: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title Line 1</label>
                  <input
                    type="text"
                    value={localSettings.heroTitleLine1}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroTitleLine1: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title Line 2</label>
                  <input
                    type="text"
                    value={localSettings.heroTitleLine2}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroTitleLine2: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={localSettings.heroSubtitle}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary CTA Text</label>
                  <input
                    type="text"
                    value={localSettings.heroCtaText}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroCtaText: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary CTA Text</label>
                  <input
                    type="text"
                    value={localSettings.heroSecondaryCtaText}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroSecondaryCtaText: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discord Invite URL</label>
                  <input
                    type="text"
                    value={localSettings.discordUrl}
                    onChange={(e) => setLocalSettings({ ...localSettings, discordUrl: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={localSettings.supportEmail}
                    onChange={(e) => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB: OFFICIAL PARTNERS TICKER & MANAGEMENT */}
          {activeAdminTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Official Partners Bar & Network</h3>
                    <span className="text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      {partners.length} Partners
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Customize the live scrolling partner ticker, upload brand logos, set custom badges, and add external links.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingPartner(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Partner</span>
                </button>
              </div>

              {/* Partners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className={`bg-[#121422] border ${
                      partner.isSpecial
                        ? 'border-yellow-500/40 bg-gradient-to-r from-[#121422] to-yellow-950/20'
                        : 'border-white/10'
                    } rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/40 transition-all group`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Logo Preview or Initials */}
                          <div
                            className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center font-black text-sm shrink-0 ${
                              partner.iconBg || 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {partner.logoUrl ? (
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : partner.isSpecial ? (
                              <Award className="w-6 h-6 text-yellow-300 fill-yellow-400/20" />
                            ) : (
                              <span>{partner.name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                                {partner.name}
                              </h4>
                              {partner.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                                  {partner.badge}
                                </span>
                              )}
                              {partner.active === false && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-purple-400 font-mono">
                              {partner.category}
                            </span>
                          </div>
                        </div>

                        {/* Quick action icons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingPartner(partner)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Edit Partner"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${partner.name}?`)) {
                                deletePartner(partner.id);
                                showSaveToast(`Removed ${partner.name}`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                        {partner.tagline || partner.description}
                      </p>

                      {partner.url && (
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline truncate max-w-full"
                        >
                          <span>{partner.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => {
                          updatePartner(partner.id, { active: partner.active === false ? true : false });
                          showSaveToast(`Partner visibility toggled`);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          partner.active !== false
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {partner.active !== false ? '● Active on Ticker' : '○ Hidden from Ticker'}
                      </button>

                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        Configure Details &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER REVIEWS & TESTIMONIALS */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Customer & Player Reviews</h3>
                    <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {reviews.length} Reviews
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Manage testimonials, Trustpilot star ratings, verified player badges, and hosting client feedback.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingReview(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Review</span>
                </button>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#121422] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Initials or Image */}
                          {rev.avatarImage ? (
                            <img
                              src={rev.avatarImage}
                              alt={rev.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover border border-white/20"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                                rev.avatarBg || 'from-purple-600 to-indigo-700'
                              } text-white font-black text-xs flex items-center justify-center shadow-md border border-white/20 shrink-0`}
                            >
                              {rev.avatar || (rev.name ? rev.name.slice(0, 2).toUpperCase() : 'AR')}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {rev.name}
                              </h4>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#00b67a]/20 text-[#00b67a] px-1.5 py-0.2 rounded border border-[#00b67a]/30">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                              {rev.active === false && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {rev.role}
                            </span>
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingReview(rev)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Edit Review"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete review from ${rev.name}?`)) {
                                deleteReview(rev.id);
                                showSaveToast(`Deleted review from ${rev.name}`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 ${
                              i < (rev.rating || 5) ? 'bg-[#00b67a]' : 'bg-slate-700'
                            } flex items-center justify-center rounded-[2px]`}
                          >
                            <Star className="w-2 h-2 text-white fill-white" />
                          </div>
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1 font-mono">
                          {rev.rating || 5}.0 Stars
                        </span>
                      </div>

                      {/* Quote Text */}
                      <p className="text-xs text-slate-300 italic line-clamp-3 mb-2">
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-purple-300">
                        {rev.serverType || 'Host Client'}
                      </span>
                      <span className="text-slate-500">{rev.date || 'Recently'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DISCOUNTS & SWITCH PROMO */}
          {activeAdminTab === 'discounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Coupons & Promotional Switch Banner</h3>
                  <p className="text-xs text-slate-400">Configure promotional discount codes and ticking countdown.</p>
                </div>
                <button
                  onClick={() => {
                    updateSiteSettings(localSettings);
                    showSaveToast('Promo & Coupon settings updated!');
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Promo Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={localSettings.switchCouponCode}
                    onChange={(e) => setLocalSettings({ ...localSettings, switchCouponCode: e.target.value.toUpperCase() })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={localSettings.switchDiscountPercent}
                    onChange={(e) => setLocalSettings({ ...localSettings, switchDiscountPercent: Number(e.target.value) })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Promo Section Title</label>
                  <input
                    type="text"
                    value={localSettings.switchSectionTitle}
                    onChange={(e) => setLocalSettings({ ...localSettings, switchSectionTitle: e.target.value })}
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Countdown Target Timestamp</label>
                  <input
                    type="text"
                    value={localSettings.switchCountdownTarget}
                    onChange={(e) => setLocalSettings({ ...localSettings, switchCountdownTarget: e.target.value })}
                    placeholder="2026-12-31T23:59:59Z"
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FAQS */}
          {activeAdminTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-400">Add or edit questions shown on the home page.</p>
                </div>
                <button
                  onClick={() => setIsAddingFaq(true)}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 rounded-2xl bg-[#131622] border border-white/10 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-xs mb-1">{faq.question}</h4>
                      <p className="text-xs text-slate-400">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteFaq(faq.id);
                          showSaveToast('FAQ deleted.');
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BLOG POSTS */}
          {activeAdminTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Blog Articles & Guides</h3>
                  <p className="text-xs text-slate-400">Publish guides, security announcements, and server tutorials.</p>
                </div>
                <button
                  onClick={() => setIsAddingBlog(true)}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-2xl bg-[#131622] border border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase">{post.category}</span>
                      <h4 className="font-bold text-white text-xs mt-1 mb-1">{post.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 text-[11px] text-slate-500">
                      <span>By {post.author}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingBlog(post)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            deleteBlogPost(post.id);
                            showSaveToast('Article deleted.');
                          }}
                          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: LOCATIONS */}
          {activeAdminTab === 'locations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Data Center Locations</h3>
                <p className="text-xs text-slate-400">Configure data center regions, flags, and latency pings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className="p-4 rounded-2xl bg-[#131622] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{loc.flag}</span>
                        <span className="font-bold text-white text-xs">{loc.name} ({loc.city})</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold text-xs">{loc.pingMs}ms</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-400">Region Name</label>
                        <input
                          type="text"
                          value={loc.name}
                          onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                          className="w-full bg-[#0a0c12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400">City</label>
                        <input
                          type="text"
                          value={loc.city}
                          onChange={(e) => updateLocation(loc.id, { city: e.target.value })}
                          className="w-full bg-[#0a0c12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: BACKUP & RESET */}
          {activeAdminTab === 'advanced' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Reset & Data Controls</h3>
                <p className="text-xs text-slate-400">Restore default demo dataset or clear custom admin modifications.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141724] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Reset Website to Default State</h4>
                    <p className="text-[11px] text-slate-400">
                      Restores all original services, Minecraft plans, hero content, and games from initial setup.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all content to default demo state?')) {
                      resetToDefaults();
                      setLocalSettings({ ...siteSettings });
                      showSaveToast('Website reset to default dataset.');
                    }
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  Reset to Factory Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Service Modal Overlay */}
        {(editingService || isAddingService) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#11141e] border border-white/10 p-6 rounded-3xl max-w-lg w-full space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">
                {isAddingService ? 'Create New Service' : 'Edit Service'}
              </h3>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  defaultValue={editingService?.title || 'Game Server Hosting'}
                  id="form-service-title"
                  className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  defaultValue={editingService?.description || 'High performance server with low latency'}
                  id="form-service-desc"
                  className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Starting Price ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingService?.startingPrice || 8.0}
                    id="form-service-price"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    defaultValue={editingService?.badge || 'Popular'}
                    id="form-service-badge"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Features (comma-separated)</label>
                <input
                  type="text"
                  defaultValue={editingService?.features.join(', ') || 'Instant Setup, DDoS Protection, 24/7 Support'}
                  id="form-service-features"
                  className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsAddingService(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = (document.getElementById('form-service-title') as HTMLInputElement).value;
                    const description = (document.getElementById('form-service-desc') as HTMLTextAreaElement).value;
                    const startingPrice = Number((document.getElementById('form-service-price') as HTMLInputElement).value) || 9.99;
                    const badge = (document.getElementById('form-service-badge') as HTMLInputElement).value;
                    const features = (document.getElementById('form-service-features') as HTMLInputElement).value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);

                    if (isAddingService) {
                      addService({
                        title,
                        description,
                        icon: 'Gamepad2',
                        startingPrice,
                        features,
                        badge: badge || undefined,
                        category: 'game',
                        active: true,
                        link: '#plans',
                      });
                      showSaveToast('New service created!');
                    } else if (editingService) {
                      updateService(editingService.id, {
                        title,
                        description,
                        startingPrice,
                        badge: badge || undefined,
                        features,
                      });
                      showSaveToast('Service updated!');
                    }
                    setEditingService(null);
                    setIsAddingService(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Plan Modal Overlay */}
        {(editingPlan || isAddingPlan) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#11141e] border border-white/10 p-6 rounded-3xl max-w-lg w-full space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">
                {isAddingPlan ? 'Create New Plan' : 'Edit Hosting Plan'}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plan Name</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.name || 'Emerald'}
                    id="form-plan-name"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.subtitle || 'Minecraft Server'}
                    id="form-plan-subtitle"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingPlan?.monthlyPrice || 19.99}
                    id="form-plan-price"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original Price (Crossed out)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingPlan?.originalPrice || 24.0}
                    id="form-plan-orig-price"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">RAM</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.ram || '16 GB RAM'}
                    id="form-plan-ram"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">vCPU Cores</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.cpu || '6 vCPU Cores'}
                    id="form-plan-cpu"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Storage NVMe</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.storage || '120 GB NVMe'}
                    id="form-plan-storage"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Player Capacity</label>
                  <input
                    type="text"
                    defaultValue={editingPlan?.players || '150 Players'}
                    id="form-plan-players"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  defaultChecked={editingPlan?.popular ?? false}
                  id="form-plan-popular"
                  className="rounded bg-[#0a0c12] border-white/10"
                />
                <label htmlFor="form-plan-popular" className="text-slate-300 font-semibold">
                  Highlight as Popular (Star sparkles banner)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsAddingPlan(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = (document.getElementById('form-plan-name') as HTMLInputElement).value;
                    const subtitle = (document.getElementById('form-plan-subtitle') as HTMLInputElement).value;
                    const monthlyPrice = Number((document.getElementById('form-plan-price') as HTMLInputElement).value) || 16;
                    const originalPrice = Number((document.getElementById('form-plan-orig-price') as HTMLInputElement).value) || undefined;
                    const ram = (document.getElementById('form-plan-ram') as HTMLInputElement).value;
                    const cpu = (document.getElementById('form-plan-cpu') as HTMLInputElement).value;
                    const storage = (document.getElementById('form-plan-storage') as HTMLInputElement).value;
                    const players = (document.getElementById('form-plan-players') as HTMLInputElement).value;
                    const popular = (document.getElementById('form-plan-popular') as HTMLInputElement).checked;

                    if (isAddingPlan) {
                      addPlan({
                        name,
                        subtitle,
                        monthlyPrice,
                        originalPrice,
                        quarterlyPrice: monthlyPrice * 3 * 0.95,
                        yearlyPrice: monthlyPrice * 12 * 0.85,
                        gameId: 'minecraft',
                        tier: 'Standard',
                        ram,
                        cpu,
                        storage,
                        players,
                        popular,
                        badge: popular ? 'Popular' : undefined,
                        features: ['Instant Setup', 'DDoS Protection', 'NVMe SSD Storage'],
                      });
                      showSaveToast('New plan created!');
                    } else if (editingPlan) {
                      updatePlan(editingPlan.id, {
                        name,
                        subtitle,
                        monthlyPrice,
                        originalPrice,
                        ram,
                        cpu,
                        storage,
                        players,
                        popular,
                        badge: popular ? 'Popular' : undefined,
                      });
                      showSaveToast('Plan updated!');
                    }
                    setEditingPlan(null);
                    setIsAddingPlan(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold"
                >
                  Save Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PARTNER */}
        {(editingPartner || isAddingPartner) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-[#121522] border border-purple-500/30 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isAddingPartner ? 'Add New Official Partner' : `Edit Partner: ${editingPartner?.name}`}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure logo, link, description & badge</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setIsAddingPartner(false);
                  }}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Partner / Brand Name</label>
                    <input
                      type="text"
                      defaultValue={editingPartner?.name || ''}
                      id="form-partner-name"
                      placeholder="e.g. GAMESTER LK"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      defaultValue={editingPartner?.category || 'Esports & Community'}
                      id="form-partner-cat"
                      placeholder="e.g. Esports, Streamer, SMP"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tagline (Shown in scrolling ticker)</label>
                  <input
                    type="text"
                    defaultValue={editingPartner?.tagline || ''}
                    id="form-partner-tagline"
                    placeholder="e.g. Leading Gaming Community in Sri Lanka"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Logo URL (PNG / SVG / WebP Image)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={editingPartner?.logoUrl || ''}
                      id="form-partner-logo"
                      placeholder="https://.../logo.png or data:image/..."
                      className="flex-1 bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                    <label className="bg-purple-950 hover:bg-purple-900 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              const input = document.getElementById('form-partner-logo') as HTMLInputElement;
                              if (input && uploadEvent.target?.result) {
                                input.value = uploadEvent.target.result as string;
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Paste any image web URL or click upload to pick an image file from your computer.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Website / Community URL</label>
                  <input
                    type="text"
                    defaultValue={editingPartner?.url || ''}
                    id="form-partner-url"
                    placeholder="https://discord.gg/... or https://partner.com"
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Badge Text (Optional)</label>
                    <input
                      type="text"
                      defaultValue={editingPartner?.badge || ''}
                      id="form-partner-badge"
                      placeholder="e.g. Gold Winner 2025"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gradient Theme</label>
                    <select
                      id="form-partner-accent"
                      defaultValue={editingPartner?.accent || 'from-amber-400 to-orange-500'}
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="from-amber-400 to-orange-500">Amber & Orange</option>
                      <option value="from-emerald-400 to-teal-500">Emerald & Teal</option>
                      <option value="from-purple-400 to-pink-500">Purple & Pink</option>
                      <option value="from-blue-400 to-cyan-500">Blue & Cyan</option>
                      <option value="from-yellow-300 via-amber-400 to-yellow-600">Gold Trophy Accent</option>
                      <option value="from-cyan-400 to-indigo-500">Cyan & Indigo</option>
                      <option value="from-rose-400 to-red-500">Rose & Red</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={editingPartner?.isSpecial ?? false}
                      id="form-partner-special"
                      className="rounded bg-[#0a0c12] border-white/10"
                    />
                    <span className="text-yellow-400 font-semibold">Special Gold Trophy Partner</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={editingPartner?.active ?? true}
                      id="form-partner-active"
                      className="rounded bg-[#0a0c12] border-white/10"
                    />
                    <span className="text-slate-300 font-semibold">Visible on Live Ticker</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartner(null);
                    setIsAddingPartner(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = (document.getElementById('form-partner-name') as HTMLInputElement).value;
                    if (!name.trim()) {
                      alert('Please enter a partner name');
                      return;
                    }
                    const category = (document.getElementById('form-partner-cat') as HTMLInputElement).value;
                    const tagline = (document.getElementById('form-partner-tagline') as HTMLInputElement).value;
                    const logoUrl = (document.getElementById('form-partner-logo') as HTMLInputElement).value;
                    const url = (document.getElementById('form-partner-url') as HTMLInputElement).value;
                    const badge = (document.getElementById('form-partner-badge') as HTMLInputElement).value;
                    const accent = (document.getElementById('form-partner-accent') as HTMLSelectElement).value;
                    const isSpecial = (document.getElementById('form-partner-special') as HTMLInputElement).checked;
                    const active = (document.getElementById('form-partner-active') as HTMLInputElement).checked;

                    if (isAddingPartner) {
                      addPartner({
                        name,
                        category: category || 'Official Partner',
                        tagline: tagline || 'Trusted Partner of ArveX Hosting',
                        logoUrl: logoUrl || undefined,
                        url: url || undefined,
                        badge: badge || undefined,
                        accent: accent || 'from-purple-400 to-indigo-500',
                        glow: 'shadow-purple-500/20',
                        iconBg: isSpecial ? 'bg-yellow-500/20 text-yellow-300' : 'bg-purple-500/10 text-purple-400',
                        isSpecial,
                        active,
                      });
                      showSaveToast('New partner added to ticker!');
                    } else if (editingPartner) {
                      updatePartner(editingPartner.id, {
                        name,
                        category,
                        tagline,
                        logoUrl,
                        url,
                        badge,
                        accent,
                        isSpecial,
                        active,
                      });
                      showSaveToast('Partner updated!');
                    }
                    setEditingPartner(null);
                    setIsAddingPartner(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Partner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT CUSTOMER REVIEW */}
        {(editingReview || isAddingReview) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-[#121522] border border-emerald-500/30 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isAddingReview ? 'Add New Customer Review' : `Edit Review: ${editingReview?.name}`}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure client testimonial, stars, role & avatar</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setIsAddingReview(false);
                  }}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Customer / Reviewer Name</label>
                    <input
                      type="text"
                      defaultValue={editingReview?.name || ''}
                      id="form-review-name"
                      placeholder="e.g. Sarith Basnayake"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role / Subtitle</label>
                    <input
                      type="text"
                      defaultValue={editingReview?.role || 'Minecraft Server Owner'}
                      id="form-review-role"
                      placeholder="e.g. Plugin Dev, Network Owner"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Hosting / Server Type</label>
                    <input
                      type="text"
                      defaultValue={editingReview?.serverType || 'PaperMC 1.20.4'}
                      id="form-review-server"
                      placeholder="e.g. Purpur 8GB, 150+ PvP"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Star Rating (1 - 5)</label>
                    <select
                      id="form-review-rating"
                      defaultValue={editingReview?.rating || 5}
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      <option value="5">★★★★★ (5.0 Stars)</option>
                      <option value="4">★★★★☆ (4.0 Stars)</option>
                      <option value="3">★★★☆☆ (3.0 Stars)</option>
                      <option value="2">★★☆☆☆ (2.0 Stars)</option>
                      <option value="1">★☆☆☆☆ (1.0 Star)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Review Quote / Testimonial Text</label>
                  <textarea
                    rows={3}
                    defaultValue={editingReview?.reviewText || ''}
                    id="form-review-text"
                    placeholder="Write the customer's feedback and experience with ArveX..."
                    className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Avatar Initials</label>
                    <input
                      type="text"
                      defaultValue={editingReview?.avatar || 'SB'}
                      id="form-review-avatar"
                      placeholder="e.g. SB"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Date String</label>
                    <input
                      type="text"
                      defaultValue={editingReview?.date || '2 days ago'}
                      id="form-review-date"
                      placeholder="e.g. 2 days ago, 1 week ago"
                      className="w-full bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Avatar Photo URL (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={editingReview?.avatarImage || ''}
                      id="form-review-avatar-img"
                      placeholder="https://.../photo.jpg or upload"
                      className="flex-1 bg-[#0a0c12] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                    />
                    <label className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              const input = document.getElementById('form-review-avatar-img') as HTMLInputElement;
                              if (input && uploadEvent.target?.result) {
                                input.value = uploadEvent.target.result as string;
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={editingReview?.verified ?? true}
                      id="form-review-verified"
                      className="rounded bg-[#0a0c12] border-white/10 text-emerald-500"
                    />
                    <span className="text-[#00b67a] font-semibold">Verified Client Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={editingReview?.active ?? true}
                      id="form-review-active"
                      className="rounded bg-[#0a0c12] border-white/10"
                    />
                    <span className="text-slate-300 font-semibold">Show on Website Review Bar</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setIsAddingReview(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = (document.getElementById('form-review-name') as HTMLInputElement).value;
                    if (!name.trim()) {
                      alert('Please enter a reviewer name');
                      return;
                    }
                    const role = (document.getElementById('form-review-role') as HTMLInputElement).value;
                    const serverType = (document.getElementById('form-review-server') as HTMLInputElement).value;
                    const rating = Number((document.getElementById('form-review-rating') as HTMLSelectElement).value) || 5;
                    const reviewText = (document.getElementById('form-review-text') as HTMLTextAreaElement).value;
                    const avatar = (document.getElementById('form-review-avatar') as HTMLInputElement).value;
                    const date = (document.getElementById('form-review-date') as HTMLInputElement).value;
                    const avatarImage = (document.getElementById('form-review-avatar-img') as HTMLInputElement).value;
                    const verified = (document.getElementById('form-review-verified') as HTMLInputElement).checked;
                    const active = (document.getElementById('form-review-active') as HTMLInputElement).checked;

                    if (isAddingReview) {
                      addReview({
                        name,
                        role: role || 'Verified Host',
                        serverType: serverType || 'Minecraft Node',
                        rating,
                        reviewText: reviewText || 'Smooth performance and 20 TPS with zero lag.',
                        avatar: avatar || name.slice(0, 2).toUpperCase(),
                        avatarBg: 'from-emerald-600 to-teal-700',
                        avatarImage: avatarImage || undefined,
                        verified,
                        date: date || 'Recently',
                        active,
                      });
                      showSaveToast('New review added to website bar!');
                    } else if (editingReview) {
                      updateReview(editingReview.id, {
                        name,
                        role,
                        serverType,
                        rating,
                        reviewText,
                        avatar,
                        avatarImage,
                        verified,
                        date,
                        active,
                      });
                      showSaveToast('Review updated!');
                    }
                    setEditingReview(null);
                    setIsAddingReview(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar in Admin */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>All changes reflect live in real-time.</span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="bg-white hover:bg-slate-100 text-black font-bold px-4 py-2 rounded-xl transition-all"
          >
            Exit Admin Mode & View Website
          </button>
        </div>
      </div>
    </div>
  );
};
