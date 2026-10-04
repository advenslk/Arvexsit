import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  User,
  Shield,
  HelpCircle,
  FileText,
  Search,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const SupportPage: React.FC = () => {
  const {
    currentRoute,
    tickets,
    createTicket,
    replyTicket,
    updateTicketStatus,
    deployedServers,
    user,
    navigateTo,
    showNotification,
  } = useApp();

  const ticketIdParam = currentRoute.params.ticketId;
  const subView = currentRoute.params.subView || (ticketIdParam ? 'detail' : 'list');

  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Ticket State
  const [subject, setSubject] = useState<string>('');
  const [department, setDepartment] = useState<string>('Technical Support');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [relatedService, setRelatedService] = useState<string>('General Inquiry');
  const [message, setMessage] = useState<string>('');

  // Active Ticket Reply State
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active detail ticket
  const selectedTicket = tickets.find((t) => t.id === ticketIdParam) || (subView === 'detail' ? tickets[0] : null);

  const filteredTickets = (tickets || []).filter((t) => {
    const matchTab = activeTab === 'all' || (activeTab === 'open' ? t.status !== 'closed' : t.status === 'closed');
    const matchSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showNotification('Please fill in both the subject and ticket message.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newT = createTicket({
        subject: subject.trim(),
        department,
        priority,
        message: message.trim(),
        relatedService: relatedService !== 'General Inquiry' ? relatedService : undefined,
      });

      setIsSubmitting(false);
      setSubject('');
      setMessage('');
      showNotification(`Ticket #${newT.id} opened successfully!`, 'success');
      navigateTo('support', { subView: 'detail', ticketId: newT.id });
    }, 500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    replyTicket(selectedTicket.id, replyMessage.trim(), false);
    setReplyMessage('');
    showNotification('Reply submitted successfully!', 'success');
  };

  const handleToggleStatus = (ticket: SupportTicket) => {
    const isClosed = ticket.status.toLowerCase() === 'closed';
    const newStatus = isClosed ? 'Open' : 'Closed';
    updateTicketStatus(ticket.id, newStatus as any);
    showNotification(`Ticket #${ticket.id} marked as ${newStatus}.`, 'info');
  };

  return (
    <div className="gabrun-light-canvas min-h-screen text-slate-800 font-sans pb-24">
      {/* Top Hero Banner matching HomePage Gabrun style */}
      <section className="gabrun-hero-gradient relative isolate overflow-hidden pt-10 pb-16 mb-12 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button onClick={() => navigateTo('support')} className="hover:text-blue-600 transition-colors font-medium">Support Center</button>
            {subView === 'new' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-blue-600 font-semibold">Open New Ticket</span>
              </>
            )}
            {subView === 'detail' && selectedTicket && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-blue-600 font-semibold">Ticket #{selectedTicket.id}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
                <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
                <span>24/7/365 Dedicated Systems Engineers</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
                Support &amp; Ticket Center
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Track active requests or open a new conversation with our cloud infrastructure engineers.
              </p>
            </div>

            {subView === 'list' && (
              <button
                onClick={() => navigateTo('support', { subView: 'new' })}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Open New Ticket</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Support Views */}
        {subView === 'new' ? (
          /* Create New Ticket Form */
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display mb-1">
                  Open a Support Ticket
                </h2>
                <p className="text-xs text-slate-500">
                  Our senior systems engineers respond in under 15 minutes 24/7/365.
                </p>
              </div>
              <button
                onClick={() => navigateTo('support')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel &amp; Return
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ticket Subject <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Assistance with custom modpack installation on Paper 1.20"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing & Accounting">Billing &amp; Invoices</option>
                    <option value="Sales & Pre-Purchase">Sales &amp; Upgrades</option>
                    <option value="Enterprise Infrastructure">Enterprise SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="low">Low (General questions)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Server issue)</option>
                    <option value="critical">Critical (Outage)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Related Service</label>
                  <select
                    value={relatedService}
                    onChange={(e) => setRelatedService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="General Inquiry">None / General</option>
                    {deployedServers.map((srv) => (
                      <option key={srv.id} value={srv.name}>{srv.name} ({srv.ip})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Detailed Description <span className="text-blue-600">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Describe your request or technical issue in detail. Include server logs, error messages, or steps to reproduce..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Submit Support Ticket</span>}
              </button>
            </form>
          </div>
        ) : subView === 'detail' && selectedTicket ? (
          /* Conversation Thread View */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    #{selectedTicket.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedTicket.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedTicket.status === 'answered'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {selectedTicket.department} • {selectedTicket.priority} Priority
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  {selectedTicket.subject}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedTicket)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  {selectedTicket.status === 'closed' ? 'Reopen Ticket' : 'Close Ticket'}
                </button>
                <button
                  onClick={() => navigateTo('support')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Back to List
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
              {selectedTicket.messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`p-6 rounded-2xl border transition-all ${
                    msg.isStaff
                      ? 'bg-blue-50/60 border-blue-200/80 ml-0 sm:ml-6'
                      : 'bg-white border-slate-200 mr-0 sm:mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          msg.isStaff ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {msg.isStaff ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                          {msg.isStaff && (
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Staff Support
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pl-10">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            {selectedTicket.status !== 'closed' ? (
              <form onSubmit={handleSendReply} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Reply to this Ticket</h3>
                <textarea
                  rows={4}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to staff..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-slate-100 text-center text-xs font-medium text-slate-600">
                This ticket is currently closed. Click "Reopen Ticket" above to send new replies.
              </div>
            )}
          </div>
        ) : (
          /* Ticket List Overview */
          <div className="space-y-6">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['all', 'open', 'closed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      activeTab === tab ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ticket subject or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
                <LifeBuoy className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-900 mb-1">No support tickets found</p>
                <p className="text-xs mb-6 text-slate-500">Need assistance? Our support engineers are standing by 24/7.</p>
                <button
                  onClick={() => navigateTo('support', { subView: 'new' })}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Open Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigateTo('support', { subView: 'detail', ticketId: t.id })}
                    className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-blue-600">#{t.id}</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              t.status === 'open'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : t.status === 'answered'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{t.department}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {t.subject}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          Last reply {new Date(t.updatedAt).toLocaleDateString()} • {t.messages.length} message(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-medium text-slate-600 capitalize bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {t.priority}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
