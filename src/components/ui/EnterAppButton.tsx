import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import seedButtonIcon from "@/assets/seed-button-white.png";

interface EnterAppButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
  className?: string;
}

const EnterAppButton = ({ onClick, fullWidth = false, className }: EnterAppButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        // Base-style: rounded rectangle, NOT pill
        "group relative overflow-hidden rounded-xl font-semibold text-base bg-[#0000ff] text-white",
        // Height: h-14 (56px) with proper horizontal padding for icon space
        "h-14 px-14",
        "flex items-center justify-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff] focus-visible:ring-offset-2",
        // Responsive width
        fullWidth 
          ? "w-full" 
          : "w-fit max-w-[340px] md:max-w-[380px] lg:max-w-[340px]",
        className
      )}
      whileHover={{ scale: 1.02, backgroundColor: "#0000dd" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label="Enter SeedBase app"
    >
      {/* Seed icon - absolute left, slides out on hover */}
      <img
        src={seedButtonIcon}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute left-4 w-7 h-7 object-contain",
          "transition-transform duration-300 ease-out",
          "group-hover:-translate-x-12 group-focus-visible:-translate-x-12",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
        )}
      />

      {/* Text - centered, stable */}
      <span className="relative z-10 font-bold tracking-tight">Enter App</span>

      {/* Arrow icon - absolute right, slides in on hover */}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          "absolute right-4 w-5 h-5",
          "translate-x-10 transition-transform duration-300 ease-out",
          "group-hover:translate-x-0 group-focus-visible:translate-x-0",
          // Reduced motion: always visible
          "motion-reduce:transition-none motion-reduce:translate-x-0"
        )}
      />
    </motion.button>
  );
};

export default EnterAppButton;
