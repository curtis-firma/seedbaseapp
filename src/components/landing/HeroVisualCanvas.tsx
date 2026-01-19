import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FeedScrollState from './hero-states/FeedScrollState';
import MissionVideoState from './hero-states/MissionVideoState';
import NetworkFlowState from './hero-states/NetworkFlowState';
import LiveDataState from './hero-states/LiveDataState';
import BrandMomentState from './hero-states/BrandMomentState';
import StaticBrandState from './hero-states/StaticBrandState';
import SocialVideoState from './hero-states/SocialVideoState';
import AppSharingVideoState from './hero-states/AppSharingVideoState';

// Interleave videos between other cards for variety
const STATES = [
  { id: 'feed', Component: FeedScrollState },
  { id: 'mission-video', Component: MissionVideoState },
  { id: 'network', Component: NetworkFlowState },
  { id: 'social-video', Component: SocialVideoState },
  { id: 'live', Component: LiveDataState },
  { id: 'app-sharing-video', Component: AppSharingVideoState },
  { id: 'brand', Component: BrandMomentState },
];

const STATE_DURATION = 5000; // 5 seconds per state

const HeroVisualCanvas = () => {
  const [activeState, setActiveState] = useState(1); // start on video so it's immediately visible
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Rotate states (setTimeout chain is more reliable than setInterval)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setActiveState((prev) => (prev + 1) % STATES.length);
    }, STATE_DURATION);

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion, activeState]);

  // Reduced motion fallback: show static brand state
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-[280px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[24px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
        <StaticBrandState />
      </div>
    );
  }

  const ActiveComponent = STATES[activeState].Component;

  return (
    <div className="relative w-full h-[280px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[24px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
      <AnimatePresence mode="sync">
        <div
          key={activeState}
          className="absolute inset-0"
        >
          <ActiveComponent />
        </div>
      </AnimatePresence>
      
      {/* State indicators (subtle dots) */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 ${
              index === activeState 
                ? 'bg-black/40 scale-125' 
                : 'bg-black/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroVisualCanvas;
