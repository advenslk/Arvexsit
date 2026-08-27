import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../data/initialData';
import {
  Server,
  Gamepad2,
  Cpu,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  X,
  Shield,
  User as UserIcon,
  LogOut,
  Terminal,
  Layers,
  Sparkles,
  Menu,
  Receipt,
  LifeBuoy,
  CreditCard,
  BookOpen,
  MessageCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { AppPage } from '../types';

export const Navbar: React.FC = () => {
  const {
    siteSettings,
    currency,
    setCurrency,
    user,
    logout,
    setIsAuthModalOpen,
    setAuthModalTab,
    openCheckout,
    plans,
    isAnnouncementVisible,
    dismissAnnouncement,
    currentPage,
    navigateTo,
  } = useApp();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'si' | 'ta'>('en');

  const handleGetStarted = () => {
    navigateTo('services-minecraft');
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setIsCurrencyDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080911]/95 backdrop-blur-xl border-b border-purple-950/40">
      {/* Top Announcement Bar */}
      {isAnnouncementVisible && siteSettings.announcementActive && (
        <div
          id="announcement-bar"
          className="w-full bg-gradient-to-r from-purple-950 via-[#15122b] to-purple-950 border-b border-purple-800/30 text-xs text-purple-200 py-1.5 px-4 flex items-center justify-between"
        >
          <div className="flex-1 text-center flex items-center justify-center gap-2">
            <span className="font-semibold">{siteSettings.announcementText}</span>
            <span className="font-mono font-bold bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded border border-purple-500/40">
              {siteSettings.announcementCoupon}
            </span>
          </div>
          <button
            id="dismiss-announcement-btn"
            onClick={dismissAnnouncement}
            className="text-purple-300 hover:text-white p-1 transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar matching Screenshot 4 & 5 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-7">
          <button
            onClick={() => {
              navigateTo('home');
              closeDropdowns();
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            {/* Glowing Purple 'A' Logo Icon matching Screenshot 4 & 5 */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center text-white font-black text-base shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter font-display">A</span>
              <div className="absolute inset-0 rounded-xl border border-white/25" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-display">
                ArveX
              </span>
              <span className="text-lg font-medium tracking-tight text-purple-300 font-display">
                Hosting
              </span>
            </div>
          </button>

          {/* Desktop Nav Items matching Screenshot 4 & 5: Services ▾, Social ▾, About ▾, Status, Legal ▾ */}
          <nav className="hidden lg:flex items-center gap-1 text-sm text-slate-300">
            {/* 1. Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('services')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeDropdown === 'services' || currentPage.startsWith('services')
                    ? 'text-purple-300 bg-purple-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'services' && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-[#0e101d] border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      navigateTo('services-minecraft');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      🎮
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Minecraft Hosting</h4>
                      <p className="text-[10px] text-slate-400">Paper, Purpur, Forge &amp; Bedrock</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('services-games');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      🕹
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Game Servers</h4>
                      <p className="text-[10px] text-slate-400">Palworld, Rust, Ark, Valheim</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('services-vps');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300">VPS Cloud Hosting</h4>
                      <p className="text-[10px] text-slate-400">AMD EPYC &amp; NVMe Storage</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('services-bot-hosting');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                      🤖
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Discord Bot Hosting</h4>
                      <p className="text-[10px] text-slate-400">Node.js, Python 24/7 Runtime</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Social Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('social')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeDropdown === 'social'
                    ? 'text-purple-300 bg-purple-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Social</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'social' && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-[#0e101d] border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href="https://discord.gg/arvexhosting"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center gap-2.5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    <span className="text-[#5865F2]">Discord Community</span>
                  </a>
                  <a
                    href="https://wa.me/94770000000"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center gap-2.5 text-xs text-slate-200 hover:text-emerald-400"
                  >
                    <span>WhatsApp Sri Lanka</span>
                  </a>
                  <button
                    onClick={() => {
                      navigateTo('partners');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 flex items-center gap-2.5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    <span>Official Partners</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. About Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('about')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeDropdown === 'about' || currentPage === 'about'
                    ? 'text-purple-300 bg-purple-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>About</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'about' && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-[#0e101d] border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      navigateTo('about');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    About ArveX
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('locations');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    Global Locations
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('hardware');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    Hardware &amp; Network
                  </button>
                </div>
              )}
            </div>

            {/* 4. Status (Direct link) */}
            <button
              onClick={() => {
                navigateTo('status');
                closeDropdowns();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                currentPage === 'status'
                  ? 'text-purple-300 bg-purple-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Status
            </button>

            {/* 5. Legal Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('legal')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeDropdown === 'legal' || currentPage === 'terms'
                    ? 'text-purple-300 bg-purple-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Legal</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'legal' && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-[#0e101d] border border-purple-500/30 rounded-2xl shadow-2xl p-2 z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      navigateTo('terms');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    Terms of Service
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('privacy');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('sla');
                      closeDropdowns();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 text-xs text-slate-200 hover:text-purple-300"
                  >
                    SLA Guarantee
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Tools & Language Pill & Dashboard Action matching Screenshot 4 & 5 */}
        <div className="flex items-center gap-3">
          {/* Language Pill: English | සිංහල | தமிழ் */}
          <div className="hidden sm:flex items-center bg-[#121422] border border-white/10 rounded-full px-3 py-1 text-[11px] font-medium text-slate-300">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                selectedLanguage === 'en'
                  ? 'text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setSelectedLanguage('si')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                selectedLanguage === 'si'
                  ? 'text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              සිංහල
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setSelectedLanguage('ta')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                selectedLanguage === 'ta'
                  ? 'text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              id="currency-selector-btn"
              onClick={() => {
                setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                setActiveDropdown(null);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-purple-200 bg-[#141628] hover:bg-[#1c2038] px-3 py-1.5 rounded-xl border border-purple-500/30 transition-colors"
            >
              <span>{currency.label}</span>
              <ChevronDown className="w-3 h-3 text-purple-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#111320] border border-purple-500/30 rounded-xl shadow-2xl py-1 z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      currency.code === c.code ? 'text-purple-300 font-semibold bg-white/5' : 'text-slate-300'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dashboard Button matching Screenshot 4 & 5 */}
          <button
            onClick={() => navigateTo('dashboard')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md ${
              currentPage === 'dashboard'
                ? 'bg-purple-600 text-white shadow-purple-600/30'
                : 'bg-[#15182c] hover:bg-[#1e233f] text-slate-200 border border-purple-500/30'
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <span className="w-1.5 h-1.5 rounded-xs bg-purple-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-purple-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-purple-400" />
              <span className="w-1.5 h-1.5 rounded-xs bg-purple-400" />
            </div>
            <span>Dashboard</span>
          </button>

          {/* User Sign In / Sign Up */}
          {user ? (
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('signup');
                setIsAuthModalOpen(true);
              }}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all active:scale-95"
            >
              Sign Up
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0c16] border-b border-purple-900/30 px-4 py-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold text-purple-300 uppercase">Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                navigateTo('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-slate-200 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigateTo('services-minecraft');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-purple-300 font-bold"
            >
              Minecraft Hosting
            </button>
            <button
              onClick={() => {
                navigateTo('pricing');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-slate-200 font-medium"
            >
              Pricing &amp; Plans
            </button>
            <button
              onClick={() => {
                navigateTo('games');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-slate-200 font-medium"
            >
              Supported Games
            </button>
            <button
              onClick={() => {
                navigateTo('partners');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-slate-200 font-medium"
            >
              Official Partners
            </button>
            <button
              onClick={() => {
                navigateTo('status');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#121422] text-left text-slate-200 font-medium"
            >
              Node Status
            </button>
            <button
              onClick={() => {
                navigateTo('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-purple-600 text-left text-white font-bold col-span-2 flex items-center justify-between"
            >
              <span>Open Server Dashboard</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
