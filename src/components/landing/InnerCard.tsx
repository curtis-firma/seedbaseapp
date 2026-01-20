import { cn } from "@/lib/utils";

interface InnerCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * InnerCard - Canonical sizing container for landing page cards
 * Uses percentage-based sizing to fill parent and scale naturally
 */
const InnerCard = ({ children, className }: InnerCardProps) => {
  return (
    <div 
      className={cn(
        // Fill 84% of parent to create padding around the white card
        "w-[84%] h-[84%]",
        // Clip content and round corners
        "overflow-hidden rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default InnerCard;
