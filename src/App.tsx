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
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-400/20 bg-purple-500/10 shadow-[0_0_70px_rgba(124,58,237,0.16)]"><span className="text-4xl">🔧</span></div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-purple-300"><span className="h-1.5 w-1.5 rounded-full bg-purple-400" />Maintenance Mode</div>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">We&apos;ll be back soon.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">ArveX Hosting is currently undergoing maintenance and improvements. Our website will be available again soon.</p>
        <p className="mt-3 text-xs text-slate-600">Thank you for your patience.</p>
        <a id="arvex-administrator-login" href="?admin-login=1" onClick={(event)=>{event.preventDefault();openAdminLogin();}} className="relative z-20 mt-8 inline-flex cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-white">Administrator Login</a>
      </div>
    </main>
  );
}

function MaintenanceAdminControl({ enabled, busy, onToggle }: { enabled: boolean; busy: boolean; onToggle: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-[90] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0d16]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Maintenance Mode</p><p className={`text-xs font-bold ${enabled?'text-amber-300':'text-emerald-300'}`}>{enabled?'ON — Visitors blocked':'OFF — Website online'}</p></div>
      <button type="button" disabled={busy} onClick={onToggle} className={`relative h-7 w-12 rounded-full border transition ${enabled?'border-amber-400/40 bg-amber-500/20':'border-emerald-400/40 bg-emerald-500/20'} disabled:opacity-50`} aria-label="Toggle maintenance mode"><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled?'left-6':'left-1'}`} /></button>
    </div>
  );
}

function MainWebsite() {
  const { currentPage, currentUser, login, logout, setIsAuthModalOpen, setAuthModalTab, siteSettings, updateSiteSettings } = useApp();
  const [authReady, setAuthReady] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceBusy, setMaintenanceBusy] = useState(false);
  const serverUserLoaded = useRef(false);

  const openAdminLogin = () => { setAuthModalTab('admin'); setIsAuthModalOpen(true); };

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => { if(result?.authenticated&&result.user) login(result.user.email,result.user.role==='admin'?'admin':'customer',result.user.name,result.user.provider||'email'); })
      .catch(() => undefined)
      .finally(() => { serverUserLoaded.current=true; setAuthReady(true); });
    // Intentionally run once per page load. AppContext's login function is not memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled=false;
    const loadMaintenance=async()=>{try{const response=await fetch('/api/cms/config',{cache:'no-store'});if(!response.ok)return;const config=await response.json();if(!cancelled)setMaintenanceMode(Boolean(config?.siteSettings?.maintenanceMode));}catch{}};
    loadMaintenance();const interval=window.setInterval(loadMaintenance,15000);return()=>{cancelled=true;window.clearInterval(interval)};
  },[]);

  useEffect(() => {
    if(!authReady||!serverUserLoaded.current)return;
    const params=new URLSearchParams(window.location.search);if(params.get('admin-login')!=='1')return;
    setAuthModalTab('admin');setIsAuthModalOpen(true);window.history.replaceState({},document.title,window.location.pathname+window.location.hash);
  },[authReady,setAuthModalTab,setIsAuthModalOpen]);

  const toggleMaintenance=async()=>{
    if(currentUser?.role!=='admin'||maintenanceBusy)return;
    const next=!maintenanceMode;
    const adminToken=sessionStorage.getItem('arvex_admin_token')||'';
    if(!adminToken){setAuthModalTab('admin');setIsAuthModalOpen(true);return;}
    setMaintenanceBusy(true);
    try{
      const response=await fetch('/api/cms/config/siteSettings',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json',Authorization:`Bearer ${adminToken}`},body:JSON.stringify({value:{...siteSettings,maintenanceMode:next}})});
      if(!response.ok){if(response.status===401){sessionStorage.removeItem('arvex_admin_token');logout();openAdminLogin();}return;}
      setMaintenanceMode(next);updateSiteSettings({maintenanceMode:next} as any);
    }catch{}finally{setMaintenanceBusy(false)}
  };

  const renderActivePage=()=>{switch(currentPage){
    case 'dynamic-plan': return <PlanDetailPage />; case 'dynamic-game': return <GameDetailPage />; case 'services': return <ServicesPage />;
    case 'services-minecraft': return <MinecraftServicePage />; case 'services-game-hosting': return <GameHostingServicePage />; case 'services-vps': return <VpsServicePage />; case 'services-vds': return <VdsServicePage />; case 'services-web-hosting': return <WebHostingServicePage />; case 'services-bot-hosting': return <BotHostingServicePage />;
    case 'plans': case 'pricing': return <PricingPage />; case 'games': return <GamesPage />; case 'domains': return <DomainsPage />; case 'checkout': return <CheckoutPage />; case 'payment': return <PayHerePaymentPage />; case 'support': case 'tickets': return <SupportPage />; case 'status': return <StatusPage />; case 'knowledgebase': return <KnowledgebasePage />; case 'partners': return <PartnersPage />; case 'affiliates': return <AffiliatesPage />; case 'contact': return <ContactPage />; case 'about': return <AboutPage />;
    case 'terms': case 'privacy': case 'sla': case 'acceptable-use': return <LegalPage />; case 'locations': return <LocationsPage />; case 'hardware': return <HardwarePage />; case 'billing': return <BillingPage />; case 'blog': return <BlogPage />; case 'dashboard': return <DashboardPage />;
    case 'admin': if(currentUser?.role==='admin')return <AdminPage />; return <MaintenancePage openAdminLogin={openAdminLogin} />;
    case 'home': default: return <HomePage />;
  }};

  if(!authReady)return <div className="flex min-h-screen items-center justify-center bg-[#07080c] text-slate-400"><div className="text-center"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-400"/><p className="text-xs font-semibold uppercase tracking-[0.2em]">Loading ArveX</p></div></div>;

  if(maintenanceMode&&currentUser?.role!=='admin')return <><MaintenancePage openAdminLogin={openAdminLogin}/><AuthModal/></>;

  return <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black antialiased flex flex-col justify-between">
    {currentUser?.role==='admin'&&<MaintenanceAdminControl enabled={maintenanceMode} busy={maintenanceBusy} onToggle={toggleMaintenance}/>}<Navbar/><main className="relative flex-1">{renderActivePage()}</main><Footer/><AuthModal/><CheckoutModal/><InvoiceModal/><TicketModal/><BlogPostModal/><ClientAreaModal/><AdminPanelModal/>
  </div>;
}

export default function App(){return <AppProvider><MainWebsite/></AppProvider>;}
