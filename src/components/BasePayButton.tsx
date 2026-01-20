import { cn } from "@/lib/utils";

interface BasePayButtonProps {
  variant?: "solid" | "transparent";
  colorScheme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

/**
 * Base Pay button following Coinbase/Base UX design principles
 * - Rounded pill shape
 * - Small square icon on the left
 * - Clean, minimal aesthetic
 */
export function BasePayButton({ 
  variant = "solid",
  colorScheme = "dark",
  size = "md",
  className,
  onClick,
  fullWidth = false,
}: BasePayButtonProps) {
  const sizes = {
    sm: "h-10 px-4 text-sm gap-2.5",
    md: "h-12 px-5 text-base gap-3",
    lg: "h-14 px-6 text-lg gap-3.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // Determine colors based on variant and colorScheme
  const getStyles = () => {
    if (variant === "solid") {
      if (colorScheme === "dark") {
        // Dark solid: black bg, white text
        return "bg-foreground text-background";
      } else {
        // Light solid: white bg, black text
        return "bg-background text-foreground border border-border";
      }
    } else {
      // Transparent variant
      if (colorScheme === "dark") {
        return "bg-transparent text-foreground border border-foreground";
      } else {
        return "bg-transparent text-background border border-background";
      }
    }
  };

  const getIconBg = () => {
    if (colorScheme === "dark") {
      return variant === "solid" ? "bg-primary" : "bg-foreground";
    } else {
      return variant === "solid" ? "bg-primary" : "bg-background";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200",
        "hover:opacity-90 active:scale-[0.98]",
        sizes[size],
        getStyles(),
        fullWidth && "w-full",
        className
      )}
    >
      {/* Small square icon */}
      <span
        className={cn(
          "rounded-sm flex-shrink-0",
          iconSizes[size],
          getIconBg()
        )}
      />
      <span>Base Pay</span>
    </button>
  );
}
