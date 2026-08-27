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

export const HomePage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    const el = document.getElementById('plans');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080911] text-slate-200">
      {/* 1. Hero Section matching Screenshot 5 */}
      <HeroSection />

      {/* 2. Official Partners Continuous Animation Bar matching Screenshot 5 */}
      <OfficialPartnersTicker />

      {/* 3. Why Choose Us Section matching Screenshot 5 */}
      <WhyChooseUsSection />

      {/* 4. Animated Reviews Bar (Players Don't Lie / Trustpilot 4.7/5) matching Screenshot 4 */}
      <AnimatedReviewsBar />

      {/* 5. Pick Your Game Showcase matching Screenshot 4 */}
      <PickYourGameSection />

      {/* 6. Our Locations Interactive Map matching Screenshot 4 */}
      <OurLocationsMapSection />

      {/* 7. Minecraft & Game Hosting Plans Matrix */}
      <GameHostingPlansSection
        selectedGameId={selectedGameId}
        onSelectGame={handleSelectGame}
      />

      {/* 8. Pterodactyl Client Control Panel Showcase */}
      <ControlPanelSection />

      {/* 9. Domain Search & Addons */}
      <DomainSection />

      {/* 10. Hardware Comparison & Speed Testing */}
      <HardwareComparisonSection />

      {/* 11. Frequently Asked Questions */}
      <FaqSection />

      {/* 12. Floating Discord, WhatsApp, Live Chat Widgets matching Screenshot 4 & 5 */}
      <FloatingSocialWidgets />
    </div>
  );
};
