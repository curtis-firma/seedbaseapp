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
    <div className="relative flex items-center gap-2">
      {/* Avatar - navigates to profile */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAvatarClick}
        className="relative"
      >
        <img
          src={displayAvatar}
          alt={user.name}
          className="w-10 h-10 rounded-xl bg-muted object-cover"
        />
      </motion.button>
      
      {/* Menu button - opens drawer */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center"
      >
        <Menu className="h-4 w-4 text-muted-foreground" />
      </motion.button>
    </div>
  );
}
