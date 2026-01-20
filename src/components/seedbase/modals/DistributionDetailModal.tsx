import { motion } from 'framer-motion';
import { Calendar, Wallet, TrendingUp, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addMonths } from 'date-fns';

interface DistributionDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimatedAmount: string;
}

// Mock distribution history
const distributionHistory = [
  { id: 'd1', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: 420, recipients: 145 },
  { id: 'd2', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), amount: 385, recipients: 142 },
  { id: 'd3', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), amount: 398, recipients: 138 },
];

export function DistributionDetailModal({ open, onClose, estimatedAmount }: DistributionDetailModalProps) {
  const nextDistributionDate = addMonths(new Date(), 1);
  const totalDistributed = distributionHistory.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Next Distribution
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Next Distribution Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Estimated Next</span>
            </div>
            <p className="text-3xl font-bold text-emerald-500 mb-1">{estimatedAmount}</p>
            <p className="text-sm text-muted-foreground">
              {format(nextDistributionDate, 'MMMM d, yyyy')}
            </p>
          </div>

          {/* Your Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border/50 p-4">
              <Wallet className="h-4 w-4 text-primary mb-2" />
              <p className="text-2xl font-bold">$5,000</p>
              <p className="text-xs text-muted-foreground">Your Locked Seed</p>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-4">
              <TrendingUp className="h-4 w-4 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold">8%</p>
              <p className="text-xs text-muted-foreground">Annual Rate</p>
            </div>
          </div>

          {/* Distribution History */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Distributions</h4>
            <div className="space-y-2">
              {distributionHistory.map((dist, i) => (
                <motion.div
                  key={dist.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{format(dist.date, 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">{dist.recipients} recipients</p>
                  </div>
                  <span className="text-emerald-500 font-semibold">+${dist.amount}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Total Received</p>
            <p className="text-2xl font-bold">${totalDistributed.toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
