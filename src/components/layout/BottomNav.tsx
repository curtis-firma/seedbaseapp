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

  // Get active index for indicator positioning
  const activeIndex = navItems.findIndex(item => 
    location.pathname === item.path || 
    (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 pb-safe-bottom">
        <div className="relative flex items-center justify-around py-2">
          {/* Sliding indicator background - smooth modern pill */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-12 bg-primary/10 rounded-2xl"
            initial={false}
            animate={{
              x: `calc(${activeIndex * 100}% + ${activeIndex * 8}px)`,
              width: '80px',
            }}
            style={{
              left: `calc(${(100/3) * 0.5}% - 40px)`,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
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
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-150",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-xs transition-all duration-150",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground font-medium"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Active dot indicator */}
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary"
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
