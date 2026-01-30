import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Wallet, Home, MessageSquare, Sprout, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

interface TutorialOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

const TUTORIAL_STORAGE_KEY = 'seedbase-tutorial-completed';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  targetSelector: string;
  gradient: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'home',
    title: 'Your Feed',
    description: 'See real-time impact from your network. Every seed planted, every harvest reported.',
    icon: Home,
    targetSelector: '[data-tutorial="nav-home"]',
    gradient: 'from-primary to-primary/80',
  },
  {
    id: 'wallet',
    title: 'Your Profile',
    description: 'Manage your wallet, track contributions, and see your impact metrics.',
    icon: User,
    targetSelector: '[data-tutorial="nav-user"]',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'quick-action',
    title: 'Quick Actions',
    description: 'Tap the seed button to quickly give, post updates, or commit seed.',
    icon: Sprout,
    targetSelector: '[data-tutorial="quick-action"]',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'settings',
    title: 'Menu & Settings',
    description: 'Access settings, view your role, and manage your account from the sidebar.',
    icon: Settings,
    targetSelector: '[data-tutorial="profile-menu"]',
    gradient: 'from-orange-500 to-orange-600',
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export function TutorialOverlay({ isOpen, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const { trigger } = useHaptic();

  // Find and measure target element
  const measureTarget = useCallback(() => {
    const step = tutorialSteps[currentStep];
    if (!step) return;
    
    const element = document.querySelector(step.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      });
    } else {
      // Fallback positions if element not found
      const fallbacks: Record<string, TargetRect> = {
        home: { top: window.innerHeight - 70, left: window.innerWidth * 0.15, width: 50, height: 50, centerX: window.innerWidth * 0.15, centerY: window.innerHeight - 45 },
        wallet: { top: window.innerHeight - 70, left: window.innerWidth * 0.85, width: 50, height: 50, centerX: window.innerWidth * 0.85, centerY: window.innerHeight - 45 },
        'quick-action': { top: window.innerHeight - 140, left: window.innerWidth - 70, width: 56, height: 56, centerX: window.innerWidth - 42, centerY: window.innerHeight - 112 },
        settings: { top: 16, left: window.innerWidth - 60, width: 40, height: 40, centerX: window.innerWidth - 40, centerY: 36 },
      };
      setTargetRect(fallbacks[step.id] || null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Measure on step change and window resize
  useLayoutEffect(() => {
    if (isVisible) {
      measureTarget();
      const handleResize = () => measureTarget();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isVisible, currentStep, measureTarget]);

  const handleNext = useCallback(() => {
    trigger('light');
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, trigger]);

  const handleComplete = useCallback(() => {
    trigger('success');
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete, trigger]);

  const handleSkip = useCallback(() => {
    trigger('light');
    handleComplete();
  }, [handleComplete, trigger]);

  const step = tutorialSteps[currentStep];

  // Calculate tooltip position based on target location
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return { bottom: '160px', left: '50%', transform: 'translateX(-50%)' };
    
    const padding = 16;
    const tooltipWidth = 300;
    const tooltipHeight = 180;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Determine if target is in top or bottom half
    const isTargetInBottomHalf = targetRect.centerY > viewportHeight / 2;
    
    // Calculate horizontal position (center on target, but keep within viewport)
    let left = targetRect.centerX - tooltipWidth / 2;
    left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding));
    
    if (isTargetInBottomHalf) {
      // Show tooltip above target
      return {
        position: 'fixed' as const,
        bottom: viewportHeight - targetRect.top + 24,
        left,
        width: tooltipWidth,
      };
    } else {
      // Show tooltip below target
      return {
        position: 'fixed' as const,
        top: targetRect.top + targetRect.height + 24,
        left,
        width: tooltipWidth,
      };
    }
  };

  // Spotlight radius
  const spotlightRadius = targetRect 
    ? Math.max(targetRect.width, targetRect.height) / 2 + 12 
    : 40;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100]"
        >
          {/* SVG Mask for spotlight effect */}
          <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={handleSkip}>
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                {targetRect && (
                  <circle
                    cx={targetRect.centerX}
                    cy={targetRect.centerY}
                    r={spotlightRadius}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="rgba(0,0,0,0.8)" 
              mask="url(#spotlight-mask)"
            />
          </svg>

          {/* Pulsing ring around target */}
          {targetRect && (
            <motion.div
              key={`ring-${step.id}`}
              className="absolute pointer-events-none"
              style={{
                left: targetRect.centerX - spotlightRadius,
                top: targetRect.centerY - spotlightRadius,
                width: spotlightRadius * 2,
                height: spotlightRadius * 2,
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}

          {/* Tooltip card */}
          <motion.div
            key={`tooltip-${step.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
            className="pointer-events-auto"
            style={getTooltipStyle()}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className={cn("p-4 bg-gradient-to-r text-white", step.gradient)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-white/80 text-xs">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {tutorialSteps.map((_, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          i === currentStep ? "bg-primary" : "bg-muted"
                        )}
                        animate={{
                          width: i === currentStep ? 20 : 6,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSkip}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleNext}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all",
                        "bg-gradient-to-r",
                        step.gradient,
                        "hover:shadow-lg hover:scale-105 active:scale-95"
                      )}
                    >
                      {currentStep === tutorialSteps.length - 1 ? 'Done' : 'Next'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skip button in corner */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if tutorial should show
export function useShouldShowTutorial(): boolean {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    setShouldShow(!hasCompleted);
  }, []);

  return shouldShow;
}

// Helper to reset tutorial for testing
export function resetTutorial() {
  localStorage.removeItem(TUTORIAL_STORAGE_KEY);
}
