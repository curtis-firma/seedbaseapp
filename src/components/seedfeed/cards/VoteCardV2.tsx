import { motion } from 'framer-motion';
import { Vote, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { useHaptic } from '@/hooks/useHaptic';

interface VoteCardV2Props {
  title: string;
  description?: string;
  seedbaseName: string;
  yesCount: number;
  noCount: number;
  deadline: string;
  hasVoted?: boolean;
  userVote?: 'yes' | 'no';
  onVote?: (vote: 'yes' | 'no') => void;
  className?: string;
}

export function VoteCardV2({
  title,
  description,
  seedbaseName,
  yesCount,
  noCount,
  deadline,
  hasVoted: initialHasVoted = false,
  userVote: initialUserVote,
  onVote,
  className = '',
}: VoteCardV2Props) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [yesVotes, setYesVotes] = useState(yesCount);
  const [noVotes, setNoVotes] = useState(noCount);
  const haptic = useHaptic();

  const totalVotes = yesVotes + noVotes;
  const yesPercent = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 50;
  const noPercent = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 50;

  const handleVote = (vote: 'yes' | 'no') => {
    if (hasVoted) return;
    haptic.medium();
    setHasVoted(true);
    setUserVote(vote);
    if (vote === 'yes') {
      setYesVotes(yesVotes + 1);
    } else {
      setNoVotes(noVotes + 1);
    }
    onVote?.(vote);
  };

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
      <div className="p-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <span className="text-xs text-muted-foreground">{seedbaseName}</span>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="p-4">
        <div className="h-3 rounded-full overflow-hidden flex bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${yesPercent}%` }}
            transition={{ duration: 0.5 }}
            className="bg-seed"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${noPercent}%` }}
            transition={{ duration: 0.5 }}
            className="bg-destructive"
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-seed font-medium">Yes: {yesVotes}</span>
          <span className="text-destructive font-medium">No: {noVotes}</span>
        </div>
      </div>

      {/* Vote Buttons or Result */}
      <div className="px-4 pb-4">
        {hasVoted ? (
          <div className="text-center py-2 text-sm text-muted-foreground">
            You voted <span className={userVote === 'yes' ? 'text-seed' : 'text-destructive'}>
              {userVote === 'yes' ? 'Yes' : 'No'}
            </span>
          </div>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('yes')}
              className="
                flex-1 py-2.5 rounded-xl font-medium
                bg-seed/10 text-seed border border-seed/30
                hover:bg-seed/20 transition-colors
              "
            >
              Vote Yes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('no')}
              className="
                flex-1 py-2.5 rounded-xl font-medium
                bg-destructive/10 text-destructive border border-destructive/30
                hover:bg-destructive/20 transition-colors
              "
            >
              Vote No
            </motion.button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{totalVotes + 1} voters</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{deadline}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default VoteCardV2;
