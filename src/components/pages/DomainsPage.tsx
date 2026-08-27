import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  Lock,
  Server,
  RefreshCw,
  Clock,
  Sparkles,
  CreditCard,
  Plus,
} from 'lucide-react';
import { DomainTld } from '../../types';

export const DomainsPage: React.FC = () => {
  const {
    tlds,
    registeredDomains,
    registerDomain,
    formatPrice,
    navigateTo,
    user,
    currentRoute,
    showNotification,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{
    domain: string;
    available: boolean;
    tld: DomainTld;
  } | null>(null);

  const [whoisPrivacy, setWhoisPrivacy] = useState<boolean>(true);
  const [registrationYears, setRegistrationYears] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const subView = currentRoute.params.subView || 'search';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    let clean = searchTerm.trim().toLowerCase();
    // Strip http/https if pasted
    clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');

    let domainName = clean;
    let tldExtension = '.com';

    const dotIndex = clean.indexOf('.');
    if (dotIndex !== -1) {
      tldExtension = clean.substring(dotIndex);
      domainName = clean.substring(0, dotIndex);
    }

    const matchedTld = tlds.find((t) => t.extension === tldExtension) || tlds[0];
    const fullDomain = `${domainName}${matchedTld.extension}`;

    // Check availability against currently registered domains in state
    const isAlreadyRegistered = registeredDomains.some(
      (d) => d.domainName.toLowerCase() === fullDomain
    );

    setSearchResult({
      domain: fullDomain,
      available: !isAlreadyRegistered,
      tld: matchedTld,
    });
    setHasSearched(true);
  };

  const handleRegister = () => {
    if (!searchResult || !searchResult.available) return;

    setIsProcessing(true);
    setTimeout(() => {
      const reg = registerDomain(searchResult.domain, registrationYears, whoisPrivacy);
      setIsProcessing(false);
      showNotification(`Successfully registered ${searchResult.domain}!`, 'success');
      navigateTo('dashboard', { section: 'domains', id: reg.id });
    }, 600);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-cyan-400 font-semibold">Domain Registration &amp; DNS Management</span>
      </nav>

      {/* Hero Search Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>Global Domain Registrar &amp; Anycast DNS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight mb-4">
          Find Your Perfect Domain
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          Register premium .com, .net, .gg, .lk, and modern web3/tech extensions with free WHOIS privacy, Anycast DNS management, and seamless server linking.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="flex items-center bg-[#11131e] border border-white/15 rounded-2xl p-2 shadow-2xl focus-within:border-cyan-500 transition-colors">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search your brand or domain (e.g. playarvex.com, myserver.gg)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-white text-sm sm:text-base px-3 py-2 focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Search Result Card */}
      {hasSearched && searchResult && (
        <div className="max-w-3xl mx-auto mb-16 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`p-6 sm:p-8 rounded-3xl border ${
              searchResult.available
                ? 'bg-[#0e1624] border-cyan-500/40 shadow-xl shadow-cyan-500/10'
                : 'bg-[#181119] border-red-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {searchResult.available ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Domain Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Domain Taken
                    </span>
                  )}
                  <span className="text-xs text-slate-400">TLD: {searchResult.tld.extension}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                  {searchResult.domain}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {searchResult.available
                    ? 'Includes free WHOIS privacy & automatic Anycast DNS zone.'
                    : 'This domain is already registered. Try searching another variation.'}
                </p>
              </div>

              {searchResult.available && (
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                  <p className="text-3xl font-black text-white font-display">
                    {formatPrice(searchResult.tld.registerPrice * registrationYears)}
                  </p>
                  <p className="text-xs text-slate-400 mb-4">for {registrationYears} year(s)</p>

                  <button
                    onClick={handleRegister}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Register Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {searchResult.available && (
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whoisPrivacy}
                    onChange={(e) => setWhoisPrivacy(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Free WHOIS Privacy Protection</span>
                </label>

                <div className="flex items-center justify-start sm:justify-end gap-2 text-xs text-slate-400">
                  <span>Registration Period:</span>
                  <select
                    value={registrationYears}
                    onChange={(e) => setRegistrationYears(Number(e.target.value))}
                    className="bg-[#11131e] border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={1}>1 Year</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TLD Pricing Table */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-display mb-1">
              Top Level Domain (TLD) Pricing
            </h2>
            <p className="text-xs text-slate-400">
              Transparent registration, renewal, and transfer rates with no hidden fees.
            </p>
          </div>
        </div>

        <div className="bg-[#11131e] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161926] text-slate-400 font-semibold border-b border-white/5 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Domain Extension</th>
                  <th className="py-3.5 px-6">Registration</th>
                  <th className="py-3.5 px-6">Renewal</th>
                  <th className="py-3.5 px-6">Transfer</th>
                  <th className="py-3.5 px-6">WHOIS Privacy</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {tlds.map((tld) => (
                  <tr key={tld.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-white font-mono text-sm">
                      {tld.extension}
                    </td>
                    <td className="py-4 px-6 font-semibold text-cyan-400">
                      {formatPrice(tld.registerPrice)} / yr
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {formatPrice(tld.renewPrice)} / yr
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {formatPrice(tld.transferPrice)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Free Included
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSearchTerm(`myserver${tld.extension}`);
                          setSearchResult({
                            domain: `myserver${tld.extension}`,
                            available: true,
                            tld,
                          });
                          setHasSearched(true);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500 hover:text-black text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Register
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
