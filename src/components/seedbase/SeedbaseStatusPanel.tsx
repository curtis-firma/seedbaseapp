import { motion } from 'framer-motion';
import { Target, Vote, Calendar, Layers, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusData {
  missions: number;
  votes: number;
  nextDistribution: string;
  provisionPool: number;
  recentCommitments: number;
}

interface SeedbaseStatusPanelProps {
  data: StatusData;
  onTileClick: (tileId: string) => void;
}

const statusTiles = [
  { id: 'missions', label: 'Missions Active', icon: Target, color: 'text-primary' },
  { id: 'votes', label: 'Votes Pending', icon: Vote, color: 'text-orange-500', hasAction: true },
  { id: 'distribution', label: 'Next Distribution', icon: Calendar, color: 'text-emerald-500' },
  { id: 'provision', label: 'Provision Pool', icon: Layers, color: 'text-blue-500' },
  { id: 'commitments', label: 'Recent Commitments', icon: TrendingUp, color: 'text-purple-500' },
];

export function SeedbaseStatusPanel({ data, onTileClick }: SeedbaseStatusPanelProps) {
  const getValue = (id: string) => {
    switch (id) {
      case 'missions': return data.missions.toString();
      case 'votes': return data.votes.toString();
      case 'distribution': return data.nextDistribution;
      case 'provision': return `$${data.provisionPool.toLocaleString()}`;
      case 'commitments': return `+$${data.recentCommitments.toLocaleString()}`;
      default: return '0';
    }
  };

  const getSubtext = (id: string) => {
    switch (id) {
      case 'distribution': return 'Est. next month';
      case 'commitments': return 'This week';
      default: return null;
    }
  };

  return (
    <div className="px-4 py-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        System Status
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusTiles.map((tile, index) => {
          const subtext = getSubtext(tile.id);
          return (
            <motion.button
              key={tile.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTileClick(tile.id)}
              className={cn(
                "bg-card rounded-xl border border-border/50 p-4 text-left",
                "hover:border-primary/30 hover:shadow-md transition-all",
                "flex flex-col gap-1 relative group"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <tile.icon className={cn("h-4 w-4", tile.color)} />
                <span className="text-xs text-muted-foreground">{tile.label}</span>
              </div>
              <p className="text-xl font-bold">{getValue(tile.id)}</p>
              {subtext && (
                <p className="text-xs text-muted-foreground">{subtext}</p>
              )}
              
              {tile.hasAction && data.votes > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full block animate-pulse" />
                </div>
              )}
              
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
