import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, MoreHorizontal } from 'lucide-react';

interface PostHeaderProps {
  author: {
    name: string;
    handle?: string;
    isVerified?: boolean;
    role?: string;
  };
  timestamp: Date;
  badge?: string;
  badgeVariant?: 'official' | 'steward' | 'envoy' | 'activator' | 'recipient';
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
  onMoreClick,
  className = '',
}: PostHeaderProps) {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {/* Name */}
      <span className="font-semibold text-foreground text-[15px] leading-tight">
        {author.name}
      </span>

      {/* Verified Badge */}
      {author.isVerified && (
        <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
      )}

      {/* Role Badge Pill */}
      {badge && (
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
      )}

      {/* Handle */}
      {author.handle && (
        <span className="text-muted-foreground text-[13px]">@{author.handle}</span>
      )}

      {/* Separator */}
      <span className="text-muted-foreground text-[13px]">·</span>

      {/* Time */}
      <span className="text-muted-foreground text-[13px]">
        {formatDistanceToNow(timestamp, { addSuffix: false })}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* More Button */}
      {onMoreClick && (
        <button
          onClick={onMoreClick}
          className="p-1.5 hover:bg-muted rounded-full transition-colors -mr-1"
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

export default PostHeader;
