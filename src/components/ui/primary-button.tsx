import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  showRing?: boolean;
  showArrow?: boolean;
  hoverIcon?: React.ReactNode;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, showRing = true, showArrow = true, hoverIcon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative bg-primary text-primary-foreground hover:bg-primary/90",
          "font-semibold text-base",
          "rounded-xl px-6 py-3 h-auto",
          "transition-all duration-300",
          "group",
          showRing && "ring-4 ring-primary/20 hover:ring-primary/30",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
