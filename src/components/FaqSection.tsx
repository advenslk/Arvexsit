import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqs, siteSettings, navigateTo } = useApp();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 text-left">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-3 shadow-sm">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Help &amp; Answers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mb-6">
          Everything you need to know about our cloud, game hosting, and payment gateways.
        </p>

        <button
          type="button"
          onClick={() => navigateTo('support')}
          className="bg-[#0b0f19] hover:bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
        >
          <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
          <span>Contact 24/7 Support</span>
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {faqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-300"
            >
              <button
                type="button"
                id={`faq-item-${faq.id}`}
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 font-medium">
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
