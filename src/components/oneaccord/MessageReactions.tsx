import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/useHaptic';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageReactionsProps {
  messageId: string;
  className?: string;
}

const QUICK_REACTIONS = ['👍', '❤️', '🔥', '🙏', '💯', '🎉'];

export function MessageReactions({ messageId, className }: MessageReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`reactions-${messageId}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [userReactions, setUserReactions] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`user-reactions-${messageId}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = (emoji: string) => {
    triggerHaptic('light');
    
    setReactions(prev => {
      const newReactions = { ...prev };
      if (userReactions.has(emoji)) {
        // Remove reaction
        newReactions[emoji] = Math.max(0, (newReactions[emoji] || 0) - 1);
        if (newReactions[emoji] === 0) delete newReactions[emoji];
      } else {
        // Add reaction
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
      }
      localStorage.setItem(`reactions-${messageId}`, JSON.stringify(newReactions));
      return newReactions;
    });

    setUserReactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emoji)) {
        newSet.delete(emoji);
      } else {
        newSet.add(emoji);
      }
      localStorage.setItem(`user-reactions-${messageId}`, JSON.stringify([...newSet]));
      return newSet;
    });

    setShowPicker(false);
  };

  const sortedReactions = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <AnimatePresence>
        {sortedReactions.map(([emoji, count]) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReaction(emoji)}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all",
              userReactions.has(emoji)
                ? "bg-[#0000ff]/10 border border-[#0000ff]/30"
                : "bg-gray-100 border border-transparent hover:bg-gray-200"
            )}
          >
            <span>{emoji}</span>
            {count > 1 && (
              <span className={cn(
                "text-xs font-medium",
                userReactions.has(emoji) ? "text-[#0000ff]" : "text-gray-600"
              )}>
                {count}
              </span>
            )}
          </motion.button>
        ))}
      </AnimatePresence>

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-2 bg-white rounded-xl shadow-lg border border-gray-200" 
          side="top" 
          align="start"
          sideOffset={4}
        >
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(emoji)}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-colors",
                  userReactions.has(emoji)
                    ? "bg-[#0000ff]/10"
                    : "hover:bg-gray-100"
                )}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
