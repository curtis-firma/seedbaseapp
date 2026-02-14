

# Fix Sidebar and Header Logo to Match Homepage

## Problem
The sidebar logo shows only the black wordmark text (no blue box icon) when expanded. It should show the same "combined" logo (blue box + wordmark) used on the homepage. It also needs to scale properly without distortion.

## Changes

### 1. `src/components/layout/Sidebar.tsx` (lines 49-58)

**When expanded**: Change `variant="wordmark"` to `variant="combined"` so it shows the blue box + wordmark, matching the homepage branding.

**When collapsed**: Keep `variant="icon"` (just the blue square) -- this is correct.

**Sizing fix**: Use `w-auto max-w-full object-contain` styling on the expanded logo container to prevent distortion when the sidebar width changes. The `size` prop stays `"lg"`.

### 2. `src/components/layout/AppLayout.tsx` (line 145)

The mobile header already uses `variant="combined" size="sm"` which is correct. No change needed here.

## Summary

| Location | Before | After |
|----------|--------|-------|
| Sidebar expanded | `variant="wordmark"` (black text only) | `variant="combined"` (blue box + black wordmark) |
| Sidebar collapsed | `variant="icon"` (blue box) | No change |
| Mobile header | `variant="combined"` | No change |

One file changes: `Sidebar.tsx`.

