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
 * Combines colored outer background + white InnerCard as ONE unit
 * 
 * Sizing (InnerCard + consistent ~64px padding):
 * - Mobile: 300×300px (scales down smoothly)
 * - Small Mobile: 344×344px
 * - Tablet: 484×484px
 * - Desktop: 404×404px
 */
const FeatureSquareCard = ({ 
  bgColor, 
  bgImage, 
  children, 
  className,
  animate = false 
}: FeatureSquareCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        // LOCKED ASPECT RATIO - prevents distortion
        "aspect-square",
        // RESPONSIVE SIZE - scales down on small screens
        "w-full",
        "max-w-[300px]",
        "sm:max-w-[344px]",
        "md:max-w-[484px]",
        "lg:max-w-[404px]",
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
  );
};

export default FeatureSquareCard;
