import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sprout, Rocket, 
  Shield, Users, CheckCircle2, ChevronDown, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Role data with full content from the Claude artifact
const roleData = {
  activator: {
    icon: Sprout,
    gradient: 'gradient-seed',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    title: 'Activator',
    tagline: 'Plant generosity. Watch it grow.',
    who: 'Anyone who wants to give and see their impact multiply',
    whatYouDo: [
      'Commit USDC as seed (any amount, 1-5 years)',
      'Watch your seed appreciate as the network grows',
      'Share impact moments to X or Base Feed',
      'Bring others into the network',
      'Track all impact in real time',
    ],
    whatYouGet: [
      'Original seed returned after commitment period',
      'Earn from surplus distributions',
      'Affiliate rewards for network growth',
      'Higher impact score = larger distributions',
      'Complete visibility into where your seed goes',
    ],
    perfectFor: 'Church members, mission supporters, anyone who wants generosity that compounds',
  },
  trustee: {
    icon: Shield,
    gradient: 'gradient-trust',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    title: 'Trustee',
    tagline: 'Steward shared generosity.',
    who: 'Community leaders, nonprofit directors, church leaders, impact coordinators',
    whatYouDo: [
      'Steward a Seedbase (community anchor)',
      'Launch and approve missions',
      'Select and support Envoys (field partners)',
      'Review impact reports (Harvests)',
      'Build trust through accountability',
    ],
    whatYouDont: [
      'Spend pooled seed directly',
      'Withdraw surplus for personal use',
      'Override smart contract distributions',
      'Make unilateral decisions',
    ],
    whatYouGet: [
      'Tools to mobilize your community',
      'Reputation as a trusted steward',
      'Visibility across the network',
      'Impact at scale',
    ],
    perfectFor: 'Leaders who want to turn shared generosity into measurable results',
  },
  envoy: {
    icon: Rocket,
    gradient: 'gradient-envoy',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    title: 'Envoy',
    tagline: 'Execute missions. Deliver impact.',
    who: 'Field partners, project leaders, missionaries, on-the-ground implementers',
    whatYouDo: [
      'Receive mission funding (USDC directly to you)',
      'Execute approved initiatives',
      'Submit Harvests (impact reports with proof)',
      'Show what generosity made possible',
      'Build reputation through delivery',
    ],
    whatYouGet: [
      'Direct funding without bureaucracy',
      'Community backing and support',
      'Tools to tell your impact story',
      'More missions as you prove results',
    ],
    requirements: [
      'Sponsorship by a Trustee',
      'Clear mission proposal',
      'Commitment to transparency',
      'Regular reporting (Harvests)',
    ],
    perfectFor: 'People doing real work who need sustainable, predictable support',
  },
};

type RoleKey = keyof typeof roleData;
type RoleData = typeof roleData[RoleKey];

// Animation variants
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

const glowVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    boxShadow: '0 0 0 transparent',
  },
  animate: (glowColor: string) => ({
    opacity: 1,
    scale: 1,
    boxShadow: [
      '0 0 0 transparent',
      `0 0 20px ${glowColor}`,
      '0 0 0 transparent',
    ],
    transition: {
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
      boxShadow: { duration: 1.2, times: [0, 0.5, 1] }
    }
  }),
};

