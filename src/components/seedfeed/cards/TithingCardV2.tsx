import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Flame, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TithingCardV2Props {
  currentAmount: number;
  goalAmount: number;
  month: string;
  streak?: number;
  daysRemaining: number;
  className?: string;
}

export function TithingCardV2({
  currentAmount,
  goalAmount,
  month,
  streak = 0,
  daysRemaining,
  className = '',
}: TithingCardV2Props) {
  const navigate = useNavigate();
  const progressPercent = Math.min((currentAmount / goalAmount) * 100, 100);
  const isComplete = currentAmount >= goalAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-border bg-card overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-base/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-base" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{month} Tithing</h4>
            <span className="text-xs text-muted-foreground">
              {daysRemaining} days remaining
            </span>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 rounded-lg">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">{streak}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-foreground">
              ${currentAmount.toLocaleString()}
            </span>
            <span className="text-muted-foreground ml-1">
              / ${goalAmount.toLocaleString()}
            </span>
          </div>
          <span className={`text-sm font-medium ${isComplete ? 'text-seed' : 'text-muted-foreground'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${isComplete ? 'bg-seed' : 'bg-base'}`}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/app/wallet')}
          className={`
            w-full flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl font-medium text-sm
            transition-colors
            ${isComplete 
              ? 'bg-seed/10 text-seed border border-seed/30' 
              : 'bg-primary text-primary-foreground'
            }
          `}
        >
          {isComplete ? (
            <>
              <TrendingUp className="w-4 h-4" />
              Goal Reached! 
            </>
          ) : (
            <>
              Add Funds
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default TithingCardV2;
