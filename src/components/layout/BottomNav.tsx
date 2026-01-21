import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layers, User, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

const navItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: MessageCircle, label: 'Accord', path: '/app/oneaccord', featured: true },
  { icon: Layers, label: 'Seedbase', path: '/app/seedbase' },
  { icon: User, label: 'User', path: '/app/wallet' },
];

const navTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptic();

  const handleNavClick = (path: string) => {
    haptic.selection();
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={navTransition}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 pb-safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            const isFeatured = 'featured' in item && item.featured;

            return (
              <motion.button
                key={item.path}
                data-tutorial={`nav-${item.label.toLowerCase()}`}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-5 py-2",
                  isFeatured && !isActive && "bg-gradient-to-r from-[#0000ff]/10 to-purple-500/10 rounded-xl mx-1"
                )}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                transition={navTransition}
              >
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={navTransition}
                  className={cn(
                    isFeatured && !isActive && "relative"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      isActive ? "text-primary" : isFeatured ? "text-[#0000ff]" : "text-muted-foreground"
                    )}
                  />
                </motion.div>
                <motion.span
                  animate={{ 
                    opacity: isActive ? 1 : 0.7,
                    fontWeight: isActive ? 600 : 500,
                  }}
                  className={cn(
                    "text-xs transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-glow"
                      transition={navTransition}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
