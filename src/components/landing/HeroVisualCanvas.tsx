import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PhoneMockupState from './hero-states/PhoneMockupState';
import MissionVideoState from './hero-states/MissionVideoState';
import NetworkFlowState from './hero-states/NetworkFlowState';
import LiveDataState from './hero-states/LiveDataState';
import BrandMomentState from './hero-states/BrandMomentState';
import StaticBrandState from './hero-states/StaticBrandState';
import SocialVideoState from './hero-states/SocialVideoState';
import AppSharingVideoState from './hero-states/AppSharingVideoState';

// Mission video is FIRST, then phone mockup with scrolling feed
const STATES = [
  { id: 'mission-video', Component: MissionVideoState },
  { id: 'phone-feed', Component: PhoneMockupState },
  { id: 'social-video', Component: SocialVideoState },
  { id: 'network', Component: NetworkFlowState },
  { id: 'app-sharing-video', Component: AppSharingVideoState },
  { id: 'live', Component: LiveDataState },
  { id: 'brand', Component: BrandMomentState },
];

const STATE_DURATION = 5000; // 5 seconds per state

const HeroVisualCanvas = () => {
  const [activeState, setActiveState] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Rotate states
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setActiveState((prev) => (prev + 1) % STATES.length);
    }, STATE_DURATION);

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion, activeState]);

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
        <StaticBrandState />
      </div>
    );
  }

  const ActiveComponent = STATES[activeState].Component;

  return (
    <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "linear" }}
          className="absolute inset-0"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
      
      {/* State indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-150 ${
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
