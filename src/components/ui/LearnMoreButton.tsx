import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LearnMoreButtonProps {
  onClick: () => void;
  fullWidth?: boolean;
  variant?: "black" | "blue";
  className?: string;
}

const LearnMoreButton = ({ onClick, fullWidth = false, variant = "black", className }: LearnMoreButtonProps) => {
  const isBlue = variant === "blue";
  
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "group rounded-xl py-5 h-auto text-lg font-semibold border-2 min-h-[44px]",
        "transition-colors duration-200",
        // Variant styling
        isBlue
          ? "border-[#0000ff] text-[#0000ff] hover:bg-[#0000ff] hover:text-white"
          : "border-black text-black hover:bg-black hover:text-white",
        // Responsive width
        fullWidth 
          ? "w-full" 
          : "w-fit max-w-[340px] md:max-w-[380px] lg:max-w-[340px]",
        className
      )}
      aria-label="Learn more about SeedBase"
    >
      Learn More
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "w-5 h-5 ml-2",
          "transition-transform duration-300 ease-out",
          // Bounce animation on hover
          "group-hover:animate-bounce-subtle group-focus-visible:animate-bounce-subtle",
          // Reduced motion: no animation
          "motion-reduce:animate-none"
        )}
      />
    </Button>
  );
};

export default LearnMoreButton;
