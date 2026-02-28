

# Performance Optimization -- Speed & Responsiveness Only

No UI, feature, or visual changes. Purely making navigation feel instant like Twitter/X.

## Root Causes Identified

1. **Artificial loading delays**: SeedbasePage has a hardcoded `setTimeout(() => setIsLoading(false), 400)` that forces a 400ms skeleton screen on every mount
2. **Tab switching shows 300ms skeleton**: HomePage's `handleTabChange` sets `isTabSwitching = true` then clears it after 300ms, showing skeletons unnecessarily
3. **`AnimatePresence mode="wait"` everywhere**: HomePage feed tabs and `SwipeableTabContent` both use `mode="wait"`, which blocks the new view until the old one finishes its exit animation
4. **No React Query caching**: `QueryClient` is created with zero configuration -- default `staleTime: 0` means every navigation triggers a refetch
5. **FeedRenderer statically imports large video files**: `seeded-hype-full.mp4` and `mission-video.mp4` are imported at the top of `FeedRenderer.tsx`, bloating the feed bundle even when no video cards are visible
6. **Pages re-fetch data on every mount**: HomePage calls `loadPosts(true)` in `useEffect([], [])` with `isLoading = true` on every mount, showing skeletons even when data was already loaded

## Changes

### 1. Configure QueryClient with caching (`src/App.tsx`)

Add `staleTime` and `gcTime` so previously fetched data displays instantly:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 min -- data is "fresh" for 5 min
      gcTime: 10 * 60 * 1000,    // 10 min -- keep in cache for 10 min
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Remove artificial loading delay (`src/pages/SeedbasePage.tsx`)

Delete the fake 400ms loading timer:
```diff
- const [isLoading, setIsLoading] = useState(true);
- useEffect(() => {
-   const timer = setTimeout(() => setIsLoading(false), 400);
-   return () => clearTimeout(timer);
- }, []);
+ const isLoading = false;
```

### 3. Remove 300ms tab-switch skeleton (`src/pages/HomePage.tsx`)

The `isTabSwitching` state and its 300ms `setTimeout` create a fake loading delay on every tab tap. Remove it entirely -- the content is already in memory, it should swap instantly:

- Remove `isTabSwitching` state
- Remove `setTimeout(() => setIsTabSwitching(false), 300)` from `handleTabChange`
- Remove `isTabSwitching` from the loading condition
- Change `AnimatePresence mode="wait"` to `mode="popLayout"` for concurrent enter/exit (no blocking)

### 4. Fix SwipeableTabContent animation blocking (`src/components/shared/SwipeableTabContent.tsx`)

Change `AnimatePresence mode="wait"` to `mode="popLayout"` so the new tab renders immediately without waiting for the old tab's exit animation to finish. Also reduce transition duration.

### 5. Lazy-load video imports in FeedRenderer (`src/components/seedfeed/FeedRenderer.tsx`)

Move the static MP4 imports out of the module scope. Instead, reference them only when a video card actually renders:

```diff
- import seededHypeFull from '@/assets/seeded-hype-full.mp4';
- import missionVideo from '@/assets/mission-video.mp4';
```

Use dynamic imports or inline URL references only inside the `v2-video` variant branch.

### 6. Prevent re-fetch on mount when data exists (`src/pages/HomePage.tsx`)

Change `isLoading` to start as `false` when posts are already in state (e.g., from a previous visit). Use a ref to track if the initial load has happened:

```typescript
const [isLoading, setIsLoading] = useState(true);
const hasLoaded = useRef(false);

useEffect(() => {
  if (hasLoaded.current) return;
  hasLoaded.current = true;
  loadPosts(true);
}, []);
```

Since React Router + Outlet keeps pages mounted as long as you're on `/app/*`, and lazy-loaded pages stay in memory after first load, this ensures the feed shows instantly on return visits within the same session.

## Files Modified

| # | File | What Changes |
|---|------|-------------|
| 1 | `src/App.tsx` | Add `staleTime`/`gcTime`/`refetchOnWindowFocus` to QueryClient |
| 2 | `src/pages/SeedbasePage.tsx` | Remove fake 400ms loading delay |
| 3 | `src/pages/HomePage.tsx` | Remove `isTabSwitching` 300ms delay, change AnimatePresence mode, guard against re-fetching |
| 4 | `src/components/shared/SwipeableTabContent.tsx` | Change `AnimatePresence mode="wait"` to `mode="popLayout"` |
| 5 | `src/components/seedfeed/FeedRenderer.tsx` | Lazy-load video assets instead of static imports |

## What Does NOT Change

- All colors, layouts, typography, glass effects, animations (visual style)
- All features, modals, navigation structure
- All routing and authentication logic
- Landing page
- Component hierarchy and data flow

