import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import seedButtonIcon from "@/assets/seed-button-icon.png";

interface EnterAppButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
  className?: string;
}

const EnterAppButton = ({ onClick, fullWidth = false, className }: EnterAppButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden py-5 rounded-xl font-semibold text-lg bg-[#0000ff] text-white",
        "flex items-center justify-center",
        "hover:bg-[#0000ff]/90 transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff] focus-visible:ring-offset-2",
        // Responsive width
        fullWidth 
          ? "w-full" 
          : "w-fit max-w-[340px] md:max-w-[380px] lg:max-w-[340px]",
        // Padding for icon space
        "px-14",
        className
      )}
      aria-label="Enter SeedBase app"
    >
      {/* Seed icon - absolute left, slides out on hover */}
      <img
        src={seedButtonIcon}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute left-4 w-6 h-6 object-contain",
          "transition-transform duration-300 ease-out",
          "group-hover:-translate-x-12 group-focus-visible:-translate-x-12",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
        )}
      />

      {/* Text - centered, stable */}
      <span className="relative z-10">Enter App</span>

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
    </button>
  );
};

export default EnterAppButton;
