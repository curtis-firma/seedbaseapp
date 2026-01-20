import { motion } from 'framer-motion';
import { Layers, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProvisionDetailModalProps {
  open: boolean;
  onClose: () => void;
  balance: number;
  onAllocate?: () => void;
  onGive?: () => void;
}

// Mock recent transactions
const recentTransactions = [
  { id: 't1', type: 'in', label: 'Tithe from @emma', amount: 500, date: new Date(Date.now() - 3600000) },
  { id: 't2', type: 'out', label: 'Allocated to Water Wells', amount: 2000, date: new Date(Date.now() - 86400000) },
  { id: 't3', type: 'in', label: 'Offering from @david', amount: 250, date: new Date(Date.now() - 172800000) },
  { id: 't4', type: 'out', label: 'Emergency: Medical Supplies', amount: 1500, date: new Date(Date.now() - 259200000) },
  { id: 't5', type: 'in', label: 'Monthly tithe pool', amount: 3200, date: new Date(Date.now() - 345600000) },
];

export function ProvisionDetailModal({ open, onClose, balance, onAllocate, onGive }: ProvisionDetailModalProps) {
  const totalIn = recentTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = recentTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            Provision Pool
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border border-blue-500/20">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border/50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">This Week In</span>
              </div>
              <p className="text-lg font-bold text-emerald-500">+${totalIn.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">This Week Out</span>
              </div>
              <p className="text-lg font-bold text-orange-500">-${totalOut.toLocaleString()}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                      tx.type === 'in' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                    )}>
                      {tx.type === 'in' ? '+' : '-'}
                    </div>
                    <span className="text-sm">{tx.label}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    tx.type === 'in' ? "text-emerald-500" : "text-orange-500"
                  )}>
                    {tx.type === 'in' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { onClose(); onGive?.(); }}
              className="flex-1 py-3 rounded-xl border border-border bg-background font-medium"
            >
              Give to Pool
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { onClose(); onAllocate?.(); }}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-medium"
            >
              Allocate Funds
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
