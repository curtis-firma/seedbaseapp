import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Crown, Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  impactScore: number;
  trend: 'up' | 'down' | 'same';
  trendAmount?: number;
}

// Demo leaderboard data
const demoLeaderboard: LeaderboardEntry[] = [
  { id: '1', rank: 1, name: 'Sarah Chen', handle: 'sarahimpact', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', impactScore: 12450, trend: 'same' },
  { id: '2', rank: 2, name: 'Marcus Johnson', handle: 'marcusseed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', impactScore: 11200, trend: 'up', trendAmount: 2 },
  { id: '3', rank: 3, name: 'Elena Rodriguez', handle: 'elenagives', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', impactScore: 9800, trend: 'down', trendAmount: 1 },
  { id: '4', rank: 4, name: 'David Kim', handle: 'davidk', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', impactScore: 8650, trend: 'up', trendAmount: 3 },
  { id: '5', rank: 5, name: 'Amara Okonkwo', handle: 'amarao', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', impactScore: 7420, trend: 'same' },
  { id: '6', rank: 6, name: 'James Wilson', handle: 'jameswil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', impactScore: 6890, trend: 'up', trendAmount: 1 },
  { id: '7', rank: 7, name: 'Maya Patel', handle: 'mayap', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', impactScore: 5340, trend: 'down', trendAmount: 2 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Medal className="h-4 w-4 text-amber-600" />;
    default:
      return null;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30';
    default:
      return 'bg-muted/50 border-border/50';
  }
};

interface ImpactLeaderboardProps {
  compact?: boolean;
  maxEntries?: number;
}

export function ImpactLeaderboard({ compact = false, maxEntries = 7 }: ImpactLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate initial load
    setEntries(demoLeaderboard.slice(0, maxEntries));
  }, [maxEntries]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      // Randomly update scores slightly
      setEntries(prev => 
        prev.map(entry => ({
          ...entry,
          impactScore: entry.impactScore + Math.floor(Math.random() * 10) - 3,
        })).sort((a, b) => b.impactScore - a.impactScore)
          .map((entry, i) => ({
            ...entry,
            rank: i + 1,
            trend: entry.rank > i + 1 ? 'up' : entry.rank < i + 1 ? 'down' : 'same',
            trendAmount: Math.abs(entry.rank - (i + 1)),
          }))
      );
      
      setTimeout(() => setIsAnimating(false), 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="space-y-2">
        {entries.slice(0, 3).map((entry, i) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border",
              getRankBg(entry.rank)
            )}
          >
            <span className="w-5 text-center font-bold text-sm">{entry.rank}</span>
            <Avatar className="h-6 w-6">
              <AvatarImage src={entry.avatar} alt={entry.name} />
              <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate flex-1">{entry.name}</span>
            <span className="text-xs font-bold text-primary">{entry.impactScore.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Top Seeders</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                layout: { type: 'spring', damping: 25, stiffness: 300 },
                delay: i * 0.05 
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                getRankBg(entry.rank),
                isAnimating && "scale-[0.99]"
              )}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(entry.rank) || (
                  <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarImage src={entry.avatar} alt={entry.name} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entry.name}</p>
                <p className="text-xs text-muted-foreground">@{entry.handle}</p>
              </div>

              {/* Score & Trend */}
              <div className="text-right">
                <p className="font-bold text-primary">{entry.impactScore.toLocaleString()}</p>
                <div className="flex items-center gap-1 justify-end">
                  {entry.trend === 'up' && (
                    <motion.span 
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-xs text-green-500 flex items-center gap-0.5"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {entry.trendAmount && `+${entry.trendAmount}`}
                    </motion.span>
                  )}
                  {entry.trend === 'down' && (
                    <motion.span 
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-xs text-red-500 flex items-center gap-0.5"
                    >
                      <TrendingUp className="h-3 w-3 rotate-180" />
                      {entry.trendAmount && `-${entry.trendAmount}`}
                    </motion.span>
                  )}
                  {entry.trend === 'same' && (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Your Position */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3"
      >
        <div className="w-8 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Your Rank</p>
          <p className="text-xs text-muted-foreground">Keep sharing to climb!</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary">#42</p>
          <p className="text-xs text-muted-foreground">1,240 pts</p>
        </div>
      </motion.div>
    </div>
  );
}
