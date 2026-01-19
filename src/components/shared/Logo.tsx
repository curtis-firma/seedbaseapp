import { cn } from '@/lib/utils';

// New SeedDrop assets for light/dark mode
import seeddropIconLight from '@/assets/seeddroplogo_lightmode.png';
import seeddropIconDark from '@/assets/seeddroplogo_darkmode.png';
import seeddropTypeLight from '@/assets/seeddrop_lightmode.png';
import seeddropTypeDark from '@/assets/seeddroptype_darkmode.png';

type LogoVariant = 'icon' | 'wordmark' | 'full';
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  forceDark?: boolean; // Force dark mode assets (for light backgrounds)
  forceLight?: boolean; // Force light mode assets (for dark backgrounds)
}

const iconSizes: Record<LogoSize, string> = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
};

const wordmarkSizes: Record<LogoSize, string> = {
  xs: 'h-5 w-auto',
  sm: 'h-7 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-12 w-auto',
};

/**
 * Canonical Logo component that automatically switches between light/dark mode assets.
 * 
 * Variants:
 * - icon: Just the SeedDrop icon/symbol
 * - wordmark: Just the SeedDrop text/type
 * - full: Icon + Wordmark side by side
 * 
 * For light backgrounds (like landing page): use forceDark={true}
 * For dark backgrounds: use forceLight={true}
 * For themed pages: leave both false to auto-detect via CSS
 */
export function Logo({ 
  variant = 'icon', 
  size = 'md', 
  className,
  forceDark = false,
  forceLight = false,
}: LogoProps) {
  // Determine which assets to use
  // Light mode (light background) = show dark logo for contrast
  // Dark mode (dark background) = show light logo for contrast
  // forceDark = always show dark version (for light backgrounds)
  // forceLight = always show light version (for dark backgrounds)
  
  const renderIcon = (sizeClass: string) => {
    if (forceDark) {
      return (
        <img 
          src={seeddropIconDark} 
          alt="SeedDrop" 
          className={cn(sizeClass, className)}
        />
      );
    }
    if (forceLight) {
      return (
        <img 
          src={seeddropIconLight} 
          alt="SeedDrop" 
          className={cn(sizeClass, className)}
        />
      );
    }
    // Auto-detect: show light version in dark mode, dark version in light mode
    return (
      <>
        <img 
          src={seeddropIconDark} 
          alt="SeedDrop" 
          className={cn(sizeClass, 'dark:hidden', className)}
        />
        <img 
          src={seeddropIconLight} 
          alt="SeedDrop" 
          className={cn(sizeClass, 'hidden dark:block', className)}
        />
      </>
    );
  };

  const renderWordmark = (sizeClass: string) => {
    if (forceDark) {
      return (
        <img 
          src={seeddropTypeDark} 
          alt="SeedDrop" 
          className={cn(sizeClass, className)}
        />
      );
    }
    if (forceLight) {
      return (
        <img 
          src={seeddropTypeLight} 
          alt="SeedDrop" 
          className={cn(sizeClass, className)}
        />
      );
    }
    // Auto-detect
    return (
      <>
        <img 
          src={seeddropTypeDark} 
          alt="SeedDrop" 
          className={cn(sizeClass, 'dark:hidden', className)}
        />
        <img 
          src={seeddropTypeLight} 
          alt="SeedDrop" 
          className={cn(sizeClass, 'hidden dark:block', className)}
        />
      </>
    );
  };

  if (variant === 'icon') {
    return renderIcon(iconSizes[size]);
  }

  if (variant === 'wordmark') {
    return renderWordmark(wordmarkSizes[size]);
  }

  // Full: icon + wordmark
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {renderIcon(iconSizes[size])}
      {renderWordmark(wordmarkSizes[size])}
    </div>
  );
}

// Export individual assets for special cases
export { 
  seeddropIconLight, 
  seeddropIconDark, 
  seeddropTypeLight, 
  seeddropTypeDark 
};
