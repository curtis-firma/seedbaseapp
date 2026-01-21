import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { PostHeader } from './shared/PostHeader';
import { PostActions } from './shared/PostActions';
import { CardImpactFooter } from './shared/CardImpactFooter';
import { useInView } from '@/hooks/useInView';

interface PostCardProps {
  author: {
    name: string;
    avatar: string;
    handle?: string;
    isVerified?: boolean;
    role?: string;
  };
  timestamp: Date;
  content?: string;
  badge?: string;
  badgeVariant?: 'official' | 'trustee' | 'envoy' | 'activator' | 'recipient';
  isOfficial?: boolean;
  children?: ReactNode;
  commentCount?: number;
  likeCount?: number;
  impactAmount?: number;
  totalRaised?: number;
  yourSeed?: number;
  yourPercentage?: number;
  showImpactFooter?: boolean;
  showGiveButton?: boolean;
  onComment?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onGive?: () => void;
  className?: string;
  index?: number;
}

export function PostCard({
  author,
  timestamp,
  content,
  badge,
  badgeVariant = 'activator',
  isOfficial = false,
  children,
  commentCount = 0,
  likeCount = 0,
  impactAmount,
  totalRaised,
  yourSeed,
  yourPercentage,
  showImpactFooter = false,
  showGiveButton = true,
  onComment,
  onShare,
  onLike,
  onGive,
  className = '',
  index = 0,
}: PostCardProps) {
  const { ref, isInView: isVisible } = useInView({ threshold: 0.1 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.2, delay: 0 }}
      className={`
        bg-card border border-border/50 rounded-2xl
        shadow-sm hover:shadow-md transition-shadow
        overflow-hidden
        ${className}
      `}
    >
      {/* Header Row */}
      <div className="p-4 pb-0">
        <PostHeader
          author={author}
          timestamp={timestamp}
          badge={badge}
          badgeVariant={badgeVariant}
        />
      </div>

      {/* Content */}
      {content && (
        <div className="px-4 py-3">
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      )}

      {/* Card Content (variant-specific) */}
      {children && (
        <div className="px-4 pb-3">
          {children}
        </div>
      )}

      {/* Impact Footer */}
      {showImpactFooter && totalRaised !== undefined && (
        <div className="px-4 pb-3">
          <CardImpactFooter
            totalAmount={totalRaised}
            yourSeed={yourSeed}
            yourPercentage={yourPercentage}
          />
        </div>
      )}

      {/* Actions Row */}
      <div className="px-4 pb-4 border-t border-border/30 mt-2">
        <PostActions
          commentCount={commentCount}
          likeCount={likeCount}
          impactAmount={impactAmount}
          onComment={onComment}
          onShare={onShare}
          onLike={onLike}
          onGive={onGive}
          showGiveButton={showGiveButton}
        />
      </div>
    </motion.article>
  );
}

export default PostCard;
