import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ProfileMenuTriggerProps {
  onOpen: () => void;
}

export function ProfileMenuTrigger({ onOpen }: ProfileMenuTriggerProps) {
  const { user, avatarUrl, username } = useUser();
  
  // Use avatarUrl from context (synced with localStorage), fallback to user.avatar or DiceBear
  const displayAvatar = avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      data-tutorial="profile-menu"
      className="relative flex items-center"
    >
      {/* Combined Avatar with Hamburger Badge - Single Button */}
      <div className="relative">
        <img
          src={displayAvatar}
          alt={user.name}
          className="w-10 h-10 rounded-full bg-muted object-cover border-2 border-primary/30 hover:border-primary/50 transition-colors"
        />
        {/* Hamburger menu badge overlay */}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm border-2 border-background">
          <Menu className="h-2.5 w-2.5 text-primary-foreground" />
        </div>
      </div>
    </motion.button>
  );
}
