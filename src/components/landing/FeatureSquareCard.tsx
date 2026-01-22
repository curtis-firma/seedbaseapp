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
    // Outer wrapper - centers the fixed-size card
    <div className="flex items-center justify-center w-full mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          // RESPONSIVE SIZE:
          // Mobile: Full width with aspect-square to match parent container width
          // Tablet & Desktop: Fixed 420x420px (locked - does NOT change with hero)
          "w-full aspect-square",
          "sm:w-[420px] sm:h-[420px] sm:aspect-auto",
          "flex-shrink-0",
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
      </motion.div>
    </div>
  );
};

export default FeatureSquareCard;
