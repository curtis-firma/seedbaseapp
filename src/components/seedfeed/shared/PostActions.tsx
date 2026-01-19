import { motion } from 'framer-motion';
import { MessageCircle, Share2, Heart, TrendingUp, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useHaptic } from '@/hooks/useHaptic';

interface PostActionsProps {
  commentCount: number;
  likeCount: number;
  impactAmount?: number;
  isLiked?: boolean;
  onComment?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onGive?: () => void;
  showGiveButton?: boolean;
  className?: string;
}

export function PostActions({
  commentCount,
  likeCount,
  impactAmount,
  isLiked: initialLiked = false,
  onComment,
  onShare,
  onLike,
  onGive,
  showGiveButton = true,
  className = '',
}: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likeCount);
  const haptic = useHaptic();

  const handleLike = () => {
    haptic.light();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.();
  };

  const handleShare = async () => {
    haptic.light();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Seedbase',
          text: 'Check out this impact on Seedbase!',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
    onShare?.();
  };

  return (
    <div className={`flex items-center justify-between pt-3 ${className}`}>
      {/* Left Actions */}
      <div className="flex items-center gap-4">
        {/* Comment */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { haptic.light(); onComment?.(); }}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span className="text-sm">{commentCount}</span>
        </motion.button>

        {/* Impact Amount */}
        {impactAmount !== undefined && (
          <div className="flex items-center gap-1.5 text-seed">
            <TrendingUp className="w-4.5 h-4.5" />
            <span className="text-sm font-medium">${impactAmount.toLocaleString()}</span>
          </div>
        )}

        {/* Share */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <Share2 className="w-4.5 h-4.5" />
        </motion.button>

        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${
            isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">{likes}</span>
        </motion.button>
      </div>

      {/* Give Button */}
      {showGiveButton && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { haptic.medium(); onGive?.(); }}
          className="
            flex items-center gap-1.5 px-4 py-1.5
            bg-primary text-primary-foreground
            rounded-xl font-medium text-sm
            hover:bg-primary/90 transition-colors
            shadow-sm
          "
        >
          <Sprout className="w-4 h-4" />
          <span>Give</span>
        </motion.button>
      )}
    </div>
  );
}

export default PostActions;
