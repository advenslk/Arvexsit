import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  ChevronRight,
  ShieldCheck,
  Globe,
  LifeBuoy,
  CheckCircle2,
  Sparkles,
  MapPin,
  Headphones,
  Building,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigateTo, showNotification } = useApp();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>('General Inquiries');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showNotification('Please fill in all fields before sending.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      showNotification('Thank you! Your message has been sent to our engineering team.', 'success');
    }, 500);
  };

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Contact &amp; Support</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Headphones className="w-3.5 h-3.5 text-cyan-300" />
              <span>24/7/365 Direct Engineer Support</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Get in Touch with Our Team
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Have questions regarding enterprise deployments, custom game networks, or billing? Our engineers reply in under 12 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-20 relative z-20">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] card-interactive-3d">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Fast Response</span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display mb-3">Communication Channels</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Choose the best way to reach us. For existing game server instances, opening a support ticket in your client area provides the fastest diagnostic resolution.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">General &amp; Sales Support</p>
                    <p className="text-xs text-blue-600 font-medium font-mono">support@helzerx.cloud</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Average response: 12 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Community Discord</p>
                    <p className="text-xs text-purple-600 font-medium font-mono">discord.gg/helzerx</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Active server community &amp; staff</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Operating Hours</p>
                    <p className="text-xs text-slate-700 font-medium">24 Hours / 7 Days / 365 Days</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Continuous infrastructure on-call staff</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Ticket Direct Link */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-bold font-display mb-2 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-cyan-300" />
                <span>Existing Customer?</span>
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed mb-5">
                Log in to open high-priority technical tickets with automated node logs and server hardware diagnostics attached.
              </p>
              <button
                onClick={() => navigateTo('support')}
                className="w-full py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Go to Ticket Helpdesk
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Direct Dispatch</span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-6">Send an Inquiry</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Perera"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="General Inquiries">General Inquiries</option>
                    <option value="Sales & Custom Quotes">Sales &amp; Enterprise Quotes</option>
                    <option value="Billing & Invoicing">Billing &amp; Invoicing</option>
                    <option value="Hardware Architecture">Hardware Architecture</option>
                    <option value="Partnership & Affiliates">Partnership &amp; Affiliates</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Message / Details *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your server needs, required RAM, estimated player count, or custom requirements..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
