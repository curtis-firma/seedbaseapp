import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface SwipeableTabContentProps {
  activeTab: number;
  tabCount: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode;
}

export function SwipeableTabContent({ 
  activeTab, 
  tabCount, 
  onTabChange, 
  children 
}: SwipeableTabContentProps) {
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const haptic = useHaptic();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;

    // Use velocity or offset to determine swipe
    const shouldSwipe = Math.abs(offset) > threshold || velocity > 300;

    if (shouldSwipe) {
      if (offset < 0 && activeTab < tabCount - 1) {
        // Swipe left -> next tab
        haptic.light();
        setDirection(1);
        onTabChange(activeTab + 1);
      } else if (offset > 0 && activeTab > 0) {
        // Swipe right -> previous tab
        haptic.light();
        setDirection(-1);
        onTabChange(activeTab - 1);
      }
      // If at edge, snap back happens automatically via dragConstraints
    }
    // If !shouldSwipe, the elastic snap-back handles returning to center
  };

  // Update direction when tab changes externally (e.g., from tab pills)
  const handleTabChangeExternal = (newTab: number) => {
    setDirection(newTab > activeTab ? 1 : -1);
  };

  // Slide variants for directional animation
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  // Calculate edge indicators based on position
  const showLeftIndicator = activeTab > 0;
  const showRightIndicator = activeTab < tabCount - 1;

  return (
    <div ref={containerRef} className="overflow-hidden touch-pan-y relative">
      {/* Left edge indicator - shows more tabs to the left */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none",
          "bg-gradient-to-r from-background/80 to-transparent",
          "transition-opacity duration-200",
          showLeftIndicator && isDragging ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Right edge indicator - shows more tabs to the right */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none",
          "bg-gradient-to-l from-background/80 to-transparent",
          "transition-opacity duration-200",
          showRightIndicator && isDragging ? "opacity-100" : "opacity-0"
        )}
      />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 400, damping: 35 },
              opacity: { duration: 0.15 },
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
