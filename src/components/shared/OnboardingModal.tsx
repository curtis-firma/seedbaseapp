import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sprout, Layers, Rocket, 
  Shield, DollarSign, Users, BarChart3, Lock, Heart,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 'welcome',
    title: 'Welcome to Seedbase',
    subtitle: 'A social network for committed generosity',
    content: 'Seedbase turns committed capital into measurable, accountable real-world impact. This isn\'t charity or speculation—it\'s governed generosity.',
    icon: Sprout,
    gradient: 'gradient-seed',
    quote: '"Locked value. Living impact."',
  },
  {
    id: 'roles',
    title: 'Three Roles, One Mission',
    subtitle: 'Everyone has a part to play',
    content: null,
    roles: [
      {
        name: 'Activator',
        icon: Sprout,
        gradient: 'gradient-seed',
        description: 'Commit capital, activate generosity, grow the network.',
        forWho: 'Great for individuals who want to commit funds and track impact',
      },
      {
        name: 'Trustee',
        icon: Shield,
        gradient: 'gradient-trust',
        description: 'Govern Seedbases, launch missions, approve Envoys.',
        forWho: 'Great for nonprofit, church, or ministry leaders',
      },
      {
        name: 'Envoy',
        icon: Rocket,
        gradient: 'gradient-envoy',
        description: 'Execute missions, receive distributions, report outcomes.',
        forWho: 'Great for teams executing missions on the ground',
      },
    ],
  },
  {
    id: 'keys',
    title: 'Power Comes From Keys',
    subtitle: 'Not profiles—Keys unlock abilities',
    content: 'In Seedbase, your role doesn\'t automatically grant power. You need the corresponding Key to take action. Keys are earned, not given.',
    keys: [
      { name: 'SeedKey', gradient: 'gradient-seed', description: 'Commit capital to activate' },
      { name: 'BaseKey', gradient: 'gradient-trust', description: 'Apply to govern a Seedbase' },
      { name: 'MissionKey', gradient: 'gradient-envoy', description: 'Get approved to execute missions' },
    ],
    quote: '"Governed by rules, not people."',
  },
  {
    id: 'flow',
    title: 'How Money Flows',
    subtitle: 'Transparent, accountable, on-chain',
    content: null,
    flow: [
      { step: 1, label: 'Activators commit USDC', icon: DollarSign },
      { step: 2, label: 'Capital is locked in Seedbases', icon: Lock },
      { step: 3, label: 'Trustees launch missions', icon: Layers },
      { step: 4, label: 'Envoys execute & report', icon: Rocket },
      { step: 5, label: 'Distributions flow to impact', icon: Heart },
    ],
    quote: '"USDC in. USDC out. Value stays."',
  },
  {
    id: 'demo',
    title: 'This is Demo Mode',
    subtitle: 'Explore freely, learn the system',
    content: 'In this demo, all roles are unlocked so you can explore. In production, Trustees and Envoys require approval. Activators can join by committing capital.',
    features: [
      'Switch between roles using the sidebar',
      'Explore the social feed (Seedfeed)',
      'See how missions and distributions work',
      'Accept transfers in OneAccord',
      'View analytics in the Vault',
    ],
    icon: CheckCircle2,
    gradient: 'gradient-base',
    cta: 'Start Exploring',
  },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-elevated h-full md:h-auto max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentSlide ? "w-6 bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-xl"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Icon */}
                    {slide.icon && (
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", slide.gradient)}>
                        <slide.icon className="h-8 w-8 text-white" />
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-muted-foreground mb-6">{slide.subtitle}</p>

                    {/* Content */}
                    {slide.content && (
                      <p className="text-foreground/80 mb-6 leading-relaxed">{slide.content}</p>
                    )}

                    {/* Roles */}
                    {slide.roles && (
                      <div className="space-y-3 mb-6">
                        {slide.roles.map((role) => (
                          <div key={role.name} className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.gradient)}>
                                <role.icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-semibold">{role.name}</span>
                            </div>
                            <p className="text-sm text-foreground/80 mb-1">{role.description}</p>
                            <p className="text-xs text-muted-foreground italic">{role.forWho}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Keys */}
                    {slide.keys && (
                      <div className="flex gap-3 mb-6">
                        {slide.keys.map((key) => (
                          <div key={key.name} className="flex-1 text-center">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2", key.gradient)}>
                              <Lock className="h-5 w-5 text-white" />
                            </div>
                            <p className="font-medium text-sm">{key.name}</p>
                            <p className="text-xs text-muted-foreground">{key.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Flow */}
                    {slide.flow && (
                      <div className="space-y-3 mb-6">
                        {slide.flow.map((step, i) => (
                          <div key={step.step} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-base text-white text-sm font-bold flex items-center justify-center">
                              {step.step}
                            </div>
                            <step.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{step.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Features */}
                    {slide.features && (
                      <div className="space-y-2 mb-6">
                        {slide.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-seed flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quote */}
                    {slide.quote && (
                      <p className="text-sm text-muted-foreground italic text-center py-4 border-t border-border/50">
                        {slide.quote}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50 flex items-center justify-between">
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
                  {currentSlide === slides.length - 1 ? (
                    slide.cta || 'Get Started'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
