

# Fix Landing Page Logo Sizing and Consistency

## Issues Found

1. **Desktop bottom logo** (line 249 of `ScrollingLandingPage.tsx`): Uses `<Logo variant="combined" size="xl" />` which caps at `h-16`. It should stretch across the full width of the right panel instead.

2. **Desktop top-left logo** (line 155): Uses `size="lg"` (`h-12`). Slightly too small -- bump up.

3. **Mobile/tablet bottom logo** (line 167 of `MobileScrollNarrative.tsx`): Uses `seedbaseWordmarkBlack` (just the wordmark text, no blue box). It should use the same combined logo (blue box + wordmark) as desktop.

---

## Changes

### 1. `src/components/sections/ScrollingLandingPage.tsx`

**Top-left logo (line 155)**: Change `size="lg"` to `size="xl"` to make it bigger.

**Bottom logo (lines 244-251)**: Replace the `<Logo>` component with a direct `<img>` tag using `seedbaseCombinedBlack` with `w-full` so it stretches across the right panel. Import the asset from the Logo exports.

### 2. `src/components/sections/MobileScrollNarrative.tsx`

**Bottom logo (lines 164-168)**: Replace the `seedbaseWordmarkBlack` import with `seedbaseCombinedBlack` so mobile/tablet shows the same combined logo (blue box + black wordmark) as desktop. Keep the `w-full max-w-md` sizing so it scales nicely on smaller screens.

Update the import from:
```
import { seedbaseWordmarkBlack } from "@/components/shared/Logo";
```
to:
```
import { seedbaseCombinedBlack } from "@/components/shared/Logo";
```

---

## Summary

| Location | Before | After |
|----------|--------|-------|
| Desktop top-left | `size="lg"` (h-12) | `size="xl"` (h-16) |
| Desktop bottom | `<Logo size="xl">` (h-16, centered) | `<img>` with `w-full` (stretches across panel) |
| Mobile/tablet bottom | Wordmark only (black text, no icon) | Combined logo (blue box + black text) |

