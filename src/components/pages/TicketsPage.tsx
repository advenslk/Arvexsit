import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Server,
  Headphones,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { TicketDepartment, TicketPriority } from '../../types';

export const TicketsPage: React.FC = () => {
  const {
    tickets,
    createTicket,
    setActiveTicketModal,
    deployedServers,
    user,
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form State
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<TicketDepartment>('Technical Support');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [relatedServerId, setRelatedServerId] = useState<string>('');
  const [message, setMessage] = useState('');

  const departments: TicketDepartment[] = [
    'Technical Support',
    'Billing & Accounts',
    'Sales & Pre-Purchase',
    'DDoS & Network',
  ];

  const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  const filteredTickets = (tickets || []).filter((t) => {
    const matchDept = filterDepartment === 'All' || t.department === filterDepartment;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchDept && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket = createTicket({
      subject: subject.trim(),
      department,
      priority,
      message: message.trim(),
      relatedServerId: relatedServerId || undefined,
    });

    // Reset Form
    setSubject('');
    setMessage('');
    setIsCreating(false);
    setActiveTicketModal(newTicket);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7/365 Helpdesk & Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
            Customer Support & Ticket System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Get rapid technical assistance from our tier-3 systems engineers within minutes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel Ticket' : 'Open New Ticket'}</span>
        </button>
      </div>

      {/* New Ticket Form */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#111422] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl animate-in fade-in duration-200"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-cyan-400" />
            <span>Submit a Support Request</span>
          </h3>

          <div className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                Subject / Issue Summary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Need assistance setting up reverse DNS / Modpack crash issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#090b12] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as TicketDepartment)}
                  className="w-full bg-[#090b12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-[#090b12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  Related Server (Optional)
                </label>
                <select
                  value={relatedServerId}
                  onChange={(e) => setRelatedServerId(e.target.value)}
                  className="w-full bg-[#090b12] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">None / General Inquiry</option>
                  {(deployedServers || []).map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.serverName} ({srv.ipAddress})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                Detailed Message & Crash Logs *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Please describe your issue in detail. Paste relevant server error logs or crash dumps here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#090b12] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['All', ...departments].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDepartment(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterDepartment === dept
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          {['All', 'Open', 'Staff-Reply', 'Customer-Reply', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setActiveTicketModal(ticket)}
              className="group cursor-pointer bg-[#0f111c] hover:bg-[#141727] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        ticket.status === 'Closed'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : ticket.status === 'Staff-Reply'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {ticket.department}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ticket.priority === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : ticket.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {ticket.messages?.[ticket.messages.length - 1]?.message || 'No messages'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-400 gap-1 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <span className="font-mono text-[11px]">
                  Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
                <span className="text-cyan-400 text-[11px] font-semibold">
                  {ticket.messages?.length || 1} messages →
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#0f111c] rounded-3xl border border-white/10">
            <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No support tickets found.</p>
            <p className="text-xs text-slate-500 mt-1">
              Have an issue or inquiry? Click "Open New Ticket" above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
