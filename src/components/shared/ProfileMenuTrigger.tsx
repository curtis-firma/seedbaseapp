import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

// Role config for pill styling
const roleConfig = {
  activator: { label: 'Activator', bg: 'bg-seed/20', text: 'text-seed', border: 'border-seed/40' },
  trustee: { label: 'Trustee', bg: 'bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/40' },
  envoy: { label: 'Envoy', bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/40' },
};

interface ProfileMenuTriggerProps {
  onOpen: () => void;
}

export function ProfileMenuTrigger({ onOpen }: ProfileMenuTriggerProps) {
  const { user, avatarUrl, username, viewRole } = useUser();
  
  // Use avatarUrl from context (synced with localStorage), fallback to user.avatar or DiceBear
  const displayAvatar = avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;
  const config = roleConfig[viewRole] || roleConfig.activator;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      data-tutorial="profile-menu"
      className={cn(
        "relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all",
        config.bg,
        config.border,
        "hover:shadow-md active:scale-[0.98]"
      )}
    >
      {/* Avatar with glow ring */}
      <div className="relative">
        <div className={cn(
          "absolute inset-0 rounded-full blur-sm opacity-50",
          config.bg
        )} />
        <img
          src={displayAvatar}
          alt={user.name}
          className={cn(
            "relative w-8 h-8 rounded-full bg-muted object-cover border-2",
            config.border
          )}
        />
      </div>
      
      {/* Role label */}
      <span className={cn(
        "text-sm font-semibold",
        config.text
      )}>
        {config.label}
      </span>
      
      {/* Hamburger icon */}
      <Menu className={cn("h-4 w-4", config.text)} />
    </motion.button>
  );
}
