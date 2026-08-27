/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { PlansPage } from './components/pages/PlansPage';
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
import { PaymentPage } from './components/pages/PaymentPage';
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

function MainWebsite() {
  const { currentPage, currentUser, setAuthModalOpen, setAuthModalTab } = useApp();

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
      case 'payment': return <PaymentPage />;

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
        return (
          <section className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6 py-20 text-center">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 shadow-2xl backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
                <span className="text-xl">🔐</span>
              </div>
              <h1 className="text-2xl font-black text-white">Admin access required</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">Sign in with an authorized ArveX administrator account to continue.</p>
              <button
                onClick={() => { setAuthModalTab('admin'); setAuthModalOpen(true); }}
                className="mt-6 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-500"
              >
                Open Admin Login
              </button>
            </div>
          </section>
        );

      case 'home':
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black antialiased flex flex-col justify-between">
      <Navbar />
      <main className="relative flex-1">{renderActivePage()}</main>
      <Footer />
      <AuthModal />
      <CheckoutModal />
      <InvoiceModal />
      <TicketModal />
      <BlogPostModal />
      <ClientAreaModal />
      <AdminPanelModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainWebsite />
    </AppProvider>
  );
}
