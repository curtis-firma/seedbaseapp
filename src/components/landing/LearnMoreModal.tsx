import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, Loader2 } from "lucide-react";

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetStarted: () => void;
}

const LearnMoreModal = ({ open, onOpenChange, onGetStarted }: LearnMoreModalProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    onOpenChange(false);
    // Smooth scroll to top before showing login
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Delay login modal to allow scroll to complete
    setTimeout(() => {
      setIsLoading(false);
      onGetStarted();
    }, 300);
  };

  const handleReadLightPaper = () => {
    window.open("https://claude.ai/public/artifacts/74db03fe-e309-4c96-a235-a7ee0f1a40a1", "_blank");
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

  const pillVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-5 sm:p-6 rounded-2xl border-0 bg-white shadow-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Hero Headline */}
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-tight"
          >
            Impact you can see.{" "}
            <span className="text-primary">Where generosity compounds.</span>
          </motion.h2>

          {/* Main Summary - Always visible */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed"
          >
            Seedbase is a social network for generosity. Commit USDC, it becomes seed that grows. 
            That growth funds real missions worldwide—and you follow every dollar in real time.
          </motion.p>

          {/* Expandable Details */}
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
                    <p>
                      No crypto knowledge needed. Use your debit card or Apple Pay. Withdraw to your bank anytime.
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
              {/* Activator */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-seed/10 text-seed">
                  🌱 Activators
                </span>
                <span className="text-sm text-muted-foreground">
                  Plant a seed. Watch it grow.
                </span>
              </motion.div>

              {/* Trustee */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-trust/10 text-trust">
                  ⛨ Trustees
                </span>
                <span className="text-sm text-muted-foreground">
                  Lead communities. Guide missions.
                </span>
              </motion.div>

              {/* Envoy */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-envoy/10 text-envoy">
                  🚀 Envoys
                </span>
                <span className="text-sm text-muted-foreground">
                  Execute on the ground. Deliver impact.
                </span>
              </motion.div>
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
              <ExternalLink className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
