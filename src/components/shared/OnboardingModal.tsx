import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sprout, Layers, Rocket, 
  Shield, DollarSign, Users, Lock, Heart, TrendingUp,
  CheckCircle2, FileText, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 'usdc-flow',
    title: 'USDC → Vault → $CIK → Ledger',
    subtitle: 'The complete flow',
    content: 'Your USDC purchases $CIK tokens which are locked in the Vault. The Ledger tracks your ownership and distributions. You never hold tokens—the protocol manages everything.',
    icon: DollarSign,
    gradient: 'gradient-seed',
    flow: [
      { step: 1, label: 'Commit USDC', icon: DollarSign },
      { step: 2, label: 'USDC purchases $CIK', icon: Sprout },
      { step: 3, label: '$CIK locked in Vault', icon: Lock },
      { step: 4, label: 'Ledger tracks your share', icon: Layers },
    ],
  },
  {
    id: 'no-tokens',
    title: 'You Never Hold Tokens',
    subtitle: 'Simpler. Safer. Smarter.',
    content: 'Unlike crypto wallets, you never touch tokens directly. The $CIK you purchase is immediately locked in the Vault. The smart contract handles all conversions and distributions automatically.',
    icon: Shield,
    gradient: 'gradient-trust',
    features: [
      'No wallet management required',
      'No gas fees or token transfers',
      'Automatic distribution to your account',
      'Principle blocked until commitment ends',
    ],
  },
  {
    id: 'vault-vs-ledger',
    title: 'Vault vs. Ledger',
    subtitle: 'Two systems, one truth',
    content: 'The Vault holds locked $CIK (purchased with your USDC). The Ledger tracks your share and pending distributions. Both are transparent and verifiable on-chain.',
    icon: Layers,
    gradient: 'gradient-base',
    comparison: [
      { 
        title: 'The Vault', 
        icon: Lock,
        points: ['Holds locked $CIK tokens', 'Enforces supply control', 'No human access to locked seed', 'Creates value through scarcity']
      },
      { 
        title: 'The Ledger', 
        icon: FileText,
        points: ['Tracks your ownership %', 'Records distributions', 'Calculates your surplus share', 'Verifiable history']
      },
    ],
  },
  {
    id: 'roles-explained',
    title: 'Activator / Trustee / Envoy',
    subtitle: 'Three roles, one mission',
    content: null,
    roles: [
      {
        name: 'Activator',
        icon: Sprout,
        gradient: 'gradient-seed',
        description: 'Commit USDC, lock $CIK, activate generosity. Your locked value grows the network.',
      },
      {
        name: 'Trustee',
        icon: Shield,
        gradient: 'gradient-trust',
        description: 'Govern Seedbases, approve missions, ensure accountability. Stewards of the community.',
      },
      {
        name: 'Envoy',
        icon: Rocket,
        gradient: 'gradient-envoy',
        description: 'Execute missions on the ground, receive distributions, report verified outcomes.',
      },
    ],
  },
  {
    id: 'surplus',
    title: 'How Surplus is Calculated',
    subtitle: 'Your share of the growth',
    content: 'When the Vault generates yield, surplus is calculated based on your locked commitment. Larger commitments = larger distributions. Surplus flows to missions you support.',
    icon: TrendingUp,
    gradient: 'gradient-seed',
    features: [
      'Yield generated from locked $CIK',
      'Your share = your locked % of total',
      'Automatic distribution to missions',
      'Transparent calculation on-chain',
    ],
    quote: '"Commitment creates capacity."',
  },
  {
    id: 'harvests',
    title: 'Harvests & Transparency Days',
    subtitle: 'Real outcomes, real accountability',
    content: 'Envoys submit weekly Harvest reports with verified impact metrics. Trustees review and approve. On Transparency Days, all fund flows are published for community review.',
    icon: FileText,
    gradient: 'gradient-envoy',
    features: [
      'Weekly impact reports from the field',
      'Photos, metrics, and testimonies',
      'Trustee verification required',
      'Monthly transparency publications',
    ],
  },
  {
    id: 'network',
    title: 'Your Seed Flows Through the Network',
    subtitle: 'Connected generosity',
    content: 'Every seed you plant connects to missions across the network. Your locked $CIK value helps fund real impact—tracked, verified, and transparent.',
    icon: Network,
    gradient: 'gradient-base',
    cta: 'Start Exploring',
    quote: '"Locked value. Living impact."',
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

                    {/* Flow */}
                    {slide.flow && (
                      <div className="space-y-3 mb-6">
                        {slide.flow.map((step, i) => (
                          <motion.div
                            key={step.step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full gradient-base text-white text-sm font-bold flex items-center justify-center">
                              {step.step}
                            </div>
                            <step.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm">{step.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Comparison */}
                    {slide.comparison && (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {slide.comparison.map((item, i) => (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-muted/50 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <item.icon className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-sm">{item.title}</span>
                            </div>
                            <ul className="space-y-1">
                              {item.points.map((point, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Roles */}
                    {slide.roles && (
                      <div className="space-y-3 mb-6">
                        {slide.roles.map((role, i) => (
                          <motion.div
                            key={role.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-muted/50 rounded-xl p-4"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.gradient)}>
                                <role.icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-semibold">{role.name}</span>
                            </div>
                            <p className="text-sm text-foreground/80">{role.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Features */}
                    {slide.features && (
                      <div className="space-y-2 mb-6">
                        {slide.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-seed flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
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
                    slide.cta || 'Start Exploring'
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
