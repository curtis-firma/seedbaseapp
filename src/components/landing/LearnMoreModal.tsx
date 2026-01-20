import { motion, Variants } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetStarted: () => void;
}

const LearnMoreModal = ({ open, onOpenChange, onGetStarted }: LearnMoreModalProps) => {
  const handleGetStarted = () => {
    onOpenChange(false);
    onGetStarted();
  };

  const handleReadLightPaper = () => {
    window.open("https://claude.ai/public/artifacts/74db03fe-e309-4c96-a235-a7ee0f1a40a1", "_blank");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
  };

  const pillVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl border-0 bg-white shadow-2xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* Hero Headline */}
          <motion.h2 
            variants={itemVariants}
            className="text-2xl font-semibold tracking-tight text-foreground leading-tight"
          >
            Impact you can see.{" "}
            <span className="text-primary">Where generosity compounds.</span>
          </motion.h2>

          {/* Paragraph 1 */}
          <motion.p 
            variants={itemVariants}
            className="text-[15px] text-muted-foreground leading-relaxed"
          >
            Seedbase is a social network for generosity built on blockchain technology. When you commit USDC, it becomes seed—locked value that can't be sold or traded. As the network grows, seed appreciates. That growth creates surplus that automatically funds real missions worldwide.
          </motion.p>

          {/* Paragraph 2 */}
          <motion.p 
            variants={itemVariants}
            className="text-[15px] text-muted-foreground leading-relaxed"
          >
            You follow missions in real time and see verified Harvests (impact reports). As your seed grows in value, that appreciation creates surplus—you earn rewards, missions get funded, and your original seed is kept safe for return.
          </motion.p>

          {/* No crypto line */}
          <motion.p 
            variants={itemVariants}
            className="text-[15px] text-muted-foreground leading-relaxed"
          >
            No crypto knowledge needed. Use your debit card or Apple Pay to start. Deposit instantly to your bank account anytime.
          </motion.p>

          {/* Closing line */}
          <motion.p 
            variants={itemVariants}
            className="text-[15px] font-medium text-foreground leading-relaxed"
          >
            This is generosity that multiplies impact, not generosity that disappears.
          </motion.p>

          {/* How to Participate Section */}
          <motion.div variants={itemVariants} className="pt-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              How to Participate
            </h3>
            
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Activator */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-seed/10 text-seed">
                  🌱 Activators
                </span>
                <span className="text-sm text-muted-foreground">
                  Plant a seed. Watch it grow.
                </span>
              </motion.div>

              {/* Trustee */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-trust/10 text-trust">
                  ⛨ Trustees
                </span>
                <span className="text-sm text-muted-foreground">
                  Lead communities. Guide missions.
                </span>
              </motion.div>

              {/* Envoy */}
              <motion.div 
                variants={pillVariants}
                className="flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-envoy/10 text-envoy">
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
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 rounded-xl"
            >
              Get Started
            </Button>
            <Button
              onClick={handleReadLightPaper}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/5 font-medium h-11 rounded-xl gap-2"
            >
              Read Full Light Paper
              <ExternalLink className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
