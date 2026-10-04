import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Shield,
  Lock,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();
  const routePage = currentRoute.page;

  const defaultTab =
    routePage === 'privacy'
      ? 'privacy'
      : routePage === 'sla'
      ? 'sla'
      : routePage === 'acceptable-use'
      ? 'acceptable-use'
      : 'terms';

  const [activeDoc, setActiveDoc] = useState<string>(defaultTab);

  const docs = [
    { id: 'terms', title: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
    { id: 'sla', title: 'Service Level Agreement (SLA)', icon: <Shield className="w-4 h-4" /> },
    { id: 'acceptable-use', title: 'Acceptable Use Policy (AUP)', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-blue-600 font-semibold">Legal &amp; Compliance Center</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Transparency &amp; Consumer Protection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight mb-3">
              Legal Terms &amp; Policies
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Last revised: January 1, 2025. Please review the agreements governing your use of HelzerX Cloud infrastructure.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200 scrollbar-none">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                activeDoc === doc.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {doc.icon}
              <span>{doc.title}</span>
            </button>
          ))}
        </div>

        {/* Document Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6 shadow-xs">
          {activeDoc === 'terms' && (
            <>
              <h2 className="text-xl font-bold text-slate-900 font-display">1. Terms of Service &amp; Agreement</h2>
              <p>
                By accessing or purchasing services from HelzerX Cloud ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you are expressly prohibited from using the platform.
              </p>
              <h3 className="text-base font-bold text-slate-900">2. Account Registration &amp; Security</h3>
              <p>
                You must provide accurate, complete, and current information upon creating an account. You are responsible for safeguarding your credentials, API tokens, and 2FA keys.
              </p>
              <h3 className="text-base font-bold text-slate-900">3. Payments, Billing &amp; 24-Hour Refund Policy</h3>
              <p>
                Services are billed in advance on a recurring monthly, quarterly, or yearly cycle. We offer a 24-hour money-back guarantee on all Minecraft and Game Hosting plans. Dedicated servers, domain registrations, and software licenses are non-refundable once provisioned.
              </p>
              <h3 className="text-base font-bold text-slate-900">4. Service Suspension &amp; Termination</h3>
              <p>
                Invoices must be paid within 3 days of the due date. Unpaid nodes will be automatically suspended after 3 days and permanently terminated after 7 days of non-payment.
              </p>
            </>
          )}

          {activeDoc === 'privacy' && (
            <>
              <h2 className="text-xl font-bold text-slate-900 font-display">Privacy Policy &amp; Data Protection</h2>
              <p>
                HelzerX Cloud respects your privacy. We never sell, rent, or monetize personal customer records to third parties.
              </p>
              <h3 className="text-base font-bold text-slate-900">Information We Collect</h3>
              <p>
                We collect your name, email address, IP address for fraud prevention, billing country, and transaction history. We do not store full credit card numbers on our servers; payments are processed directly through PCI-DSS Level 1 certified gateways (Stripe, PayHere, PayPal).
              </p>
              <h3 className="text-base font-bold text-slate-900">GDPR &amp; Data Subject Rights</h3>
              <p>
                European Union and international users have the right to request a full export or permanent deletion of their account records upon opening a privacy ticket.
              </p>
            </>
          )}

          {activeDoc === 'sla' && (
            <>
              <h2 className="text-xl font-bold text-slate-900 font-display">99.99% Infrastructure SLA Guarantee</h2>
              <p>
                We guarantee a minimum of 99.99% monthly network and hardware uptime for all game server nodes, VPS hypervisors, and cloud storage pools.
              </p>
              <h3 className="text-base font-bold text-slate-900">SLA Credit Policy</h3>
              <p>
                If unscheduled downtime exceeds 0.01% in any calendar month, you are eligible for account credits:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>99.0% - 99.9% Uptime: 10% Service Credit</li>
                <li>98.0% - 98.9% Uptime: 25% Service Credit</li>
                <li>Below 98.0% Uptime: 50% Service Credit</li>
              </ul>
            </>
          )}

          {activeDoc === 'acceptable-use' && (
            <>
              <h2 className="text-xl font-bold text-slate-900 font-display">Acceptable Use Policy (AUP)</h2>
              <p>
                To safeguard our network integrity and IP reputation, the following activities are strictly prohibited on all HelzerX servers:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Outbound denial of service (DDoS/DoS) attacks, IP port scanning, and stress testing.</li>
                <li>Cryptocurrency mining (e.g. Monero XMR, Bitcoin miners) on non-dedicated CPU plans.</li>
                <li>Unsolicited bulk email spamming (SPAM) and phishing hosting.</li>
                <li>Torrent trackers, copyrighted piracy distribution, and malware command &amp; control nodes.</li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
