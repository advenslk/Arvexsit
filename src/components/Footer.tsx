import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Twitter,
  Github,
  Mail,
  ArrowUp,
  Shield,
  Gamepad2,
  Terminal,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080c] border-t border-white/10 pt-16 pb-12 relative text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                AX
              </div>
              <span className="text-base font-bold text-white font-display">
                {siteSettings.brandName}
              </span>
            </div>

            <p className="max-w-sm text-slate-400 leading-relaxed text-xs">
              {siteSettings.tagline}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Discord Community"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.supportEmail}`}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigateTo('plans')}
                  className="hover:text-white transition-colors text-left"
                >
                  Game Servers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-white transition-colors text-left"
                >
                  VPS Cloud Servers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('hardware')}
                  className="hover:text-white transition-colors text-left"
                >
                  Bare Metal Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('locations')}
                  className="hover:text-white transition-colors text-left"
                >
                  Global Datacenters
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pterodactyl Panel
                </button>
              </li>
            </ul>
          </div>

          {/* SaaS Portal Column */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Client & Billing
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigateTo('billing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Billing & Cards (LKR/USD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('tickets')}
                  className="hover:text-white transition-colors text-left"
                >
                  Support Desk (24/7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog')}
                  className="hover:text-white transition-colors text-left"
                >
                  Knowledgebase & Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-left font-semibold"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Control Center</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors text-left">
                  SLA 99.99% Agreement
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left">
                  Corero 3.2Tbps DDoS SLA
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px] text-slate-400">
              ©
            </div>
            <span>2026 {siteSettings.brandName}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500 italic hidden sm:inline">
              “Reimagine how the world hosts.”
            </span>

            <button
              id="scroll-to-top-btn"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
