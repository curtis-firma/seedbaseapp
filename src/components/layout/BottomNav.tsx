import { useState, useEffect } from 'react';
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

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptic();
  const [pendingCount, setPendingCount] = useState(0);

  // Get current user ID
  const getCurrentUserId = (): string | null => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Load pending transfers count
  useEffect(() => {
    const loadPendingCount = async () => {
      if (!currentUserId) return;
      try {
        const pending = await getPendingTransfers(currentUserId);
        setPendingCount(pending.length);
      } catch (err) {
        console.error('Error loading pending count:', err);
      }
    };
    loadPendingCount();
  }, [currentUserId]);

  // Real-time updates for pending transfers
  useRealtimeTransfers({
    userId: currentUserId,
    onAnyChange: async () => {
      if (!currentUserId) return;
      try {
        const pending = await getPendingTransfers(currentUserId);
        setPendingCount(pending.length);
      } catch {}
    },
  });

  const handleNavClick = (path: string) => {
    haptic.selection();
    navigate(path);
  };

  // Get active index for indicator positioning
  const getActiveIndex = (): number => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/') return 0;
    if (path.startsWith('/app/seedbase')) return 1;
    if (path.startsWith('/app/oneaccord')) return 2;
    if (path.startsWith('/app/wallet') || path.startsWith('/app/profile') || path.startsWith('/app/settings')) return 3;
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
          {/* Sliding indicator with glow */}
          <motion.div
            className="absolute inset-y-1 bg-primary/10 rounded-2xl"
            style={{
              width: `${100 / 4}%`,
              boxShadow: '0 0 20px hsl(var(--primary) / 0.25)',
            }}
            animate={{
              left: `${activeIndex * (100 / 4)}%`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
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
                <motion.div
                  whileTap={{ 
                    scale: [1, 0.85, 1.1, 1],
                    transition: { duration: 0.3, times: [0, 0.2, 0.5, 1] }
                  }}
                  className="relative"
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-150",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {/* Pending transfers badge for Messages */}
                  {item.path === '/app/oneaccord' && pendingCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold rounded-full shadow-lg"
                    >
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </motion.span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs transition-all duration-150",
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
}
