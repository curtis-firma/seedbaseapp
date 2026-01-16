import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layers, Wallet, MessageCircle, BarChart3, 
  Radio, Rocket, Settings, Users, ChevronLeft, ChevronRight,
  Sprout
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const primaryNav = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Layers, label: 'SeedBase', path: '/seedbase' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
];

const secondaryNav = [
  { icon: MessageCircle, label: 'OneAccord', path: '/oneaccord' },
  { icon: BarChart3, label: 'Vault', path: '/vault' },
  { icon: Radio, label: 'Seeded', path: '/seeded' },
  { icon: Rocket, label: 'Launcher', path: '/launcher' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, setActiveRole } = useUser();

  const roleConfig = {
    activator: { label: 'Activator', icon: Sprout, color: 'text-seed' },
    trustee: { label: 'Trustee', icon: Layers, color: 'text-trust' },
    envoy: { label: 'Envoy', icon: Rocket, color: 'text-envoy' },
  };

  const currentRole = roleConfig[activeRole];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="hidden md:flex flex-col h-screen fixed left-0 top-0 glass-strong border-r border-border/50 z-40"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center shadow-glow">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-xl"
            >
              Seedbase
            </motion.span>
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

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive 
                    ? "text-primary" 
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
      </nav>

      {/* Role Switcher */}
      <div className="p-3">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3"
            >
              <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Switch Role</p>
              <div className="flex gap-1 px-2">
                {(['activator', 'trustee', 'envoy'] as const).map((role) => {
                  const config = roleConfig[role];
                  return (
                    <button
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                        activeRole === role
                          ? `${config.color} bg-muted`
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {config.label}
                    </button>
                  );
                })}
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
