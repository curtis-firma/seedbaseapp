import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, ShieldCheck, Ban, Bot, Award, Trophy, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block">How Activators</span>
              <span className="block text-primary">Grow the Network</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Impact Score Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">Your Impact Score</span>
              </div>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                Demo
              </span>
            </div>
            <p className="text-3xl font-bold text-primary mb-1">1,240</p>
            <p className="text-sm text-muted-foreground">
              Earned by sharing verified impact moments
            </p>
          </motion.div>

          {/* Core Principles */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Core Principles
            </h3>
            {principleItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className={cn("p-2 rounded-lg", item.bgColor)}>
                  <item.icon className={cn("h-4 w-4", item.color)} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Affiliate Pool */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              Distributed to top activators monthly based on impact score
            </p>
          </motion.div>

          {/* Leaderboard Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border border-dashed border-border rounded-2xl p-4 text-center"
          >
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="font-semibold">Leaderboard</p>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
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
