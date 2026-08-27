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
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>SaaS Billing & Invoices Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
            Billing & Payment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your payment gateways, saved credit/debit cards, and download official PDF tax invoices.
          </p>
        </div>

        {/* Currency & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#10121e] border border-white/10 p-3.5 rounded-2xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
            <span className="text-base font-black text-white font-mono">
              {formatPrice(totalSpentUsd)}
            </span>
          </div>
          <div className="bg-[#10121e] border border-white/10 p-3.5 rounded-2xl text-right">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Due Balance</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatPrice(pendingAmountUsd)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-[#0c0d16] p-1.5 rounded-2xl border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'invoices'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cards'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Saved Cards ({savedCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gateways')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gateways'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    invoiceFilter === filter
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter} Invoices
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-[#0f111c] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#131624] text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-6">Invoice #</th>
                    <th className="py-4 px-6">Description / Plan</th>
                    <th className="py-4 px-6">Created Date</th>
                    <th className="py-4 px-6">Due Date</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/5 text-slate-300 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-cyan-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                        {inv.items?.[0]?.description || 'Hosting Service'}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-white">
                        {formatPrice(inv.amountUsd)}
                        {currency.code === 'LKR' && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Rs. {Math.round(inv.amountUsd * 305).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : inv.status === 'unpaid'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveInvoiceModal(inv)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
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
              <h3 className="text-lg font-bold text-white">Your Saved Payment Methods</h3>
              <p className="text-xs text-slate-400">
                Cards are securely tokenized with end-to-end encryption for auto-renewal and 1-click purchases.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCard(!isAddingCard)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCard ? 'Cancel' : 'Add New Card'}</span>
            </button>
          </div>

          {/* Add Card Form Drawer */}
          {isAddingCard && (
            <form
              onSubmit={handleSaveCard}
              className="bg-[#111422] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-xl animate-in fade-in duration-200 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Secure Card Details (Visa, Mastercard, Amex)
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nethum Menura"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full bg-[#0a0b12] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-[#0a0b12] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono tracking-wider"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Exp Month</label>
                    <select
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="w-full bg-[#0a0b12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {Array.from({ length: 12 }).map((_, i) => {
                        const m = String(i + 1).padStart(2, '0');
                        return <option key={m} value={m}>{m}</option>;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Exp Year</label>
                    <select
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="w-full bg-[#0a0b12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {['25', '26', '27', '28', '29', '30', '31'].map((y) => (
                        <option key={y} value={y}>20{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">CVC / CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#0a0b12] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                  <span>Set this as my default payment method for server renewals</span>
                </label>

                <button
                  type="submit"
                  className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
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
                className="relative bg-gradient-to-tr from-[#121626] to-[#181d33] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black uppercase text-cyan-400 font-mono tracking-widest">
                      {card.brand}
                    </span>
                    {card.isDefault ? (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultCard(card.id)}
                        className="text-[10px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded"
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
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
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
          <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                  PH
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">PayHere Gateway</h3>
                  <span className="text-[10px] text-amber-300 font-semibold">Sri Lanka (LKR) & International Cards</span>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                Active & Verified
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Supports Sri Lankan Rupee (LKR) direct payments via Visa, MasterCard, Genie, FriMi, EzCash, and Sri Lankan local bank web payments.
            </p>

            <div className="bg-[#090a10] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Merchant ID:</span>
                <span className="text-white font-bold">{paymentSettings.payhereMerchantId}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency Settled:</span>
                <span className="text-amber-400 font-bold">LKR (Rs.) / USD ($)</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Production Ready</span>
              </div>
            </div>
          </div>

          {/* PayPal Smart Checkout */}
          <div className="bg-[#0f111c] border border-blue-500/30 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0070ba]/20 border border-[#0070ba]/40 flex items-center justify-center text-[#0070ba] font-black">
                  PP
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">PayPal Smart Checkout</h3>
                  <span className="text-[10px] text-blue-300 font-semibold">Global Buyer Protection</span>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Pay with your PayPal balance, connected bank accounts, or pay in 4 interest-free installments.
            </p>

            <div className="bg-[#090a10] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Client ID:</span>
                <span className="text-white font-bold">sb-client-id-arvex-hosting-live</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Capture:</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
            </div>
          </div>

          {/* Crypto / USDT / BTC */}
          <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
                  ₿
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Web3 & Crypto Gateway</h3>
                  <span className="text-[10px] text-purple-300 font-semibold">USDT (TRC20 / ERC20), Bitcoin, Solana</span>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                0% Fee
              </span>
            </div>

            <div className="bg-[#090a10] p-3.5 rounded-xl border border-white/5 space-y-2 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px]">USDT (TRC20) Deposit Address:</span>
                <span className="text-cyan-300 select-all break-all">{paymentSettings.cryptoUsdtAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Bitcoin (BTC) Address:</span>
                <span className="text-amber-400 select-all break-all">{paymentSettings.cryptoBtcAddress}</span>
              </div>
            </div>
          </div>

          {/* Direct Bank Wire Deposit */}
          <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Bank Transfer</h3>
                  <span className="text-[10px] text-emerald-300 font-semibold">Commercial Bank / BOC / Wire</span>
                </div>
              </div>
              <span className="bg-white/10 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                Manual Confirmation
              </span>
            </div>

            <div className="bg-[#090a10] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Bank Name:</span>
                <span className="text-white font-bold">{paymentSettings.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Name:</span>
                <span className="text-white font-bold">{paymentSettings.bankAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <span className="text-cyan-300 font-bold">{paymentSettings.bankAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Swift / BIC:</span>
                <span className="text-slate-300 font-bold">{paymentSettings.bankSwiftCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
