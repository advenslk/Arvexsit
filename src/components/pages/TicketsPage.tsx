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
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <Headphones className="w-3.5 h-3.5 text-blue-600" />
                <span>24/7/365 Helpdesk &amp; Support Desk</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Customer Support &amp; Ticket System
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Get rapid technical assistance from our tier-3 systems engineers within minutes.
              </p>
            </div>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Cancel Ticket' : 'Open New Ticket'}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Ticket Form */}
        {isCreating && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-10 shadow-sm animate-in fade-in duration-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              <span>Submit a Support Request</span>
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-700 block mb-1.5 font-bold">
                  Subject / Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need assistance setting up reverse DNS / Modpack crash issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-700 block mb-1.5 font-bold">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as TicketDepartment)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-700 block mb-1.5 font-bold">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-700 block mb-1.5 font-bold">
                    Related Server (Optional)
                  </label>
                  <select
                    value={relatedServerId}
                    onChange={(e) => setRelatedServerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
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
                <label className="text-xs text-slate-700 block mb-1.5 font-bold">
                  Detailed Message &amp; Crash Logs *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe your issue in detail. Paste relevant server error logs or crash dumps here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 active:scale-95 cursor-pointer"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterDepartment === dept
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            {['All', 'Open', 'Staff-Reply', 'Customer-Reply', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
                className="group cursor-pointer bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-blue-600">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          ticket.status === 'Closed'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : ticket.status === 'Staff-Reply'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ticket.department}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ticket.priority === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : ticket.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {ticket.subject}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {ticket.messages?.[ticket.messages.length - 1]?.message || 'No messages'}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-500 gap-1 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-mono text-[11px]">
                    Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 text-[11px] font-semibold">
                    {ticket.messages?.length || 1} messages →
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <LifeBuoy className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">No support tickets found.</p>
              <p className="text-xs text-slate-500 mt-1">
                Have an issue or inquiry? Click "Open New Ticket" above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
