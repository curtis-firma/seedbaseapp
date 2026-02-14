import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, ShieldCheck, Ban, Bot, Award, Trophy, Info, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ImpactLeaderboard } from './ImpactLeaderboard';
import { ImpactScoreBreakdownModal } from './ImpactScoreBreakdownModal';

interface AffiliateExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo handles used across the app
export const DEMO_SOCIAL_HANDLES = {
  x: '@SeedbaseImpact',
  base: '@seedbase',
};

const principleItems = [
  {
    icon: ShieldCheck,
    title: 'Proof-Based Only',
    description: 'Your impact score grows when you share REAL verified impact events, not empty promotions.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Ban,
    title: 'No MLM',
    description: 'No pyramids, no recruitment bonuses. Your score reflects direct verifiable impact.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Ban,
    title: 'No Spam',
    description: 'Sharing once is better than spamming. Quality over quantity is rewarded.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Bot,
    title: 'No Auto-Posting',
    description: 'Every share is intentional. Bots and automation don\'t grow your impact score.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function AffiliateExplainerModal({ isOpen, onClose }: AffiliateExplainerModalProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block">How Seeders</span>
                <span className="block text-primary">Grow the Network</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Impact Score Preview - Now clickable for breakdown */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBreakdown(true)}
              className="w-full text-left bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 hover:border-primary/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Your Impact Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                    Demo
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">1,240</p>
              <p className="text-sm text-muted-foreground">
                Tap to see how your score is calculated
              </p>
            </motion.button>

            {/* Live Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-muted/30 rounded-2xl p-4"
            >
              <ImpactLeaderboard maxEntries={5} />
            </motion.div>

            {/* Core Principles - Collapsed into grid */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Core Principles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {principleItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50"
                  >
                    <div className={cn("p-1.5 rounded-lg", item.bgColor)}>
                      <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                    </div>
                    <p className="font-medium text-xs">{item.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Affiliate Pool */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/50 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-seed" />
                <span className="font-semibold">Affiliate Pool</span>
                <span className="text-xs bg-seed/20 text-seed px-2 py-1 rounded-full font-medium ml-auto">
                  Demo
                </span>
              </div>
              <p className="text-2xl font-bold text-seed mb-1">$84,000</p>
              <p className="text-sm text-muted-foreground">
                Distributed to top seeders monthly based on impact score
              </p>
            </motion.div>

            {/* Demo Handles Reference */}
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Official Seedbase Handles</p>
              <div className="flex items-center justify-center gap-4 text-sm font-medium">
                <span>X: {DEMO_SOCIAL_HANDLES.x}</span>
                <span className="text-muted-foreground">·</span>
                <span>Base: {DEMO_SOCIAL_HANDLES.base}</span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 rounded-xl gradient-seed text-white font-semibold"
            >
              Got It
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Score Breakdown Modal */}
      <ImpactScoreBreakdownModal 
        isOpen={showBreakdown} 
        onClose={() => setShowBreakdown(false)} 
      />
    </>
  );
}

// Small info button component for inline usage
export function AffiliateInfoButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-1 rounded-full hover:bg-muted transition-colors"
      title="How Affiliates Work"
    >
      <Info className="h-4 w-4 text-muted-foreground" />
    </motion.button>
  );
}
