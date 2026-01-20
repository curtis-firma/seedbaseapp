import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

interface CardImpactFooterProps {
  totalAmount: number;
  yourSeed?: number;
  yourPercentage?: number;
  missionName?: string;
  onYourSeedClick?: () => void;
  className?: string;
}

export function CardImpactFooter({
  totalAmount,
  yourSeed,
  yourPercentage,
  missionName,
  onYourSeedClick,
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

      {/* Your Seed Impact - Now Interactive Button with emphasis */}
      {yourSeed !== undefined && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onYourSeedClick}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-primary/10 hover:bg-primary/20 
            border-2 border-primary/40 hover:border-primary/60
            rounded-xl cursor-pointer
            transition-all duration-200
            shadow-md hover:shadow-lg
            group
          "
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-primary font-medium">Your Seed Impact</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-primary">${yourSeed.toLocaleString()}</span>
              {yourPercentage !== undefined && (
                <span className="text-xs text-primary/70">
                  ({yourPercentage.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" />
        </motion.button>
      )}
    </motion.div>
  );
}

export default CardImpactFooter;
