import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CURRENCIES } from '../../data/initialData';
import {
  Server,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  Globe,
  Sliders,
  Sparkles,
  Tag,
  Lock,
  User,
  Mail,
  RefreshCw,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Building2,
  Wallet,
  QrCode,
  Check,
  Copy,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { HostingPlan, BillingCycle } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    currentRoute,
    plans,
    selectedPlanForCheckout,
    locations,
    coupons,
    user,
    setUser,
    currency,
    setCurrency,
    billingCycle,
    formatPrice,
    createOrder,
    deployServer,
    navigateTo,
    showNotification,
  } = useApp();

  const targetPlanId = currentRoute.params.planId || currentRoute.params.orderId;
  const initialPlan =
    plans.find((p) => p.id === targetPlanId || p.slug === targetPlanId) ||
    selectedPlanForCheckout ||
    plans[0];

  const [plan, setPlan] = useState<HostingPlan>(initialPlan);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(billingCycle || 'monthly');
  const [selectedServerType, setSelectedServerType] = useState<string>('papermc');
  const [selectedLocation, setSelectedLocation] = useState<string>('singapore');
  const [serverName, setServerName] = useState<string>('My HelzerX Server');
  const [serverNotes, setServerNotes] = useState<string>('');

  // Customer Auth / Checkout Type (Screenshot 1)
  const [authMode, setAuthMode] = useState<'existing' | 'new'>('new');
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [emailAddress, setEmailAddress] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCloudflareVerified, setIsCloudflareVerified] = useState<boolean>(true);

  // Promotion
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);

  // Real Payment Gateway Selection
  const [paymentGateway, setPaymentGateway] = useState<'payhere' | 'card' | 'bank_transfer' | 'crypto' | 'koko'>('payhere');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [activePaymentModal, setActivePaymentModal] = useState<string | null>(null);
  const [isOrderCompleted, setIsOrderCompleted] = useState<any | null>(null);

  // Bank Transfer Slip State
  const [bankSlipUploaded, setBankSlipUploaded] = useState<boolean>(false);
  const [bankReference, setBankReference] = useState<string>(`ARX-${Math.floor(100000 + Math.random() * 900000)}`);

  // Crypto Address State
  const [copiedCrypto, setCopiedCrypto] = useState<boolean>(false);

  // Currency Dropdown
  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);

  // Server Types matching Screenshot 3
  const serverTypes = [
    {
      id: 'papermc',
      name: 'PaperMC Latest',
      desc: 'High performance Spigot fork for plugins',
      icon: '📜',
    },
    {
      id: 'forge',
      name: 'Forge Latest',
      desc: 'Heavy modpack & modded community engine',
      icon: '⚒️',
    },
    {
      id: 'vanilla',
      name: 'Vanilla Minecraft Latest',
      desc: 'Official Mojang release runtime',
      icon: '🧊',
    },
    {
      id: 'bedrock',
      name: 'Bedrock Latest',
      desc: 'Native Pocket Edition & Windows 10 support',
      icon: '📱',
    },
    {
      id: 'proxy',
      name: 'Proxy Server',
      desc: 'Velocity / BungeeCord cross-node network hub',
      icon: '⚙️',
    },
  ];

  // Locations matching Screenshot 3
  const serverLocations = [
    {
      id: 'singapore',
      name: 'Singapore',
      flag: '🇸🇬',
      ping: '14-24ms',
      badge: 'Lowest Latency',
    },
    {
      id: 'us-central',
      name: 'US Central',
      flag: '🇺🇸',
      ping: '150ms',
      badge: 'Enterprise EPYC',
    },
    {
      id: 'sri-lanka',
      name: 'Sri Lanka (Colombo)',
      flag: '🇱🇰',
      ping: '8-14ms',
      badge: 'Dialog & SLT Fiber',
    },
    {
      id: 'germany',
      name: 'Frankfurt, Germany',
      flag: '🇩🇪',
      ping: '130ms',
      badge: 'EU Scrubbing',
    },
  ];

  // Pricing calculations
  const calculateBasePriceLkr = () => {
    let baseLkr = plan.monthlyPrice * 350; // default 350 LKR/USD ratio or mapped plan
    if (plan.id === 'plan-mc-1' || plan.slug === 'minecraft-1gb') baseLkr = 350;
    else if (plan.id === 'plan-mc-2') baseLkr = 700;
    else if (plan.id === 'plan-mc-3') baseLkr = 1400;
    else if (plan.id === 'plan-mc-4') baseLkr = 2800;
    else baseLkr = Math.round(plan.monthlyPrice * 300);

    if (selectedCycle === 'quarterly') return baseLkr * 3;
    if (selectedCycle === 'yearly') return baseLkr * 12 * 0.85; // 15% off
    return baseLkr;
  };

  const rawSubtotalLkr = calculateBasePriceLkr();
  let discountLkr = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountLkr = (rawSubtotalLkr * appliedCoupon.discount) / 100;
    } else {
      discountLkr = appliedCoupon.discount * 300;
    }
  }

  const finalTotalLkr = Math.max(0, rawSubtotalLkr - discountLkr);

  // Formatted price string based on selected site currency
  const getDisplayTotal = () => {
    if (currency.code === 'LKR') {
      return `Rs. ${finalTotalLkr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const inUsd = finalTotalLkr / 300;
    return `${currency.symbol}${(inUsd * currency.rate).toFixed(2)}`;
  };

  const handleValidateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const matched = coupons.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase() && c.active
    );

    if (matched) {
      setAppliedCoupon(matched);
      showNotification(`Coupon "${matched.code}" validated! Discount applied.`, 'success');
    } else if (couponInput.toUpperCase() === 'AUREX10' || couponInput.toUpperCase() === 'VOLTUS10') {
      const customCoupon = { code: couponInput.toUpperCase(), discount: 10, type: 'percentage' };
      setAppliedCoupon(customCoupon);
      showNotification(`Coupon "${customCoupon.code}" applied: 10% OFF!`, 'success');
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setConfirmPassword(pass);
    showNotification('Secure password generated and copied to fields!', 'info');
  };

  const handleExecutePayment = (selectedMethod: string) => {
    if (!emailAddress || !emailAddress.includes('@')) {
      showNotification('Please enter a valid email address to receive your server credentials.', 'error');
      return;
    }

    if (!agreedTerms) {
      showNotification('Please accept the Terms of Service to continue.', 'error');
      return;
    }

    // Auto-login user if new
    if (!user && fullName) {
      setUser({
        id: `usr-${Date.now()}`,
        name: fullName || 'HelzerX Customer',
        email: emailAddress,
        role: 'Client',
        avatar: 'AX',
      });
    }

    setIsProcessingPayment(true);

    // Open Real Payment Gateway Modal Simulation
    setTimeout(() => {
      setIsProcessingPayment(false);
      setActivePaymentModal(selectedMethod);
    }, 600);
  };

  const handleCompleteOrderSuccess = () => {
    const newOrder = createOrder({
      customerName: fullName || user?.name || 'Valued Customer',
      customerEmail: emailAddress || user?.email || 'customer@helzerx.cloud',
      planName: plan.name,
      planId: plan.id,
      billingCycle: selectedCycle,
      amount: finalTotalLkr / 300,
      location: selectedLocation === 'singapore' ? 'Singapore' : selectedLocation === 'sri-lanka' ? 'Sri Lanka' : 'US Central',
      hostname: `${serverName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'server'}.helzerx.cloud`,
      status: 'Paid',
    });

    // Deploy instant Pterodactyl node
    const newServer = deployServer({
      serverName: serverName || 'My HelzerX Minecraft Node',
      planName: plan.name,
      planId: plan.id,
      location: selectedLocation === 'singapore' ? 'Singapore' : selectedLocation === 'sri-lanka' ? 'Sri Lanka' : 'Dallas, TX',
      ramMb: plan.ramGb * 1024,
      cpuCores: plan.cpuCores,
      diskGb: plan.diskGb,
      status: 'running',
      autoRestart: true,
    });

    setActivePaymentModal(null);
    setIsOrderCompleted({
      orderId: newOrder.id,
      serverId: newServer.id,
      serverName: newServer.serverName,
      ipAddress: `${newServer.ipAddress}:${newServer.port}`,
    });

    showNotification('Payment verified! Server provisioned on HelzerX Node.', 'success');
  };

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Currency Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20 mb-6">
            <nav className="flex items-center gap-2 text-xs text-blue-200/90 overflow-x-auto whitespace-nowrap">
              <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
              <button onClick={() => navigateTo('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
              <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
              <span className="text-white font-bold">Checkout</span>
            </nav>

            {/* Currency Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors backdrop-blur-md cursor-pointer"
              >
                <span>{currency.label}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 z-50 text-slate-800">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <span className="font-semibold">{c.label}</span>
                      <span className="font-mono text-[10px] text-slate-400">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Instant Automated Provisioning</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Complete Your Order
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Configuring <strong className="text-white">{plan.name}</strong> ({plan.ramGb}GB RAM, {plan.cpuCores} vCPU) with 100% NVMe storage &amp; DDoS protection.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-16 relative z-20">
        {/* 1. Selected Plan Specs Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] relative overflow-hidden card-interactive-3d">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/30 flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-md text-white">
                <Server className="w-8 h-8" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                  Tier: {plan.tier || 'Enterprise'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {plan.name}
                </h2>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    ⚙ {plan.cpuCores} Core CPU
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    💾 {plan.ramGb} GB RAM
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    💽 {plan.diskGb} GB NVMe SSD
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    🛡 DDoS Scrubbing
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-[11px] text-slate-400 block">
                Need a custom enterprise quote?
              </span>
              <button
                onClick={() => navigateTo('support')}
                className="text-xs text-blue-600 hover:text-blue-800 underline font-bold cursor-pointer"
              >
                Talk to support 24/7.
              </button>
            </div>
          </div>
        </div>

        {/* 2. Service Configuration */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <span>Service Configuration</span>
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Server Display Name
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Enter server name"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Custom display name for your Pterodactyl server instance
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Special Requirements / Migration Notes (Optional)
              </label>
              <textarea
                value={serverNotes}
                onChange={(e) => setServerNotes(e.target.value)}
                placeholder="Add any notes or special requirements..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Additional notes for your server configuration or migration request
              </span>
            </div>
          </div>

          {/* 1. Server Type Radio Tiles */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Server Software Runtime <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serverTypes.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedServerType(st.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedServerType === st.id
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{st.icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {st.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">{st.desc}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedServerType === st.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedServerType === st.id && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Server Location Radio Tiles */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              2. Datacenter Location <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serverLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedLocation === loc.id
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{loc.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {loc.name}
                        </h4>
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                          {loc.ping}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{loc.badge}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedLocation === loc.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedLocation === loc.id && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Customer Identification & Account */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Customer Identification &amp; Account</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* Existing Customer Option */}
            <div
              onClick={() => setAuthMode('existing')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                authMode === 'existing'
                  ? 'bg-blue-50/70 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    I&apos;m an existing customer
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sign in to continue with checkout
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    authMode === 'existing'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {authMode === 'existing' && <Check className="w-2.5 h-2.5" />}
                </div>
              </div>
            </div>

            {/* New Customer Option */}
            <div
              onClick={() => setAuthMode('new')}
              className={`p-5 rounded-3xl border transition-all ${
                authMode === 'new'
                  ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    I&apos;m a new customer
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Create an account to checkout
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    authMode === 'new'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {authMode === 'new' && <Check className="w-2.5 h-2.5" />}
                </div>
              </div>

              {/* Social Login Buttons matching Screenshot 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setFullName('Discord Gamer');
                    setEmailAddress('gamer@discord.gg');
                    showNotification('Signed in with Discord OAuth!', 'success');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Continue with Discord</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFullName('Google User');
                    setEmailAddress('user@gmail.com');
                    showNotification('Signed in with Google OAuth!', 'success');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Registration Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-200 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Generate</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Strong Password"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none pr-9 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none pr-9 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Cloudflare Turnstile Verification Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Verified human visitor</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cloudflare Turnstile Verified</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (emailAddress && fullName) {
                      showNotification('Account verified for instant checkout!', 'success');
                    } else {
                      showNotification('Please fill in your name and email.', 'info');
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Confirm Account Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Select Duration */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Billing Cycle</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedCycle('monthly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedCycle === 'monthly'
                  ? 'bg-blue-50/70 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedCycle === 'monthly'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedCycle === 'monthly' && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Monthly Billing</h4>
                  <p className="text-[11px] text-blue-700 font-mono font-bold">
                    Standard Rate
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedCycle('quarterly')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedCycle === 'quarterly'
                  ? 'bg-blue-50/70 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedCycle === 'quarterly'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedCycle === 'quarterly' && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Quarterly (3 Months)</h4>
                  <p className="text-[11px] text-emerald-700 font-mono font-bold">
                    5% Discount Included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Promotion / Coupon */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] space-y-3">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <span>Discount Coupon</span>
          </h3>

          <form onSubmit={handleValidateCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter coupon code (e.g. AUREX10, VOLTUS10)"
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Validate</span>
            </button>
          </form>

          {appliedCoupon && (
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Code &quot;{appliedCoupon.code}&quot; applied successfully!
            </p>
          )}

          {couponError && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {couponError}
            </p>
          )}
        </div>

        {/* 6. Order Summary & Payment Methods */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Order Summary &amp; Payment Gateway</span>
            </h3>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            <div className="flex justify-between">
              <span>Service Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">
                Rs. {rawSubtotalLkr.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Setup &amp; Provisioning Fee:</span>
              <span className="font-mono font-bold text-emerald-600">FREE</span>
            </div>
            {discountLkr > 0 && (
              <div className="flex justify-between">
                <span>Discount Applied:</span>
                <span className="font-mono font-bold text-emerald-600">
                  -Rs. {discountLkr.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">Total Due Today:</span>
              <span className="font-mono font-extrabold text-base text-blue-600 font-display">
                {getDisplayTotal()}
              </span>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms-check"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="terms-check" className="text-xs text-slate-600 cursor-pointer">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => navigateTo('terms')}
                className="text-blue-600 font-bold hover:underline"
              >
                Terms of Service
              </button>{' '}
              and 99.99% SLA Guarantee.
            </label>
          </div>

          {/* Real Payment Gateway Selector Options */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Select Payment Method:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Option 1: PayHere */}
              <button
                type="button"
                onClick={() => setPaymentGateway('payhere')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentGateway === 'payhere'
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-blue-700">PayHere LKR</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Visa, MC, Genie, FriMi, eZ Cash
                </span>
              </button>

              {/* Option 2: Stripe Card */}
              <button
                type="button"
                onClick={() => setPaymentGateway('card')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentGateway === 'card'
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-slate-900">Card (Stripe)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  International &amp; Local Cards
                </span>
              </button>

              {/* Option 3: Bank Transfer */}
              <button
                type="button"
                onClick={() => setPaymentGateway('bank_transfer')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentGateway === 'bank_transfer'
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-emerald-700">Bank Transfer</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  ComBank, BOC, HNB, Sampath
                </span>
              </button>

              {/* Option 4: Crypto */}
              <button
                type="button"
                onClick={() => setPaymentGateway('crypto')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentGateway === 'crypto'
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 ring-2 ring-blue-600/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-amber-700">Crypto</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  USDT TRC20, TON, BTC
                </span>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={() => handleExecutePayment(paymentGateway)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Connecting to {paymentGateway.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Pay &amp; Deploy ({getDisplayTotal()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Real Interactive Payment Modals */}
      {/* 1. PayHere Sri Lanka Gateway Window */}
      {activePaymentModal === 'payhere' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* PayHere Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider bg-white text-blue-800 px-2 py-0.5 rounded font-display">
                  PayHere
                </span>
                <span className="text-xs font-semibold">Secure Payment Portal</span>
              </div>
              <span className="text-xs font-mono font-bold">{getDisplayTotal()}</span>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-500">Merchant: <strong className="text-slate-800">HelzerX Cloud Lanka (Pvt) Ltd</strong></p>
                <p className="text-slate-500">Order Reference: <strong className="text-blue-700 font-mono">{bankReference}</strong></p>
                <p className="text-slate-500">Item: <strong className="text-slate-800">{plan.name} ({selectedCycle})</strong></p>
              </div>

              {/* Supported Payment Channels */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  Select Sri Lanka Payment Method:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center gap-2 text-blue-900">
                    <span>💳</span>
                    <span className="font-semibold text-[11px]">Visa / MasterCard</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                    <span>📱</span>
                    <span className="font-semibold text-[11px]">FriMi / Genie</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                    <span>💵</span>
                    <span className="font-semibold text-[11px]">eZ Cash / mCash</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                    <span>🏦</span>
                    <span className="font-semibold text-[11px]">Sampath Vishwa</span>
                  </div>
                </div>
              </div>

              {/* Card input mockup */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Card Number (4111 2222 3333 4444)"
                  defaultValue="4111 2222 3333 4444"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 font-mono text-xs focus:outline-none focus:border-blue-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    defaultValue="888"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePaymentModal(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOrderSuccess}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize LKR Pay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sri Lankan Bank Transfer Modal */}
      {activePaymentModal === 'bank_transfer' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Direct Sri Lankan Bank Transfer</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600">{getDisplayTotal()}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <p className="text-slate-500">Bank: <strong className="text-slate-900">Commercial Bank of Ceylon</strong></p>
              <p className="text-slate-500">Account Name: <strong className="text-slate-900">HelzerX Cloud LK Pvt Ltd</strong></p>
              <p className="text-slate-500">Account Number: <strong className="text-blue-700 font-mono text-sm">8009284711</strong></p>
              <p className="text-slate-500">Branch: <strong className="text-slate-900">Colombo Main Branch (001)</strong></p>
              <p className="text-slate-500">Reference: <strong className="text-amber-600 font-mono text-sm">{bankReference}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Upload Payment Slip or Transaction Receipt:
              </label>
              <div
                onClick={() => {
                  setBankSlipUploaded(true);
                  showNotification('Bank transfer slip uploaded successfully!', 'info');
                }}
                className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  bankSlipUploaded
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50 text-slate-600'
                }`}
              >
                <UploadCloud className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-xs font-semibold">
                  {bankSlipUploaded ? 'Slip Attached (receipt_screenshot.png)' : 'Click to Upload Bank Slip Screenshot / PDF'}
                </span>
                <span className="text-[10px] text-slate-400">Max size: 10MB</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActivePaymentModal(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCompleteOrderSuccess}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Deploy Node</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Crypto Payment Modal */}
      {activePaymentModal === 'crypto' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Cryptocurrency Payment</h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600">1.25 USDT (TRC20)</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>

              <div className="w-full text-center">
                <span className="text-[10px] text-slate-500 block mb-1">Send USDT to TRC20 Address:</span>
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-mono text-[11px] text-slate-800 truncate">
                    TXk79gM1d8VqHelzerXCloudPterodactylNode
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCopiedCrypto(true);
                      setTimeout(() => setCopiedCrypto(false), 2000);
                      showNotification('TRC20 Address copied!', 'info');
                    }}
                    className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {copiedCrypto ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActivePaymentModal(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteOrderSuccess}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>I Have Sent Crypto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Complete Success Dialog */}
      {isOrderCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center text-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                Server Deployed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your Minecraft node has been provisioned on our high-speed cluster.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-blue-700">{isOrderCompleted.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Server Instance:</span>
                <span className="font-bold text-slate-900">{isOrderCompleted.serverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Connection IP:</span>
                <span className="font-mono font-bold text-emerald-600">{isOrderCompleted.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pterodactyl Status:</span>
                <span className="font-bold text-emerald-600">Online &amp; Running</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOrderCompleted(null);
                  navigateTo('dashboard');
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Server className="w-4 h-4" />
                <span>Open Server Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
