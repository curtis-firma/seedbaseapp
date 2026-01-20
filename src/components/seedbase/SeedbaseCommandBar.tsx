import { motion } from 'framer-motion';
import { 
  Sprout, Heart, Vote, Target, Layers, UserCheck, 
  FileText, TrendingUp, DollarSign 
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface SeedbaseCommandBarProps {
  onAction: (action: string) => void;
  activeVotes: number;
}

const actionsByRole = {
  activator: [
    { id: 'commit-seed', label: 'Commit Seed', icon: Sprout, gradient: 'gradient-seed' },
    { id: 'give-provision', label: 'Give to Provision', icon: Heart, gradient: 'bg-primary' },
    { id: 'vote', label: 'Vote', icon: Vote, gradient: 'gradient-base', showBadge: true },
  ],
  trustee: [
    { id: 'launch-mission', label: 'Launch Mission', icon: Target, gradient: 'gradient-base' },
    { id: 'allocate-provision', label: 'Allocate', icon: Layers, gradient: 'bg-primary' },
    { id: 'approve-envoy', label: 'Approve Envoy', icon: UserCheck, gradient: 'gradient-envoy' },
  ],
  envoy: [
    { id: 'post-update', label: 'Post Update', icon: FileText, gradient: 'gradient-envoy' },
    { id: 'submit-harvest', label: 'Submit Harvest', icon: TrendingUp, gradient: 'bg-primary' },
    { id: 'request-funds', label: 'Request Funds', icon: DollarSign, gradient: 'gradient-base' },
  ],
};

export function SeedbaseCommandBar({ onAction, activeVotes }: SeedbaseCommandBarProps) {
  const { viewRole } = useUser();
  const actions = actionsByRole[viewRole];

  return (
    <div className="px-4 py-3 bg-card/50 border-b border-border/30">
      <div className="flex gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.id)}
            className={cn(
              "flex-1 relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl",
              "text-white font-medium text-xs transition-all",
              action.gradient
            )}
          >
            <action.icon className="h-5 w-5" />
            <span className="leading-tight text-center">{action.label}</span>
            
            {/* Vote badge */}
            {action.showBadge && activeVotes > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {activeVotes}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
