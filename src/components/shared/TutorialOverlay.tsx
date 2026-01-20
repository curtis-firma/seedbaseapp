import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Wallet, Home, MessageSquare, Sprout, Settings } from 'lucide-react';
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
  position: 'bottom-nav' | 'fab' | 'header';
  highlightIndex?: number;
  gradient: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'home',
    title: 'Your Feed',
    description: 'See real-time impact from your network. Every seed planted, every harvest reported.',
    icon: Home,
    position: 'bottom-nav',
    highlightIndex: 0,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'wallet',
    title: 'Your Wallet',
    description: 'Manage your seed balance, send funds, and track your contributions.',
    icon: Wallet,
    position: 'bottom-nav',
    highlightIndex: 1,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'messages',
    title: 'One Accord',
    description: 'Connect with your community. Accept transfers and coordinate with others.',
    icon: MessageSquare,
    position: 'bottom-nav',
    highlightIndex: 2,
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'quick-action',
    title: 'Quick Actions',
    description: 'Tap the seed button to quickly give, post updates, or launch missions.',
    icon: Sprout,
    position: 'fab',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'settings',
    title: 'Your Profile',
    description: 'Access settings, view your role, and manage your account from the sidebar.',
    icon: Settings,
    position: 'header',
    gradient: 'from-orange-500 to-orange-600',
  },
];

export function TutorialOverlay({ isOpen, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { trigger } = useHaptic();

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth entrance after onboarding completes
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

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

  // Calculate highlight position based on step
  const getHighlightStyle = () => {
    switch (step.position) {
      case 'bottom-nav':
        // Approximate positions for bottom nav items (5 items)
        const navWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
        const itemWidth = navWidth / 5;
        const left = itemWidth * (step.highlightIndex || 0) + itemWidth / 2 - 32;
        return {
          bottom: '70px',
          left: `${left}px`,
          width: '64px',
          height: '64px',
        };
      case 'fab':
        return {
          bottom: '90px',
          right: '16px',
          width: '64px',
          height: '64px',
        };
      case 'header':
        return {
          top: '12px',
          left: '16px',
          width: '48px',
          height: '48px',
        };
      default:
        return {};
    }
  };

  const getTooltipPosition = () => {
    switch (step.position) {
      case 'bottom-nav':
        return 'bottom-40 left-1/2 -translate-x-1/2';
      case 'fab':
        return 'bottom-44 right-4';
      case 'header':
        return 'top-20 left-4';
      default:
        return 'bottom-40 left-1/2 -translate-x-1/2';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          {/* Dark overlay with cutout */}
          <div className="absolute inset-0 pointer-events-auto">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={handleSkip}
            />
            
            {/* Highlight spotlight */}
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute rounded-full"
              style={{
                ...getHighlightStyle(),
                boxShadow: '0 0 0 4px rgba(255,255,255,0.3), 0 0 0 9999px rgba(0,0,0,0.7)',
              }}
            >
              {/* Pulsing ring */}
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
          </div>

          {/* Tooltip card */}
          <motion.div
            key={`tooltip-${step.id}`}
            initial={{ opacity: 0, y: step.position === 'header' ? -20 : 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: step.position === 'header' ? -20 : 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
            className={cn(
              "absolute max-w-[300px] pointer-events-auto",
              getTooltipPosition()
            )}
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

            {/* Arrow pointer */}
            <div
              className={cn(
                "absolute w-4 h-4 bg-card border-l border-b border-border rotate-[135deg]",
                step.position === 'header' ? 'top-full left-8 -mt-2' : 'bottom-full left-1/2 -translate-x-1/2 mb-[-8px] rotate-[-45deg]'
              )}
              style={{
                transform: step.position === 'fab' 
                  ? 'translateX(0) rotate(-45deg)' 
                  : step.position === 'header'
                    ? 'rotate(135deg)'
                    : 'translateX(-50%) rotate(-45deg)',
                right: step.position === 'fab' ? '24px' : undefined,
                left: step.position === 'fab' ? 'auto' : step.position === 'header' ? '24px' : '50%',
              }}
            />
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
