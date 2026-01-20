import { motion } from 'framer-motion';
import { Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
}

interface MilestoneCardV2Props {
  title: string;
  missionName: string;
  heroValue: string | number;
  heroLabel: string;
  stats?: StatItem[];
  imageUrl?: string;
  className?: string;
}

export function MilestoneCardV2({
  title,
  missionName,
  heroValue,
  heroLabel,
  stats = [],
  imageUrl,
  className = '',
}: MilestoneCardV2Props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        rounded-xl border border-seed/30 bg-gradient-to-br from-seed/5 to-transparent
        overflow-hidden
        ${className}
      `}
    >
      {/* Celebration Header */}
      <div className="bg-seed/10 px-4 py-3 flex items-center gap-3 border-b border-seed/20">
        <div className="w-10 h-10 rounded-full bg-seed/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-seed" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{title}</span>
            <CheckCircle2 className="w-4 h-4 text-seed" />
          </div>
          <span className="text-xs text-muted-foreground">{missionName}</span>
        </div>
      </div>

      {/* Hero Metric */}
      <div className="p-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <span className="text-4xl font-bold text-seed">{heroValue}</span>
          <p className="text-sm text-muted-foreground mt-1">{heroLabel}</p>
        </motion.div>
      </div>

      {/* Supporting Stats Grid */}
      {stats.length > 0 && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {stats.slice(0, 3).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="text-center p-2 bg-muted/50 rounded-lg"
              >
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/app/vault')}
          className="
            w-full flex items-center justify-center gap-2
            py-2.5 px-4 rounded-xl
            bg-primary text-white
            font-medium text-sm
            hover:bg-primary/90 transition-colors
            shadow-sm
          "
        >
          See Dashboard
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default MilestoneCardV2;
