import { useState } from "react";
import { motion, Variants, AnimatePresence, PanInfo } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Rocket, Check, X, ArrowLeft } from "lucide-react";

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetStarted: () => void;
}

type RoleType = 'activator' | 'trustee' | 'envoy' | null;

const roleData = {
  activator: {
    emoji: "🌱",
    title: "Activators",
    tagline: "Plant a seed. Watch it grow. Share impact and earn.",
    who: "Anyone who wants to give and see their impact multiply",
    whatYouDo: [
      "Commit USDC as seed (any amount, 1-5 years)",
      "Watch your seed appreciate as the network grows",
      "Share impact moments to X or Base Feed",
      "Bring others into the network",
      "Track all impact in real time"
    ],
    whatYouGet: [
      "Original seed returned after commitment period",
      "Earn from surplus distributions",
      "Affiliate rewards for network growth",
      "Higher impact score = larger distributions",
      "Complete visibility into where your seed goes"
    ],
    perfectFor: "Church members, mission supporters, anyone who wants generosity that compounds",
    bgColor: "bg-seed/5",
    borderColor: "border-seed/20",
    glowColor: "rgba(34, 197, 94, 0.4)"
  },
  trustee: {
    emoji: "⛨",
    title: "Trustees",
    tagline: "Lead communities. Guide missions with transparency.",
    who: "Community leaders, nonprofit directors, church leaders, impact coordinators",
    whatYouDo: [
      "Steward a Seedbase (community anchor)",
      "Launch and approve missions",
      "Select and support Envoys (field partners)",
      "Review impact reports (Harvests)",
      "Build trust through accountability"
    ],
    whatYouDont: [
      "Spend pooled seed directly",
      "Withdraw surplus for personal use",
      "Override smart contract distributions",
      "Make unilateral decisions"
    ],
    whatYouGet: [
      "Tools to mobilize your community",
      "Reputation as a trusted steward",
      "Visibility across the network",
      "Impact at scale"
    ],
    perfectFor: "Leaders who want to turn shared generosity into measurable results",
    bgColor: "bg-trust/5",
    borderColor: "border-trust/20",
    glowColor: "rgba(168, 85, 247, 0.4)"
  },
  envoy: {
    emoji: "🚀",
    title: "Envoys",
    tagline: "Execute on the ground. Deliver impact.",
    who: "Field partners, project leaders, missionaries, on-the-ground implementers",
    whatYouDo: [
      "Receive mission funding (USDC directly to you)",
      "Execute approved initiatives",
      "Submit Harvests (impact reports with proof)",
      "Show what generosity made possible",
      "Build reputation through delivery"
    ],
    whatYouGet: [
      "Direct funding without bureaucracy",
      "Community backing and support",
      "Tools to tell your impact story",
      "More missions as you prove results"
    ],
    requirements: [
      "Sponsorship by a Trustee",
      "Clear mission proposal",
      "Commitment to transparency",
      "Regular reporting (Harvests)"
    ],
    perfectFor: "People doing real work who need sustainable, predictable support",
    bgColor: "bg-envoy/5",
    borderColor: "border-envoy/20",
    glowColor: "rgba(249, 115, 22, 0.4)"
  }
};

