import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'feed' | 'stat' | 'mission';
  className?: string;
}

export function SkeletonCard({ variant = 'feed', className }: SkeletonCardProps) {
  if (variant === 'stat') {
    return (
      <div className={cn("bg-card rounded-2xl border border-border/50 p-5", className)}>
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3" />
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 w-20 bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  if (variant === 'mission') {
    return (
      <div className={cn("bg-card rounded-2xl border border-border/50 p-5", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 w-1/2 bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full animate-pulse mb-2" />
        <div className="h-3 w-1/3 bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  // Default: X-style two-column feed skeleton
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("bg-card rounded-2xl border border-border/50 p-4", className)}
    >
      {/* X-style two-column layout */}
      <div className="flex gap-3">
        {/* Avatar column */}
        <div className="flex-shrink-0">
          <div className="w-11 h-11 bg-muted rounded-full animate-pulse" />
        </div>
        
        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Header row - Name, handle, time */}
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-3 w-14 bg-muted/50 rounded animate-pulse" />
            <div className="h-3 w-8 bg-muted/30 rounded animate-pulse" />
          </div>
          
          {/* Role badge skeleton */}
          <div className="h-4 w-16 bg-muted/40 rounded animate-pulse mb-3" />
          
          {/* Content text lines */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse" />
          </div>
          
          {/* Embedded card skeleton */}
          <div className="h-32 w-full bg-muted/30 rounded-xl animate-pulse mb-4" />
          
          {/* Impact footer skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-28 bg-seed/10 rounded-xl animate-pulse" />
          </div>
          
          {/* Actions row skeleton */}
          <div className="flex items-center gap-6 pt-3 border-t border-border/30">
            <div className="h-4 w-8 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-10 bg-muted/50 rounded animate-pulse" />
            <div className="h-4 w-6 bg-muted/50 rounded animate-pulse" />
            <div className="flex-1" />
            <div className="h-8 w-8 bg-muted/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
