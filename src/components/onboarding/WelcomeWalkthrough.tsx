import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sprout, 
  BarChart3, Sparkles, ArrowRight, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

interface WelcomeWalkthroughProps {
  isOpen: boolean;
  onComplete: (showFullWalkthrough?: boolean) => void;
}

const slides = [
  {
    id: 'intro',
    title: 'Plant Generosity. Watch Impact Grow.',
    subtitle: 'Welcome to Seedbase',
    content: 'A new way to give—with commitment, transparency, and real outcomes.',
    icon: Sprout,
    gradient: 'gradient-seed',
    emoji: '🌱',
  },
  {
    id: 'how-it-works',
    title: 'How Seeding Works',
    subtitle: 'Commit → Lock → Distribute',
    content: 'Commit USDC → Locked as value → Surplus distributed to missions.',
    icon: Sprout,
    gradient: 'gradient-seed',
    visual: [
      { label: 'Commit USDC', emoji: '💵' },
      { label: '→', emoji: '' },
      { label: 'Value Locked', emoji: '🔒' },
      { label: '→', emoji: '' },
      { label: 'Impact Created', emoji: '🌍' },
    ],
  },
  {
    id: 'follow',
    title: 'Follow Your Impact',
    subtitle: 'Track where your seed flows',
    content: 'Follow missions. See real-time updates. Know exactly where your generosity goes.',
    icon: BarChart3,
    gradient: 'gradient-trust',
    features: [
      'Real-time mission updates',
      'Verified impact reports',
      'Transparent fund flow',
    ],
  },
  {
    id: 'join-cik',
    title: 'Join Christ is King Seedbase',
    subtitle: 'Your first seedbase is ready',
    content: 'Start your generosity journey with a community committed to lasting change.',
    icon: Users,
    gradient: 'gradient-base',
    emoji: '⛪',
  },
  {
    id: 'ready',
    title: 'Ready to Plant Your First Seed?',
    subtitle: 'Your wallet is set up and ready',
    content: 'Explore the feed, discover missions, and commit your first seed.',
    icon: Sparkles,
    gradient: 'gradient-envoy',
    cta: "Let's Go",
    secondaryCta: 'Learn More',
  },
];

export function WelcomeWalkthrough({ isOpen, onComplete }: WelcomeWalkthroughProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Dispatch event to trigger tooltip on Quick Action button
      window.dispatchEvent(new CustomEvent('welcome-walkthrough-complete'));
      onComplete(false);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onComplete(false);
  };

  const handleLearnMore = () => {
    setCurrentSlide(0);
    onComplete(true); // Trigger full walkthrough
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-elevated h-full md:h-auto max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Logo variant="wordmark" size="xs" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          i === currentSlide ? "w-5 bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-xl"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    {/* Emoji celebration for first slide */}
                    {slide.emoji && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
                        className="text-5xl mb-4"
                      >
                        {slide.emoji}
                      </motion.span>
                    )}

                    {/* Icon */}
                    {slide.icon && !slide.emoji && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", slide.gradient)}
                      >
                        <slide.icon className="h-8 w-8 text-white" />
                      </motion.div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-muted-foreground mb-4">{slide.subtitle}</p>

                    {/* Content */}
                    <p className="text-foreground/80 mb-6 leading-relaxed max-w-sm">{slide.content}</p>

                    {/* Visual flow */}
                    {slide.visual && (
                      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                        {slide.visual.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                              "flex items-center gap-1",
                              item.emoji && item.label !== '→' && "bg-muted/50 px-3 py-2 rounded-xl"
                            )}
                          >
                            {item.emoji && <span className="text-xl">{item.emoji}</span>}
                            {item.label !== '→' && <span className="text-sm font-medium">{item.label}</span>}
                            {item.label === '→' && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Features list */}
                    {slide.features && (
                      <div className="space-y-2 mb-6 text-left w-full max-w-xs mx-auto">
                        {slide.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-5 h-5 rounded-full gradient-seed flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                {/* Last slide has two buttons */}
                {currentSlide === slides.length - 1 ? (
                  <div className="space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium shadow-lg"
                    >
                      {slide.cta}
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLearnMore}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border hover:bg-muted/50 rounded-xl font-medium transition-colors"
                    >
                      {slide.secondaryCta}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrev}
                      disabled={currentSlide === 0}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                        currentSlide === 0 ? "opacity-0 pointer-events-none" : "hover:bg-muted"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium shadow-lg"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
