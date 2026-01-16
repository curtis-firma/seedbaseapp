import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Search, HelpCircle, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { FeedCard } from '@/components/feed/FeedCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { getPosts, type DemoPost } from '@/lib/supabase/postsApi';
import { mockFeedItems, forYouItems } from '@/data/mockData';
import { FeedItem } from '@/types/seedbase';
import seedbaseIcon from '@/assets/seedbase-icon.png';

const tabs = ['Network', 'For You'];

// Convert DemoPost to FeedItem format
function postToFeedItem(post: DemoPost): FeedItem {
  // Generate a title from the body
  const title = post.body.slice(0, 50) + (post.body.length > 50 ? '...' : '');
  
  return {
    id: post.id,
    type: post.post_type === 'transparency' ? 'transparency' : 
          post.post_type === 'testimony' ? 'testimony' : 
          post.post_type === 'vote' ? 'milestone' : 'mission_update',
    postType: post.post_type as any,
    title,
    content: post.body,
    timestamp: new Date(post.created_at),
    likes: post.likes,
    comments: post.comments,
    author: post.author ? {
      name: post.author.display_name || post.author.username,
      handle: post.author.username,
      avatar: post.author.avatar_url || '',
      role: post.author.active_role,
      isVerified: true,
    } : undefined,
    seedbase: post.seedbase_tag ? { id: post.id, name: post.seedbase_tag } : undefined,
    mission: post.mission_tag ? { id: post.id, name: post.mission_tag } : undefined,
    roleBadge: post.author?.active_role === 'trustee' ? 'Steward' : 
               post.author?.active_role === 'envoy' ? 'Envoy' : 'Activator',
  };
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 10;

  // Load posts from database
  const loadPosts = async (reset = false) => {
    const offset = reset ? 0 : page * POSTS_PER_PAGE;
    
    if (reset) {
      setIsLoading(true);
      setPage(0);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const dbPosts = await getPosts(POSTS_PER_PAGE, offset);
      const feedItems = dbPosts.map(postToFeedItem);
      
      if (reset) {
        // If we got posts from DB, use them; otherwise fall back to mock data
        if (feedItems.length > 0) {
          setPosts(feedItems);
        } else {
          setPosts(mockFeedItems);
        }
      } else {
        setPosts(prev => [...prev, ...feedItems]);
      }
      
      setHasMore(feedItems.length === POSTS_PER_PAGE);
      if (!reset) setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading posts:', err);
      // Fall back to mock data on error
      if (reset) {
        setPosts(mockFeedItems);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts(true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || activeTab !== 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, activeTab]);

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

  // Use DB posts for Network tab, mock for For You
  const currentFeed = activeTab === 0 ? posts : forYouItems;

  // Trigger onboarding again
  const handleShowHelp = () => {
    localStorage.removeItem('seedbase-onboarding-seen');
    window.location.reload();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts(true);
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={seedbaseIcon} alt="Seedbase" className="w-10 h-10 md:hidden" />
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
                onClick={() => navigate('/oneaccord')}
                className="relative p-2.5 hover:bg-muted rounded-xl transition-colors"
                title="Messages & Transfers"
              >
                <PenSquare className="h-5 w-5 text-muted-foreground" />
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
              <>
                {currentFeed.map((item, index) => (
                  <FeedCard key={item.id} item={item} index={index} />
                ))}

                {/* Load More Trigger */}
                {activeTab === 0 && hasMore && (
                  <div ref={loadMoreRef} className="py-4">
                    {isLoadingMore && (
                      <div className="flex justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Tagline Footer */}
            {!isLoading && !hasMore && (
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
            )}
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