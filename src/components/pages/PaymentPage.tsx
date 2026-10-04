import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Lock,
  Download,
  ExternalLink,
  Server,
  QrCode,
  Copy,
  Receipt,
} from 'lucide-react';
import { OrderItem } from '../../types';

export const PaymentPage: React.FC = () => {
  const {
    currentRoute,
    orders,
    updateOrderStatus,
    recordPayment,
    deployServer,
    formatPrice,
    paymentSettings,
    currency,
    navigateTo,
    showNotification,
  } = useApp();

  const orderId = currentRoute.params.orderId;
  const statusParam = currentRoute.params.status;

  // Find targeted order
  const order = orders.find((o) => o.id === orderId) || orders[orders.length - 1];

  const [selectedGateway, setSelectedGateway] = useState<'payhere' | 'card' | 'paypal' | 'crypto'>('payhere');
  const [paymentState, setPaymentState] = useState<'selecting' | 'processing' | 'success' | 'pending' | 'failed'>(
    statusParam === 'success' ? 'success' : statusParam === 'failed' ? 'failed' : statusParam === 'pending' ? 'pending' : 'selecting'
  );

  // Form Fields
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');

  // Crypto state
  const [cryptoCoin, setCryptoCoin] = useState<string>('USDT (TRC20)');
  const [txHash, setTxHash] = useState<string>('');

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const gateways = [
    {
      id: 'payhere',
      name: 'PayHere (LKR / Cards / Genie / eZ Cash)',
      badge: 'Sri Lanka & Global',
      desc: 'Instant processing for Visa, MasterCard, Frimi, Genie, and LKR bank transfers.',
      active: paymentSettings.payhereEnabled,
    },
    {
      id: 'card',
      name: 'Debit / Credit Card (Stripe Gateway)',
      badge: 'Global Instant',
      desc: 'Instant 256-bit encrypted checkout with Visa, Mastercard, AMEX.',
      active: paymentSettings.stripeEnabled,
    },
    {
      id: 'paypal',
      name: 'PayPal Express Checkout',
      badge: 'Buyer Protection',
      desc: 'Pay securely using your PayPal balance or connected bank account.',
      active: paymentSettings.paypalEnabled,
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency (USDT / BTC / LTC)',
      badge: 'Decentralized',
      desc: 'Zero KYC anonymous instant payments via automated blockchain verification.',
      active: paymentSettings.cryptoEnabled,
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleProcessPayment = () => {
    if (!order) return;
    setPaymentState('processing');

    setTimeout(() => {
      // Create real payment ledger transaction
      const transId = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      recordPayment({
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        amount: order.amount,
        currency,
        provider: selectedGateway.toUpperCase(),
        status: 'Completed',
        transactionId: transId,
      });

      // Update Order to Active
      updateOrderStatus(order.id, 'Active');

      // Auto-deploy actual cloud node
      deployServer({
        name: `${order.planName} - Production`,
        game: order.planName.toLowerCase().includes('minecraft') ? 'Minecraft' : 'Cloud Node',
        plan: order.planName,
        ip: `142.132.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 250) + 1}`,
        port: 25565,
        location: order.location || 'Frankfurt, DE',
        status: 'running',
        ramUsage: 12,
        cpuUsage: 8,
        diskUsage: 2.1,
      });

      setPaymentState('success');
      showNotification('Payment verified! Server node has been provisioned.', 'success');
    }, 1500);
  };

  if (!order) {
    return (
      <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
          <Receipt className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 font-display mb-3">No Active Order Found</h1>
          <p className="text-slate-500 text-xs leading-relaxed mb-6">
            Please select a hosting plan to initiate a secure checkout session.
          </p>
          <button
            onClick={() => navigateTo('pricing')}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            View Hosting Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 text-white shadow-sm mb-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="gabrun-grid-lines absolute inset-0 opacity-30" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-400/25 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-blue-200/90 mb-6 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <button onClick={() => navigateTo('checkout')} className="hover:text-white transition-colors cursor-pointer">Checkout</button>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60 shrink-0" />
            <span className="text-white font-bold">Payment Gateway (#{order.id})</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md mb-4">
              <Lock className="w-3.5 h-3.5 text-cyan-300" />
              <span>256-Bit SSL Encrypted Payment Portal</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Complete Your Payment
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Choose your preferred payment method below. Your cloud instance deploys automatically upon transaction settlement.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {paymentState === 'success' ? (
          /* Success State */
          <div className="max-w-2xl mx-auto bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(16,185,129,0.12)] animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 inline-block border border-emerald-200">
              Payment Verified &amp; Server Active
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mb-3">
              Payment Successful!
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Your payment of <strong className="text-slate-900">{formatPrice(order.amount)}</strong> has been confirmed. Your container has been provisioned on our high-frequency fleet.
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left mb-8 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Plan</span>
                <span className="font-bold text-blue-600">{order.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Node Status</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE (Pterodactyl Active)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigateTo('dashboard', { section: 'services' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Server className="w-4 h-4" />
                <span>Go to Server Console</span>
              </button>

              <button
                onClick={() => navigateTo('dashboard', { section: 'invoices' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          /* Gateway Selection and Payment Execution */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
                <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
                  Choose Payment Method
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  All transactions are protected by end-to-end encryption and verified in real-time.
                </p>

                {/* Gateway Cards */}
                <div className="space-y-3 mb-8">
                  {gateways.map((gw) => {
                    const isSelected = selectedGateway === gw.id;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setSelectedGateway(gw.id as any)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/60 border-blue-500 text-slate-900 shadow-md shadow-blue-500/5'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{gw.name}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                {gw.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{gw.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Gateway Form View */}
                {selectedGateway === 'payhere' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 animate-in fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">PayHere Gateway (Sri Lanka &amp; International)</h3>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        LKR Enabled
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                      You will complete the transaction via PayHere secure checkout. Supports Sri Lankan credit/debit cards, eZ Cash, mCash, Genie, and FriMi.
                    </p>
                    <button
                      onClick={handleProcessPayment}
                      disabled={paymentState === 'processing'}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
                    >
                      {paymentState === 'processing' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Pay {formatPrice(order.amount)} via PayHere</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedGateway === 'card' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4 animate-in fade-in">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Credit / Debit Card Checkout</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono shadow-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expiration Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Security Code (CVC)</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono shadow-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleProcessPayment}
                      disabled={paymentState === 'processing'}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 shadow-md shadow-blue-500/20"
                    >
                      {paymentState === 'processing' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay {formatPrice(order.amount)} Securely</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedGateway === 'paypal' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 animate-in fade-in">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">PayPal Express Checkout</h3>
                    <p className="text-xs text-slate-600 mb-6">
                      Click below to open PayPal. Your order will be activated as soon as PayPal sends the instant payment notification webhook.
                    </p>
                    <button
                      onClick={handleProcessPayment}
                      disabled={paymentState === 'processing'}
                      className="w-full py-3.5 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {paymentState === 'processing' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Continue to PayPal ({formatPrice(order.amount)})</span>
                      )}
                    </button>
                  </div>
                )}

                {selectedGateway === 'crypto' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4 animate-in fade-in">
                    <h3 className="text-sm font-bold text-slate-900">Automated Cryptocurrency Gateway</h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Network / Currency:</span>
                        <span className="font-bold text-slate-900">{cryptoCoin}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Deposit Address:</span>
                        <button
                          onClick={() => handleCopy('TX7vK9pL2qM4aZ5wR8sT1yU3iO6eD0fG')}
                          className="text-blue-600 hover:text-blue-700 font-mono flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <span>TX7vK9pL2qM4...</span>
                          <Copy className="w-3.5 h-3.5" />
                          {isCopied && <span className="text-emerald-600 text-[10px] font-bold">Copied!</span>}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleProcessPayment}
                      disabled={paymentState === 'processing'}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      {paymentState === 'processing' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Verify Blockchain Payment ({formatPrice(order.amount)})</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Details */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.06)]">
                <h2 className="text-base font-bold text-slate-900 font-display mb-4">
                  Invoice Details
                </h2>
                <div className="space-y-3 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order Ref</span>
                    <span className="font-mono text-slate-900 font-bold">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service</span>
                    <span className="font-semibold text-slate-900">{order.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Cycle</span>
                    <span className="capitalize text-slate-900 font-semibold">{order.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Customer</span>
                    <span className="text-slate-900">{order.customerEmail}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-sm font-bold text-slate-700">Amount Due</span>
                  <span className="text-2xl font-black text-slate-900 font-display">
                    {formatPrice(order.amount)}
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant automated provisioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>7-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
