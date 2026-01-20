import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, TrendingUp, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Confetti } from '@/components/shared/Confetti';
import { useToast } from '@/hooks/use-toast';
import { createCommitment } from '@/lib/supabase/commitmentsApi';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface CommitSeedModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
  currentLocked?: number;
}

export function CommitSeedModal({ open, onClose, onSuccess, currentLocked = 5000 }: CommitSeedModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'amount' | 'confirm' | 'success'>('amount');
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Projections based on 8% annual distribution
  const annualDistribution = amount * 0.08;
  const totalDistribution = annualDistribution * years;
  const impactMultiplier = 1 + (years * 0.15);
  const livesImpacted = Math.round(amount * 0.45 * impactMultiplier);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    const userId = localStorage.getItem('demo_user_id') || 'demo-user';
    await createCommitment({ user_id: userId, amount, years });
    
    setShowConfetti(true);
    setStep('success');
    setIsSubmitting(false);
    
    toast({
      title: "Seed Committed!",
      description: `You locked $${amount.toLocaleString()} for ${years} years`,
    });

    // Add activity
    onSuccess({
      id: `commit-${Date.now()}`,
      type: 'commitment_added',
      title: 'Seed Committed',
      description: `You locked $${amount.toLocaleString()} into Christ is King Seedbase`,
      timestamp: new Date(),
      amount,
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClose = () => {
    setStep('amount');
    setAmount(1000);
    setYears(3);
    onClose();
  };

  const newTotal = currentLocked + amount;
  const networkTotal = 429000;
  const yourPercentage = ((newTotal / (networkTotal + amount)) * 100).toFixed(2);

  return (
    <>
      <Confetti isActive={showConfetti} />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              Commit Seed
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 'amount' && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Before State */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Your Current Locked Seed</p>
                  <p className="text-2xl font-bold">${currentLocked.toLocaleString()}</p>
                </div>

                {/* Amount Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Commit Amount</span>
                    <span className="text-lg font-bold text-primary">${amount.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={([val]) => setAmount(val)}
                    min={100}
                    max={10000}
                    step={100}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$100</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Years Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Lock Duration</span>
                    <span className="text-lg font-bold text-primary">{years} years</span>
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={([val]) => setYears(val)}
                    min={1}
                    max={5}
                    step={1}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 year</span>
                    <span>5 years</span>
                  </div>
                </div>

                {/* After State Preview */}
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Your New Locked Seed</p>
                  <p className="text-2xl font-bold text-primary">
                    ${currentLocked.toLocaleString()} + ${amount.toLocaleString()} = ${newTotal.toLocaleString()}
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seedbase Weight</span>
                      <span className="font-medium">{yourPercentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full gradient-seed"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(parseFloat(yourPercentage) * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Projections */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">${Math.round(annualDistribution)}</p>
                    <p className="text-xs text-muted-foreground">Annual Dist.</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Sparkles className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                    <p className="text-lg font-bold">{impactMultiplier.toFixed(1)}x</p>
                    <p className="text-xs text-muted-foreground">Multiplier</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Users className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                    <p className="text-lg font-bold">{livesImpacted}</p>
                    <p className="text-xs text-muted-foreground">Lives</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setStep('confirm')}
                  className="w-full py-3 rounded-xl gradient-seed text-white font-medium flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-muted/50 rounded-xl p-6 text-center">
                  <Sprout className="h-12 w-12 mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-1">Confirm Your Commitment</h3>
                  <p className="text-muted-foreground">
                    Lock <span className="font-bold text-foreground">${amount.toLocaleString()}</span> for{' '}
                    <span className="font-bold text-foreground">{years} years</span>
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Total Distribution</span>
                    <span className="font-medium">${Math.round(totalDistribution).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Projected Lives Impacted</span>
                    <span className="font-medium">{livesImpacted}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Unlock Date</span>
                    <span className="font-medium">
                      {new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('amount')}
                    className="flex-1 py-3 rounded-xl border border-border bg-background font-medium"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 py-3 rounded-xl gradient-seed text-white font-medium",
                      isSubmitting && "opacity-70"
                    )}
                  >
                    {isSubmitting ? 'Committing...' : 'Commit Seed'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full gradient-seed flex items-center justify-center"
                >
                  <Sprout className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Seed Planted! 🌱</h3>
                <p className="text-muted-foreground mb-6">
                  Your ${amount.toLocaleString()} commitment is now growing impact.
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl gradient-seed text-white font-medium"
                >
                  Done
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
