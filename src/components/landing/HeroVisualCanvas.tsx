import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import FeedScrollState from './hero-states/FeedScrollState';
import NetworkFlowState from './hero-states/NetworkFlowState';
import LiveDataState from './hero-states/LiveDataState';
import BrandMomentState from './hero-states/BrandMomentState';
import StaticBrandState from './hero-states/StaticBrandState';
import TokenTilesState from './hero-states/TokenTilesState';

// Lazy load heavy video components to reduce initial bundle
const MissionVideoState = lazy(() => import('./hero-states/MissionVideoState'));
const SocialVideoState = lazy(() => import('./hero-states/SocialVideoState'));
const AppSharingVideoState = lazy(() => import('./hero-states/AppSharingVideoState'));
const SeededHypeVideoState = lazy(() => import('./hero-states/SeededHypeVideoState'));

// Video state component type with onEnded callback
type VideoStateComponent = ComponentType<{ active?: boolean; onEnded?: () => void }>;

interface HeroState {
  id: string;
  Component: ComponentType<any>;
  duration: number;
  isVideo?: boolean;
  isLazy?: boolean;
}

// States cycle with smooth transitions - faster non-video cards
const STATES: HeroState[] = [
  { id: 'mission-video', Component: MissionVideoState, duration: 15000, isVideo: true, isLazy: true },
  { id: 'feed-scroll', Component: FeedScrollState, duration: 3000 },
  { id: 'social-video', Component: SocialVideoState, duration: 12000, isVideo: true, isLazy: true },
  { id: 'token-tiles', Component: TokenTilesState, duration: 3000 },
  { id: 'network', Component: NetworkFlowState, duration: 3000 },
  { id: 'seeded-hype', Component: SeededHypeVideoState, duration: 20000, isVideo: true, isLazy: true },
  { id: 'app-sharing-video', Component: AppSharingVideoState, duration: 12000, isVideo: true, isLazy: true },
  { id: 'live', Component: LiveDataState, duration: 3500 },
  { id: 'brand', Component: BrandMomentState, duration: 3500 },
];

const VIDEO_STATE_IDS = new Set(['mission-video', 'social-video', 'app-sharing-video', 'seeded-hype']);

// Simple loading placeholder for lazy components
const VideoLoadingPlaceholder = () => (
  <div className="w-full h-full bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  </div>
);

const HeroVisualCanvas = () => {
  const [activeState, setActiveState] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadedStates, setLoadedStates] = useState<Set<number>>(new Set([0])); // Start with first state loaded
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
    setActiveState((prev) => {
      const next = (prev + 1) % STATES.length;
      // Preload next state
      setLoadedStates(loaded => new Set([...loaded, next, (next + 1) % STATES.length]));
      return next;
    });
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

  // Preload next few states after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedStates(new Set([0, 1, 2]));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] bg-[#FDDE02] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden">
        <StaticBrandState />
      </div>
    );
  }

  // Quick fade transition - no sliding
  const quickFade = {
    duration: 0.25,
    ease: 'easeOut' as const,
  };

  return (
    <div className="relative w-full h-[200px] md:h-[340px] lg:h-[420px] rounded-[20px] md:rounded-[32px] lg:rounded-[48px] overflow-hidden bg-white">
      {/* Keep ALL states mounted - quick opacity toggle for instant switching */}
      {STATES.map((state, index) => {
        const isActive = index === activeState;
        const isVideo = VIDEO_STATE_IDS.has(state.id);
        const StateComponent = state.Component as VideoStateComponent;
        const shouldRender = loadedStates.has(index) || isActive;

        if (!shouldRender) return null;

        const content = (
          <StateComponent active={isActive} onEnded={isVideo ? handleVideoEnded : undefined} />
        );

        return (
          <motion.div
            key={state.id}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 0,
            }}
            transition={quickFade}
          >
            {/* Wrap lazy components in Suspense */}
            {state.isLazy ? (
              <Suspense fallback={<VideoLoadingPlaceholder />}>
                {content}
              </Suspense>
            ) : (
              content
            )}
          </motion.div>
        );
      })}
      
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
