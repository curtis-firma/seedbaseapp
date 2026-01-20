import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sprout, 
  BarChart3, Sparkles, ArrowRight, Users, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { useHaptic } from '@/hooks/useHaptic';

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
    collapsible: {
      title: 'How it works',
      content: [
        'Your USDC purchases $CIK tokens which are locked in the Vault.',
        'As the network grows, your seed appreciates.',
        'Surplus flows to missions you support.',
      ],
      highlight: 'No crypto knowledge needed. Use your debit card or Apple Pay. Withdraw to your bank anytime.',
    },
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

// Smooth spring transition for Privy-style feel
const slideTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 350,
};

const dropdownVariants = {
  closed: { 
    height: 0, 
    opacity: 0,
    transition: { 
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
      opacity: { duration: 0.15 }
    }
  },
  open: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  }
};

export function WelcomeWalkthrough({ isOpen, onComplete }: WelcomeWalkthroughProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { trigger } = useHaptic();
  const slide = slides[currentSlide];

  const handleNext = () => {
    trigger('light');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setExpandedSection(null);
    } else {
      // Dispatch event to trigger tooltip on Quick Action button
      window.dispatchEvent(new CustomEvent('welcome-walkthrough-complete'));
      onComplete(false);
    }
  };

  const handlePrev = () => {
    trigger('light');
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setExpandedSection(null);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    setExpandedSection(null);
    onComplete(false);
  };

  const handleLearnMore = () => {
    trigger('medium');
    setCurrentSlide(0);
    setExpandedSection(null);
    onComplete(true); // Trigger full walkthrough
  };

  const handleSkip = () => {
    trigger('light');
    window.dispatchEvent(new CustomEvent('welcome-walkthrough-complete'));
    onComplete(false);
  };

  const toggleSection = (id: string) => {
    trigger('light');
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur animation */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-50"
          />

          {/* Modal with Privy-style spring animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={slideTransition}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-elevated h-full md:h-auto max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Logo variant="wordmark" size="xs" />
                </div>
                <div className="flex items-center gap-3">
                  {/* Enhanced progress dots - pill shape when active */}
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: i === currentSlide ? 20 : 8,
                          backgroundColor: i === currentSlide 
                            ? 'hsl(var(--primary))' 
                            : i < currentSlide 
                              ? 'hsl(var(--primary) / 0.5)' 
                              : 'hsl(var(--muted))',
                        }}
                        transition={{ duration: 0.2 }}
                        className="h-2 rounded-full"
                      />
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content with popLayout for smoother transitions */}
              <div className="flex-1 overflow-y-auto p-6 text-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 30, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.98 }}
                    transition={slideTransition}
                    className="flex flex-col items-center"
                  >
                    {/* Emoji celebration with glow */}
                    {slide.emoji && (
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
                        className="text-5xl mb-4 drop-shadow-lg"
                      >
                        {slide.emoji}
                      </motion.span>
                    )}

                    {/* Icon with glow effect */}
                    {slide.icon && !slide.emoji && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          boxShadow: [
                            '0 0 0 rgba(0,0,0,0)',
                            '0 0 20px rgba(34, 197, 94, 0.3)',
                            '0 0 0 rgba(0,0,0,0)',
                          ],
                        }}
                        transition={{ 
                          scale: { delay: 0.1 },
                          boxShadow: { duration: 1.5, repeat: 1 }
                        }}
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

                    {/* Collapsible section for How it works */}
                    {slide.collapsible && (
                      <div className="w-full max-w-sm mb-6">
                        <motion.button
                          onClick={() => toggleSection(slide.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                            expandedSection === slide.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 bg-muted/50"
                          )}
                        >
                          <span className="font-medium flex items-center gap-2">
                            {slide.collapsible.title}
                            {/* Arrow hint animation */}
                            {expandedSection !== slide.id && (
                              <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-muted-foreground"
                              >
                                →
                              </motion.span>
                            )}
                          </span>
                          <motion.div
                            animate={{ rotate: expandedSection === slide.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.div>
                        </motion.button>
                        
                        <AnimatePresence>
                          {expandedSection === slide.id && (
                            <motion.div
                              variants={dropdownVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              className="overflow-hidden"
                            >
                              <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-4 text-left space-y-3"
                              >
                                {slide.collapsible.content.map((item, i) => (
                                  <p key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    {item}
                                  </p>
                                ))}
                                {slide.collapsible.highlight && (
                                  <p className="text-sm font-semibold italic text-foreground mt-4 pt-4 border-t border-border/50">
                                    {slide.collapsible.highlight}
                                  </p>
                                )}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Features list with staggered entrance */}
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium shadow-lg transition-colors"
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
                  <div className="flex flex-col gap-3">
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
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium shadow-lg transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    {/* Skip option */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleSkip}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-1"
                    >
                      Skip for now
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
