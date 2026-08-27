import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  CreditCard,
  Zap,
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const {
    activeInvoiceModal,
    setActiveInvoiceModal,
    siteSettings,
    formatPrice,
    payInvoice,
    currency,
  } = useApp();

  if (!activeInvoiceModal) return null;

  const invoice = activeInvoiceModal;

  const handlePrint = () => {
    window.print();
  };

  const handlePayNow = (method: 'payhere' | 'card' | 'paypal') => {
    payInvoice(invoice.id, method);
    setActiveInvoiceModal({
      ...invoice,
      status: 'paid',
      paymentMethod: method,
      paidAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c0d14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121420] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {invoice.invoiceNumber}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                invoice.status === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : invoice.status === 'unpaid'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setActiveInvoiceModal(null)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-10 space-y-8 print:p-0">
          {/* Header Row: Company & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black font-display text-sm">
                  A
                </div>
                <span className="text-xl font-bold font-display text-white tracking-tight">
                  {siteSettings.brandName}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                {siteSettings.companyAddress}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                VAT / Reg: {siteSettings.vatNumber}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <h1 className="text-2xl font-black font-display text-white tracking-tight uppercase">
                INVOICE
              </h1>
              <p className="text-xs text-cyan-400 font-mono font-bold">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-400">
                Issued: {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-400">
                Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              {invoice.paidAt && (
                <p className="text-xs text-emerald-400 font-semibold">
                  Paid On: {new Date(invoice.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Billed To / Payment Status Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#11131c] p-5 rounded-2xl border border-white/5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Billed To
              </span>
              <h4 className="text-sm font-bold text-white">{invoice.userName}</h4>
              <p className="text-xs text-slate-400">{invoice.userEmail}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">Account ID: {invoice.userId}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Payment Status
              </span>
              {invoice.status === 'paid' ? (
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID IN FULL</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>PAYMENT PENDING</span>
                </div>
              )}
              {invoice.paymentMethod && (
                <p className="text-[11px] text-slate-400 mt-1 uppercase font-mono">
                  Method: {invoice.paymentMethod} • Ref: {invoice.transactionId || 'N/A'}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Billing Period</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx} className="text-slate-300">
                    <td className="py-3.5 px-2 font-medium text-white">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-2 text-slate-400 font-mono text-[11px]">
                      {item.period}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-400">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-bold text-white">
                      {formatPrice(item.amountUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Totals */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400 space-y-1.5 max-w-sm">
              <p className="font-semibold text-slate-300">Terms & Conditions</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Services are provisioned immediately upon transaction confirmation. 30-day money-back guarantee on all game node instances.
              </p>
              {invoice.notes && (
                <p className="text-[11px] text-cyan-400/90 font-mono mt-2">
                  Note: {invoice.notes}
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatPrice(invoice.subtotalUsd)}</span>
              </div>
              {invoice.discountUsd > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({invoice.couponUsed}):</span>
                  <span className="font-mono">-{formatPrice(invoice.discountUsd)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Tax (0%):</span>
                <span className="font-mono text-white">$0.00</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount:</span>
                <span className="font-mono text-cyan-400 font-display">
                  {formatPrice(invoice.amountUsd)}
                </span>
              </div>
              {currency.code === 'LKR' && (
                <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Equivalent in LKR:</span>
                  <span className="text-amber-300 font-bold">
                    Rs. {Math.round(invoice.amountUsd * 305).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Pay Action Bar if Unpaid */}
          {invoice.status === 'unpaid' && (
            <div className="pt-6 border-t border-white/10 bg-[#151824] p-5 rounded-2xl print:hidden">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Pay this invoice now</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handlePayNow('payhere')}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with PayHere (LKR / Card)</span>
                </button>
                <button
                  onClick={() => handlePayNow('card')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Direct Card (Visa / MC)</span>
                </button>
                <button
                  onClick={() => handlePayNow('paypal')}
                  className="bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>PayPal Checkout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
