import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';

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
  const navigate = useNavigate();
  const haptic = useHaptic();

  const handleImpactClick = () => {
    haptic.light();
    if (onYourSeedClick) {
      onYourSeedClick();
    } else {
      // Default navigation to vault/impact
      navigate('/app/vault');
    }
  };

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

      {/* Your Seed Impact - Premium Interactive Button */}
      {yourSeed !== undefined && (
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImpactClick}
          className="
            flex items-center gap-2.5 px-4 py-2.5
            bg-[#0000ff] hover:bg-[#0000dd]
            text-white
            rounded-xl cursor-pointer
            transition-all duration-200
            shadow-lg hover:shadow-xl
            group
            active:scale-95
          "
        >
          <Sparkles className="w-4 h-4 text-white/90" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-white/80 font-medium uppercase tracking-wide">Your Seed Impact</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">${yourSeed.toLocaleString()}</span>
              {yourPercentage !== undefined && (
                <span className="text-xs text-white/70 font-medium">
                  ({yourPercentage.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1" />
        </motion.button>
      )}
    </motion.div>
  );
}

export default CardImpactFooter;
