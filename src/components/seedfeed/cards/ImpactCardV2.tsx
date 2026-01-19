import { motion } from 'framer-motion';
import { Droplets, Utensils, Users, GraduationCap, Heart, Home, Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { YourShareBadge } from '../shared/YourShareBadge';

interface HarvestMetric {
  label: string;
  value: string | number;
  icon: string;
}

interface ImpactCardV2Props {
  missionName: string;
  status: 'deploying' | 'active' | 'completed';
  fundingProgress: number;
  fundingGoal: number;
  fundingRaised: number;
  harvestMetrics?: HarvestMetric[];
  yourShare?: number;
  imageUrl?: string;
  className?: string;
}

const harvestIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-4 h-4" />,
  meals: <Utensils className="w-4 h-4" />,
  people: <Users className="w-4 h-4" />,
  students: <GraduationCap className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  homes: <Home className="w-4 h-4" />,
  farms: <Leaf className="w-4 h-4" />,
  default: <Heart className="w-4 h-4" />,
};

const statusStyles = {
  deploying: {
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    label: 'Deploying',
  },
  active: {
    bg: 'bg-seed',
    text: 'text-seed',
    label: 'Active',
  },
  completed: {
    bg: 'bg-primary',
    text: 'text-primary',
    label: 'Completed',
  },
};

export function ImpactCardV2({
  missionName,
  status,
  fundingProgress,
  fundingGoal,
  fundingRaised,
  harvestMetrics = [],
  yourShare,
  imageUrl,
  className = '',
}: ImpactCardV2Props) {
  const navigate = useNavigate();
  const statusStyle = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-border bg-card overflow-hidden
        ${className}
      `}
    >
      {/* Status Accent Bar */}
      <div className={`h-1 ${statusStyle.bg}`} />

      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">{missionName}</h4>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg}/10 ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              ${fundingRaised.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              of ${fundingGoal.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fundingProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${statusStyle.bg}`}
            />
          </div>
        </div>
      </div>

      {/* Harvest Metrics */}
      {harvestMetrics.length > 0 && (
        <div className="p-4 pt-3">
          <div className="grid grid-cols-3 gap-2">
            {harvestMetrics.slice(0, 3).map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col items-center p-2 bg-muted/50 rounded-lg"
              >
                <div className={`${statusStyle.text} mb-1`}>
                  {harvestIcons[metric.icon] || harvestIcons.default}
                </div>
                <span className="text-sm font-bold text-foreground">{metric.value}</span>
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        {yourShare !== undefined && (
          <YourShareBadge amount={yourShare} variant="compact" />
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/app/seedbase')}
          className="
            flex items-center gap-1 px-3 py-1.5
            text-sm font-medium text-primary
            hover:bg-primary/10 rounded-lg transition-colors
            ml-auto
          "
        >
          View Mission
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ImpactCardV2;
