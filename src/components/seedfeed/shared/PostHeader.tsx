import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, MoreHorizontal } from 'lucide-react';
import seedbaseIcon from '@/assets/seeddroplogo_lightmode.png';

interface PostHeaderProps {
  author: {
    name: string;
    avatar: string;
    handle?: string;
    isVerified?: boolean;
    role?: string;
  };
  timestamp: Date;
  badge?: string;
  badgeVariant?: 'official' | 'steward' | 'envoy' | 'activator' | 'recipient';
  isOfficial?: boolean;
  onMoreClick?: () => void;
  className?: string;
}

const badgeStyles = {
  official: 'bg-primary/10 text-primary',
  steward: 'bg-trust/10 text-trust',
  envoy: 'bg-envoy/10 text-envoy',
  activator: 'bg-seed/10 text-seed',
  recipient: 'bg-base/10 text-base',
};

export function PostHeader({
  author,
  timestamp,
  badge,
  badgeVariant = 'activator',
  isOfficial = false,
  onMoreClick,
  className = '',
}: PostHeaderProps) {
  // Use Seedbase logo for official accounts
  const avatarSrc = isOfficial ? seedbaseIcon : author.avatar;
  const isEmoji = !isOfficial && author.avatar.length <= 4;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Avatar */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0"
      >
        {isEmoji ? (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
            {author.avatar}
          </div>
        ) : (
          <img
            src={avatarSrc}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-border/50"
          />
        )}
      </motion.div>

      {/* Name, Handle, Time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-foreground truncate">{author.name}</span>
          {author.isVerified && (
            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
          )}
          {badge && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${badgeStyles[badgeVariant]}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {author.handle && <span>@{author.handle}</span>}
          <span>·</span>
          <span>{formatDistanceToNow(timestamp, { addSuffix: false })}</span>
        </div>
      </div>

      {/* More Button */}
      {onMoreClick && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMoreClick}
          className="p-1.5 hover:bg-muted rounded-full transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      )}
    </div>
  );
}

export default PostHeader;
