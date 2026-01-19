import { cn } from "@/lib/utils";
import InnerCard from "./InnerCard";

interface FeatureSquareCardProps {
  bgColor: string;
  bgImage?: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

/**
 * FeatureSquareCard - Canonical grouped wrapper component
 * Combines colored outer background + white InnerCard as ONE unit
 * 
 * Sizing (InnerCard + 64px padding):
 * - Mobile: 344×344px (280 + 64)
 * - Tablet: 384×384px (320 + 64)
 * - Desktop: 404×404px (340 + 64)
 */
const FeatureSquareCard = ({ 
  bgColor, 
  bgImage, 
  children, 
  className,
  animate = false 
}: FeatureSquareCardProps) => {
  return (
    <div 
      className={cn(
        // LOCKED ASPECT RATIO - prevents distortion
        "aspect-square",
        // FIXED SIZE with min/max constraints - prevents flex/grid shrinking/stretching
        "w-full",
        "max-w-[344px] min-w-[344px]",
        "md:max-w-[384px] md:min-w-[384px]",
        "lg:max-w-[404px] lg:min-w-[404px]",
        // Prevent flex shrink - critical for desktop grid layouts
        "flex-none shrink-0",
        // Outer styling
        "rounded-3xl md:rounded-[32px]",
        "flex items-center justify-center",
        "overflow-hidden",
        // Apply bgColor only if no bgImage
        !bgImage && bgColor,
        // Optional hover animation
        animate && "transition-transform hover:scale-[1.01] duration-300",
        className
      )}
      style={bgImage ? { 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      <InnerCard>
        {children}
      </InnerCard>
    </div>
  );
};

export default FeatureSquareCard;
