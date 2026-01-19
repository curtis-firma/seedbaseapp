import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Search, HelpCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { FeedRenderer } from '@/components/seedfeed/FeedRenderer';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { getPosts, type DemoPost } from '@/lib/supabase/postsApi';
import { mockFeedItems, forYouItems } from '@/data/mockData';
import { FeedItem } from '@/types/seedbase';
import { Logo } from '@/components/shared/Logo';
import { useHaptic } from '@/hooks/useHaptic';

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

// Generate infinite mock data by cycling through existing items
function generateMoreMockItems(existingCount: number, count: number): FeedItem[] {
  const allMockItems = [...mockFeedItems, ...forYouItems];
  const newItems: FeedItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const sourceItem = allMockItems[(existingCount + i) % allMockItems.length];
    newItems.push({
      ...sourceItem,
      id: `generated-${existingCount + i}-${Date.now()}`,
      timestamp: new Date(Date.now() - (existingCount + i) * 3600000), // Offset by hours
    });
  }
  
  return newItems;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [forYouPosts, setForYouPosts] = useState<FeedItem[]>(forYouItems);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const haptic = useHaptic();

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
        setHasMore(true);
      } else {
        // If no more DB posts, generate mock items for infinite scroll feel
        if (feedItems.length === 0) {
          const moreMockItems = generateMoreMockItems(posts.length, POSTS_PER_PAGE);
          setPosts(prev => [...prev, ...moreMockItems]);
          // Keep hasMore true for infinite feel, but slow down after many pages
          setHasMore(page < 10);
        } else {
          setPosts(prev => [...prev, ...feedItems]);
          setHasMore(feedItems.length === POSTS_PER_PAGE);
        }
      }
      
      if (!reset) setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading posts:', err);
      // Fall back to mock data on error
      if (reset) {
        setPosts(mockFeedItems);
      } else {
        // Generate more mock items for infinite scroll
        const moreMockItems = generateMoreMockItems(posts.length, POSTS_PER_PAGE);
        setPosts(prev => [...prev, ...moreMockItems]);
      }
      setHasMore(page < 10);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more for "For You" tab
  const loadMoreForYou = useCallback(() => {
    const moreItems = generateMoreMockItems(forYouPosts.length, 5);
    setForYouPosts(prev => [...prev, ...moreItems]);
  }, [forYouPosts.length]);

  // Initial load
  useEffect(() => {
    loadPosts(true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          if (activeTab === 0) {
            loadPosts(false);
          } else {
            loadMoreForYou();
          }
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, activeTab, loadMoreForYou]);

  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    haptic.selection();
    setIsTabSwitching(true);
    setActiveTab(index);
    // Brief skeleton display for smooth transition
    setTimeout(() => setIsTabSwitching(false), 300);
  };

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeTab < tabs.length - 1) {
      haptic.light();
      setActiveTab(activeTab + 1);
    } else if (info.offset.x > threshold && activeTab > 0) {
      haptic.light();
      setActiveTab(activeTab - 1);
    }
  }, [activeTab, haptic]);

  // Network shows mockFeedItems + any DB posts, For You shows personalized items
  const networkFeed = [...mockFeedItems, ...posts.filter(p => !mockFeedItems.some(m => m.id === p.id))];
  const currentFeed = activeTab === 0 ? networkFeed : forYouPosts;

  // Note: Walkthrough is now triggered via AppLayout
  const handleShowHelp = () => {
    haptic.light();
    window.dispatchEvent(new CustomEvent('show-walkthrough'));
  };

  const handleRefresh = async () => {
    haptic.medium();
    setIsRefreshing(true);
    await loadPosts(true);
    setIsRefreshing(false);
    haptic.success();
  };

  const handleButtonTap = () => {
    haptic.light();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Logo variant="wordmark" size="sm" />
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShowHelp}
                onTouchStart={handleButtonTap}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors active:bg-muted/80"
                title="Show walkthrough"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onTouchStart={handleButtonTap}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors active:bg-muted/80"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { haptic.light(); navigate('/app/oneaccord'); }}
                className="relative p-2.5 hover:bg-muted rounded-xl transition-colors active:bg-muted/80"
                title="Messages & Transfers"
              >
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
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
            {isLoading || isTabSwitching ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <FeedRenderer items={currentFeed} />

                {/* Infinite Scroll Load More Trigger */}
                <div ref={loadMoreRef} className="py-6">
                  {isLoadingMore && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                      />
                      <span className="text-xs text-muted-foreground">Loading more...</span>
                    </motion.div>
                  )}
                  {!isLoadingMore && hasMore && (
                    <div className="h-20" /> // Invisible trigger area
                  )}
                </div>
              </>
            )}

            {/* End of Feed Message - only show when truly at the end */}
            {!isLoading && !hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Locked value. Living impact."
                </p>
                <p className="text-xs text-muted-foreground">
                  You've seen it all! Pull down to refresh.
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