import React, { useState } from 'react';
import { HeroSection } from '../HeroSection';
import { OfficialPartnersTicker } from '../OfficialPartnersTicker';
import { WhyChooseUsSection } from '../WhyChooseUsSection';
import { PickYourGameSection } from '../PickYourGameSection';
import { OurLocationsMapSection } from '../OurLocationsMapSection';
import { AnimatedReviewsBar } from '../AnimatedReviewsBar';
import { GameHostingPlansSection } from '../GameHostingPlansSection';
import { ControlPanelSection } from '../ControlPanelSection';
import { HardwareComparisonSection } from '../HardwareComparisonSection';
import { FaqSection } from '../FaqSection';
import { DomainSection } from '../DomainSection';
import { FloatingSocialWidgets } from '../FloatingSocialWidgets';

const MINECRAFT_BACKDROP = 'https://www.image2url.com/r2/default/images/1788176922731-5e6dc6ce-f58f-40a6-bd49-f7d856157f42.jpeg';
const HERO_VIDEO = 'https://videotourl.com/videos/1788180973614-5e0ed4b7-443a-4b26-b505-adf7a4fda22a.mp4';

const particles = Array.from({ length: 42 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${6 + ((i * 43) % 78)}%`,
  delay: `${(i % 12) * -0.75}s`,
  duration: `${7 + (i % 9)}s`,
  size: `${1 + (i % 4) * .7}px`,
}));

export const HomePage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="arvex-home-page relative min-h-screen overflow-x-clip bg-[#03040a] text-slate-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1050px] overflow-hidden sm:h-[1120px] lg:h-[1180px]">
        <video
          className="absolute -inset-[4%] h-[108%] w-[108%] object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(1,3,10,.20)_0%,rgba(3,4,10,.12)_28%,rgba(3,4,10,.30)_50%,rgba(4,3,13,.72)_68%,rgba(6,3,15,.96)_86%,#07030f_96%,#07030f_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_28%,rgba(124,58,237,.28),transparent_44%),radial-gradient(ellipse_at_12%_48%,rgba(16,185,129,.08),transparent_30%),radial-gradient(ellipse_at_88%_42%,rgba(59,130,246,.10),transparent_32%)]" />
        <div className="arvex-grid-glow absolute inset-0 opacity-[.18]" />
        {particles.map((particle, i) => (
          <span
            key={i}
            className="arvex-particle absolute rounded-full bg-white/80 shadow-[0_0_12px_rgba(216,180,254,.95)]"
            style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size, animationDelay: particle.delay, animationDuration: particle.duration }}
          />
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="arvex-orb arvex-orb-one" />
        <div className="arvex-orb arvex-orb-two" />
        <div className="arvex-scanline" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <OfficialPartnersTicker />
        <WhyChooseUsSection />
        <AnimatedReviewsBar />
        <PickYourGameSection />
        <OurLocationsMapSection />
        <GameHostingPlansSection selectedGameId={selectedGameId} onSelectGame={handleSelectGame} />
        <ControlPanelSection />
        <DomainSection />
        <HardwareComparisonSection />
        <FaqSection />
        <FloatingSocialWidgets />
      </div>
    </div>
  );
};