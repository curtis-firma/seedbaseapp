import { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, User, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { getPendingTransfers } from '@/lib/supabase/transfersApi';
import { useRealtimeTransfers } from '@/hooks/useRealtimeTransfers';

const navItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: Layers, label: 'Seedbase', path: '/app/seedbase' },
  { icon: MessageCircle, label: 'Messages', path: '/app/oneaccord' },
  { icon: User, label: 'User', path: '/app/wallet' },
];

export const BottomNav = memo(function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptic();
  const [pendingCount, setPendingCount] = useState(0);

  // Get current user ID - memoized
  const currentUserId = (() => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  })();

  // Load pending transfers count
  useEffect(() => {
    if (!currentUserId) return;
    
    let isMounted = true;
    const loadPendingCount = async () => {
      try {
        const pending = await getPendingTransfers(currentUserId);
        if (isMounted) setPendingCount(pending.length);
      } catch (err) {
        console.error('Error loading pending count:', err);
      }
    };
    loadPendingCount();
    
    return () => { isMounted = false; };
  }, [currentUserId]);

  // Real-time updates for pending transfers - debounced callback
  const handleRealtimeChange = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const pending = await getPendingTransfers(currentUserId);
      setPendingCount(pending.length);
    } catch {}
  }, [currentUserId]);

  useRealtimeTransfers({
    userId: currentUserId,
    onAnyChange: handleRealtimeChange,
  });

  const handleNavClick = useCallback((path: string) => {
    haptic.selection();
    navigate(path);
  }, [haptic, navigate]);

  // Get active index for indicator positioning
  const getActiveIndex = (): number => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/') return 0;
    if (path.startsWith('/app/seedbase')) return 1;
    if (path.startsWith('/app/oneaccord')) return 2;
    if (path.startsWith('/app/wallet') || path.startsWith('/app/settings')) return 3;
    return 0;
  };
  
  const activeIndex = getActiveIndex();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 pb-safe-bottom">
        <div className="relative flex items-center justify-around py-2">
          {/* Sliding indicator - simplified spring */}
          <motion.div
            className="absolute inset-y-1 bg-primary/10 rounded-2xl"
            style={{
              width: `${100 / 4}%`,
              boxShadow: '0 0 16px hsl(var(--primary) / 0.2)',
            }}
            animate={{
              left: `${activeIndex * (100 / 4)}%`,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
          
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                data-tutorial={`nav-${item.label.toLowerCase()}`}
                onClick={() => handleNavClick(item.path)}
                className="relative z-10 flex flex-col items-center gap-1 px-4 py-2"
                whileTap={{ scale: 0.92 }}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-100",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {/* Pending transfers badge for Messages */}
                  {item.path === '/app/oneaccord' && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs transition-colors duration-100",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground font-medium"
                  )}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
});
