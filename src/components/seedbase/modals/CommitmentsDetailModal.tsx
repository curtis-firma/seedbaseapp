import { motion } from 'framer-motion';
import { TrendingUp, Sprout, Users, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

interface CommitmentsDetailModalProps {
  open: boolean;
  onClose: () => void;
  recentTotal: number;
  onCommitSeed?: () => void;
}

// Mock recent commitments
const recentCommitments = [
  { id: 'c1', user: '@emma', amount: 500, years: 3, timestamp: new Date(Date.now() - 1800000) },
  { id: 'c2', user: '@david', amount: 1000, years: 5, timestamp: new Date(Date.now() - 7200000) },
  { id: 'c3', user: '@john', amount: 250, years: 2, timestamp: new Date(Date.now() - 14400000) },
  { id: 'c4', user: '@sarah', amount: 750, years: 4, timestamp: new Date(Date.now() - 43200000) },
  { id: 'c5', user: '@marcus', amount: 2000, years: 5, timestamp: new Date(Date.now() - 86400000) },
];

export function CommitmentsDetailModal({ open, onClose, recentTotal, onCommitSeed }: CommitmentsDetailModalProps) {
  const totalCommitters = new Set(recentCommitments.map(c => c.user)).size;
  const avgYears = recentCommitments.reduce((sum, c) => sum + c.years, 0) / recentCommitments.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Recent Commitments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl border border-border/50 p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-500" />
              <p className="text-lg font-bold text-purple-500">+${recentTotal.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-3 text-center">
              <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{totalCommitters}</p>
              <p className="text-xs text-muted-foreground">Activators</p>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-3 text-center">
              <Calendar className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-bold">{avgYears.toFixed(1)}y</p>
              <p className="text-xs text-muted-foreground">Avg Lock</p>
            </div>
          </div>

          {/* Commitment List */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {recentCommitments.map((commitment, i) => (
                <motion.div
                  key={commitment.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full gradient-seed flex items-center justify-center">
                    <Sprout className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {commitment.user} locked ${commitment.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {commitment.years} year{commitment.years > 1 ? 's' : ''} • {formatDistanceToNow(commitment.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => { onClose(); onCommitSeed?.(); }}
            className="w-full py-3 rounded-xl gradient-seed text-white font-medium"
          >
            Commit Your Seed
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
