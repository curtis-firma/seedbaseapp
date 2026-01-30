import { cn } from '@/lib/utils';

// New Seedbase brand assets
import seedbaseIconBlue from '@/assets/seedbase-icon-blue.png';
import seedbaseWordmarkWhite from '@/assets/seedbase-wordmark-white.png';
import seedbaseWordmarkBlack from '@/assets/seedbase-wordmark-black.png';
import seedbaseWordmarkBlue from '@/assets/seedbase-wordmark-blue.png';

type LogoVariant = 'icon' | 'wordmark' | 'full';
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  forceDark?: boolean; // Force dark mode assets (white wordmark for dark backgrounds)
  forceLight?: boolean; // Force light mode assets (black wordmark for light backgrounds)
}

const iconSizes: Record<LogoSize, string> = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
};

const wordmarkSizes: Record<LogoSize, string> = {
  xs: 'h-5 w-auto',
  sm: 'h-7 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-12 w-auto'
};

/**
 * Canonical Logo component for Seedbase brand.
 * 
 * The icon is always the blue square (works on any background).
 * 
 * Variants:
 * - icon: Just the Seedbase blue square icon
 * - wordmark: Just the Seedbase text
 * - full: Icon + Wordmark side by side
 * 
 * For dark backgrounds: use forceDark={true} → white wordmark
 * For light backgrounds: use forceLight={true} → black wordmark
 * For themed pages: leave both false to auto-detect via CSS
 */
export function Logo({
  variant = 'icon',
  size = 'md',
  className,
  forceDark = false,
  forceLight = false
}: LogoProps) {
  // The blue icon works universally on both light and dark backgrounds
  const renderIcon = (sizeClass: string) => (
    <img 
      src={seedbaseIconBlue} 
      alt="Seedbase" 
      className={cn(sizeClass, className)} 
    />
  );

  const renderWordmark = (sizeClass: string) => {
    if (forceDark) {
      // White wordmark for dark backgrounds
      return <img src={seedbaseWordmarkWhite} alt="Seedbase" className={cn(sizeClass, className)} />;
    }
    if (forceLight) {
      // Black wordmark for light backgrounds
      return <img src={seedbaseWordmarkBlack} alt="Seedbase" className={cn(sizeClass, className)} />;
    }
    // Auto-detect: black wordmark in light mode, white wordmark in dark mode
    return (
      <div className="flex items-center justify-center">
        <img 
          src={seedbaseWordmarkBlack} 
          alt="Seedbase" 
          className={cn(sizeClass, 'dark:hidden', className)} 
        />
        <img 
          src={seedbaseWordmarkWhite} 
          alt="Seedbase" 
          className={cn(sizeClass, 'hidden dark:block', className)} 
        />
      </div>
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
  seedbaseIconBlue, 
  seedbaseWordmarkWhite, 
  seedbaseWordmarkBlack, 
  seedbaseWordmarkBlue 
};
