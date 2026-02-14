import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

// Role config for shiny gradient pill styling
const roleConfig = {
  activator: { label: 'Seeder', gradient: 'gradient-seed' },
  trustee: { label: 'Trustee', gradient: 'gradient-trust' },
  envoy: { label: 'Envoy', gradient: 'gradient-envoy' },
};

interface ProfileMenuTriggerProps {
  onOpen: () => void;
}

export function ProfileMenuTrigger({ onOpen }: ProfileMenuTriggerProps) {
  const { user, avatarUrl, username, viewRole } = useUser();
  
  const displayAvatar = avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;
  const config = roleConfig[viewRole] || roleConfig.activator;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      data-tutorial="profile-menu"
      className={cn(
        "relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-full",
        config.gradient,
        "text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-shadow"
      )}
    >
      {/* Avatar */}
      <img
        src={displayAvatar}
        alt={user.name}
        className="w-8 h-8 rounded-full bg-white/20 object-cover border-2 border-white/40"
      />
      
      {/* Role label */}
      <span className="text-sm font-semibold">
        {config.label}
      </span>
      
      {/* Hamburger icon */}
      <Menu className="h-4 w-4 text-white/90" />
    </motion.button>
  );
}
