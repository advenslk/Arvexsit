import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqs, siteSettings } = useApp();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleContactSupport = () => {
    if (siteSettings.contactSupportUrl.startsWith('mailto:')) {
      window.location.href = siteSettings.contactSupportUrl;
    } else {
      window.open(siteSettings.discordUrl, '_blank');
    }
  };

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Title & Contact Support Button matching Screenshot 4 & 8 */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mb-6">
          Everything you need to know about our game hosting services.
        </p>

        <button
          id="faq-contact-support-btn"
          onClick={handleContactSupport}
          className="bg-white hover:bg-slate-100 text-black font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          Contact Support
        </button>
      </div>

      {/* Accordion List matching Screenshot 4 & 8 */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-[#11131a] border border-white/5 overflow-hidden transition-all duration-200"
            >
              <button
                id={`faq-item-${faq.id}`}
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 animate-in fade-in slide-in-from-top-1">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
