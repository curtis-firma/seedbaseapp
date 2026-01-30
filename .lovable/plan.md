
# Add Combined Logo Assets and Update Logo Component

## What You Asked For

You want to use the combined logo (blue icon box + wordmark together) with:
- **Black text** on light/white backgrounds (default)  
- **White text** only on black/dark backgrounds

## New Assets to Add

I'll add your uploaded files to the assets folder:

| File | Purpose |
|------|---------|
| `Frame_22-2.png` → `seedbase-combined-black.png` | Blue box + black wordmark (for light backgrounds) |
| `seedwhite-2.png` → `seedbase-combined-white.png` | Blue box + white wordmark (for dark backgrounds) |
| `Seed_wordmark.svg` → `seedbase-wordmark.svg` | SVG wordmark for scalable use |

---

## Logo Component Updates

### New Variant: `combined`

```text
variant="combined" → Single image of blue box + wordmark side-by-side
- Default: Black text version (light backgrounds)
- forceDark={true}: White text version (dark backgrounds)
```

### Updated Size System

```text
combinedSizes: Record<LogoSize, string> = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto', 
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
}
```

---

## Files to Update

### 1. Add new assets
- Copy `Frame_22-2.png` → `src/assets/seedbase-combined-black.png`
- Copy `seedwhite-2.png` → `src/assets/seedbase-combined-white.png`

### 2. Update Logo component (`src/components/shared/Logo.tsx`)
- Import new combined assets
- Add `combined` variant type
- Add `combinedSizes` record
- Add `renderCombined()` function that shows:
  - Black text version by default (for light backgrounds)
  - White text version when `forceDark={true}` (for dark backgrounds)

### 3. Update Landing Page (`src/components/sections/ScrollingLandingPage.tsx`)
- Replace `seedbaseWordmarkBlack` import with `Logo` component
- Use `<Logo variant="combined" size="lg" />` in hero header

### 4. Update App Header (`src/components/layout/AppLayout.tsx`)
- Update mobile header to use `<Logo variant="combined" size="sm" />`

### 5. Update Splash Screen (`src/components/shared/AppSplashScreen.tsx`)
- Use `<Logo variant="combined" size="xl" forceDark />` for dark background splash

### 6. Other usages
- `WelcomeWalkthrough.tsx` - Update to use combined variant
- Any other places showing icon + wordmark separately

---

## Usage Examples After Update

```tsx
// Light background (default) - blue box + black text
<Logo variant="combined" size="lg" />

// Dark background - blue box + white text
<Logo variant="combined" size="lg" forceDark />

// Just the icon
<Logo variant="icon" size="md" />

// Just the wordmark (legacy)
<Logo variant="wordmark" size="sm" />
```

---

## Technical Details

### Logo.tsx changes

```typescript
// New imports
import seedbaseCombinedBlack from '@/assets/seedbase-combined-black.png';
import seedbaseCombinedWhite from '@/assets/seedbase-combined-white.png';

// Updated variant type
type LogoVariant = 'icon' | 'wordmark' | 'full' | 'combined';

// New size record
const combinedSizes: Record<LogoSize, string> = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
};

// New render function
const renderCombined = (sizeClass: string) => {
  if (forceDark) {
    // White text for dark backgrounds
    return <img src={seedbaseCombinedWhite} alt="Seedbase" className={cn(sizeClass, className)} />;
  }
  // Default: Black text for light backgrounds
  return <img src={seedbaseCombinedBlack} alt="Seedbase" className={cn(sizeClass, className)} />;
};
```

---

## Summary

| Location | Before | After |
|----------|--------|-------|
| Landing hero | `seedbaseWordmarkBlack` image | `<Logo variant="combined" size="lg" />` |
| App header | `<Logo variant="wordmark" />` | `<Logo variant="combined" size="sm" />` |
| Splash screen | `<Logo variant="full" forceDark />` | `<Logo variant="combined" forceDark />` |
| Welcome walkthrough | `<Logo variant="wordmark" />` | `<Logo variant="combined" />` |