const slides = [
  {
    id: 'intro',
    title: 'Impact you can see.',
    subtitle: 'Where generosity compounds.',
    content: 'Seedbase is a network where your giving creates shared impact. Plant a seed, grow it with others, and follow how value flows to missions.',
    hasHowItWorks: true,
  },
  {
    id: 'grow-impact',
    title: 'Grow Your Impact',
    subtitle: 'Your network multiplies your generosity',
    content: 'Connect your X or Base App profile. As your network grows, so does your impact score—and your share of surplus distributions.',
    icon: Rocket,
    gradient: 'gradient-envoy',
    hasGrowDetails: true,
  },
  {
    id: 'roles',
    title: 'How to Participate',
    subtitle: 'Three roles, one mission',
    hasRoles: true,
    hasProgressIndicator: true,
  },
  {
    id: 'technical',
    title: 'Under the Hood',
    subtitle: 'How it actually works',
    content: 'Curious about the mechanics? Explore the technical details below.',
    hasTechnicalDropdowns: true,
  },
  {
    id: 'cta',
    title: 'Ready to Plant Your First Seed?',
    subtitle: 'Your generosity journey starts here',
    content: 'Explore the feed, discover missions, and commit your first seed.',
    icon: Sprout,
    gradient: 'gradient-seed',
    isFinal: true,
    quote: '"Locked value. Living impact."',
  },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<RoleKey | null>(null);
  const { trigger } = useHaptic();
  const slide = slides[currentSlide];

  const handleNext = () => {
    trigger('light');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setExpandedDropdown(null);
      setExpandedRole(null);
    } else {
      trigger('success');
      onClose();
    }
  };

  const handlePrev = () => {
    trigger('light');
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setExpandedDropdown(null);
      setExpandedRole(null);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    setExpandedDropdown(null);
    setExpandedRole(null);
    onClose();
  };

  const handleSkip = () => {
    trigger('light');
    setCurrentSlide(0);
    setExpandedDropdown(null);
    setExpandedRole(null);
    onClose();
  };

  const toggleDropdown = (id: string) => {
    trigger('light');
    setExpandedDropdown(expandedDropdown === id ? null : id);
  };

  const toggleRole = (role: RoleKey) => {
    trigger('medium');
    setExpandedRole(expandedRole === role ? null : role);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={slideTransition}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden shadow-elevated h-full md:h-auto max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === currentSlide ? 24 : 8,
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
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 30, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.98 }}
                    transition={slideTransition}
                  >
                    {/* Icon */}
                    {slide.icon && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          boxShadow: [
                            '0 0 0 transparent',
                            '0 0 20px rgba(34, 197, 94, 0.3)',
                            '0 0 0 transparent',
                          ],
                        }}
                        transition={{ 
                          scale: { delay: 0.1 },
                          boxShadow: { duration: 1.5, repeat: 1 }
                        }}
                        className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", slide.gradient)}
                      >
                        <slide.icon className="h-8 w-8 text-white" />
                      </motion.div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-muted-foreground mb-6">{slide.subtitle}</p>

                    {/* Content */}
                    {slide.content && (
                      <p className="text-foreground/80 mb-6 leading-relaxed">{slide.content}</p>
                    )}

                    {/* How it works dropdown (Slide 1) */}
                    {slide.hasHowItWorks && (
                      <CollapsibleSection
                        id="how-it-works"
                        title="How it works"
                        isExpanded={expandedDropdown === 'how-it-works'}
                        onToggle={() => toggleDropdown('how-it-works')}
                      >
                        <div className="space-y-3 text-left">
                          <p className="text-sm text-foreground/80">
                            Your USDC purchases $CIK tokens which are locked in the Vault. 
                            As the network grows, seed appreciates. That appreciation creates surplus—you earn rewards, 
                            missions get funded, and your original seed is kept safe for return.
                          </p>
                          <p className="text-sm font-semibold italic text-foreground">
                            No crypto knowledge needed. Use your debit card or Apple Pay. Withdraw to your bank anytime.
                          </p>
                        </div>
                      </CollapsibleSection>
                    )}

                    {/* Grow details dropdown (Slide 2) */}
                    {slide.hasGrowDetails && (
                      <CollapsibleSection
                        id="grow-details"
                        title="How affiliate growth works"
                        isExpanded={expandedDropdown === 'grow-details'}
                        onToggle={() => toggleDropdown('grow-details')}
                      >
                        <div className="space-y-3 text-left">
                          <p className="text-sm text-foreground/80">
                            Connect your X or Base App profile to start building your impact network.
                          </p>
                          <ul className="space-y-2">
                            {[
                              'Every seed you plant increases your impact score',
                              'Bring others into the network to multiply your reach',
                              'Higher impact score = larger share of surplus distributions',
                            ].map((item, i) => (
                              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm font-semibold italic text-foreground pt-2">
                            Your network grows. Your impact compounds.
                          </p>
                        </div>
                      </CollapsibleSection>
                    )}

                    {/* Role Progress Indicator & Cards (Slide 3) */}
                    {slide.hasProgressIndicator && (
                      <div className="mb-6">
                        {/* Visual Progress Indicator */}
                        <div className="flex items-center justify-center gap-2 mb-6 px-4">
                          {(['activator', 'trustee', 'envoy'] as RoleKey[]).map((role, i) => {
                            const data = roleData[role];
                            const Icon = data.icon;
                            const isExpanded = expandedRole === role;
                            
                            return (
                              <div key={role} className="flex items-center">
                                <motion.div
                                  animate={{
                                    scale: isExpanded ? 1.1 : 1,
                                    boxShadow: isExpanded ? `0 0 16px ${data.glowColor}` : '0 0 0 transparent',
                                  }}
                                  className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                    isExpanded ? data.gradient : "bg-muted"
                                  )}
                                >
                                  <Icon className={cn("h-5 w-5", isExpanded ? "text-white" : "text-muted-foreground")} />
                                </motion.div>
                                {i < 2 && (
                                  <div className="w-8 h-0.5 bg-border mx-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground text-center mb-4">
                          Activator → Trustee → Envoy
                        </p>
                      </div>
                    )}

                    {slide.hasRoles && (
                      <div className="space-y-3">
                        {(['activator', 'trustee', 'envoy'] as RoleKey[]).map((roleKey, i) => (
                          <RoleCard
                            key={roleKey}
                            roleKey={roleKey}
                            data={roleData[roleKey]}
                            isExpanded={expandedRole === roleKey}
                            onToggle={() => toggleRole(roleKey)}
                            index={i}
                          />
                        ))}
                      </div>
                    )}

                    {/* Technical dropdowns (Slide 4) */}
                    {slide.hasTechnicalDropdowns && (
                      <div className="space-y-3">
                        <CollapsibleSection
                          id="usdc-flow"
                          title="USDC Flow"
                          isExpanded={expandedDropdown === 'usdc-flow'}
                          onToggle={() => toggleDropdown('usdc-flow')}
                        >
                          <div className="space-y-2 text-left text-sm text-foreground/80">
                            <p><strong>1.</strong> Commit USDC → Purchases $CIK tokens</p>
                            <p><strong>2.</strong> $CIK → Locked in the Vault</p>
                            <p><strong>3.</strong> Vault → Tracks on the Ledger</p>
                            <p><strong>4.</strong> Ledger → Records your ownership %</p>
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                          id="no-tokens"
                          title="You Never Hold Tokens"
                          isExpanded={expandedDropdown === 'no-tokens'}
                          onToggle={() => toggleDropdown('no-tokens')}
                        >
                          <div className="space-y-2 text-left text-sm text-foreground/80">
                            <p>Unlike crypto wallets, you never touch tokens directly. The $CIK you purchase is immediately locked.</p>
                            <p className="font-semibold italic">Simpler. Safer. Smarter.</p>
                          </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                          id="vault-ledger"
                          title="Vault vs Ledger"
                          isExpanded={expandedDropdown === 'vault-ledger'}
                          onToggle={() => toggleDropdown('vault-ledger')}
                        >
                          <div className="space-y-3 text-left text-sm text-foreground/80">
                            <div>
                              <p className="font-semibold text-foreground">The Vault</p>
                              <p>Holds locked $CIK. Enforces scarcity. No human access.</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">The Ledger</p>
                              <p>Tracks ownership %. Records distributions. Verifiable history.</p>
                            </div>
                            <p className="font-semibold italic">Two systems, one truth.</p>
                          </div>
                        </CollapsibleSection>
                      </div>
                    )}

                    {/* Quote (Final slide) */}
                    {slide.quote && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-muted-foreground italic text-center py-4 mt-4 border-t border-border/50"
                      >
                        {slide.quote}
                      </motion.p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                <div className="flex flex-col gap-3">
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
                      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium shadow-lg transition-colors"
                    >
                      {slide.isFinal ? 'Start Exploring' : 'Next'}
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  {/* Skip option for role slides */}
                  {(slide.hasRoles || slide.hasTechnicalDropdowns) && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleSkip}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-1"
                    >
                      Skip for now
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Collapsible Section Component
function CollapsibleSection({ 
  id, 
  title, 
  isExpanded, 
  onToggle, 
  children 
}: { 
  id: string; 
  title: string; 
  isExpanded: boolean; 
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <motion.button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
          isExpanded
            ? "border-primary bg-primary/10 text-primary"
            : "border-border hover:border-primary/50 bg-muted/50"
        )}
      >
        <span className="font-medium flex items-center gap-2">
          {title}
          {!isExpanded && (
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
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
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
              className="p-4"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Role Card Component with glow animation
function RoleCard({ 
  roleKey, 
  data, 
  isExpanded, 
  onToggle,
  index,
}: { 
  roleKey: RoleKey;
  data: RoleData;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = data.icon;

  return (
    <motion.div
      variants={glowVariants}
      initial="initial"
      animate="animate"
      custom={data.glowColor}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl overflow-hidden"
    >
      <motion.button
        onClick={onToggle}
        className={cn(
          "w-full p-4 rounded-xl border-2 transition-all text-left",
          isExpanded
            ? `border-primary ${data.gradient}`
            : "border-border hover:border-primary/50 bg-card"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isExpanded ? "bg-white/20" : data.gradient
            )}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={cn("font-semibold", isExpanded && "text-white")}>{data.title}</p>
              <p className={cn("text-sm", isExpanded ? "text-white/80" : "text-muted-foreground")}>
                {data.tagline}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={cn("h-5 w-5", isExpanded ? "text-white" : "text-muted-foreground")} />
          </motion.div>
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
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
              className={cn("p-4 space-y-4 text-left rounded-b-xl", data.gradient)}
            >
              {/* Who */}
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Who</p>
                <p className="text-sm text-white">{data.who}</p>
              </div>

              {/* What you do */}
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">What you do</p>
                <ul className="space-y-1.5">
                  {data.whatYouDo.map((item, i) => (
                    <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you DON'T do (Trustee only) */}
              {'whatYouDont' in data && Array.isArray((data as typeof roleData.trustee).whatYouDont) && (
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">What you DON'T do</p>
                  <ul className="space-y-1.5">
                    {(data as typeof roleData.trustee).whatYouDont.map((item, i) => (
                      <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-white/70 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What you get */}
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">What you get</p>
                <ul className="space-y-1.5">
                  {data.whatYouGet.map((item, i) => (
                    <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements (Envoy only) */}
              {'requirements' in data && Array.isArray((data as typeof roleData.envoy).requirements) && (
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {(data as typeof roleData.envoy).requirements.map((item, i) => (
                      <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perfect for */}
              <div className="pt-2 border-t border-white/20">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Perfect for</p>
                <p className="text-sm text-white italic">{data.perfectFor}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
