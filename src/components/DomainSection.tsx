import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Globe, CheckCircle2, AlertCircle, ShoppingCart, Sparkles } from 'lucide-react';

export const DomainSection: React.FC = () => {
  const { siteSettings, formatPrice } = useApp();
  const [domainQuery, setDomainQuery] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [searchResult, setSearchResult] = useState<{
    searched: string;
    available: boolean;
    price: number;
    tld: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const popularTlds = [
    { tld: '.com', price: 9.99, popular: true },
    { tld: '.net', price: 11.99, popular: false },
    { tld: '.org', price: 12.99, popular: false },
    { tld: '.io', price: 29.99, popular: false },
    { tld: '.gg', price: 24.99, popular: true },
    { tld: '.dev', price: 14.99, popular: false },
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainQuery.trim()) return;

    setIsSearching(true);
    setIsAddedToCart(false);

    let cleanName = domainQuery.trim().toLowerCase().replace(/^https?:\/\//, '');
    let matchedTld = selectedTld;

    popularTlds.forEach((t) => {
      if (cleanName.endsWith(t.tld)) {
        matchedTld = t.tld;
        cleanName = cleanName.replace(t.tld, '');
      }
    });

    const fullDomain = `${cleanName}${matchedTld}`;
    const tldInfo = popularTlds.find((t) => t.tld === matchedTld) || popularTlds[0];

    setTimeout(() => {
      setIsSearching(false);
      // Simulate realistic availability
      const isTaken = ['google', 'microsoft', 'minecraft', 'hypixel', 'apple', 'arvex'].includes(
        cleanName.toLowerCase()
      );
      setSearchResult({
        searched: fullDomain,
        available: !isTaken,
        price: tldInfo.price,
        tld: matchedTld,
      });
    }, 450);
  };

  const handleTldClick = (tld: string) => {
    setSelectedTld(tld);
    if (domainQuery) {
      setTimeout(() => handleSearch(), 50);
    }
  };

  return (
    <section id="domain" className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Light Container Card matching Screenshot 7 */}
      <div className="relative overflow-hidden rounded-3xl bg-[#f8fafc] text-slate-900 p-8 sm:p-12 shadow-2xl border border-slate-200">
        {/* Stylized world dot pattern watermark on the right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none bg-[radial-gradient(#0f172a_1.5px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_60%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2 font-display">
            {siteSettings.domainSearchTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8">
            {siteSettings.domainSearchSubtitle}
          </p>

          {/* Domain Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex items-center bg-white rounded-2xl p-2 border border-slate-300 shadow-lg focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="domain-search-input"
                type="text"
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                placeholder="Find your perfect domain..."
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none px-2"
              />
              <button
                id="domain-search-submit-btn"
                type="submit"
                disabled={isSearching}
                className="bg-black hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isSearching ? 'Checking...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Popular TLD Pills matching Screenshot 7 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {popularTlds.map((item) => (
              <button
                key={item.tld}
                onClick={() => handleTldClick(item.tld)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  selectedTld === item.tld
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300'
                }`}
              >
                <span>{item.tld}</span>
                <span className="ml-1.5 text-[10px] opacity-70">
                  {formatPrice(item.price)}
                </span>
              </button>
            ))}
          </div>

          {/* Live Search Result Alert */}
          {searchResult && (
            <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-300 shadow-md flex items-center justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                {searchResult.available ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-base">
                      {searchResult.searched}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        searchResult.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {searchResult.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {searchResult.available
                      ? `Instant DNS setup with DDoS protection included.`
                      : `This domain is already registered. Try searching for another TLD like ${searchResult.searched.replace(
                          searchResult.tld,
                          '.gg'
                        )}.`}
                  </p>
                </div>
              </div>

              {searchResult.available && (
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-900">
                    {formatPrice(searchResult.price)}
                    <span className="text-xs text-slate-500 font-normal">/yr</span>
                  </span>
                  <button
                    onClick={() => setIsAddedToCart(!isAddedToCart)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isAddedToCart
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black hover:bg-slate-800 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{isAddedToCart ? 'Added to Cart ✓' : 'Register Now'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
