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
      {/* Ambient effects stay behind the page. The hero video itself is scoped to HeroSection so it cannot bleed into the sections below. */}
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
