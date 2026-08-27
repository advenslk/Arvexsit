import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  LifeBuoy,
  Clock,
  CheckCircle2,
  ShieldCheck,
  User,
  Paperclip,
  Server,
  AlertTriangle,
} from 'lucide-react';

export const TicketModal: React.FC = () => {
  const {
    activeTicketModal,
    setActiveTicketModal,
    replyTicket,
    updateTicketStatus,
    user,
  } = useApp();

  const [replyText, setReplyText] = useState('');

  if (!activeTicketModal) return null;

  const ticket = activeTicketModal;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const asAdmin = user?.role === 'admin';
    replyTicket(ticket.id, replyText.trim(), asAdmin);
    setReplyText('');
    // refresh local state representation
    setActiveTicketModal({
      ...ticket,
      status: asAdmin ? 'Staff-Reply' : 'Customer-Reply',
      messages: [
        ...ticket.messages,
        {
          id: 'msg-' + Date.now(),
          senderId: user?.id || 'usr',
          senderName: asAdmin ? 'ArveX Staff Support' : user?.name || 'Customer',
          senderRole: asAdmin ? 'staff' : 'customer',
          senderAvatar: user?.avatar,
          message: replyText.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  const handleStatusChange = (newStatus: any) => {
    updateTicketStatus(ticket.id, newStatus);
    setActiveTicketModal({ ...ticket, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0d0f18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#121524] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {ticket.ticketNumber}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                    ticket.status === 'Closed'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : ticket.status === 'Staff-Reply'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {ticket.status}
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {ticket.priority} Priority
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {ticket.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveTicketModal(null)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subheader info bar */}
        <div className="px-6 py-3 bg-[#0a0b12] border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-slate-300">Department:</strong> {ticket.department}
            </span>
            {ticket.relatedServerName && (
              <span className="flex items-center gap-1 text-cyan-300">
                <Server className="w-3 h-3" />
                <span>{ticket.relatedServerName}</span>
              </span>
            )}
            <span>
              <strong className="text-slate-300">Opened:</strong>{' '}
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ticket.status !== 'Closed' ? (
              <button
                onClick={() => handleStatusChange('Closed')}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2.5 py-1 rounded-lg border border-white/5 transition-colors"
              >
                Close Ticket
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange('Open')}
                className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30"
              >
                Reopen Ticket
              </button>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#090a10]">
          {(ticket.messages || []).map((msg, i) => {
            const isStaff = msg.senderRole === 'staff' || msg.senderRole === 'admin';
            return (
              <div
                key={msg.id || i}
                className={`flex gap-3.5 ${isStaff ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="shrink-0">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isStaff ? 'bg-cyan-500 text-black' : 'bg-slate-700 text-white'
                      }`}
                    >
                      {isStaff ? 'S' : 'U'}
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs ${
                    isStaff
                      ? 'bg-[#151928] border border-cyan-500/20 text-slate-200'
                      : 'bg-[#1a1f33] border border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{msg.senderName}</span>
                      {isStaff && (
                        <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                          Staff
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed text-slate-300">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        {ticket.status !== 'Closed' ? (
          <form
            onSubmit={handleSendReply}
            className="p-4 bg-[#121524] border-t border-white/10 flex items-center gap-3"
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here... (Attach error logs or details)"
              rows={2}
              className="flex-1 bg-[#090a10] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold px-4 py-3 rounded-xl transition-all flex items-center gap-1.5 text-xs active:scale-95 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="p-4 bg-[#121524] border-t border-white/10 text-center text-xs text-slate-400">
            This ticket is closed. Click 'Reopen Ticket' above to send a follow-up message.
          </div>
        )}
      </div>
    </div>
  );
};
