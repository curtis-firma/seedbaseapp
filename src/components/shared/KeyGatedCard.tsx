import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { KeyType } from '@/types/seedbase';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface KeyGatedCardProps {
  requiredKey: KeyType;
  children: ReactNode;
  className?: string;
  unlockMessage?: string;
}

const keyConfig = {
  SeedKey: {
    name: 'SeedKey',
    description: 'Commit capital to activate',
    gradient: 'gradient-seed',
    action: 'Become an Activator',
  },
  BaseKey: {
    name: 'BaseKey',
    description: 'Apply to govern a Seedbase',
    gradient: 'gradient-trust',
    action: 'Apply as Trustee',
  },
  MissionKey: {
    name: 'MissionKey',
    description: 'Get approved to execute missions',
    gradient: 'gradient-envoy',
    action: 'Apply as Envoy',
  },
};

export function KeyGatedCard({ requiredKey, children, className, unlockMessage }: KeyGatedCardProps) {
  const { isKeyActive } = useUser();
  const hasAccess = isKeyActive(requiredKey);
  const config = keyConfig[requiredKey];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "relative rounded-2xl border border-border/50 overflow-hidden",
        className
      )}
    >
      {/* Blurred Content */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4", config.gradient)}
        >
          <Lock className="h-7 w-7 text-white" />
        </motion.div>
        <h4 className="font-semibold text-lg mb-1">{config.name} Required</h4>
        <p className="text-muted-foreground text-sm text-center mb-4 max-w-xs">
          {unlockMessage || config.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn("px-6 py-3 rounded-xl text-white font-medium", config.gradient)}
        >
          {config.action}
        </motion.button>
      </div>
    </motion.div>
  );
}
