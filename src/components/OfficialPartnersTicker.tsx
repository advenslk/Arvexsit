import React from 'react';
import { useApp } from '../context/AppContext';
import { Partner } from '../types';

const defaultLogos = [
  { name: 'PayPal', badge: 'Payments', iconText: 'PayPal' },
  { name: 'Notion', badge: 'Workspace', iconText: 'N' },
  { name: 'Slack', badge: 'Comms', iconText: '# slack' },
  { name: 'Loom', badge: 'Video', iconText: 'loom' },
  { name: 'Monday.com', badge: 'Work OS', iconText: 'monday.com' },
  { name: 'Afterpay', badge: 'Fintech', iconText: 'afterpay' },
  { name: 'Cloudflare', badge: 'Security', iconText: 'Cloudflare' },
  { name: 'AMD Ryzen', badge: 'Hardware', iconText: 'AMD RYZEN' },
  { name: 'Pterodactyl', badge: 'Control Panel', iconText: 'Pterodactyl' },
  { name: 'Ubuntu', badge: 'OS', iconText: 'ubuntu' },
];

export const OfficialPartnersTicker: React.FC = () => {
  const { partners, navigateTo } = useApp();
  const activePartners: Partner[] = (partners || []).filter((p) => p.active !== false);

  const displayList = activePartners.length > 0 ? activePartners : defaultLogos;
  const marqueeItems = [...displayList, ...displayList];

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Trusted By More Than <span className="text-blue-600">+10,000 Users</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
          Leading gaming communities, SaaS founders, and engineers run on HelzerX Cloud Infrastructure.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="animate-marquee flex w-max items-center gap-6 py-2 will-change-transform">
          {marqueeItems.map((item: any, index: number) => (
            <div
              key={`${item.name}-${index}`}
              onClick={() => navigateTo('partners')}
              className="flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-3 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-white transition-all duration-200"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 font-black text-xs font-display">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="h-full w-full object-contain p-1" />
                ) : (
                  <span>{item.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display text-sm font-bold text-slate-800">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{item.category || item.badge || 'Verified Partner'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
