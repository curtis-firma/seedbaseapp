
# Fix Collapsed Sidebar Logo Distortion

## Problem
When the sidebar is collapsed (80px wide), the logo icon renders at `size="lg"` (h-12) but stretches to fill available width, distorting its aspect ratio.

## Fix

### `src/components/layout/Sidebar.tsx` (line 49)

Change the collapsed logo from `size="lg"` to `size="sm"` and add explicit square dimensions with `object-contain` to prevent distortion:

```tsx
<Logo variant="icon" size="sm" className="h-10 w-10 object-contain" />
```

This gives the icon a fixed 40x40px square that fits within the 80px collapsed sidebar with proper padding, maintaining its aspect ratio at any screen size.

One line change in one file.
