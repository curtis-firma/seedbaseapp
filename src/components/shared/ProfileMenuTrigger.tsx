import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface ProfileMenuTriggerProps {
  onOpen: () => void;
}

export function ProfileMenuTrigger({ onOpen }: ProfileMenuTriggerProps) {
  const navigate = useNavigate();
  const { user, avatarUrl, username } = useUser();
  
  // Use avatarUrl from context (synced with localStorage), fallback to user.avatar or DiceBear
  const displayAvatar = avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;

  const handleAvatarClick = () => {
    navigate('/app/profile');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      data-tutorial="profile-menu"
      className="relative flex items-center gap-2 group"
    >
      {/* Avatar */}
      <img
        src={displayAvatar}
        alt={user.name}
        className="w-10 h-10 rounded-full bg-muted object-cover border-2 border-border/50"
        onClick={(e) => {
          e.stopPropagation();
          handleAvatarClick();
        }}
      />
      
      {/* Hamburger menu icon */}
      <div className="w-8 h-8 rounded-lg bg-muted/50 group-hover:bg-muted flex items-center justify-center transition-colors">
        <Menu className="h-5 w-5 text-muted-foreground" />
      </div>
    </motion.button>
  );
}
