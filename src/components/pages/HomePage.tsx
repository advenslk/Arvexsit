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

// Public Minecraft-style landscape artwork used only as decorative homepage artwork.
const MINECRAFT_BACKDROP = 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=2600&q=92';

const particles = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 29) % 100}%`,
  top: `${(i * 47) % 100}%`,
  delay: `${(i % 9) * -0.8}s`,
  duration: `${7 + (i % 7)}s`,
  size: `${2 + (i % 4)}px`,
}));

export const HomePage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    const el = document.getElementById('plans');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="arvex-home-page relative min-h-screen overflow-x-clip bg-transparent text-slate-200">
      {/* Cinematic fixed Minecraft world: all content scrolls above it. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="arvex-mc-world absolute -inset-[3%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${MINECRAFT_BACKDROP})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,4,8,.16),rgba(8,4,18,.42)_42%,rgba(3,4,8,.86)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,.26),transparent_38%),radial-gradient(circle_at_15%_55%,rgba(34,197,94,.10),transparent_28%),radial-gradient(circle_at_85%_45%,rgba(59,130,246,.10),transparent_30%)]" />
        <div className="arvex-grid-glow absolute inset-0 opacity-30" />
        {particles.map((particle, i) => (
          <span
            key={i}
            className="arvex-particle absolute rounded-full bg-purple-200/70 shadow-[0_0_12px_rgba(168,85,247,.9)]"
            style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size, animationDelay: particle.delay, animationDuration: particle.duration }}
          />
        ))}
      </div>

      {/* Ambient purple light that slowly moves behind the content. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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