import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Receipt,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
  Wallet,
  Zap,
  Lock,
  Download,
  Printer,
} from 'lucide-react';
import { PaymentGatewayType, SavedCard } from '../../types';

export const BillingPage: React.FC = () => {
  const {
    invoices,
    savedCards,
    addSavedCard,
    removeSavedCard,
    setDefaultCard,
    setActiveInvoiceModal,
    payInvoice,
    formatPrice,
    paymentSettings,
    currency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'cards' | 'gateways'>('invoices');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Add Card Form State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('28');
  const [cvc, setCvc] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  // Filter Invoices
  const filteredInvoices = (invoices || []).filter((inv) => {
    if (invoiceFilter === 'paid') return inv.status === 'paid';
    if (invoiceFilter === 'unpaid') return inv.status === 'unpaid';
    return true;
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    // Format into 4-digit groups
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 15) return;

    let brand: SavedCard['brand'] = 'visa';
    if (rawNumber.startsWith('5') || rawNumber.startsWith('2')) brand = 'mastercard';
    if (rawNumber.startsWith('3')) brand = 'amex';

    addSavedCard({
      userId: 'usr-admin-1',
      cardholderName: cardholderName || 'Cardholder',
      brand,
      last4: rawNumber.slice(-4),
      expMonth,
      expYear,
      isDefault: saveAsDefault,
    });

    // Reset Form
    setCardNumber('');
    setCardholderName('');
    setCvc('');
    setIsAddingCard(false);
  };

  const totalSpentUsd = (invoices || [])
    .filter((i) => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.amountUsd, 0);

  const pendingAmountUsd = (invoices || [])
    .filter((i) => i.status === 'unpaid')
    .reduce((acc, curr) => acc + curr.amountUsd, 0);

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                <span>SaaS Billing &amp; Invoices Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Billing &amp; Payment Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage your payment gateways, saved credit/debit cards, and download official PDF tax invoices.
              </p>
            </div>

            {/* Currency & Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-right shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Invoiced</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {formatPrice(totalSpentUsd)}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-right shadow-xs">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Due Balance</span>
                <span className="text-base font-black text-amber-600 font-mono">
                  {formatPrice(pendingAmountUsd)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Saved Cards ({savedCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gateways'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Payment Gateways (PayHere / PayPal / Crypto)</span>
          </button>
        </div>

        {/* TAB 1: INVOICES LIST */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Sub Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['all', 'unpaid', 'paid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setInvoiceFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      invoiceFilter === filter
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {filter} Invoices
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-6">Invoice #</th>
                      <th className="py-4 px-6">Description / Plan</th>
                      <th className="py-4 px-6">Created Date</th>
                      <th className="py-4 px-6">Due Date</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60 text-slate-600 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-blue-600">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900 max-w-xs truncate">
                          {inv.items?.[0]?.description || 'Hosting Service'}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">
                          {formatPrice(inv.amountUsd)}
                          {currency.code === 'LKR' && (
                            <span className="block text-[10px] text-slate-500 font-normal">
                              Rs. {Math.round(inv.amountUsd * 305).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : inv.status === 'unpaid'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveInvoiceModal(inv)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="View & Print Official PDF Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            {inv.status === 'unpaid' && (
                              <button
                                onClick={() => {
                                  payInvoice(inv.id, 'payhere');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED CARDS MANAGEMENT */}
        {activeTab === 'cards' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Saved Payment Methods</h3>
                <p className="text-xs text-slate-500">
                  Cards are securely tokenized with end-to-end encryption for auto-renewal and 1-click purchases.
                </p>
              </div>

              <button
                onClick={() => setIsAddingCard(!isAddingCard)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingCard ? 'Cancel' : 'Add New Card'}</span>
              </button>
            </div>

            {/* Add Card Form Drawer */}
            {isAddingCard && (
              <form
                onSubmit={handleSaveCard}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl animate-in fade-in duration-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Secure Card Details (Visa, Mastercard, Amex)
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1.5">Cardholder Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nethum Menura"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1.5">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono tracking-wider"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1.5">Exp Month</label>
                      <select
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        {Array.from({ length: 12 }).map((_, i) => {
                          const m = String(i + 1).padStart(2, '0');
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1.5">Exp Year</label>
                      <select
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        {['25', '26', '27', '28', '29', '30', '31'].map((y) => (
                          <option key={y} value={y}>20{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1.5">CVC / CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-600 pt-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={saveAsDefault}
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span>Set this as my default payment method for server renewals</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Save Card Securely
                  </button>
                </div>
              </form>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className="relative bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between h-48"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black uppercase text-blue-400 font-mono tracking-widest">
                        {card.brand}
                      </span>
                      {card.isDefault ? (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultCard(card.id)}
                          className="text-[10px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer"
                        >
                          Set Default
                        </button>
                      )}
                    </div>

                    <p className="font-mono text-lg text-white font-bold tracking-widest my-2">
                      •••• •••• •••• {card.last4}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Cardholder</span>
                      <span className="text-white font-medium">{card.cardholderName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Expires</span>
                      <span className="text-white font-mono">{card.expMonth}/{card.expYear}</span>
                    </div>
                    <button
                      onClick={() => removeSavedCard(card.id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT GATEWAYS (PAYHERE / PAYPAL / CRYPTO / BANK) */}
        {activeTab === 'gateways' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PayHere Gateway Box (Sri Lanka LKR & Global) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-black">
                    PH
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">PayHere Gateway</h3>
                    <span className="text-[10px] text-amber-700 font-semibold">Sri Lanka (LKR) &amp; International Cards</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Active &amp; Verified
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Supports Sri Lankan Rupee (LKR) direct payments via Visa, MasterCard, Genie, FriMi, EzCash, and Sri Lankan local bank web payments.
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px] font-mono text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Merchant ID:</span>
                  <span className="text-slate-900 font-bold">{paymentSettings.payhereMerchantId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency Settled:</span>
                  <span className="text-amber-700 font-bold">LKR (Rs.) / USD ($)</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold">Production Ready</span>
                </div>
              </div>
            </div>

            {/* PayPal Smart Checkout */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black">
                    PP
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">PayPal Smart Checkout</h3>
                    <span className="text-[10px] text-blue-700 font-semibold">Global Buyer Protection</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Connected
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pay with your PayPal balance, connected bank accounts, or pay in 4 interest-free installments.
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px] font-mono text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Client ID:</span>
                  <span className="text-slate-900 font-bold">sb-client-id-helzerx-cloud-live</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Capture:</span>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
              </div>
            </div>

            {/* Crypto / USDT / BTC */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-black">
                    ₿
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Web3 &amp; Crypto Gateway</h3>
                    <span className="text-[10px] text-purple-700 font-semibold">USDT (TRC20 / ERC20), Bitcoin, Solana</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  0% Fee
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-[11px] font-mono text-slate-600">
                <div>
                  <span className="text-slate-500 block text-[10px]">USDT (TRC20) Deposit Address:</span>
                  <span className="text-blue-600 select-all break-all font-semibold">{paymentSettings.cryptoUsdtAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Bitcoin (BTC) Address:</span>
                  <span className="text-amber-700 select-all break-all font-semibold">{paymentSettings.cryptoBtcAddress}</span>
                </div>
              </div>
            </div>

            {/* Direct Bank Wire Deposit */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Direct Bank Transfer</h3>
                    <span className="text-[10px] text-emerald-700 font-semibold">Commercial Bank / BOC / Wire</span>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Manual Confirmation
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px] font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Bank Name:</span>
                  <span className="text-slate-900 font-bold">{paymentSettings.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Name:</span>
                  <span className="text-slate-900 font-bold">{paymentSettings.bankAccountName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Number:</span>
                  <span className="text-blue-600 font-bold">{paymentSettings.bankAccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Swift / BIC:</span>
                  <span className="text-slate-700 font-bold">{paymentSettings.bankSwiftCode}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
