import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Server,
  Cpu,
  Globe,
  Bot,
  HardDrive,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, formatPrice, openCheckout, plans } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'Server':
        return <Server className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'HardDrive':
        return <HardDrive className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'srv-game') {
      const el = document.getElementById('plans');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const popularPlan = plans.find((p) => p.popular) || plans[0];
      if (popularPlan) openCheckout(popularPlan);
    }
  };

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-3">
          Explore Our Services
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          From high-frequency game instances to dedicated bare-metal clusters, engineered for absolute reliability.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(services || [])
          .filter((s) => s?.active)
          .map((service) => (
            <div
              key={service.id}
              className="group relative rounded-3xl bg-[#11131c] border border-white/10 hover:border-cyan-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1"
            >
              <div>
                {/* Top Row: Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[#181d2c] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  {service.badge && (
                    <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-2 mb-6 text-xs text-slate-300">
                  {(service.features || []).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Price & Action Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Starting from</span>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-white font-display">
                      {formatPrice(service.startingPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/mo</span>
                  </div>
                </div>

                <button
                  onClick={() => handleServiceClick(service.id)}
                  className="bg-white hover:bg-slate-100 text-black text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};
