/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { GamesPage } from './components/pages/GamesPage';
import { LocationsPage } from './components/pages/LocationsPage';
import { HardwarePage } from './components/pages/HardwarePage';
import { BillingPage } from './components/pages/BillingPage';
import { BlogPage } from './components/pages/BlogPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AdminPage } from './components/pages/AdminPage';
import { MinecraftServicePage } from './components/pages/MinecraftServicePage';
import { GameHostingServicePage } from './components/pages/GameHostingServicePage';
import { VpsServicePage } from './components/pages/VpsServicePage';
import { VdsServicePage } from './components/pages/VdsServicePage';
import { WebHostingServicePage } from './components/pages/WebHostingServicePage';
import { BotHostingServicePage } from './components/pages/BotHostingServicePage';
import { PlanDetailPage } from './components/pages/PlanDetailPage';
import { GameDetailPage } from './components/pages/GameDetailPage';
import { DomainsPage } from './components/pages/DomainsPage';
import { PricingPage } from './components/pages/PricingPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { PayHerePaymentPage } from './components/pages/PayHerePaymentPage';
import { SupportPage } from './components/pages/SupportPage';
import { StatusPage } from './components/pages/StatusPage';
import { PartnersPage } from './components/pages/PartnersPage';
import { AffiliatesPage } from './components/pages/AffiliatesPage';
import { LegalPage } from './components/pages/LegalPage';
import { ContactPage } from './components/pages/ContactPage';
import { KnowledgebasePage } from './components/pages/KnowledgebasePage';
import { AboutPage } from './components/pages/AboutPage';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { TicketModal } from './components/TicketModal';
import { BlogPostModal } from './components/BlogPostModal';
import { ClientAreaModal } from './components/ClientAreaModal';
import { AdminPanelModal } from './components/AdminPanelModal';

function MaintenancePage({ openAdminLogin }: { openAdminLogin: () => void }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080c] px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(124,58,237,0.16),transparent_42%)]" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-400/20 bg-purple-500/10 shadow-[0_0_70px_rgba(124,58,237,0.16)]">
          <span className="text-4xl">🔧</span>
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          Maintenance Mode
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">We&apos;ll be back soon.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          ArveX Hosting is currently undergoing maintenance and improvements. Our website will be available again soon.
        </p>
        <p className="mt-3 text-xs text-slate-600">Thank you for your patience.</p>
        <button
          type="button"
          onPointerUp={(event) => {
            event.preventDefault();
            openAdminLogin();
          }}
          onClick={(event) => event.preventDefault()}
          className="relative z-20 mt-8 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-white"
        >
          Administrator Login
        </button>
      </div>
    </main>
  );
}

function MainWebsite() {
  const { currentPage, currentUser, login, setAuthModalOpen, setAuthModalTab } = useApp();
  const [authReady, setAuthReady] = useState(false);
  const authBootstrapped = useRef(false);
  const serverUserLoaded = useRef(false);

  useEffect(() => {
    try { localStorage.removeItem('arvex_saas_v3_user'); } catch {}
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => {
        if (result?.authenticated && result.user) login(result.user.email, result.user.role === 'admin' ? 'admin' : 'customer', result.user.name, result.user.provider || 'email');
      })
      .catch(() => undefined)
      .finally(() => {
        serverUserLoaded.current = true;
        authBootstrapped.current = true;
        setAuthReady(true);
      });
  }, []);

  useEffect(() => {
    if (!authBootstrapped.current || !serverUserLoaded.current || currentUser) return;
    try { localStorage.removeItem('arvex_admin_token'); } catch {}
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
  }, [currentUser]);

  const openAdminLogin = () => {
    // Set both values in the same React update so the modal is opened directly
    // in administrator mode. Do not close/re-open it asynchronously.
    setAuthModalTab('admin');
    setAuthModalOpen(true);
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dynamic-plan': return <PlanDetailPage />;
      case 'dynamic-game': return <GameDetailPage />;
      case 'services': return <ServicesPage />;
      case 'services-minecraft': return <MinecraftServicePage />;
      case 'services-game-hosting': return <GameHostingServicePage />;
      case 'services-vps': return <VpsServicePage />;
      case 'services-vds': return <VdsServicePage />;
      case 'services-web-hosting': return <WebHostingServicePage />;
      case 'services-bot-hosting': return <BotHostingServicePage />;
      case 'plans':
      case 'pricing': return <PricingPage />;
      case 'games': return <GamesPage />;
      case 'domains': return <DomainsPage />;
      case 'checkout': return <CheckoutPage />;
      case 'payment': return <PayHerePaymentPage />;
      case 'support':
      case 'tickets': return <SupportPage />;
      case 'status': return <StatusPage />;
      case 'knowledgebase': return <KnowledgebasePage />;
      case 'partners': return <PartnersPage />;
      case 'affiliates': return <AffiliatesPage />;
      case 'contact': return <ContactPage />;
      case 'about': return <AboutPage />;
      case 'terms':
      case 'privacy':
      case 'sla':
      case 'acceptable-use': return <LegalPage />;
      case 'locations': return <LocationsPage />;
      case 'hardware': return <HardwarePage />;
      case 'billing': return <BillingPage />;
      case 'blog': return <BlogPage />;
      case 'dashboard': return <DashboardPage />;
      case 'admin':
        if (currentUser?.role === 'admin') return <AdminPage />;
        return <MaintenancePage openAdminLogin={openAdminLogin} />;
      case 'home':
      default: return <HomePage />;
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07080c] text-slate-400">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-400" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">Loading ArveX</p>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'admin') {
    return (
      <>
        <MaintenancePage openAdminLogin={openAdminLogin} />
        <AuthModal />
      </>
    );
  }

  return <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black antialiased flex flex-col justify-between"><Navbar /><main className="relative flex-1">{renderActivePage()}</main><Footer /><AuthModal /><CheckoutModal /><InvoiceModal /><TicketModal /><BlogPostModal /><ClientAreaModal /><AdminPanelModal /></div>;
}

export default function App() { return <AppProvider><MainWebsite /></AppProvider>; }
