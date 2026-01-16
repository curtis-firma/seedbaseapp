import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Eye, Sprout, Shield, Rocket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/seedbase';
import { cn } from '@/lib/utils';

const roleConfig = {
  activator: {
    icon: Sprout,
    label: 'Activator',
    gradient: 'gradient-seed',
    bgClass: 'bg-seed/10',
    textClass: 'text-seed',
  },
  trustee: {
    icon: Shield,
    label: 'Trustee',
    gradient: 'gradient-trust',
    bgClass: 'bg-trust/10',
    textClass: 'text-trust',
  },
  envoy: {
    icon: Rocket,
    label: 'Envoy',
    gradient: 'gradient-envoy',
    bgClass: 'bg-envoy/10',
    textClass: 'text-envoy',
  },
};

interface ViewRoleBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ViewRoleBadge({ variant = 'compact', className }: ViewRoleBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { viewRole, setViewRole, activeRole } = useUser();

  const currentConfig = roleConfig[viewRole];
  const isViewingAsOther = viewRole !== activeRole;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setViewRole(role);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
          isViewingAsOther 
            ? "bg-primary/10 border border-primary/30" 
            : "hover:bg-muted"
        )}
      >
        {isViewingAsOther && <Eye className="h-3.5 w-3.5 text-primary" />}
        <currentConfig.icon className={cn("h-4 w-4", currentConfig.textClass)} />
        {variant === 'full' && (
          <span className={cn("text-sm font-medium", currentConfig.textClass)}>
            {currentConfig.label}
          </span>
        )}
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden"
          >
            <div className="p-1.5">
              <p className="px-3 py-2 text-xs text-muted-foreground font-medium">
                View as role
              </p>
              
              {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                const config = roleConfig[role];
                const isSelected = viewRole === role;
                const isActualRole = activeRole === role;

                return (
                  <motion.button
                    key={role}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                      isSelected ? config.bgClass : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      config.gradient
                    )}>
                      <config.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium text-sm",
                        isSelected && config.textClass
                      )}>
                        {config.label}
                      </p>
                      {isActualRole && (
                        <p className="text-xs text-muted-foreground">Your role</p>
                      )}
                    </div>
                    {isSelected && (
                      <div className={cn("w-2 h-2 rounded-full", config.gradient)} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        `border-${viewRole === 'activator' ? 'seed' : viewRole === 'trustee' ? 'trust' : 'envoy'}/30`
      )}>
        <Eye className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Viewing as {config.label}</span>
      </div>
    </motion.div>
  );
}
