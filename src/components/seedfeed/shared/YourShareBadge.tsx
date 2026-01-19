import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

interface YourShareBadgeProps {
  amount: number;
  percentage?: number;
  variant?: 'default' | 'compact' | 'overlay';
  onClick?: () => void;
  className?: string;
}

export function YourShareBadge({
  amount,
  percentage,
  variant = 'default',
  onClick,
  className = '',
}: YourShareBadgeProps) {
  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          inline-flex items-center gap-1 px-2.5 py-1
          bg-seed/10 hover:bg-seed/20 text-seed rounded-full
          text-xs font-medium
          border border-seed/20 hover:border-seed/40
          transition-all duration-200
          cursor-pointer shadow-sm hover:shadow-md
          group
          ${className}
        `}
      >
        <Sparkles className="w-3 h-3" />
        <span>${amount}</span>
        {onClick && <ChevronRight className="w-3 h-3 text-seed/60 group-hover:text-seed group-hover:translate-x-0.5 transition-all" />}
      </motion.button>
    );
  }

  if (variant === 'overlay') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          absolute bottom-2 right-2
          px-3 py-1.5 rounded-lg
          bg-card/90 hover:bg-card backdrop-blur-sm border border-border/50 hover:border-seed/40
          shadow-lg hover:shadow-xl
          cursor-pointer
          transition-all duration-200
          group
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
          {onClick && <ChevronRight className="w-3.5 h-3.5 text-seed/60 group-hover:text-seed group-hover:translate-x-0.5 transition-all ml-1" />}
        </div>
      </motion.button>
    );
  }

  // Default variant
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-2
        bg-seed/10 hover:bg-seed/20 border border-seed/20 hover:border-seed/40 rounded-xl
        cursor-pointer
        transition-all duration-200
        shadow-sm hover:shadow-md
        group
        ${className}
      `}
    >
      <Sparkles className="w-4 h-4 text-seed" />
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Your Share</span>
        <span className="text-sm font-bold text-seed">${amount.toLocaleString()}</span>
      </div>
      {percentage !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({percentage.toFixed(1)}%)</span>
      )}
      {onClick && <ChevronRight className="w-4 h-4 text-seed/60 group-hover:text-seed group-hover:translate-x-0.5 transition-all ml-1" />}
    </motion.button>
  );
}

export default YourShareBadge;
