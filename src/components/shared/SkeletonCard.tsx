import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  variant?: 'feed' | 'stat' | 'mission';
  className?: string;
}

// Shimmer effect styles
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

export function SkeletonCard({ variant = 'feed', className }: SkeletonCardProps) {
  if (variant === 'stat') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("bg-card rounded-2xl border border-border/50 p-5", className)}
      >
        <div className={cn("h-4 w-24 bg-muted rounded mb-3", shimmerClass)} />
        <div className={cn("h-8 w-32 bg-muted rounded mb-2", shimmerClass)} />
        <div className={cn("h-3 w-20 bg-muted/50 rounded", shimmerClass)} />
      </motion.div>
    );
  }

  if (variant === 'mission') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("bg-card rounded-2xl border border-border/50 p-5", className)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-12 h-12 bg-muted rounded-xl", shimmerClass)} />
          <div className="flex-1">
            <div className={cn("h-5 w-3/4 bg-muted rounded mb-2", shimmerClass)} />
            <div className={cn("h-3 w-1/2 bg-muted/50 rounded", shimmerClass)} />
          </div>
        </div>
        <div className={cn("h-2 w-full bg-muted rounded-full mb-2", shimmerClass)} />
        <div className={cn("h-3 w-1/3 bg-muted/50 rounded", shimmerClass)} />
      </motion.div>
    );
  }

  // Default: X-style two-column feed skeleton with shimmer
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-card rounded-2xl border border-border/50 p-4", className)}
    >
      {/* X-style two-column layout */}
      <div className="flex gap-3">
        {/* Avatar column */}
        <div className="flex-shrink-0">
          <div className={cn("w-11 h-11 bg-muted rounded-full", shimmerClass)} />
        </div>
        
        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Header row - Name, handle, time */}
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("h-4 w-20 bg-muted rounded", shimmerClass)} />
            <div className={cn("h-3 w-14 bg-muted/50 rounded", shimmerClass)} />
            <div className={cn("h-3 w-8 bg-muted/30 rounded", shimmerClass)} />
          </div>
          
          {/* Role badge skeleton */}
          <div className={cn("h-4 w-16 bg-muted/40 rounded mb-3", shimmerClass)} />
          
          {/* Content text lines */}
          <div className="space-y-2 mb-4">
            <div className={cn("h-4 w-full bg-muted rounded", shimmerClass)} />
            <div className={cn("h-4 w-5/6 bg-muted rounded", shimmerClass)} />
            <div className={cn("h-4 w-2/3 bg-muted/50 rounded", shimmerClass)} />
          </div>
          
          {/* Embedded card skeleton */}
          <div className={cn("h-32 w-full bg-muted/30 rounded-xl mb-4", shimmerClass)} />
          
          {/* Impact footer skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className={cn("h-4 w-20 bg-muted rounded", shimmerClass)} />
            <div className={cn("h-8 w-28 bg-primary/10 rounded-xl", shimmerClass)} />
          </div>
          
          {/* Actions row skeleton */}
          <div className="flex items-center gap-6 pt-3 border-t border-border/30">
            <div className={cn("h-4 w-8 bg-muted/50 rounded", shimmerClass)} />
            <div className={cn("h-4 w-10 bg-muted/50 rounded", shimmerClass)} />
            <div className={cn("h-4 w-6 bg-muted/50 rounded", shimmerClass)} />
            <div className="flex-1" />
            <div className={cn("h-8 w-8 bg-muted/50 rounded-xl", shimmerClass)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
