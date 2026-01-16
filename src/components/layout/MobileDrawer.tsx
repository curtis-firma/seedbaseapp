import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layers, Wallet, MessageCircle, BarChart3, 
  Radio, Rocket, Settings, X, Sprout, ChevronRight
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const primaryNav = [
  { icon: Home, label: 'Home', path: '/', description: 'Your social feed' },
  { icon: Layers, label: 'SeedBase', path: '/seedbase', description: 'Hub for your role' },
  { icon: Wallet, label: 'Wallet', path: '/wallet', description: 'Balance & keys' },
];

const secondaryNav = [
  { icon: MessageCircle, label: 'OneAccord', path: '/oneaccord', description: 'Messages & transfers' },
  { icon: BarChart3, label: 'Vault', path: '/vault', description: 'Analytics & data' },
  { icon: Radio, label: 'Seeded', path: '/seeded', description: 'Community hub' },
  { icon: Rocket, label: 'Launcher', path: '/launcher', description: 'Create new' },
  { icon: Settings, label: 'Settings', path: '/settings', description: 'Preferences' },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, setActiveRole } = useUser();

  const roleConfig = {
    activator: { label: 'Activator', icon: Sprout, color: 'text-seed', gradient: 'gradient-seed', description: 'Commit capital & grow the network' },
    trustee: { label: 'Trustee', icon: Layers, color: 'text-trust', gradient: 'gradient-trust', description: 'Govern seedbases & launch missions' },
    envoy: { label: 'Envoy', icon: Rocket, color: 'text-envoy', gradient: 'gradient-envoy', description: 'Execute missions & report impact' },
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[300px] bg-card border-r border-border/50 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center shadow-glow">
                  <Sprout className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">Seedbase</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Role Switcher */}
            <div className="p-4 border-b border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-3">CURRENT ROLE</p>
              <div className="space-y-2">
                {(['activator', 'trustee', 'envoy'] as const).map((role) => {
                  const config = roleConfig[role];
                  const Icon = config.icon;
                  const isActive = activeRole === role;

                  return (
                    <motion.button
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        isActive 
                          ? `${config.gradient} text-white` 
                          : "hover:bg-muted"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn("h-5 w-5", !isActive && config.color)} />
                      <div className="text-left flex-1">
                        <p className="font-medium">{config.label}</p>
                        <p className={cn("text-xs", isActive ? "text-white/80" : "text-muted-foreground")}>
                          {config.description}
                        </p>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">NAVIGATE</p>
              <div className="space-y-1">
                {primaryNav.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="my-4 h-px bg-border/50" />

              <p className="text-xs font-medium text-muted-foreground mb-3">MORE</p>
              <div className="space-y-1">
                {secondaryNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center italic">
                "Commitment creates capacity."
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
