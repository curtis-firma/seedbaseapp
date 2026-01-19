import { cn } from "@/lib/utils";

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * InnerCard - Canonical sizing container for landing page cards
 * TRANSPARENT - only controls size, children provide their own styling
 * 
 * Sizing tokens:
 * - Mobile: 280×280px
 * - Tablet: 320×320px  
 * - Desktop: 340×340px
 */
const InnerCard = ({ children, className }: InnerCardProps) => {
  return (
    <div 
      className={cn(
        // SIZE ONLY - no background/shadow styling (children own that)
        "w-[280px] h-[280px]",           // Mobile default
        "md:w-[320px] md:h-[320px]",     // Tablet
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
