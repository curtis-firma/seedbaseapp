import { motion } from 'framer-motion';
import { Home, Layers, Wallet, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Layers, label: 'SeedBase', path: '/seedbase' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
];

interface BottomNavProps {
  onMenuClick: () => void;
}

export function BottomNav({ onMenuClick }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="glass-strong border-t border-border/50 px-4 pb-safe-bottom">
        <div className="flex items-center justify-around py-2">
          {/* Menu Button */}
          <motion.button
            onClick={onMenuClick}
            className="relative flex flex-col items-center gap-1 px-4 py-2"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Menu</span>
          </motion.button>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-1 px-4 py-2"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-2xl gradient-base opacity-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
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
