

# Complete Brand System Overhaul

## Audit Summary

I've thoroughly explored the codebase and found every location where logos, wordmarks, and colors are defined. Here's my complete findings:

---

## Part 1: Logo & Wordmark Inventory

### Central Logo Component
**File:** `src/components/shared/Logo.tsx`
- Currently imports 4 "seeddrop" assets that need replacement
- Used across: Sidebar, MobileDrawer, AppLayout, AppSplashScreen, ScrollingLandingPage, MobileScrollNarrative

### Image Assets in `src/assets/` (38 brand-related files)
| Asset | Purpose | Action |
|-------|---------|--------|
| `seeddroplogo_lightmode.png` | Icon for light backgrounds | Replace |
| `seeddroplogo_darkmode.png` | Icon for dark backgrounds | Replace |
| `seeddrop_lightmode.png` | Wordmark for light backgrounds | Replace |
| `seeddroptype_darkmode.png` | Wordmark for dark backgrounds | Replace |
| `seedbase-pfp.png` | Circular profile picture | Replace |
| `seedbase-pfp-new.png` | Newer circular PFP | Replace |
| `seed-square-node.png` | Blue square icon for hero animations | Replace with Frame_3.png |
| `seed-icon-blue.png` | Blue icon for orbital rings | Replace |
| `seed-icon-white.png` | White icon for pull-to-refresh | Replace |
| `seed-button-white.png` | White icon for Enter App button | Replace |
| `seedbase-wordmark-white.png` | White wordmark | Replace |
| `seedbase-circle-logo.png` | Circular logo | Replace |
| `seedbase-icon.png` | Square icon | Replace |
| `seedbase-leaf-*.png` | Legacy leaf assets | Remove |
| `seedbase-seed*.svg` | SVG seed variants | Replace |
| `seedbase-block.svg` | Block variant | Replace |
| `seedbase-logo-*.png` | Various logo versions | Replace |
| `seeded-logo-white.png` | SEEDED sub-brand | Keep (shop brand) |

### Public Folder Assets
| Asset | Purpose |
|-------|---------|
| `favicon.ico` | Legacy favicon (not used) |
| `seedbase-favicon.png` | Desktop favicon |
| `seedbase-apple-touch.png` | iOS home screen |
| `seeddrop-favicon.png` | Alternate favicon |
| `seeddrop-apple-touch.png` | Alternate iOS icon |
| `og-image.png` | Social share image |

### index.html References
- Favicon: External URL (storage.googleapis.com) needs update
- OG Image: External URL needs update

---

## Part 2: Current Color Palette

### CSS Variables (src/index.css)

**Light Mode:**
```css
--primary: 221 83% 53%        /* Current blue - needs change */
--background: 220 20% 97%     /* Light gray background */
--foreground: 222 47% 11%     /* Dark text */
--card: 0 0% 100%             /* White cards */
--muted: 220 14% 96%          /* Light gray muted */
--seed-green: 142 76% 36%     /* Activator green */
--base-blue: 221 83% 53%      /* Base network blue */
--trust-purple: 262 83% 58%   /* Trustee purple */
--envoy-orange: 25 95% 53%    /* Envoy orange */
```

**Dark Mode:**
```css
--background: 222 47% 6%      /* Dark background */
--foreground: 210 40% 98%     /* Light text */
--card: 222 47% 9%            /* Dark cards */
```

### Your New Color Palette (from element.png)
Based on your uploaded palette image:

| Color | Hex | Purpose |
|-------|-----|---------|
| Primary Blue | `#0000FF` | Brand primary (pure blue) |
| Light Blue | `#0A84FF` | Secondary blue accent |
| Off-White | `#F5F5F7` | Light background |
| Silver | `#C4C4C4` | Muted elements |
| Black | `#1C1C1E` | Dark mode background |
| Tan/Gold | `#B5A486` | Accent 1 |
| Yellow | `#FFD60A` | Accent 2 (landing-ledger) |
| Green | `#34C759` | Success/Activator |
| Lime | `#BFFF00` | Highlight accent |
| Red | `#FF3B30` | Destructive/Error |
| Pink | `#FFB6C1` | Soft accent |

---

## Part 3: Hardcoded Colors Found (125+ files)

### Critical Files with `#0000ff` hardcoded:
1. `src/components/layout/Sidebar.tsx` (lines 118-129)
2. `src/components/layout/MobileDrawer.tsx` (lines 141-157)
3. `src/components/layout/AppLayout.tsx` (lines 152-163)
4. `src/pages/OneAccordPage.tsx` (multiple locations)
5. `src/components/oneaccord/ChatBubbles.tsx` (multiple locations)
6. `src/components/oneaccord/InlineComposeBar.tsx` (multiple locations)
7. `src/components/oneaccord/MessageThread.tsx` (lines 131, 207)
8. `src/components/feed/QuickVoteCard.tsx` (line 36)

