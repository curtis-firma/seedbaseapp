import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/useHaptic';

interface SwipeableMessageCardProps {
  children: React.ReactNode;
  onAccept: () => void;
  isPending: boolean;
  className?: string;
}

const SWIPE_THRESHOLD = 100;
const TRIGGER_THRESHOLD = 150;

export function SwipeableMessageCard({
  children,
  onAccept,
  isPending,
  className,
}: SwipeableMessageCardProps) {
  const [isTriggered, setIsTriggered] = useState(false);
  const hasTriggeredHaptic = useRef(false);
  const x = useMotionValue(0);
  
  // Transform values for the reveal indicator
  const revealOpacity = useTransform(x, [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD], [0, 0.5, 1]);
  const revealScale = useTransform(x, [0, SWIPE_THRESHOLD], [0.8, 1]);
  const checkScale = useTransform(x, [SWIPE_THRESHOLD, TRIGGER_THRESHOLD], [1, 1.2]);
  const bgOpacity = useTransform(x, [0, SWIPE_THRESHOLD, TRIGGER_THRESHOLD], [0, 0.1, 0.2]);
  
  // Arrow hint animation
  const arrowX = useTransform(x, [0, 50], [0, 10]);

  const handleDrag = (_: any, info: { offset: { x: number } }) => {
    // Trigger haptic when crossing threshold
    if (info.offset.x >= TRIGGER_THRESHOLD && !hasTriggeredHaptic.current) {
      triggerHaptic('medium');
      hasTriggeredHaptic.current = true;
    } else if (info.offset.x < TRIGGER_THRESHOLD) {
      hasTriggeredHaptic.current = false;
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x >= TRIGGER_THRESHOLD || (info.offset.x > SWIPE_THRESHOLD && info.velocity.x > 500)) {
      setIsTriggered(true);
      triggerHaptic('success');
      
      // Delay the accept action for visual feedback
      setTimeout(() => {
        onAccept();
      }, 300);
    }
    hasTriggeredHaptic.current = false;
  };

  if (!isPending) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Accept reveal indicator behind the card */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center pl-4"
        style={{ opacity: revealOpacity }}
      >
        <motion.div
          className="flex items-center gap-2 text-white font-medium"
          style={{ scale: revealScale }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center"
            style={{ scale: checkScale }}
          >
            <Check className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-lg">Accept</span>
        </motion.div>
      </motion.div>

      {/* Swipeable card */}
      <AnimatePresence>
        {!isTriggered ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className={cn("relative touch-pan-y cursor-grab active:cursor-grabbing", className)}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* Green tint overlay when swiping */}
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-xl pointer-events-none"
              style={{ opacity: bgOpacity }}
            />
            
            {/* Card content */}
            <div className="relative">
              {children}
            </div>

            {/* Swipe hint arrow for pending cards */}
            <motion.div
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 opacity-50"
              style={{ x: arrowX }}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 0.95, opacity: 0 }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
