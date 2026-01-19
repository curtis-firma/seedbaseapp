import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedScrollState from './hero-states/FeedScrollState';
import MissionVideoState from './hero-states/MissionVideoState';
import NetworkFlowState from './hero-states/NetworkFlowState';
import LiveDataState from './hero-states/LiveDataState';
import BrandMomentState from './hero-states/BrandMomentState';
import StaticBrandState from './hero-states/StaticBrandState';

const STATES = [
  { id: 'feed', Component: FeedScrollState },
  { id: 'video', Component: MissionVideoState },
  { id: 'network', Component: NetworkFlowState },
  { id: 'live', Component: LiveDataState },
  { id: 'brand', Component: BrandMomentState },
];

const STATE_DURATION = 8000; // 8 seconds per state

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

  // Rotate states every 5 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setActiveState((prev) => (prev + 1) % STATES.length);
    }, STATE_DURATION);
    
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Reduced motion fallback: show static brand state
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-[360px] md:h-[420px] lg:h-[500px] bg-[#FDDE02] rounded-[32px] lg:rounded-[48px] overflow-hidden">
        <StaticBrandState />
      </div>
    );
  }

  const ActiveComponent = STATES[activeState].Component;

  return (
    <div className="relative w-full h-[360px] md:h-[420px] lg:h-[500px] bg-[#FDDE02] rounded-[32px] lg:rounded-[48px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
      
      {/* State indicators (subtle dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
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
