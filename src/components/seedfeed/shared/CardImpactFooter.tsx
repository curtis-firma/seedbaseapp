import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

interface CardImpactFooterProps {
  totalAmount: number;
  yourSeed?: number;
  yourPercentage?: number;
  missionName?: string;
  className?: string;
}

export function CardImpactFooter({
  totalAmount,
  yourSeed,
  yourPercentage,
  missionName,
  className = '',
}: CardImpactFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        flex items-center justify-between py-3 px-4
        bg-muted/50 rounded-xl border border-border/50
        ${className}
      `}
    >
      {/* Total Amount */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
          <span className="text-sm font-bold text-foreground">
            ${totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Your Seed */}
      {yourSeed !== undefined && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-seed/10 rounded-xl border border-seed/20"
        >
          <Sparkles className="w-4 h-4 text-seed" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Your Seed</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-seed">${yourSeed.toLocaleString()}</span>
              {yourPercentage !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({yourPercentage.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default CardImpactFooter;
