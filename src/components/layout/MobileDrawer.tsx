import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layers, Wallet, MessageCircle, BarChart3, 
  Radio, Rocket, Settings, X, ChevronRight,
  ChevronDown, Eye, EyeOff
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import seedbaseIcon from '@/assets/seedbase-icon.png';
import seedbaseWordmark from '@/assets/seedbase-wordmark.svg';

const menuNav = [
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
  const { activeRole, setActiveRole, walkthroughMode, setWalkthroughMode } = useUser();

  const roleConfig = {
    activator: { label: 'Activator', icon: Home, color: 'text-seed', gradient: 'gradient-seed', description: 'Commit capital & grow' },
    trustee: { label: 'Trustee', icon: Layers, color: 'text-trust', gradient: 'gradient-trust', description: 'Govern & launch' },
    envoy: { label: 'Envoy', icon: Rocket, color: 'text-envoy', gradient: 'gradient-envoy', description: 'Execute & report' },
  };

  const currentRole = roleConfig[activeRole];

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
                <img src={seedbaseIcon} alt="Seedbase" className="w-10 h-10" />
                <img src={seedbaseWordmark} alt="Seedbase" className="h-5" />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">MENU</p>
              <div className="space-y-1">
                {menuNav.map((item) => {
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

            {/* Footer - Role Switcher + Walkthrough */}
            <div className="p-4 border-t border-border/50 space-y-4">
              {/* Walkthrough Toggle */}
              <motion.button
                onClick={() => setWalkthroughMode(!walkthroughMode)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {walkthroughMode ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium text-sm">Walkthrough</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  walkthroughMode ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {walkthroughMode ? 'ON' : 'OFF'}
                </span>
              </motion.button>

              {/* Role Switcher - Colorful Buttons */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">SWITCH ROLE</p>
                <div className="flex gap-2">
                  {(['activator', 'trustee', 'envoy'] as const).map((role) => {
                    const config = roleConfig[role];
                    const isActive = activeRole === role;
                    return (
                      <motion.button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          isActive
                            ? `${config.gradient} text-white shadow-lg`
                            : `bg-muted/50 ${config.color} hover:bg-muted`
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        {config.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center italic pt-2">
                "Commitment creates capacity."
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
