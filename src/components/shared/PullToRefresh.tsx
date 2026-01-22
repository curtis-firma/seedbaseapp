import { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import seedIconWhite from '@/assets/seed-icon-white.png';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className = '' }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const haptic = useHaptic();
  
  const pullThreshold = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY <= 0) {
      setIsPulling(true);
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing || window.scrollY > 0) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startY;
    
    if (deltaY > 0) {
      const distance = Math.min(deltaY * 0.5, 120);
      setPullDistance(distance);
      
      // Haptic when crossing threshold
      if (distance > pullThreshold && pullDistance <= pullThreshold) {
        haptic.light();
      }
    }
  }, [isPulling, isRefreshing, startY, pullDistance, pullThreshold, haptic]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      haptic.medium();
      
      try {
        await onRefresh();
        haptic.success();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setIsPulling(false);
    setStartY(0);
  }, [pullDistance, isRefreshing, onRefresh, haptic, pullThreshold]);

  const progress = Math.min(pullDistance / pullThreshold, 1);
  const isPastThreshold = pullDistance > pullThreshold;

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        animate={{ 
          height: pullDistance || (isRefreshing ? 60 : 0),
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0 
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{ 
            rotate: isRefreshing ? 360 : progress * 360,
            scale: isPastThreshold || isRefreshing ? 1.2 : 0.8 + (progress * 0.4),
          }}
          transition={isRefreshing ? { 
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
            scale: { duration: 0.2 }
          } : { duration: 0.1 }}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isPastThreshold || isRefreshing ? 'bg-primary' : 'bg-muted'
          }`}
        >
          {/* Seed icon */}
          <motion.img
            src={seedIconWhite}
            alt=""
            className="w-5 h-5"
            animate={{
              opacity: isPastThreshold || isRefreshing ? 1 : 0.6,
              scale: isRefreshing ? [1, 1.1, 1] : 1,
            }}
            transition={isRefreshing ? { 
              scale: { duration: 0.5, repeat: Infinity }
            } : {}}
          />
          
          {/* Progress ring */}
          {!isRefreshing && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 40 40"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progress * 113} 113`}
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
          )}
        </motion.div>
      </motion.div>

      {/* Floating refresh indicator when active */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-full shadow-elevated border border-border/50">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              >
                <img src={seedIconWhite} alt="" className="w-2.5 h-2.5" />
              </motion.div>
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
