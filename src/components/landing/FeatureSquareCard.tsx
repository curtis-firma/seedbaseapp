import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
 * Uses CSS transform scale to shrink uniformly on mobile
 * 
 * Fixed desktop size: 404×404px
 * Scales down via transform on smaller viewports
 */
const FeatureSquareCard = ({ 
  bgColor, 
  bgImage, 
  children, 
  className,
  animate = false 
}: FeatureSquareCardProps) => {
  return (
    // Outer wrapper - full width of parent, card scales inside
    // Parent (MobileScrollNarrative) has px-4 padding, so this respects that
    <div className={cn(
      "flex items-center justify-center",
      // Full width on mobile to align with buttons/hero, constrained on larger screens
      "w-full sm:max-w-[340px] md:max-w-[484px]",
      "aspect-square",
      "mx-auto"
    )}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          // Use percentage-based width to fill container, max out at 404px for desktop
          "w-full max-w-[404px] aspect-square",
          // No scale transform - let container control size
          "origin-center",
          // Outer styling
          "rounded-3xl md:rounded-[32px]",
          "flex items-center justify-center",
          "overflow-hidden flex-shrink-0",
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
      </motion.div>
    </div>
  );
};

export default FeatureSquareCard;
