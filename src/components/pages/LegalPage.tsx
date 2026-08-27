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
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Legal &amp; Compliance Center</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Transparency &amp; Consumer Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mb-3">
          Legal Terms &amp; Policies
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Last revised: January 1, 2025. Please review the agreements governing your use of ArveX Hosting infrastructure.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/5 scrollbar-none">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveDoc(doc.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeDoc === doc.id
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                : 'bg-[#11131e] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {doc.icon}
            <span>{doc.title}</span>
          </button>
        ))}
      </div>

      {/* Document Content */}
      <div className="bg-[#11131e] border border-white/5 rounded-3xl p-8 sm:p-12 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-6 shadow-xl">
        {activeDoc === 'terms' && (
          <>
            <h2 className="text-xl font-bold text-white font-display">1. Terms of Service &amp; Agreement</h2>
            <p>
              By accessing or purchasing services from ArveX Hosting ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you are expressly prohibited from using the platform.
            </p>
            <h3 className="text-base font-bold text-white">2. Account Registration &amp; Security</h3>
            <p>
              You must provide accurate, complete, and current information upon creating an account. You are responsible for safeguarding your credentials, API tokens, and 2FA keys.
            </p>
            <h3 className="text-base font-bold text-white">3. Payments, Billing &amp; 7-Day Refund Policy</h3>
            <p>
              Services are billed in advance on a recurring monthly, quarterly, or yearly cycle. We offer a 7-day money-back guarantee on all Minecraft and Game Hosting plans. Dedicated servers, domain registrations, and software licenses are non-refundable once provisioned.
            </p>
            <h3 className="text-base font-bold text-white">4. Service Suspension &amp; Termination</h3>
            <p>
              Invoices must be paid within 3 days of the due date. Unpaid nodes will be automatically suspended after 3 days and permanently terminated after 7 days of non-payment.
            </p>
          </>
        )}

        {activeDoc === 'privacy' && (
          <>
            <h2 className="text-xl font-bold text-white font-display">Privacy Policy &amp; Data Protection</h2>
            <p>
              ArveX Hosting respects your privacy. We never sell, rent, or monetize personal customer records to third parties.
            </p>
            <h3 className="text-base font-bold text-white">Information We Collect</h3>
            <p>
              We collect your name, email address, IP address for fraud prevention, billing country, and transaction history. We do not store full credit card numbers on our servers; payments are processed directly through PCI-DSS Level 1 certified gateways (Stripe, PayHere, PayPal).
            </p>
            <h3 className="text-base font-bold text-white">GDPR &amp; Data Subject Rights</h3>
            <p>
              European Union and international users have the right to request a full export or permanent deletion of their account records upon opening a privacy ticket.
            </p>
          </>
        )}

        {activeDoc === 'sla' && (
          <>
            <h2 className="text-xl font-bold text-white font-display">99.99% Infrastructure SLA Guarantee</h2>
            <p>
              We guarantee a minimum of 99.99% monthly network and hardware uptime for all game server nodes, VPS hypervisors, and cloud storage pools.
            </p>
            <h3 className="text-base font-bold text-white">SLA Credit Policy</h3>
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
            <h2 className="text-xl font-bold text-white font-display">Acceptable Use Policy (AUP)</h2>
            <p>
              To safeguard our network integrity and IP reputation, the following activities are strictly prohibited on all ArveX servers:
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
  );
};