### Gradient patterns needing update:
- `from-[#0000ff] to-purple-600` (featured buttons, badges)
- `from-blue-500 to-purple-600` (avatars, fallbacks)
- `bg-gradient-to-br from-blue-500/20 to-purple-500/20` (backgrounds)

---

## Part 4: Implementation Plan

### Step 1: Upload New Brand Assets
Copy the uploaded images to appropriate locations:
- `Frame_3.png` → `src/assets/seedbase-icon.png` (new icon)
- `seedwhite.png` → `src/assets/seedbase-logo-white.png` (white wordmark)
- `Frame_22.png` → `src/assets/seedbase-logo-blue.png` (blue wordmark)
- `blackseedbase.png` → `src/assets/seedbase-logo-black.png` (black version)

### Step 2: Update Logo Component
Modify `src/components/shared/Logo.tsx` to use new assets:
- `forceLight` → Blue icon + black wordmark (for light backgrounds)
- `forceDark` → Blue icon + white wordmark (for dark backgrounds)

### Step 3: Update CSS Color Variables
Update `src/index.css` with new palette:
```css
:root {
  --primary: 240 100% 50%;           /* #0000FF - Pure Blue */
  --background: 0 0% 100%;           /* Pure white */
  --foreground: 0 0% 7%;             /* Near black */
  --secondary: 0 0% 96%;             /* #F5F5F7 */
  --muted-foreground: 0 0% 45%;      /* Gray */
  
  /* Accent colors from your palette */
  --accent-tan: 38 33% 62%;          /* Tan/Gold */
  --accent-yellow: 51 100% 52%;      /* Yellow */
  --accent-green: 142 69% 49%;       /* Green */
  --accent-lime: 75 100% 50%;        /* Lime */
}

.dark {
  --background: 240 6% 11%;          /* #1C1C1E */
  --foreground: 0 0% 98%;            /* Near white */
}
```

### Step 4: Update Tailwind Config
Add new color tokens in `tailwind.config.ts`:
```typescript
colors: {
  seedbase: {
    blue: '#0000FF',
    lightBlue: '#0A84FF',
  },
  accent: {
    tan: '#B5A486',
    yellow: '#FFD60A',
    lime: '#BFFF00',
  }
}
```

### Step 5: Find & Replace Hardcoded Colors
Systematic replacement across 125+ files:
- `#0000ff` → `hsl(var(--primary))` or `text-primary`
- `blue-500` → `primary` where brand blue is intended
- `from-[#0000ff] to-purple-600` → `from-primary to-purple-600`

### Step 6: Update Public Assets
- Replace `public/seedbase-favicon.png` with new icon
- Replace `public/seedbase-apple-touch.png` with new icon
- Update `index.html` favicon URL

### Step 7: Update OG/Social Images
- Update `index.html` meta tags with new image URLs

---

## Files to Modify

| Category | Files | Changes |
|----------|-------|---------|
| Core Brand | `src/components/shared/Logo.tsx` | New asset imports, simplified logic |
| CSS System | `src/index.css` | New color palette |
| Tailwind | `tailwind.config.ts` | New color tokens |
| Assets | 15+ files in `src/assets/` | Replace with new brand assets |
| Navigation | `Sidebar.tsx`, `MobileDrawer.tsx`, `AppLayout.tsx`, `BottomNav.tsx` | Color class updates |
| OneAccord | `ChatBubbles.tsx`, `InlineComposeBar.tsx`, `MessageThread.tsx` | Color class updates |
| Feed/Cards | `FeedCard.tsx`, `QuickVoteCard.tsx`, multiple card components | Color class updates |
| Landing | Hero states, `ScrollingLandingPage.tsx` | Asset and color updates |
| Meta | `index.html` | Favicon and OG image URLs |
| Public | 4 PNG files | Replace with new brand assets |

---

## Expected Result

1. **Unified visual identity** - All logos use the new blue square + seed icon
2. **Consistent color system** - Pure blue (#0000FF) as primary throughout
3. **Clean asset management** - Remove legacy "seeddrop" naming, standardize on "seedbase"
4. **Proper light/dark support** - Blue icon works on both, wordmark swaps white/black
5. **No hardcoded colors** - All brand colors via CSS variables

