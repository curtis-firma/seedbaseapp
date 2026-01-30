import { motion } from 'framer-motion';
import { Vote, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';

interface ActiveVote {
  id: string;
  title: string;
  yesPercent: number;
  totalVoters: number;
  deadline: string;
}

const activeVotes: ActiveVote[] = [
  { id: 'v1', title: 'Increase Events Budget 5%', yesPercent: 75, totalVoters: 89, deadline: '3 days' },
  { id: 'v2', title: 'New Outreach Partner', yesPercent: 86, totalVoters: 64, deadline: '5 days' },
  { id: 'v3', title: 'Q2 Mission Allocation', yesPercent: 92, totalVoters: 112, deadline: '7 days' },
];

export function QuickVoteCard() {
  const navigate = useNavigate();
  const haptic = useHaptic();

  const handleNavigate = () => {
    haptic.medium();
    navigate('/app/governance');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden mb-4"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Vote className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Active Votes</h3>
              <p className="text-xs text-muted-foreground">Shape how funds are allocated</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
            {activeVotes.length} open
          </div>
        </div>
      </div>

      {/* Vote Previews */}
      <div className="p-3 space-y-2">
        {activeVotes.slice(0, 2).map((vote) => (
          <div key={vote.id} className="p-3 rounded-xl bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium truncate flex-1 mr-2">{vote.title}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{vote.deadline}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 rounded-full overflow-hidden flex bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${vote.yesPercent}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - vote.yesPercent}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-destructive/50"
              />
            </div>
            
            <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
              <span className="text-primary font-medium">{vote.yesPercent}% Yes</span>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{vote.totalVoters} voted</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-3 pb-3">
        <motion.button
          onClick={handleNavigate}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="
            w-full py-2.5 rounded-xl font-medium text-sm
            bg-primary text-white
            shadow-[0_0_12px_hsl(var(--primary)/0.3)]
            hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]
            transition-all flex items-center justify-center gap-2
          "
        >
          See All & Vote
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default QuickVoteCard;
