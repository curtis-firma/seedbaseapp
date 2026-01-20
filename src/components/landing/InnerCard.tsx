import { cn } from "@/lib/utils";

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * InnerCard - Canonical sizing container for landing page cards
 * TRANSPARENT - only controls size, children provide their own styling
 * 
 * Fixed desktop size: 340×340px
 * Parent FeatureSquareCard handles responsive scaling via CSS transform
 */
const InnerCard = ({ children, className }: InnerCardProps) => {
  return (
    <div 
      className={cn(
        // Fixed size - parent handles responsive scaling
        "w-[340px] h-[340px]",
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
