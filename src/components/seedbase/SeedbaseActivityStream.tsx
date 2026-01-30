import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Layers, Vote, Sprout, TrendingUp, FileText, 
  UserCheck, DollarSign, CheckCircle, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type ActivityType = 
  | 'mission_launched' 
  | 'provision_allocated' 
  | 'vote_opened' 
  | 'vote_closed' 
  | 'commitment_added' 
  | 'harvest_submitted' 
  | 'envoy_update'
  | 'envoy_approved'
  | 'funds_requested';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  actor?: { name: string; avatar: string };
}

const iconMap: Record<ActivityType, LucideIcon> = {
  mission_launched: Target,
  provision_allocated: Layers,
  vote_opened: Vote,
  vote_closed: CheckCircle,
  commitment_added: Sprout,
  harvest_submitted: TrendingUp,
  envoy_update: FileText,
  envoy_approved: UserCheck,
  funds_requested: DollarSign,
};

const colorMap: Record<ActivityType, string> = {
  mission_launched: 'bg-primary text-white',
  provision_allocated: 'bg-primary text-white',
  vote_opened: 'bg-orange-500 text-white',
  vote_closed: 'bg-emerald-500 text-white',
  commitment_added: 'bg-green-500 text-white',
  harvest_submitted: 'bg-purple-500 text-white',
  envoy_update: 'bg-indigo-500 text-white',
  envoy_approved: 'bg-teal-500 text-white',
  funds_requested: 'bg-amber-500 text-white',
};

interface SeedbaseActivityStreamProps {
  items: ActivityItem[];
  maxItems?: number;
}

export function SeedbaseActivityStream({ items, maxItems = 10 }: SeedbaseActivityStreamProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Seedbase Activity
        </h3>
        <span className="text-xs text-muted-foreground">
          <Clock className="h-3 w-3 inline mr-1" />
          Live
        </span>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => {
            const Icon = iconMap[item.type];
            const colorClass = colorMap[item.type];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                layout
                className={cn(
                  "flex items-start gap-3 p-4",
                  index !== displayItems.length - 1 && "border-b border-border/30"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    {item.amount && (
                      <span className="text-sm font-semibold text-primary shrink-0">
                        ${item.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="p-8 text-center">
            <Sprout className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Initial mock activity for demo purposes
export const initialSeedbaseActivity: ActivityItem[] = [
  {
    id: 'init-1',
    type: 'commitment_added',
    title: 'New Commitment',
    description: '@emma locked $500 into Christ is King Seedbase',
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    amount: 500,
  },
  {
    id: 'init-2',
    type: 'harvest_submitted',
    title: 'Harvest Report Submitted',
    description: '@sarah submitted Week 12 harvest for Water Wells Uganda',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 'init-3',
    type: 'provision_allocated',
    title: 'Funds Allocated',
    description: '$2,000 allocated to Mobile Classrooms Initiative',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    amount: 2000,
  },
  {
    id: 'init-4',
    type: 'vote_opened',
    title: 'New Vote Opened',
    description: 'Q1 Mission Priorities - Cast your vote now',
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
  },
  {
    id: 'init-5',
    type: 'mission_launched',
    title: 'Mission Launched',
    description: 'School Supplies Drive now active in Kenya',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 'init-6',
    type: 'envoy_approved',
    title: 'Envoy Approved',
    description: '@marcus approved as Envoy for Healthcare Access',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
  },
];
