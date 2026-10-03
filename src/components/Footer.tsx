import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Twitter, Github, Mail, Shield, ArrowUp, Youtube } from 'lucide-react';

const HELZERX_LOGO = 'https://www.image2url.com/r2/default/images/1787805975676-5a4d373d-c6bd-4d39-bb64-1336474f4a7a.png';

export const Footer: React.FC = () => {
  const { siteSettings, navigateTo } = useApp();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Col 1: Brand & Bio (matching Gabrun left) */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                <span className="font-display tracking-tight text-sm">HX</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 font-display">
                {siteSettings.brandName || 'HelzerX Cloud'}
              </span>
            </div>

            <p className="max-w-sm text-slate-500 text-xs sm:text-sm leading-relaxed">
              HelzerX Cloud has a passion for simplifying cloud &amp; game infrastructure. We deliver high-performance,
              zero-lag hosting solutions for all your multiplayer gaming and developer needs.
            </p>
          </div>

          {/* Col 2: Home links */}
          <div className="md:col-span-2 text-left">
            <h4 className="font-display font-bold text-slate-900 text-sm mb-4">Home</h4>
            <ul className="space-y-3 font-medium text-slate-500">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-blue-600 transition-colors text-left">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('plans')} className="hover:text-blue-600 transition-colors text-left">
                  Game Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-blue-600 transition-colors text-left">
                  Cloud VPS
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-blue-600 transition-colors text-left">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company links */}
          <div className="md:col-span-2 text-left">
            <h4 className="font-display font-bold text-slate-900 text-sm mb-4">Company</h4>
            <ul className="space-y-3 font-medium text-slate-500">
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-blue-600 transition-colors text-left">
                  Hardware &amp; SLA
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('blog')} className="hover:text-blue-600 transition-colors text-left">
                  Blog &amp; News
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('support')} className="hover:text-blue-600 transition-colors text-left">
                  Support Center
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-left">
                  <Shield className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Media Icons (matching Gabrun right circle icons) */}
          <div className="md:col-span-3 text-left md:text-right space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Social Media</h4>
            <div className="flex items-center gap-2.5 md:justify-end">
              <a
                href={siteSettings.discordUrl || 'https://discord.gg'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-blue-600 flex items-center justify-center transition-all shadow-sm"
                title="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.twitterUrl || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-blue-600 flex items-center justify-center transition-all shadow-sm"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.githubUrl || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-blue-600 flex items-center justify-center transition-all shadow-sm"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.supportEmail || 'support@helzerx.cloud'}`}
                className="w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-blue-600 flex items-center justify-center transition-all shadow-sm"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">Available 24/7 on Discord ticket desk</p>
          </div>

        </div>

        {/* Bottom Bar matching Gabrun: "Gabrun" on left, "© All Rights Reserved" on right */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-medium">
          <span className="font-bold text-slate-700">HelzerX Cloud</span>
          <div className="flex items-center gap-4">
            <span>© All Rights Reserved</span>
            <button
              onClick={scrollToTop}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
