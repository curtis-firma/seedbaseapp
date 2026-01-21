import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import seedSquareNode from '@/assets/seed-square-node.png';

interface SeedMotifButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'wallet' | 'action';
  size?: 'default' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
}

/**
 * Premium CTA button with Seedbase square motif
 * - Ring of seed blocks around button
 * - On hover: ring shifts back, arrow emerges forward
 * - Supports loading and success states
 */
export function SeedMotifButton({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  className,
  disabled = false,
  loading = false,
  success = false,
  icon,
}: SeedMotifButtonProps) {
  const baseStyles = cn(
    "relative group overflow-hidden font-semibold transition-all duration-300",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    size === 'lg' ? "py-4 px-8 text-lg rounded-2xl" : "py-3 px-6 text-base rounded-xl",
    disabled && "opacity-50 cursor-not-allowed",
    !disabled && "cursor-pointer"
  );

  const variantStyles = {
    primary: "bg-[#0000ff] text-white hover:bg-[#0000dd]",
    wallet: "bg-primary text-primary-foreground hover:bg-primary/90",
    action: "bg-card border-2 border-primary text-primary hover:bg-primary/5",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseStyles, variantStyles[variant], className)}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Seed motif blocks - positioned at corners */}
      <motion.img
        src={seedSquareNode}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 object-contain opacity-60",
          "transition-all duration-300 dark:brightness-110 dark:contrast-110",
          "group-hover:-translate-x-3 group-hover:opacity-0"
        )}
      />
      
      {/* Main content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </motion.span>
        ) : success ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex items-center gap-2"
          >
            <Check className="h-5 w-5" />
            <span>Success!</span>
          </motion.span>
        ) : (
          <>
            {icon && <span className="mr-1">{icon}</span>}
            {children}
          </>
        )}
      </span>

      {/* Arrow that slides in on hover */}
      <motion.span
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2",
          "opacity-0 translate-x-4 transition-all duration-300",
          "group-hover:opacity-100 group-hover:translate-x-0"
        )}
        aria-hidden="true"
      >
        <ArrowRight className="h-5 w-5" />
      </motion.span>
    </motion.button>
  );
}

export default SeedMotifButton;
