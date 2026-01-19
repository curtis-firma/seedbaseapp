import { cn } from "@/lib/utils";

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * InnerCard - Canonical white inner card component
 * Single source of truth for card styling across all landing page sections
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
        // Core styling - SINGLE SOURCE OF TRUTH
        "bg-white rounded-2xl overflow-hidden shadow-lg",
        // Fixed sizing tokens per breakpoint
        "w-[280px] h-[280px]",           // Mobile default
        "md:w-[320px] md:h-[320px]",     // Tablet
        "lg:w-[340px] lg:h-[340px]",     // Desktop
        // Prevent compression
        "flex-shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default InnerCard;
