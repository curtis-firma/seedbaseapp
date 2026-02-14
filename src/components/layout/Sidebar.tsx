import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layers, User, MessageCircle, BarChart3, 
  ShoppingBag, Rocket, Settings, ChevronLeft, ChevronRight, Vote
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { ViewRoleBadge } from '@/components/shared/ViewRoleBadge';

const primaryNav = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: Layers, label: 'Seedbase', path: '/app/seedbase' },
  { icon: User, label: 'User', path: '/app/wallet' },
];

const secondaryNav = [
  { icon: MessageCircle, label: 'OneAccord', path: '/app/oneaccord', badge: 0, featured: true },
  { icon: BarChart3, label: 'Vault', path: '/app/vault', badge: 0 },
  { icon: Vote, label: 'Governance', path: '/app/governance', badge: 3 },
  { icon: ShoppingBag, label: 'Shop', path: '/app/seeded', badge: 0 },
  { icon: Rocket, label: 'Launcher', path: '/app/launcher', badge: 0 },
  { icon: Settings, label: 'Settings', path: '/app/settings', badge: 0 },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 liquid-glass-strong border-r border-border/50 z-40"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo variant="icon" size="sm" className="h-10 w-10 object-contain" />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <Logo variant="combined" size="lg" className="w-auto max-w-full object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {primaryNav.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="my-6 h-px bg-border/50" />

        <div className="space-y-1">
          {secondaryNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isFeatured = 'featured' in item && item.featured;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive 
                    ? "text-white bg-gradient-to-r from-primary to-purple-600" 
                    : isFeatured
                      ? "bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 hover:from-primary/20 hover:to-purple-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                      {isFeatured && !isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-medium">
                          💬
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* View Role Switcher + Collapse */}
      <div className="p-3">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3"
            >
              <p className="px-4 text-xs font-medium text-muted-foreground mb-2">View As</p>
              <div className="px-2">
                <ViewRoleBadge variant="dropdown" className="w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="my-3 h-px bg-border/50" />

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
