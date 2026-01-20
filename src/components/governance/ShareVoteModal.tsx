import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ExternalLink, Share2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useHaptic } from '@/hooks/useHaptic';
import { useSocialHandles } from '@/hooks/useSocialHandles';
import { Confetti } from '@/components/shared/Confetti';

interface ShareVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  voteType: 'yes' | 'no';
  proposalTitle: string;
}

export function ShareVoteModal({ isOpen, onClose, voteType, proposalTitle }: ShareVoteModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const haptic = useHaptic();
  const { xHandle, baseHandle } = useSocialHandles();

  const caption = `Just voted ${voteType.toUpperCase()} on "${proposalTitle}" @seedbase! 🗳️

Helping shape how generosity flows onchain. Every vote counts. 🌱

#Seedbase #GovernanceOnchain #Web3Giving`;

  const handleCopy = () => {
    haptic.light();
    navigator.clipboard.writeText(caption);
    toast.success('Caption copied!');
  };

  const handleShareToX = () => {
    haptic.medium();
    const tweetText = encodeURIComponent(caption);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleShareToBase = () => {
    haptic.medium();
    const castText = encodeURIComponent(caption);
    window.open(`https://warpcast.com/~/compose?text=${castText}`, '_blank');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      {showConfetti && <Confetti isActive={showConfetti} />}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0000ff]/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-[#0000ff]" />
              </div>
              Vote Cast!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Vote Summary */}
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground mb-1">You voted</p>
              <span className={`text-2xl font-bold ${voteType === 'yes' ? 'text-[#0000ff]' : 'text-destructive'}`}>
                {voteType.toUpperCase()}
              </span>
              <p className="text-sm text-muted-foreground mt-2">on</p>
              <p className="font-medium mt-1">"{proposalTitle}"</p>
            </div>

            {/* Caption Preview */}
            <div>
              <label className="text-sm font-medium mb-2 block">Share your vote</label>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-sm whitespace-pre-wrap">
                {caption}
              </div>
            </div>

            {/* Connected Handles */}
            {(xHandle || baseHandle) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {xHandle && (
                  <span className="flex items-center gap-1">
                    <span className="font-bold">𝕏</span> @{xHandle.replace('@', '')}
                  </span>
                )}
                {baseHandle && (
                  <span className="flex items-center gap-1">
                    <span className="text-[#0000ff] font-bold">◆</span> @{baseHandle.replace('@', '')}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleShareToX}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-medium"
              >
                <span className="font-bold">𝕏</span>
                Share to X
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleShareToBase}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0000ff] text-white font-medium"
              >
                <span className="font-bold">◆</span>
                Share to Base
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 font-medium text-sm hover:bg-muted/50 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy Caption
            </motion.button>

            <button
              onClick={onClose}
              className="w-full py-2 text-muted-foreground text-sm"
            >
              Maybe Later
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}