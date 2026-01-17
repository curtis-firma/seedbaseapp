import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import whiteRing from "@/assets/white-ring.png";

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  /** Show the white ring animation on the left (default: true) */
  showRing?: boolean;
  /** Show the arrow on hover (default: true) */
  showArrow?: boolean;
  /** Custom icon to show instead of arrow on hover */
  hoverIcon?: React.ReactNode;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ 
    className, 
    children, 
    showRing = true, 
    showArrow = true,
    hoverIcon,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "group relative rounded-xl py-3 px-4 text-base font-semibold bg-[#0052FF] hover:bg-[#0052FF]/90 text-white w-full",
          className
        )}
        {...props}
      >
        {/* Button Text */}
        <span>{children}</span>
        
        {/* Arrow/Icon - shown inline */}
        {showArrow && (
          <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
        )}
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
