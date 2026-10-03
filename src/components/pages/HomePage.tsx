import React, { useState } from 'react';
import { HeroSection } from '../HeroSection';
import { OfficialPartnersTicker } from '../OfficialPartnersTicker';
import { GabrunShowcaseSections } from '../GabrunShowcaseSections';
import { GameHostingPlansSection } from '../GameHostingPlansSection';
import { OurLocationsMapSection } from '../OurLocationsMapSection';
import { AnimatedReviewsBar } from '../AnimatedReviewsBar';
import { FaqSection } from '../FaqSection';
import { FloatingSocialWidgets } from '../FloatingSocialWidgets';

export const HomePage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="gabrun-light-canvas relative min-h-screen overflow-x-clip text-slate-800 font-sans">
      <HeroSection />
      <OfficialPartnersTicker />
      <GabrunShowcaseSections />
      <GameHostingPlansSection selectedGameId={selectedGameId} onSelectGame={handleSelectGame} />
      <OurLocationsMapSection />
      <AnimatedReviewsBar />
      <FaqSection />
      <FloatingSocialWidgets />
    </div>
  );
};
