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
  badgeVariant?: 'official' | 'trustee' | 'envoy' | 'activator' | 'recipient';
  onMoreClick?: () => void;
  className?: string;
}

const badgeStyles = {
  official: 'bg-primary/10 text-primary',
  trustee: 'bg-trust/10 text-trust',
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
    <div className={className}>
      {/* Main row - Twitter/X style: Name ✓ @handle · time ... */}
      <div className="flex items-center gap-1 min-w-0">
        {/* Name - truncates with ellipsis */}
        <span className="font-semibold text-foreground text-[15px] leading-tight truncate max-w-[100px] sm:max-w-[140px]">
          {author.name}
        </span>

        {/* Verified Badge */}
        {author.isVerified && (
          <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
        )}

        {/* Handle - truncates */}
        {author.handle && (
          <span className="text-muted-foreground text-[13px] truncate max-w-[70px] sm:max-w-[100px]">
            @{author.handle}
          </span>
        )}

        {/* Separator + Time - never truncates */}
        <span className="text-muted-foreground text-[13px] flex-shrink-0">·</span>
        <span className="text-muted-foreground text-[13px] flex-shrink-0 whitespace-nowrap">
          {formatDistanceToNow(timestamp, { addSuffix: false })}
        </span>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* More Button */}
        {onMoreClick && (
          <button
            onClick={onMoreClick}
            className="p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Role badge on separate line (if present) */}
      {badge && (
        <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

export default PostHeader;
