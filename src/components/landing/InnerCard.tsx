import { cn } from "@/lib/utils";

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * InnerCard - Canonical sizing container for landing page cards
 * TRANSPARENT - only controls size, children provide their own styling
 * 
 * Sizing tokens (consistent ~32px padding from outer to inner):
 * - Mobile: 280×280px (outer 344 - 64 = 280)
 * - Tablet: 420×420px (outer 484 - 64 = 420) - Scaled up proportionally
 * - Desktop: 340×340px (outer 404 - 64 = 340)
 */
const InnerCard = ({ children, className }: InnerCardProps) => {
  return (
    <div 
      className={cn(
        // RESPONSIVE SIZE - scales with parent container
        "w-[85%] h-[85%]",
        // Minimum size for readability on very small screens
        "min-w-[220px] min-h-[220px]",
        // Maximum sizes per breakpoint
        "max-w-[280px] max-h-[280px]",
        "sm:max-w-[280px] sm:max-h-[280px]",
        "md:max-w-[420px] md:max-h-[420px]",
        "lg:max-w-[340px] lg:max-h-[340px]",
        // Prevent compression and clip content
        "flex-shrink-0 overflow-hidden rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default InnerCard;
