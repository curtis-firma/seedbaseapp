import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Wallet, Sprout, 
  BarChart3, Sparkles, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import seedbaseIcon from '@/assets/seedbase-icon.png';

interface WelcomeWalkthroughProps {
  isOpen: boolean;
  onComplete: (showFullWalkthrough?: boolean) => void;
}

const slides = [
  {
    id: 'wallet-ready',
    title: 'Your Seed Wallet is Ready!',
    subtitle: 'You\'re all set to start',
    content: 'You now have a digital wallet powered by USDC. This is where your generosity journey begins.',
    icon: Wallet,
    gradient: 'gradient-base',
    emoji: '🎉',
  },
  {
    id: 'how-it-works',
    title: 'Digital Dollars In, Impact Out',
    subtitle: 'Simple, transparent, powerful',
    content: 'Digital dollars go in. Locked seeds come out. Your commitment creates real-world impact—tracked in real time.',
    icon: Sprout,
    gradient: 'gradient-seed',
    visual: [
      { label: 'USDC', emoji: '💵' },
      { label: '→', emoji: '' },
      { label: 'Locked Seeds', emoji: '🌱' },
      { label: '→', emoji: '' },
      { label: 'Impact', emoji: '🌍' },
    ],
  },
  {
    id: 'transparency',
    title: 'Track Everything',
    subtitle: 'One shared ledger, full transparency',
    content: 'Watch your impact grow in real time. Every transaction, every mission, every outcome—all on one transparent ledger.',
    icon: BarChart3,
    gradient: 'gradient-trust',
    features: [
      'See where your capital flows',
      'Track mission outcomes',
      'View distributions in real time',
    ],
  },
  {
    id: 'ready',
    title: 'Ready to Explore?',
    subtitle: 'Switch roles, discover missions, make impact',
    content: 'Explore the feed, switch between roles, and see how Seedbase turns commitment into lasting change.',
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
                  <img src={seedbaseIcon} alt="Seedbase" className="w-6 h-6" />
                  <span className="text-sm font-medium text-muted-foreground">Welcome</span>
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-base rounded-xl text-white font-medium"
                    >
                      {slide.cta}
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLearnMore}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
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
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-colors",
                        currentSlide === 0 ? "opacity-0 pointer-events-none" : "hover:bg-muted"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 gradient-base rounded-xl text-white font-medium"
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
