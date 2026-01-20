import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Check, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface VotePendingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
  onVotesUpdated?: (count: number) => void;
}

// Mock active votes
const initialVotes = [
  {
    id: 'vote-1',
    title: 'Q1 Mission Priorities',
    description: 'Allocate 60% of Q1 provisions to water initiatives',
    yesVotes: 45,
    noVotes: 12,
    deadline: new Date(Date.now() + 86400000 * 3), // 3 days
    hasVoted: false,
  },
  {
    id: 'vote-2',
    title: 'New Envoy Application',
    description: 'Approve Marcus Okonkwo for Healthcare Outreach mission',
    yesVotes: 28,
    noVotes: 5,
    deadline: new Date(Date.now() + 86400000 * 5),
    hasVoted: false,
  },
];

export function VotePendingModal({ open, onClose, onSuccess, onVotesUpdated }: VotePendingModalProps) {
  const { toast } = useToast();
  const haptic = useHaptic();
  const [votes, setVotes] = useState(initialVotes);

  const handleVote = (voteId: string, isYes: boolean) => {
    haptic.medium();
    
    setVotes(prev => prev.map(vote => {
      if (vote.id === voteId) {
        return {
          ...vote,
          yesVotes: isYes ? vote.yesVotes + 1 : vote.yesVotes,
          noVotes: !isYes ? vote.noVotes + 1 : vote.noVotes,
          hasVoted: true,
        };
      }
      return vote;
    }));

    const votedItem = votes.find(v => v.id === voteId);
    
    toast({
      title: "Vote Recorded! ✓",
      description: `You voted ${isYes ? 'Yes' : 'No'} on "${votedItem?.title}"`,
    });

    onSuccess({
      id: `voted-${Date.now()}`,
      type: 'vote_closed',
      title: 'Vote Cast',
      description: `Voted ${isYes ? 'Yes' : 'No'} on ${votedItem?.title}`,
      timestamp: new Date(),
    });

    // Update pending vote count
    const remainingVotes = votes.filter(v => v.id !== voteId && !v.hasVoted).length;
    onVotesUpdated?.(remainingVotes);
  };

  const formatDeadline = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Ending soon';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  const pendingVotes = votes.filter(v => !v.hasVoted);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Vote className="h-5 w-5 text-white" />
            </div>
            Active Votes
            {pendingVotes.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingVotes.length} pending
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {pendingVotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <Check className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">No pending votes</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {pendingVotes.map((vote) => {
                const total = vote.yesVotes + vote.noVotes;
                const yesPercent = total > 0 ? (vote.yesVotes / total) * 100 : 50;
                
                return (
                  <motion.div
                    key={vote.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-card rounded-xl border border-border/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-semibold">{vote.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {vote.description}
                        </p>
                      </div>
                      <span className="text-xs text-orange-500 font-medium flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatDeadline(vote.deadline)}
                      </span>
                    </div>

                    {/* Vote Progress Bar */}
                    <div className="mb-4">
                      <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${yesPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div
                          className="h-full bg-muted-foreground/30"
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - yesPercent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-primary font-medium">{vote.yesVotes} Yes</span>
                        <span className="text-muted-foreground">{vote.noVotes} No</span>
                      </div>
                    </div>

                    {/* Vote Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVote(vote.id, false)}
                        className="flex-1 py-2.5 rounded-lg border border-border bg-background font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        No
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVote(vote.id, true)}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white font-medium flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Yes
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Already Voted Section */}
          {votes.filter(v => v.hasVoted).length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">Already Voted</p>
              {votes.filter(v => v.hasVoted).map((vote) => (
                <div key={vote.id} className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{vote.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
