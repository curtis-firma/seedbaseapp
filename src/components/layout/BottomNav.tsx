import { motion } from 'framer-motion';
import { Home, Layers, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

const navItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: Layers, label: 'Seedbase', path: '/app/seedbase' },
  { icon: User, label: 'User', path: '/app/wallet' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptic();

  const handleNavClick = (path: string) => {
    haptic.selection();
    navigate(path);
  };

  // Get active index for indicator positioning - bulletproof path matching
  const getActiveIndex = (): number => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/') return 0;
    if (path.startsWith('/app/seedbase')) return 1;
    if (path.startsWith('/app/wallet') || path.startsWith('/app/profile') || path.startsWith('/app/settings')) return 2;
    return 0;
  };
  
  const activeIndex = getActiveIndex();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 pb-safe-bottom">
        <div className="relative flex items-center justify-around py-2">
          {/* Sliding indicator with glow */}
          <motion.div
            className="absolute inset-y-1 bg-primary/10 rounded-2xl"
            style={{
              width: `${100 / 3}%`,
              boxShadow: '0 0 20px hsl(var(--primary) / 0.25)',
            }}
            animate={{
              left: `${activeIndex * (100 / 3)}%`,
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
                className="relative z-10 flex flex-col items-center gap-1 px-5 py-2"
                whileTap={{ scale: 0.92 }}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors duration-150",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
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
