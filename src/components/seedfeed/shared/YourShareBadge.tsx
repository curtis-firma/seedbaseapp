import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface YourShareBadgeProps {
  amount: number;
  percentage?: number;
  variant?: 'default' | 'compact' | 'overlay';
  className?: string;
}

export function YourShareBadge({
  amount,
  percentage,
  variant = 'default',
  className = '',
}: YourShareBadgeProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          inline-flex items-center gap-1 px-2 py-0.5
          bg-seed/10 text-seed rounded-full
          text-xs font-medium
          ${className}
        `}
      >
        <Sparkles className="w-3 h-3" />
        <span>${amount}</span>
      </motion.div>
    );
  }

  if (variant === 'overlay') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          absolute bottom-2 right-2
          px-2.5 py-1 rounded-lg
          bg-card/90 backdrop-blur-sm border border-border/50
          shadow-lg
          ${className}
        `}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-seed" />
          <span className="text-xs font-semibold text-foreground">
            Your Share: ${amount.toLocaleString()}
          </span>
          {percentage !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        bg-seed/10 border border-seed/20 rounded-xl
        ${className}
      `}
    >
      <Sparkles className="w-4 h-4 text-seed" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Your Share</span>
        <span className="text-sm font-bold text-seed">${amount.toLocaleString()}</span>
      </div>
      {percentage !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({percentage.toFixed(1)}%)</span>
      )}
    </motion.div>
  );
}

export default YourShareBadge;
