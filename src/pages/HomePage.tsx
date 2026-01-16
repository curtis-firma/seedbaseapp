import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Bell, Search, Sprout, HelpCircle } from 'lucide-react';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { FeedCard } from '@/components/feed/FeedCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { mockFeedItems, forYouItems } from '@/data/mockData';

const tabs = ['Network', 'For You'];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    } else if (info.offset.x > threshold && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  }, [activeTab]);

  const currentFeed = activeTab === 0 ? mockFeedItems : forYouItems;

  // Trigger onboarding again
  const handleShowHelp = () => {
    localStorage.removeItem('seedbase-onboarding-seen');
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center shadow-glow md:hidden">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Seedfeed</h1>
                <p className="text-sm text-muted-foreground">Commitment creates capacity.</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShowHelp}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors"
                title="Show walkthrough"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 hover:bg-muted rounded-xl transition-colors"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </motion.button>
            </div>
          </div>

          <SwipeTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </header>

      {/* Feed Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="px-4 py-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 0 ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              currentFeed.map((item, index) => (
                <FeedCard key={item.id} item={item} index={index} />
              ))
            )}

            {/* Tagline Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-8"
            >
              <p className="text-sm text-muted-foreground italic">
                "Locked value. Living impact."
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-elevated border border-border/50">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
