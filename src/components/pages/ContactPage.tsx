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
      showNotification('Thank you! Your message has been sent to our team.', 'success');
    }, 500);
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Contact &amp; Executive Inquiries</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mb-3">
              We're Here to Help
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Have questions regarding our enterprise hosting plans, custom high-density clusters, or partnership proposals? Reach out directly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#11131e] border border-white/5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">24/7 Technical Support</h3>
                <p className="text-xs text-slate-400 mt-0.5">Average response under 15 minutes</p>
                <button
                  onClick={() => navigateTo('support', { subView: 'new' })}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-2 inline-block"
                >
                  Open a ticket &rarr;
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131e] border border-white/5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Discord Community</h3>
                <p className="text-xs text-slate-400 mt-0.5">5,000+ members, live announcements &amp; giveaways</p>
                <a
                  href="https://discord.gg/arvex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-2 inline-block"
                >
                  Join Discord Server &rarr;
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#11131e] border border-white/5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Direct Email</h3>
                <p className="text-xs text-slate-400 mt-0.5">support@arvex.host / legal@arvex.host</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-[#11131e] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-xl font-bold text-white font-display mb-2">Send a Message</h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill out the form below and an engineer will reply directly to your email inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Inquiry Topic</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#161926] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="General Inquiries">General Inquiries</option>
                  <option value="Sales & Enterprise Quotes">Sales &amp; Enterprise Quotes</option>
                  <option value="Partnerships & Sponsorships">Partnerships &amp; Sponsorships</option>
                  <option value="Abuse & DMCA Notice">Abuse &amp; DMCA Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help your team or game server project?..."
                  className="w-full bg-[#161926] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
