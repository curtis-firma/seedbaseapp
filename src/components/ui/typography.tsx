import { cn } from "@/lib/utils";
import React from "react";

/**
 * Typography System - Matches Base-style feel
 * Tight, modern grotesk with confident headings and clean body text
 */

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// H1 Hero: text-[44px] md:text-[64px] font-semibold tracking-[-0.03em] leading-[0.95]
export const Heading = ({ children, className, as: Component = "h1" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[44px] md:text-[64px] font-semibold tracking-[-0.03em] leading-[0.95] text-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};

// H2 Section: text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.05]
export const Subheading = ({ children, className, as: Component = "h2" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[28px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};

// H3 Card Title: text-[17px] font-semibold tracking-[-0.01em] leading-tight
export const CardTitle = ({ children, className, as: Component = "h3" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[17px] font-semibold tracking-[-0.01em] leading-tight text-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};

// Body: text-[15px] md:text-[16px] font-normal leading-[1.5]
export const Body = ({ children, className, as: Component = "p" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[15px] md:text-[16px] font-normal leading-[1.5] text-muted-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};

// Small/Labels: text-[12px] font-medium tracking-[0.02em] leading-[1.2]
export const Label = ({ children, className, as: Component = "span" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[12px] font-medium tracking-[0.02em] leading-[1.2] text-muted-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};

// Large body/lead text for hero descriptions
export const Lead = ({ children, className, as: Component = "p" }: TypographyProps) => {
  return (
    <Component
      className={cn(
        "text-[18px] md:text-[20px] font-normal leading-[1.5] text-muted-foreground",
        className
      )}
    >
      {children}
    </Component>
  );
};
