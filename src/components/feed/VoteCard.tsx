import { motion } from 'framer-motion';
import { Vote, Check, X, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface VoteCardProps {
  id: string;
  title: string;
  description: string;
  yesVotes: number;
  noVotes: number;
  deadline: string;
  seedbaseName: string;
  onVote?: (vote: 'yes' | 'no') => void;
}

export function VoteCard({
  id,
  title,
  description,
  yesVotes,
  noVotes,
  deadline,
  seedbaseName,
  onVote,
}: VoteCardProps) {
  const { isKeyActive } = useUser();
  const hasBaseKey = isKeyActive('BaseKey');
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4 relative overflow-hidden",
        hasBaseKey ? "bg-trust/5 border-trust/30" : "bg-muted/50 border-dashed border-muted"
      )}
    >
      {/* Locked Overlay */}
      {!hasBaseKey && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            <span className="text-xs font-medium">BaseKey Required to Vote</span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Vote className="h-4 w-4 text-trust" />
          <span className="text-xs text-trust font-medium">{seedbaseName}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {deadline}
        </div>
      </div>
      
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      {/* Vote Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-seed" />
            <span className="text-xs font-medium">{yesVotes} Yes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">{noVotes} No</span>
            <X className="h-3 w-3 text-destructive" />
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-seed transition-all"
            style={{ width: `${yesPercentage}%` }}
          />
          <div 
            className="h-full bg-destructive transition-all"
            style={{ width: `${100 - yesPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Vote Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!hasBaseKey}
          onClick={() => onVote?.('yes')}
          className="py-2 rounded-lg bg-seed/10 text-seed font-medium text-sm disabled:opacity-50"
        >
          Vote Yes
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!hasBaseKey}
          onClick={() => onVote?.('no')}
          className="py-2 rounded-lg bg-destructive/10 text-destructive font-medium text-sm disabled:opacity-50"
        >
          Vote No
        </motion.button>
      </div>
    </motion.div>
  );
}
