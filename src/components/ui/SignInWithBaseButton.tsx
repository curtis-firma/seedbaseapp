import { cn } from "@/lib/utils";

interface SignInWithBaseButtonProps {
  variant?: "solid" | "transparent";
  colorScheme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * Sign in with Base button following Base brand guidelines
 * - Rounded rectangle (rounded-xl), NOT pill
 * - Small square icon on the left with Base blue
 * - Padding rule: minimum 1× the mark height on all sides
 */
export function SignInWithBaseButton({ 
  variant = "solid",
  colorScheme = "light",
  size = "md",
  className,
  onClick,
  fullWidth = false,
  disabled = false,
}: SignInWithBaseButtonProps) {
  // Size configurations following Base 1× padding rule
  // Icon size determines minimum padding
  const sizes = {
    sm: "h-12 px-5 text-sm gap-3", // 16px icon → 20px padding
    md: "h-14 px-6 text-base gap-3.5", // 20px icon → 24px padding
    lg: "h-16 px-8 text-lg gap-4", // 24px icon → 32px padding
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
        return "bg-foreground text-background hover:bg-foreground/90";
      } else {
        // Light solid: white bg, black text
        return "bg-background text-foreground border border-border hover:bg-muted";
      }
    } else {
      // Transparent variant
      if (colorScheme === "dark") {
        return "bg-transparent text-foreground border-2 border-foreground hover:bg-foreground/10";
      } else {
        return "bg-transparent text-background border-2 border-background hover:bg-background/10";
      }
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base shape: rounded rectangle (NOT pill)
        "rounded-xl",
        // Layout
        "inline-flex items-center justify-center font-semibold",
        // Transitions
        "transition-all duration-200",
        "active:scale-[0.98]",
        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Size
        sizes[size],
        // Colors
        getStyles(),
        // Width
        fullWidth && "w-full",
        className
      )}
    >
      {/* Blue square icon - slightly rounded corners per Base brand */}
      <span
        className={cn(
          "rounded-sm flex-shrink-0 bg-[#0000ff]",
          iconSizes[size]
        )}
      />
      <span>Sign in with Base</span>
    </button>
  );
}
