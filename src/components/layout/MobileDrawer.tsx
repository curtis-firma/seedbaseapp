import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, BarChart3, ShoppingBag, Rocket, Settings, X, HelpCircle, LogOut, Vote, Users
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { ViewRoleBadge } from '@/components/shared/ViewRoleBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/Logo';
import { useSocialHandles } from '@/hooks/useSocialHandles';
import { AffiliateExplainerModal } from '@/components/shared/AffiliateExplainerModal';

const menuNav = [
  { icon: MessageCircle, label: 'OneAccord', path: '/app/oneaccord', description: 'Messages, emojis & transfers 💬', badge: 0, featured: true },
  { icon: BarChart3, label: 'Vault', path: '/app/vault', description: 'Analytics & data', badge: 0 },
  { icon: Vote, label: 'Governance', path: '/app/governance', description: 'Vote & amplify', badge: 3 },
  { icon: ShoppingBag, label: 'Shop', path: '/app/seeded', description: 'Merch & movement', badge: 0 },
  { icon: Rocket, label: 'Launcher', path: '/app/launcher', description: 'Create new', badge: 0 },
  { icon: Settings, label: 'Settings', path: '/app/settings', description: 'Preferences', badge: 0 },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowWalkthrough?: () => void;
}

export function MobileDrawer({ isOpen, onClose, onShowWalkthrough }: MobileDrawerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, displayName, activeRole, user, logout, isAuthenticated, avatarUrl } = useUser();
  const { xHandle, baseHandle, hasHandles } = useSocialHandles();
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  
  // Use avatarUrl from context for synced avatar
  const displayAvatar = avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleShowWalkthroughClick = () => {
    onClose();
    onShowWalkthrough?.();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
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
            {/* Header - Full Logo on LEFT, Close on RIGHT */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-border/50">
              <Logo variant="wordmark" size="sm" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* User Profile Section - Clickable to navigate to profile */}
            {username && (
              <motion.div 
                className="px-6 py-4 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleNavigate('/app/profile')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={displayAvatar} alt={displayName || username} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {(displayName || username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{displayName || username}</p>
                    <p className="text-sm text-muted-foreground">@{username}</p>
                    {hasHandles && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {xHandle && <span>X: @{xHandle.replace('@', '')}</span>}
                        {xHandle && baseHandle && <span> · </span>}
                        {baseHandle && <span>Base: @{baseHandle.replace('@', '')}</span>}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">View Profile →</span>
                </div>
              </motion.div>
            )}

            {/* View Role Switcher */}
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">VIEW AS</p>
              <ViewRoleBadge variant="full" className="w-full" />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 px-1">MENU</p>
              <div className="space-y-1">
                {menuNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  const isFeatured = 'featured' in item && item.featured;

                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-purple-600 text-white" 
                          : isFeatured
                            ? "bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                            : "hover:bg-muted"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <Icon className={cn("h-5 w-5", isFeatured && !isActive && "text-primary")} />
                        {item.badge > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <p className={cn("font-medium", isFeatured && !isActive && "text-primary")}>{item.label}</p>
                        <p className={cn("text-xs", isActive ? "text-white/70" : "text-muted-foreground")}>{item.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-2">
              {/* Affiliate Explainer Button */}
              <motion.button
                onClick={() => setShowAffiliateModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">How Affiliates Work</span>
                </div>
              </motion.button>

              {/* Walkthrough Button */}
              <motion.button
                onClick={handleShowWalkthroughClick}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">Show Walkthrough</span>
                </div>
              </motion.button>

              {/* Logout Button */}
              {isAuthenticated && (
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Log Out</span>
                  </div>
                </motion.button>
              )}

              <p className="text-xs text-muted-foreground text-center italic pt-2">
                "Commitment creates capacity."
              </p>
            </div>
          </motion.div>
          
          {/* Affiliate Explainer Modal */}
          <AffiliateExplainerModal 
            isOpen={showAffiliateModal} 
            onClose={() => setShowAffiliateModal(false)} 
          />
        </>
      )}
    </AnimatePresence>
  );
}