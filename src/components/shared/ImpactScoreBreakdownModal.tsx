import { motion } from 'framer-motion';
import { 
  TrendingUp, Share2, Heart, MessageSquare, Users, 
  Sprout, Award, Target, Zap, Info 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ImpactScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScoreAction {
  id: string;
  icon: typeof Share2;
  label: string;
  description: string;
  points: number;
  multiplier?: string;
  color: string;
  bgColor: string;
  yourCount: number;
  yourPoints: number;
}

const scoreActions: ScoreAction[] = [
  {
    id: 'share',
    icon: Share2,
    label: 'Share Impact',
    description: 'Share verified impact moments to X or Base',
    points: 50,
    multiplier: '×2 for first share',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    yourCount: 8,
    yourPoints: 450,
  },
  {
    id: 'commit',
    icon: Sprout,
    label: 'Commit Seed',
    description: 'Lock in seed commitments for the network',
    points: 100,
    multiplier: '+20 per year locked',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    yourCount: 3,
    yourPoints: 340,
  },
  {
    id: 'refer',
    icon: Users,
    label: 'Invite Seeders',
    description: 'Bring new seeders who commit seed',
    points: 200,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    yourCount: 2,
    yourPoints: 400,
  },
  {
    id: 'engage',
    icon: Heart,
    label: 'Engage with Feed',
    description: 'Like and comment on impact updates',
    points: 5,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    yourCount: 10,
    yourPoints: 50,
  },
];

const bonusMultipliers = [
  { label: 'Early Adopter', value: '1.5×', description: 'Joined before public launch' },
  { label: 'Consistency Streak', value: '1.2×', description: '7+ days of activity' },
  { label: 'Verified Sharer', value: '1.1×', description: 'Linked X account' },
];

export function ImpactScoreBreakdownModal({ isOpen, onClose }: ImpactScoreBreakdownModalProps) {
  const totalPoints = scoreActions.reduce((sum, a) => sum + a.yourPoints, 0);
  const baseScore = 1240;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block">Impact Score</span>
              <span className="block text-primary">Breakdown</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Current Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center"
          >
            <p className="text-sm text-muted-foreground mb-1">Your Total Impact Score</p>
            <motion.p 
              className="text-4xl font-bold text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {baseScore.toLocaleString()}
            </motion.p>
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span>+124 this week</span>
            </div>
          </motion.div>

          {/* Score Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Zap className="h-4 w-4" />
              How You Earn Points
            </h3>
            
            {scoreActions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-xl bg-muted/50 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", action.bgColor)}>
                    <action.icon className={cn("h-4 w-4", action.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{action.label}</p>
                      <span className="text-xs font-bold text-primary">+{action.points} pts</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                    {action.multiplier && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {action.multiplier}
                      </span>
                    )}
                  </div>
                </div>

                {/* Your progress for this action */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Your contribution</span>
                    <span className="font-medium">{action.yourCount}× = {action.yourPoints} pts</span>
                  </div>
                  <Progress value={(action.yourPoints / totalPoints) * 100} className="h-1.5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bonus Multipliers */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Award className="h-4 w-4" />
              Bonus Multipliers
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {bonusMultipliers.map((bonus, i) => (
                <motion.div
                  key={bonus.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center"
                >
                  <p className="text-lg font-bold text-primary">{bonus.value}</p>
                  <p className="text-xs font-medium">{bonus.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Impact scores are calculated daily. Only verified, proof-based actions count. 
              Spam or automation will result in score deduction.
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 rounded-xl gradient-seed text-white font-semibold"
          >
            Keep Growing
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
