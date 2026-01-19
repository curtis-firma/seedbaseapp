import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwipeTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  className?: string;
}

export function SwipeTabs({ tabs, activeTab, onTabChange, className }: SwipeTabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-muted/50 rounded-xl", className)}>
      {tabs.map((tab, index) => (
        <motion.button
          key={tab}
          onClick={() => onTabChange(index)}
          className={cn(
            "relative flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
            activeTab === index
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === index && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </motion.button>
      ))}
    </div>
  );
}
