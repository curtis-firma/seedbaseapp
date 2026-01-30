
## OneAccord Unified Rebuild - Make It Feel Native

### Philosophy
Transform OneAccord from a "collection of views" into a **single, cohesive messaging experience** that feels like iMessage or Telegram.

---

### Phase 1: Fix the Immediate Database Error

**File: `src/lib/supabase/demoApi.ts`**

The `getKeyByUserId` function uses `.maybeSingle()` but the database has multiple active keys per user. Fix by ordering and limiting:

```typescript
export async function getKeyByUserId(userId: string): Promise<DemoKey | null> {
  const { data, error } = await supabase
    .from('demo_keys')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  // ...
}
```

---

### Phase 2: Smooth Color Transition (No More Light-to-Dark Jarring)

**Problem:** White inbox page suddenly becomes black compose view.

**Solution:** Make the entire OneAccord page dark by default, or use a slide-over sheet pattern.

**Option A - Dark Mode Consistency:**
- Change `OneAccordPage.tsx` background from `bg-gray-50` to a dark theme (`bg-[#121212]` or similar)
- All views share the same dark color palette
- No color transition needed - it's always dark

**Option B - Slide-Over Pattern (Preferred):**
- Keep inbox light-themed
- Chat thread slides in from the right as a full-screen overlay
- Uses `transform: translateX()` instead of color fade
- Feels like native iOS navigation

**Implementation (Option B):**
```tsx
// Animate thread as a slide-over instead of color crossfade
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  className="fixed inset-0 z-50 bg-black"
>
  <InlineComposeBar ... />
</motion.div>
```

---

### Phase 3: Add Swipe-to-Exit Gesture

**File: `src/components/oneaccord/InlineComposeBar.tsx`**

Add iOS-style edge swipe to dismiss:

```tsx
// Wrap the entire compose view in a draggable container
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={{ left: 0, right: 0.3 }}
  onDragEnd={(_, info) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onBack?.();
    }
  }}
  className="fixed inset-0 z-50 bg-black"
>
  {/* ... compose content ... */}
</motion.div>
```

Also add a visual swipe indicator - show the previous screen peeking through when dragging.

---

### Phase 4: Prefetch & Cache Conversations

**Problem:** Every thread tap reloads data from scratch.

**Solution:** 
1. Prefetch recent conversations on page load
2. Use React Query's cache to show stale data immediately while revalidating
3. Load conversation history in parallel with opening animation

```tsx
// In OneAccordPage - prefetch on hover
const prefetchConversation = (partnerId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['conversation', currentUserId, partnerId],
    queryFn: () => getConversationHistory(currentUserId, partnerId),
    staleTime: 30000, // 30 seconds
  });
};

// On conversation item
<button
  onMouseEnter={() => prefetchConversation(convo.partnerId)}
  onClick={() => setSelectedConversation(convo)}
>
```

---

### Phase 5: Unified Animation System

Replace fragmented `AnimatePresence mode="wait"` with a coordinated navigation system:

1. **Inbox View** - Always mounted, opacity fades when thread opens
2. **Thread View** - Slides in from right, overlays inbox
3. **Shared header** - Morphs between states instead of replacing

```tsx
// Instead of mode="wait" which unmounts everything:
<AnimatePresence>
  {/* Inbox always rendered */}
  <motion.div 
    animate={{ opacity: selectedConversation ? 0.3 : 1 }}
    className="min-h-screen"
  >
    {/* inbox content */}
  </motion.div>

  {/* Thread slides over */}
  {selectedConversation && (
    <motion.div
      key="thread"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50"
    >
      <InlineComposeBar ... />
    </motion.div>
  )}
</AnimatePresence>
```

---

### Phase 6: Fix Accessibility Warnings

Add missing `DialogTitle` to all dialog-based modals that are causing console errors:

```tsx
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

<DialogContent>
  <VisuallyHidden>
    <DialogTitle>Compose Message</DialogTitle>
  </VisuallyHidden>
  {/* ... */}
</DialogContent>
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/supabase/demoApi.ts` | Fix `getKeyByUserId` to handle multiple keys |
| `src/pages/OneAccordPage.tsx` | Replace `AnimatePresence mode="wait"` with slide-over pattern, add prefetching |
| `src/components/oneaccord/InlineComposeBar.tsx` | Add swipe-to-exit gesture, remove color crossfade |
| `src/components/oneaccord/ChatBubbles.tsx` | Optimize initial render, reduce re-renders |
| Various modals | Add `DialogTitle` with `VisuallyHidden` wrapper |

---

### Expected Result

- **Instant response** - Thread appears to open immediately with cached/prefetched data
- **Native feel** - Slide animations match iOS navigation patterns
- **Swipe to go back** - Edge swipe dismisses the thread naturally
- **No color jarring** - Consistent dark theme or smooth slide-over
- **Single cohesive experience** - Feels like one app, not stitched together parts
