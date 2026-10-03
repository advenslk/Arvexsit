import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Server,
  Terminal,
  Globe2,
  CreditCard,
  Building,
  User,
  Users,
  HardDrive,
  Activity,
  ChevronRight,
  ExternalLink,
  Wifi,
  Play,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThreeDCard } from './ThreeDCard';

export const GabrunShowcaseSections: React.FC = () => {
  const { navigateTo, openCheckout, plans } = useApp();

  // State for Section 1: Segmented Cloud Infrastructure Tabs
  const [activeTierTab, setActiveTierTab] = useState<'vps' | 'baremetal' | 'enterprise'>('vps');

  // State for Section 2: Invoice Mockup
  const [invoicePaymentMethod, setInvoicePaymentMethod] = useState<'card' | 'bank'>('card');
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242  ••••  ••••  4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');

  // State for Section 4: Feature Switcher
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [serverDeployed, setServerDeployed] = useState(true);

  const featureTabs = [
    { title: 'Optimize servers', desc: 'Automatic tick-rate tuning, memory defragmentation, and JVM optimizations.' },
    { title: 'Scale your nodes', desc: 'Add CPU cores, RAM, and NVMe disk in 1 click without downtime.' },
    { title: 'Global routing', desc: 'Ultra-low latency Anycast BGP network across 12 tier-4 global datacenters.' },
    { title: 'Put security first', desc: 'Enterprise Corero 3.2Tbps DDoS scrubber with automated packet inspection.' },
  ];

  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoicePaid(true);
    setTimeout(() => setInvoicePaid(false), 4000);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 space-y-24 sm:space-y-36 py-20 overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: "Get The Most Powerful and Easy to Use Hosting Platform" */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top category pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-4 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>HelzerX Easy to Deploy</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Get The Most Powerful and <br className="hidden sm:inline" />
          <span className="text-blue-600">Easy to Use</span> Cloud Software
        </h2>

        {/* Segmented Control Buttons (Cloud Infrastructure Tiers) */}
        <div className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 p-1.5 border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTierTab('vps')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
              activeTierTab === 'vps'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Cloud VPS &amp; Compute</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTierTab('baremetal')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
              activeTierTab === 'baremetal'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Dedicated Bare Metal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTierTab('enterprise')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
              activeTierTab === 'enterprise'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Enterprise Multi-Cloud</span>
          </button>
        </div>

        {/* 3-Cards Row (Left, Center Elevated Blue Gradient Card, Right) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto text-left">
          
          {/* Card 1 */}
          <ThreeDCard maxTilt={8} glare={true} className="rounded-3xl bg-white p-7 border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:border-blue-300 transition-all">
            <div style={{ transform: 'translateZ(15px)' }}>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                {activeTierTab === 'vps' ? 'High-Frequency VPS' : activeTierTab === 'baremetal' ? 'Game Edge Metal' : 'Private Cloud VPC'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {activeTierTab === 'vps'
                  ? 'AMD Ryzen 9 9950X compute with dedicated NVMe Gen5 storage, instant automated snapshot backups, and 10Gbps unmetered uplink.'
                  : activeTierTab === 'baremetal'
                  ? 'Zero-virtualization overhead bare metal dedicated server tailored for competitive esports leagues and anti-cheat workloads.'
                  : 'Isolated software-defined cloud networking with private subnets, encrypted inter-node IPsec VPN tunnels, and dedicated firewalls.'}
              </p>
            </div>

            <div style={{ transform: 'translateZ(10px)' }}>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600" />
                  {activeTierTab === 'vps' ? '+28K Running VPS' : activeTierTab === 'baremetal' ? '99.999% SLA Uptime' : '+450 Enterprise Orgs'}
                </span>
                <span className="font-mono text-blue-600 font-bold">
                  {activeTierTab === 'vps' ? 'From $4.99/mo' : activeTierTab === 'baremetal' ? 'From $89.00/mo' : 'Custom Quota'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('services-vps')}
                className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-3 text-xs font-bold text-slate-800 transition"
              >
                <span>Deploy Instance</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </ThreeDCard>

          {/* Card 2: Center Elevated Blue Gradient Card (Exact Gabrun focal point!) */}
          <ThreeDCard maxTilt={10} scale={1.03} glare={true} className="rounded-3xl bg-gradient-to-b from-blue-600 via-blue-600 to-indigo-600 p-7 text-white shadow-[0_25px_60px_-10px_rgba(37,99,235,0.4)] flex flex-col justify-between transform md:-translate-y-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
              <div className="h-12 w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 border border-white/30 backdrop-blur-md shadow-inner">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {activeTierTab === 'vps' ? 'Cloud VDS (Dedicated Slices)' : activeTierTab === 'baremetal' ? 'AMD EPYC 9654 Dual-Socket' : 'Global Kubernetes Mesh'}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                {activeTierTab === 'vps'
                  ? 'Guaranteed 100% dedicated CPU threads with zero noisy-neighbor contention. Full root access, instant reboot, and custom ISO mounting.'
                  : activeTierTab === 'baremetal'
                  ? 'Monster 192 cores / 384 threads, 768GB DDR5 ECC RAM, 4x 7.68TB Enterprise U.3 NVMe in hardware RAID-10, dual 25Gbps bonded uplinks.'
                  : 'Fully managed multi-region Kubernetes clusters with auto-scaler, automated TLS ingress certificates, and zero-downtime rolling upgrades.'}
              </p>
            </div>

            <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
              <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-blue-100 font-semibold mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-cyan-300" />
                  {activeTierTab === 'vps' ? '+42K Deployed Slices' : activeTierTab === 'baremetal' ? 'Instant IPMI / KVM' : 'Anycast Global Mesh'}
                </span>
                <span className="font-mono text-white font-extrabold">
                  {activeTierTab === 'vps' ? 'From $14.50/mo' : activeTierTab === 'baremetal' ? 'From $240.00/mo' : 'Automated HA'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo(activeTierTab === 'enterprise' ? 'services-vds' : 'services-vps')}
                className="w-full flex items-center justify-between rounded-xl bg-white text-blue-700 hover:bg-blue-50 p-3 text-xs font-extrabold shadow-lg transition"
              >
                <span>Deploy Production Cloud</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </ThreeDCard>

          {/* Card 3: Dedicated Infrastructure */}
          <ThreeDCard maxTilt={8} glare={true} className="rounded-3xl bg-white p-7 border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:border-blue-300 transition-all">
            <div style={{ transform: 'translateZ(15px)' }}>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100 shadow-sm">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                {activeTierTab === 'vps' ? 'S3 Cloud Object Storage' : activeTierTab === 'baremetal' ? 'Storage Monster SAN' : 'Mission-Critical Cloud SLA'}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {activeTierTab === 'vps'
                  ? 'Ultra-reliable S3-compatible cloud object storage with infinite scalability, zero egress fees to compute instances, and 11x9s data durability.'
                  : activeTierTab === 'baremetal'
                  ? 'Petabyte-scale hot storage servers featuring enterprise SAS/NVMe drives with automated ZFS replication and real-time corruption healing.'
                  : 'Financial-grade 99.999% uptime SLA backed by 24/7 dedicated tier-3 cloud architect engineers and 5-minute initial response guarantee.'}
              </p>
            </div>

            <div style={{ transform: 'translateZ(10px)' }}>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-indigo-600" />
                  {activeTierTab === 'vps' ? '11 9s Durability' : activeTierTab === 'baremetal' ? 'Direct BGP Routing' : '24/7/365 Dedicated NOC'}
                </span>
                <span className="font-mono text-indigo-600 font-bold">
                  {activeTierTab === 'vps' ? '$0.015 / GB' : activeTierTab === 'baremetal' ? 'Custom PB Pools' : 'Tier-4 Datacenters'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('hardware')}
                className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-3 text-xs font-bold text-slate-800 transition"
              >
                <span>Explore Infrastructure</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </ThreeDCard>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: "Rewards That are Endlessly Rewarding For Every Order" */}
      {/* (Featuring the exact Gabrun Invoice payment card mockup) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-4 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>HelzerX Instant Invoicing</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Rewards That are Endlessly <br className="hidden sm:inline" />
          <span className="text-blue-600">Rewarding</span> For Every Transaction
        </h2>

        <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          Earn loyalty server credits and automated invoices for every payment. Pay with PayHere LKR, Credit Cards, PayPal, or Crypto with instant automated provisioning.
        </p>

        {/* Centerpiece: Interactive Floating Invoice Mockup Card from Gabrun */}
        <div className="mt-14 max-w-xl mx-auto relative text-left stage-3d">
          {/* Subtle network lines background */}
          <div className="pointer-events-none absolute -inset-x-20 top-1/2 -translate-y-1/2 h-44 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] blur-2xl" />

          <ThreeDCard maxTilt={10} scale={1.02} glare={true} className="relative rounded-3xl bg-white p-7 sm:p-9 border border-slate-200 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)]">
            {/* Header: Logo + Billed Info + Amount */}
            <div style={{ transform: 'translateZ(20px)' }} className="flex items-start justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-extrabold text-slate-900">Invoice From HelzerX Cloud</h4>
                  <p className="text-xs text-slate-400 font-medium">Billed to John Clayton</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display text-2xl font-black text-slate-900">$350.00</span>
                <p className="text-[11px] font-semibold text-slate-400">Due Aug 9, 2026</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handlePayInvoice} className="mt-6 space-y-4" style={{ transform: 'translateZ(15px)' }}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInvoicePaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition ${
                    invoicePaymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Card / PayHere</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoicePaymentMethod('bank')}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition ${
                    invoicePaymentMethod === 'bank'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>PayPal / Crypto</span>
                </button>
              </div>

              {/* Input: Card Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-mono text-slate-800 focus-within:border-blue-500 focus-within:bg-white transition">
                  <CreditCard className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
              </div>

              {/* Row: Expiry + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    MM/YY
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                    placeholder="884"
                  />
                </div>
              </div>

              {/* Action Button: Pay Invoice */}
              <button
                type="submit"
                className={`mt-4 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 ${
                  invoicePaid ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                }`}
              >
                {invoicePaid ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Payment Processed • Server Provisioned!</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Pay Invoice ($350.00)</span>
                  </>
                )}
              </button>
            </form>
          </ThreeDCard>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: "Keep Your Money / Cloud Secure Always" */}
      {/* (Featuring the multi-node network architecture diagram) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-4 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span>HelzerX Cloud Security</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Keep Your Cloud & Servers Secure <span className="text-blue-600">Always</span>
        </h2>

        <p className="text-slate-500 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          HelzerX Cloud protects your game and cloud servers with a world-class Corero 3.2Tbps scrubbing system that blocks DDoS attacks instantly. Safeguard your instance with screen lock, API keys, and 2FA.
        </p>

        {/* Central Node Topology Graphic (Directly mimicking the Gabrun security diagram!) */}
        <div className="mt-14 max-w-4xl mx-auto relative p-6 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06)]">
          {/* Peripheral Node 1 (Top Left) */}
          <div className="hidden sm:flex absolute left-8 top-12 items-center gap-2.5 rounded-2xl bg-slate-50 p-2.5 border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="Node"
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-800 block">Dallas Node</span>
              <span className="text-[9px] font-semibold text-emerald-600">$40.00 • Active</span>
            </div>
          </div>

          {/* Peripheral Node 2 (Top Right) */}
          <div className="hidden sm:flex absolute right-8 top-12 items-center gap-2.5 rounded-2xl bg-slate-50 p-2.5 border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
              alt="Node"
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-800 block">Frankfurt Node</span>
              <span className="text-[9px] font-semibold text-emerald-600">$40.00 • Active</span>
            </div>
          </div>

          {/* Peripheral Node 3 (Bottom Left) */}
          <div className="hidden sm:flex absolute left-8 bottom-12 items-center gap-2.5 rounded-2xl bg-slate-50 p-2.5 border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
              alt="Node"
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-800 block">Singapore Node</span>
              <span className="text-[9px] font-semibold text-emerald-600">$40.00 • Active</span>
            </div>
          </div>

          {/* Peripheral Node 4 (Bottom Right) */}
          <div className="hidden sm:flex absolute right-8 bottom-12 items-center gap-2.5 rounded-2xl bg-slate-50 p-2.5 border border-slate-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
              alt="Node"
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-800 block">Tokyo Node</span>
              <span className="text-[9px] font-semibold text-emerald-600">$40.00 • Active</span>
            </div>
          </div>

          {/* Main Central Card */}
          <div className="max-w-md mx-auto relative z-10 stage-3d">
            <ThreeDCard maxTilt={8} glare={true} className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-blue-100 shadow-2xl text-left">
              <div style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                    alt="John Clayton"
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block leading-tight">Primary Infrastructure</span>
                    <h4 className="font-display text-sm font-extrabold text-slate-900">John Clayton Cluster</h4>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Allocated Pool</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-3xl font-black text-slate-900">$3,050.00</span>
                    <span className="text-xs font-bold text-slate-400">USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-100">
                    <span className="text-emerald-700 font-bold block">Live Income</span>
                    <span className="font-display text-lg font-extrabold text-slate-900">$1,400.21</span>
                  </div>
                  <div className="rounded-xl bg-blue-50/80 p-3 border border-blue-100">
                    <span className="text-blue-700 font-bold block">Server Expenses</span>
                    <span className="font-display text-lg font-extrabold text-slate-900">$40.00</span>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: "Collect All Payments / Control All Servers Within Minutes" */}
      {/* (Featuring the 4-pill feature switchers and the right phone/card UI) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text + 4 Pill Switchers */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>HelzerX Fast Control</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Manage All Servers <br />
              Within <span className="text-blue-600">Minutes</span>
            </h2>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Integrate HelzerX Cloud easily on your browser or phone with our developer-friendly Pterodactyl console, automated backups, and 1-click modpack installers. Let your players join instantly.
            </p>

            {/* 4 Feature Pill Switchers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {featureTabs.map((tab, idx) => (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`flex items-center gap-2 rounded-2xl p-3.5 text-left text-xs font-bold border transition-all ${
                    activeFeatureTab === idx
                      ? 'border-blue-600 bg-blue-50/90 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${activeFeatureTab === idx ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="truncate">{tab.title}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">{featureTabs[activeFeatureTab].title}</span>
              {featureTabs[activeFeatureTab].desc}
            </div>
          </div>

          {/* Right Phone / Virtual Card Preview from Gabrun */}
          <div className="lg:col-span-6 flex justify-center text-left stage-3d">
            <ThreeDCard maxTilt={12} scale={1.02} glare={true} className="w-full max-w-sm rounded-[32px] bg-white p-6 border-2 border-slate-200 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] relative">
              <div style={{ transform: 'translateZ(20px)' }}>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      PP
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block leading-none">PayPal / PayHere</span>
                      <span className="text-xs font-bold text-slate-800">Auto-Billing</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 font-display">$3,050.00 <span className="text-[10px] font-normal text-slate-400">USD</span></span>
                </div>

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Payment & Node Pass</span>

                {/* Blue Glass Virtual Card Graphic with 3D Depth */}
                <div className="rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 p-5 text-white shadow-xl relative overflow-hidden mb-5 card-holographic">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-6 w-9 rounded bg-amber-400/80 border border-amber-300/60 shadow-inner" />
                    <Wifi className="h-4 w-4 text-white/80 rotate-90" />
                  </div>
                  <p className="font-mono text-base tracking-widest font-bold text-white drop-shadow-sm mb-3">
                    3455 4562 7710 3507
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-blue-100 font-medium uppercase tracking-wider">
                    <span>John Carter</span>
                    <span>02/30</span>
                  </div>
                </div>

                {/* Green Success Badge (matching Gabrun) */}
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2.5 text-xs text-emerald-800 font-bold shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Payment &amp; Server Deployed Successfully</span>
                </div>
              </div>
            </ThreeDCard>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: "Start Accepting Payments / Servers in Just 60 Seconds" */}
      {/* (Bottom CTA Blue Banner matching Gabrun!) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4)]">
          {/* Subtle curved background lines */}
          <div className="gabrun-grid-lines absolute inset-0 opacity-25" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start Your Cloud Server <br />
              in Just 60 Seconds
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100 font-normal">
              Zero setup fees. 100% NVMe Gen5 storage, instant Pterodactyl access, and 24/7 technical support.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateTo('plans');
              }}
              className="mt-8 flex max-w-md mx-auto items-center rounded-full bg-white/20 p-1.5 backdrop-blur-xl border border-white/35 shadow-2xl focus-within:border-white focus-within:bg-white/25 transition"
            >
              <input
                type="text"
                placeholder="Your email address"
                className="w-full bg-transparent px-5 py-2.5 text-sm text-white placeholder-blue-100/70 outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#0b0f19] px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-900 active:scale-95 shrink-0 shadow-lg"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>Get Started</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
