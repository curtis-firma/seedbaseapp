import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ProfileMenuTriggerProps {
  onOpen: () => void;
}

export function ProfileMenuTrigger({ onOpen }: ProfileMenuTriggerProps) {
  const { user } = useUser();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onOpen}
      className="relative flex items-center gap-2"
    >
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-xl bg-muted object-cover"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-card border border-border/50 flex items-center justify-center shadow-sm">
          <Menu className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </motion.button>
  );
}
