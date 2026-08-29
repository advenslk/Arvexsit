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

const MINECRAFT_BACKDROP = 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=2600&q=92';

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
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="arvex-mc-world absolute -inset-[4%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${MINECRAFT_BACKDROP})` }}
        />
        {/* Cinematic fade: the Minecraft artwork naturally disappears into solid black before the next sections. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,3,8,.28)_0%,rgba(3,4,10,.08)_24%,rgba(3,4,10,.22)_48%,rgba(3,4,10,.72)_70%,#03040a_88%,#03040a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(124,58,237,.22),transparent_42%),radial-gradient(ellipse_at_15%_48%,rgba(34,197,94,.07),transparent_30%),radial-gradient(ellipse_at_85%_42%,rgba(59,130,246,.08),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_58%,rgba(3,4,10,.75)_76%,#03040a_92%)]" />
        <div className="arvex-grid-glow absolute inset-0 opacity-[.22]" />
        {particles.map((particle, i) => (
          <span
            key={i}
            className="arvex-particle absolute rounded-full bg-purple-100/65 shadow-[0_0_10px_rgba(168,85,247,.8)]"
            style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size, animationDelay: particle.delay, animationDuration: particle.duration }}
          />
        ))}
      </div>

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
