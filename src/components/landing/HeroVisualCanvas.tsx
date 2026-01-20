import { useState, useEffect } from 'react';
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
import MatrixMemeState from './hero-states/MatrixMemeState';

// States cycle with smooth transitions - each controls its own background
// Per-state durations allow videos to play fully
const STATES = [
  { id: 'mission-video', Component: MissionVideoState, duration: 12000 },
  { id: 'feed-scroll', Component: FeedScrollState, duration: 6000 },
  { id: 'social-video', Component: SocialVideoState, duration: 11000 },
  { id: 'matrix-meme', Component: MatrixMemeState, duration: 6000 },
  { id: 'network', Component: NetworkFlowState, duration: 5000 },
  { id: 'app-sharing-video', Component: AppSharingVideoState, duration: 11000 },
  { id: 'live', Component: LiveDataState, duration: 5000 },
  { id: 'brand', Component: BrandMomentState, duration: 5000 },
];

const VIDEO_STATE_IDS = new Set(['mission-video', 'social-video', 'app-sharing-video']);

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

  // Rotate states with per-state duration
  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentDuration = STATES[activeState].duration;
    const timeout = window.setTimeout(() => {
      setActiveState((prev) => (prev + 1) % STATES.length);
    }, currentDuration);

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

  const activeId = STATES[activeState].id;
  const ActiveComponent = STATES[activeState].Component;
  const isVideoActive = VIDEO_STATE_IDS.has(activeId);

  return (
    <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
      {/* Keep videos mounted to prevent playback glitches */}
      {STATES.filter((s) => VIDEO_STATE_IDS.has(s.id)).map((state) => {
        const VideoComponent = state.Component as unknown as ComponentType<{ active?: boolean }>;
        const isActive = state.id === activeId;

        return (
          <motion.div
            key={state.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
          >
            <VideoComponent active={isActive} />
          </motion.div>
        );
      })}

      {/* Non-video states mount/unmount normally to keep perf high */}
      <AnimatePresence mode="sync">
        {!isVideoActive && (
          <motion.div
            key={activeState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <ActiveComponent />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* State indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {STATES.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 ${
              index === activeState 
                ? 'bg-white/70 scale-125' 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroVisualCanvas;
