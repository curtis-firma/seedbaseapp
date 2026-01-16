import { motion } from 'framer-motion';
import { Eye, Sprout, Shield, Rocket } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/seedbase';
import { cn } from '@/lib/utils';

const roleConfig: Record<UserRole, {
  icon: typeof Sprout;
  label: string;
  gradient: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  activator: {
    icon: Sprout,
    label: 'Activator',
    gradient: 'gradient-seed',
    bgClass: 'bg-seed/10',
    textClass: 'text-seed',
    borderClass: 'border-seed/30',
  },
  trustee: {
    icon: Shield,
    label: 'Trustee',
    gradient: 'gradient-trust',
    bgClass: 'bg-trust/10',
    textClass: 'text-trust',
    borderClass: 'border-trust/30',
  },
  envoy: {
    icon: Rocket,
    label: 'Envoy',
    gradient: 'gradient-envoy',
    bgClass: 'bg-envoy/10',
    textClass: 'text-envoy',
    borderClass: 'border-envoy/30',
  },
};

const roles: UserRole[] = ['activator', 'trustee', 'envoy'];

interface ViewRoleBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ViewRoleBadge({ variant = 'compact', className }: ViewRoleBadgeProps) {
  const { viewRole, setViewRole, activeRole } = useUser();

  return (
    <div className={cn("flex gap-2", className)}>
      {roles.map((role) => {
        const config = roleConfig[role];
        const isSelected = viewRole === role;
        const Icon = config.icon;

        return (
          <motion.button
            key={role}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewRole(role)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-1",
              isSelected 
                ? `${config.gradient} text-white shadow-md` 
                : `${config.bgClass} ${config.textClass} hover:opacity-80`
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {variant === 'full' && (
              <span className="text-sm font-medium truncate">
                {config.label}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Floating badge that shows when viewing as different role
export function ViewingAsBadge() {
  const { viewRole, activeRole } = useUser();
  const isViewingAsOther = viewRole !== activeRole;

  if (!isViewingAsOther) return null;

  const config = roleConfig[viewRole];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 md:left-[calc(260px+50%)] md:-translate-x-1/2"
    >
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border shadow-card",
        config.bgClass,
        config.borderClass
      )}>
        <Eye className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Viewing as {config.label}</span>
      </div>
    </motion.div>
  );
}
