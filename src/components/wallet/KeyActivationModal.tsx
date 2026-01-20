import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Sprout, Shield, Rocket, CheckCircle2, Lock, 
  X, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { createKey, getKeyByUserId } from '@/lib/supabase/demoApi';
import { createCommitment } from '@/lib/supabase/commitmentsApi';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useHaptic } from '@/hooks/useHaptic';
import { projectionData } from '@/data/mockData';
import { Confetti } from '@/components/shared/Confetti';

interface KeyActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyType: 'SeedKey' | 'BaseKey' | 'MissionKey';
  onSuccess?: () => void;
}

export function KeyActivationModal({ isOpen, onClose, keyType, onSuccess }: KeyActivationModalProps) {
  const [step, setStep] = useState<'info' | 'commit' | 'apply' | 'success'>('info');
  const [commitAmount, setCommitAmount] = useState(100);
  const [commitYears, setCommitYears] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const haptic = useHaptic();
  const { refreshUserData } = useUser();

  const getCurrentUserId = (): string | null => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  };

  const keyInfo = {
    SeedKey: {
      icon: Sprout,
      title: 'SeedKey',
      color: 'text-seed',
      bgColor: 'bg-seed/10',
      gradient: 'gradient-seed',
      description: 'Commit seed to lock in your impact and earn distributions.',
      requirement: 'Requires a seed commitment',
    },
    BaseKey: {
      icon: Shield,
      title: 'BaseKey',
      color: 'text-trust',
      bgColor: 'bg-trust/10',
      gradient: 'gradient-trust',
      description: 'Govern seedbases and vote on fund allocations.',
      requirement: 'Requires approval from existing trustees',
    },
    MissionKey: {
      icon: Rocket,
      title: 'MissionKey',
      color: 'text-envoy',
      bgColor: 'bg-envoy/10',
      gradient: 'gradient-envoy',
      description: 'Lead missions and submit harvest reports.',
      requirement: 'Requires approval from seedbase trustees',
    },
  };

  const info = keyInfo[keyType];
  const Icon = info.icon;

  // Projection calculations
  const projectedDistribution = commitAmount * 0.08 * commitYears;
  const impactMultiplier = projectionData.networkMultiplier;
  const livesImpacted = Math.round(commitAmount * projectionData.impactPerDollar / 100);
  const networkGrowth = commitAmount * impactMultiplier;

  const handleProceed = () => {
    haptic.light();
    if (keyType === 'SeedKey') {
      setStep('commit');
    } else {
      setStep('apply');
    }
  };

  const handleActivateSeedKey = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error('Please sign in first');
      return;
    }

    setIsSubmitting(true);
    haptic.medium();

    try {
      // Create the commitment
      const commitment = await createCommitment({
        user_id: userId,
        amount: commitAmount,
        years: commitYears,
      });

      if (!commitment) {
        throw new Error('Failed to create commitment');
      }

      // Create the SeedKey
      const key = await createKey(userId, 'SeedKey');
      if (!key) {
        throw new Error('Failed to create key');
      }

      // Refresh user data
      await refreshUserData();
      
      setShowConfetti(true);
      haptic.success();
      setStep('success');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

    } catch (err) {
      console.error('Error activating SeedKey:', err);
      toast.error('Failed to activate SeedKey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error('Please sign in first');
      return;
    }

    setIsSubmitting(true);
    haptic.medium();

    try {
      // For demo purposes, we'll just create the key directly
      const key = await createKey(userId, keyType);
      if (!key) {
        throw new Error('Failed to create key');
      }

      await refreshUserData();
      
      setShowConfetti(true);
      haptic.success();
      setStep('success');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

    } catch (err) {
      console.error('Error applying for key:', err);
      toast.error('Failed to apply for key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('info');
    setCommitAmount(100);
    setCommitYears(1);
    onClose();
    if (step === 'success' && onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      {showConfetti && <Confetti isActive={showConfetti} />}
      
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", info.bgColor)}>
                <Icon className={cn("h-4 w-4", info.color)} />
              </div>
              Activate {info.title}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* Info Step */}
            {step === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className={cn("p-4 rounded-xl", info.bgColor)}>
                  <p className="text-sm">{info.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>{info.requirement}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceed}
                  className={cn(
                    "w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2",
                    info.gradient
                  )}
                >
                  {keyType === 'SeedKey' ? 'Commit Seed' : 'Apply Now'}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Commit Step (SeedKey only) */}
            {step === 'commit' && (
              <motion.div
                key="commit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Amount Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Commit Amount</label>
                    <span className="text-lg font-bold text-primary">${commitAmount}</span>
                  </div>
                  <Slider
                    value={[commitAmount]}
                    onValueChange={([val]) => setCommitAmount(val)}
                    min={10}
                    max={10000}
                    step={10}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$10</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Years Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Lock Period</label>
                    <span className="text-lg font-bold text-primary">{commitYears} year{commitYears > 1 ? 's' : ''}</span>
                  </div>
                  <Slider
                    value={[commitYears]}
                    onValueChange={([val]) => setCommitYears(val)}
                    min={1}
                    max={5}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 year</span>
                    <span>5 years</span>
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Projected Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Est. Distribution</p>
                      <p className="font-bold text-primary">${projectedDistribution.toFixed(2)}/yr</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Impact Multiplier</p>
                      <p className="font-bold text-primary">{impactMultiplier.toFixed(1)}x</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Lives Impacted</p>
                      <p className="font-bold text-primary">~{livesImpacted}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Network Growth</p>
                      <p className="font-bold text-primary">+${networkGrowth.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleActivateSeedKey}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#0000ff] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Committing...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Commit ${commitAmount} for {commitYears} Year{commitYears > 1 ? 's' : ''}
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => setStep('info')}
                  className="w-full py-2 text-muted-foreground text-sm"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Apply Step (BaseKey/MissionKey) */}
            {step === 'apply' && (
              <motion.div
                key="apply"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    {keyType === 'BaseKey' 
                      ? 'In a full implementation, this would submit an application to existing trustees for approval. For demo purposes, your key will be activated immediately.'
                      : 'In a full implementation, this would submit an application to seedbase trustees for approval. For demo purposes, your key will be activated immediately.'}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50",
                    info.gradient
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Activate {info.title}
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => setStep('info')}
                  className="w-full py-2 text-muted-foreground text-sm"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-6 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className={cn("w-20 h-20 mx-auto rounded-2xl flex items-center justify-center", info.gradient)}
                >
                  <Key className="h-10 w-10 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold">{info.title} Activated!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {keyType === 'SeedKey' 
                      ? `You've committed $${commitAmount} for ${commitYears} year${commitYears > 1 ? 's' : ''}`
                      : 'You now have access to new capabilities'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-seed">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Key is now active</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-primary text-white font-medium"
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