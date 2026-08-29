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

// Cinematic Minecraft landscape chosen for the ArveX game-hosting hero.
// Kept as a remote image so the repository stays lightweight.
const MINECRAFT_BACKDROP = 'https://www.xtrafondos.com/wallpapers/resized/paisaje-minecraft-de-selva-montana-e-isla-13758.jpg?s=large';

const particles = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${8 + ((i * 43) % 76)}%`,
  delay: `${(i % 9) * -0.9}s`,
  duration: `${8 + (i % 8)}s`,
  size: `${1.5 + (i % 3)}px`,
}));

export const HomePage: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('minecraft');

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="arvex-home-page relative min-h-screen overflow-x-clip bg-[#03040a] text-slate-200">
      {/* Hero-only Minecraft artwork. It ends after the opening section instead of staying fixed behind the whole site. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1000px] overflow-hidden sm:h-[1080px] lg:h-[1160px]">
        <div
          className="arvex-mc-world absolute -inset-[4%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${MINECRAFT_BACKDROP})` }}
        />
        {/* Heavy cinematic fade at the bottom creates a clean hand-off into the dark purple sections. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,3,8,.18)_0%,rgba(3,4,10,.06)_22%,rgba(3,4,10,.18)_46%,rgba(3,4,10,.56)_66%,rgba(5,3,13,.90)_82%,#07030f_94%,#07030f_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(124,58,237,.24),transparent_42%),radial-gradient(ellipse_at_15%_48%,rgba(34,197,94,.07),transparent_30%),radial-gradient(ellipse_at_85%_42%,rgba(59,130,246,.08),transparent_32%)]" />
        <div className="arvex-grid-glow absolute inset-0 opacity-[.22]" />
        {particles.map((particle, i) => (
          <span
            key={i}
            className="arvex-particle absolute rounded-full bg-purple-100/65 shadow-[0_0_10px_rgba(168,85,247,.8)]"
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