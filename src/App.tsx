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
  const { currentPage } = useApp();

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
      case 'admin': return <AdminPage />;

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