const LearnMoreModal = ({ open, onOpenChange, onGetStarted }: LearnMoreModalProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAffiliate, setShowAffiliate] = useState(false);
  const [openRole, setOpenRole] = useState<RoleType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLightPaper, setShowLightPaper] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleGetStarted = () => {
    setIsLoading(true);
    onOpenChange(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsLoading(false);
      onGetStarted();
    }, 300);
  };

  const handleReadLightPaper = () => {
    setShowLightPaper(true);
  };

  const toggleRole = (role: RoleType) => {
    setOpenRole(openRole === role ? null : role);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (glowColor: string) => ({ 
      opacity: 1, 
      scale: 1,
      boxShadow: [
        `0 0 0 ${glowColor.replace('0.4', '0')}`,
        `0 0 16px ${glowColor}`,
        `0 0 0 ${glowColor.replace('0.4', '0')}`
      ],
      transition: { 
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        boxShadow: { duration: 1.2, times: [0, 0.5, 1], delay: 0.2 }
      }
    }),
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="fixed inset-0 left-0 top-0 translate-x-0 translate-y-0 max-w-none w-full h-full overflow-hidden p-0 rounded-none border-0 bg-background shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[600px] sm:w-[calc(100%-2rem)] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <AnimatePresence mode="wait">
          {showLightPaper ? (
            <motion.div
              key="lightpaper"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Light Paper Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
                <button
                  onClick={() => {
                    setShowLightPaper(false);
                    setIframeLoading(true);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Back to overview"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground">Light Paper</span>
                <div className="flex-1" />
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              {/* Light Paper Content */}
              <div className="relative flex-1">
                {iframeLoading && (
                  <div className="absolute inset-0 p-6 space-y-4 bg-background">
                    <div className="h-16 bg-muted rounded-xl shimmer" />
                    <div className="h-4 bg-muted rounded w-3/4 shimmer" />
                    <div className="h-4 bg-muted rounded w-full shimmer" />
                    <div className="h-4 bg-muted rounded w-5/6 shimmer" />
                    <div className="h-32 bg-muted rounded-xl shimmer" />
                    <div className="h-4 bg-muted rounded w-2/3 shimmer" />
                    <div className="h-4 bg-muted rounded w-full shimmer" />
                    <div className="h-24 bg-muted rounded-xl shimmer" />
                  </div>
                )}
                <iframe
                  src="/SB_LightPaper.html"
                  className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                  title="Seedbase Light Paper"
                  onLoad={() => setIframeLoading(false)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              className="h-full sm:h-auto overflow-y-auto overflow-x-hidden p-5 sm:p-6 w-full"
            >
              {/* Mobile Header with Close Button */}
              <div className="flex items-center justify-between -mt-2 mb-3 sm:hidden">
                <div className="w-8" /> {/* Spacer for centering */}
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 w-full"
          >
          {/* Hero Headline */}
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-tight"
          >
            Impact you can see.{" "}
            <span className="text-primary">Where generosity compounds.</span>
          </motion.h2>

          {/* Main Summary */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed"
          >
            Seedbase is a social network for generosity. Commit USDC, it becomes seed that grows. 
            That growth funds real missions worldwide—and you follow every dollar in real time.
          </motion.p>

          {/* How it works Dropdown */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showDetails 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-muted/30 hover:bg-muted/50 text-foreground'
              }`}
            >
              <span className="text-sm font-medium flex items-center gap-1.5">
                {showDetails ? "Hide details" : "How it works"}
                {!showDetails && (
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
            </button>
            
            <AnimatePresence mode="wait">
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.2, delay: showDetails ? 0.1 : 0 }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    className="pt-3 space-y-3 text-sm text-muted-foreground leading-relaxed"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                  >
                    <p>
                      As the network grows, seed appreciates. That appreciation creates surplus—you earn rewards, 
                      missions get funded, and your original seed is kept safe for return.
                    </p>
                    <p className="font-semibold italic">
                      No crypto knowledge needed. Use your debit card or Apple Pay. Withdraw to your bank anytime.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Affiliate Dropdown with Rocket */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowAffiliate(!showAffiliate)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showAffiliate 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-muted/30 hover:bg-muted/50 text-foreground'
              }`}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Grow your impact
                {!showAffiliate && (
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAffiliate ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
            </button>
            
            <AnimatePresence mode="wait">
              {showAffiliate && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.2, delay: showAffiliate ? 0.1 : 0 }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div 
                    className="pt-3 space-y-3 text-sm text-muted-foreground leading-relaxed"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                  >
                    <p>
                      <strong className="text-foreground">Connect your X or Base App profile</strong> to share impact moments with one click.
                    </p>
                    <p>
                      Each person who commits through your link increases your <strong className="text-foreground">impact score</strong> and your share of distributions.
                    </p>
                    <p className="text-primary font-medium">
                      Your network grows. Your impact compounds.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Closing line */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-[15px] font-medium text-foreground"
          >
            Generosity that multiplies—not disappears.
          </motion.p>

          {/* How to Participate Section */}
          <motion.div variants={itemVariants} className="pt-1">
            <h3 className="text-base font-semibold text-foreground mb-3">
              How to Participate
            </h3>
            
            <motion.div 
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Activator Card */}
              <RoleCard 
                role="activator" 
                data={roleData.activator}
                isOpen={openRole === 'activator'}
                onToggle={() => toggleRole('activator')}
                glowVariants={glowVariants}
              />

              {/* Trustee Card */}
              <RoleCard 
                role="trustee" 
                data={roleData.trustee}
                isOpen={openRole === 'trustee'}
                onToggle={() => toggleRole('trustee')}
                glowVariants={glowVariants}
              />

              {/* Envoy Card */}
              <RoleCard 
                role="envoy" 
                data={roleData.envoy}
                isOpen={openRole === 'envoy'}
                onToggle={() => toggleRole('envoy')}
                glowVariants={glowVariants}
              />
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex gap-3 pt-2"
          >
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
            <Button
              onClick={handleReadLightPaper}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5 font-medium h-11 rounded-xl gap-1.5"
            >
              <span className="hidden sm:inline">Read Light Paper</span>
              <span className="sm:hidden">Light Paper</span>
            </Button>
          </motion.div>
        </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

interface RoleCardProps {
  role: 'activator' | 'trustee' | 'envoy';
  data: typeof roleData.activator | typeof roleData.trustee | typeof roleData.envoy;
  isOpen: boolean;
  onToggle: () => void;
  glowVariants: Variants;
}

const RoleCard = ({ role, data, isOpen, onToggle, glowVariants }: RoleCardProps) => {
  return (
    <motion.div
      variants={glowVariants}
      custom={data.glowColor}
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        isOpen 
          ? `${data.bgColor} ${data.borderColor}` 
          : 'border-border bg-background hover:bg-muted/30'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{data.emoji}</span>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-foreground block">{data.title}</span>
            <span className="text-xs text-muted-foreground truncate block">{data.tagline}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, delay: 0.1 }
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 text-sm">
              {/* Who */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              >
                <span className="font-medium text-foreground">Who: </span>
                <span className="text-muted-foreground">{data.who}</span>
              </motion.div>

              {/* What you do */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.15 }}
              >
                <span className="font-medium text-foreground block mb-1">What you do:</span>
                <ul className="space-y-1">
                  {data.whatYouDo.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-2 text-muted-foreground"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + i * 0.04 }}
                    >
                      <Check className="w-3.5 h-3.5 text-seed flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* What you DON'T do (Trustees only) */}
              {'whatYouDont' in data && data.whatYouDont && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.35 }}
                >
                  <span className="font-medium text-foreground block mb-1">What you DON'T do:</span>
                  <ul className="space-y-1">
                    {data.whatYouDont.map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-2 text-muted-foreground"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 + i * 0.04 }}
                      >
                        <X className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* What you get */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.45 }}
              >
                <span className="font-medium text-foreground block mb-1">What you get:</span>
                <ul className="space-y-1">
                  {data.whatYouGet.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-2 text-muted-foreground"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.5 + i * 0.04 }}
                    >
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Requirements (Envoys only) */}
              {'requirements' in data && data.requirements && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.6 }}
                >
                  <span className="font-medium text-foreground block mb-1">Requirements:</span>
                  <ul className="space-y-1">
                    {data.requirements.map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-2 text-muted-foreground"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.65 + i * 0.04 }}
                      >
                        <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-center text-xs">•</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Perfect for */}
              <motion.div 
                className="pt-1 border-t border-border/50"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <span className="font-medium text-foreground">Perfect for: </span>
                <span className="text-muted-foreground">{data.perfectFor}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LearnMoreModal;
