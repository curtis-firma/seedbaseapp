import { useState, useRef, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MissionVideoState from './hero-states/MissionVideoState';
import FeedScrollState from './hero-states/FeedScrollState';
import NetworkFlowState from './hero-states/NetworkFlowState';
import LiveDataState from './hero-states/LiveDataState';
import BrandMomentState from './hero-states/BrandMomentState';
import StaticBrandState from './hero-states/StaticBrandState';
import SocialVideoState from './hero-states/SocialVideoState';
import AppSharingVideoState from './hero-states/AppSharingVideoState';
import TokenTilesState from './hero-states/TokenTilesState';
import SeededHypeVideoState from './hero-states/SeededHypeVideoState';

// Video state component type with onEnded callback
type VideoStateComponent = ComponentType<{ active?: boolean; onEnded?: () => void }>;

interface HeroState {
  id: string;
  Component: ComponentType<any>;
  duration: number;
  isVideo?: boolean;
}

// States cycle with smooth transitions - increased durations for visibility
const STATES: HeroState[] = [
  { id: 'mission-video', Component: MissionVideoState, duration: 15000, isVideo: true },
  { id: 'feed-scroll', Component: FeedScrollState, duration: 8000 },
  { id: 'social-video', Component: SocialVideoState, duration: 12000, isVideo: true },
  { id: 'token-tiles', Component: TokenTilesState, duration: 8000 },
  { id: 'network', Component: NetworkFlowState, duration: 7000 },
  { id: 'seeded-hype', Component: SeededHypeVideoState, duration: 15000, isVideo: true },
  { id: 'app-sharing-video', Component: AppSharingVideoState, duration: 12000, isVideo: true },
  { id: 'live', Component: LiveDataState, duration: 8000 },
  { id: 'brand', Component: BrandMomentState, duration: 7000 },
];

const VIDEO_STATE_IDS = new Set(['mission-video', 'social-video', 'app-sharing-video', 'seeded-hype']);

const HeroVisualCanvas = () => {
  const [activeState, setActiveState] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Advance to next state
  const advanceState = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveState((prev) => (prev + 1) % STATES.length);
  }, []);

  // Handle video ended - advance immediately
  const handleVideoEnded = useCallback(() => {
    advanceState();
  }, [advanceState]);

  // Rotate states with per-state duration
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      advanceState();
    }, STATES[activeState].duration);

    timeoutRef.current = timeout;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [prefersReducedMotion, activeState, advanceState]);

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
        <StaticBrandState />
      </div>
    );
  }

  const activeId = STATES[activeState].id;
  const ActiveComponent = STATES[activeState].Component as VideoStateComponent;
  const isVideoActive = VIDEO_STATE_IDS.has(activeId);

  // Smooth crossfade transition config
  const fadeTransition = {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden bg-black">
      {/* Single state mounted at a time with AnimatePresence for clean transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={fadeTransition}
        >
          {isVideoActive ? (
            <ActiveComponent active={true} onEnded={handleVideoEnded} />
          ) : (
            <ActiveComponent />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* State indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-500 ${
              index === activeState 
                ? 'bg-white/80 scale-125' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroVisualCanvas;
