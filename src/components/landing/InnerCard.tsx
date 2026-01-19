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
        // SIZE ONLY - no background/shadow styling (children own that)
        // Consistent padding ratio across all breakpoints
        "w-[280px] h-[280px]",           // Mobile default
        "md:w-[420px] md:h-[420px]",     // Tablet - scaled up
        "lg:w-[340px] lg:h-[340px]",     // Desktop
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
