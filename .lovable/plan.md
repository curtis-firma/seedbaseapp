

## Unified Dark Theme for OneAccord - Eliminate Light-to-Dark Jank

### Current State Analysis

The OneAccord page has a **mixed theme architecture** that causes visual jarring:

| Component | Current Theme | Problem |
|-----------|---------------|---------|
| `OneAccordPage.tsx` Inbox | `bg-gray-50` (light) | White background |
| Sticky Header | `bg-white` (light) | White background |
| Info Banner | `from-blue-50 to-purple-50` (light) | Light gradient |
| Pending Cards | `bg-white` (light) | White cards |
| Conversation Items | `bg-white` (light) | White buttons |
| `InlineComposeBar.tsx` Compose | `bg-black` (dark) | Sudden dark overlay |
| User Select Mode | `bg-black` (dark) | Dark screen |
| Chat Bubbles Area | `bg-black` (dark) | Dark chat |

When a user taps a conversation, they go from a bright white inbox to a black compose screen - this is the jarring transition.

### Solution: Consistent Dark Theme Throughout

Transform the entire OneAccord experience to use a unified dark color palette matching the compose/chat views.

---

### Phase 1: Fix Database Query (Already Done)

The `getKeyByUserId` function in `src/lib/supabase/demoApi.ts` already has the fix:

```typescript
.order('created_at', { ascending: false })
.limit(1)
.maybeSingle();
```

No further action needed.

---

### Phase 2: Dark Theme for OneAccordPage.tsx

**File: `src/pages/OneAccordPage.tsx`**

Replace light theme classes with dark equivalents:

| Current Class | New Class |
|--------------|-----------|
| `bg-gray-50` | `bg-[#121212]` (main background) |
| `bg-white` | `bg-[#1a1a1a]` (header/cards) |
| `border-gray-200` | `border-white/10` |
| `text-gray-900` | `text-white` |
| `text-gray-500` | `text-gray-400` |
| `bg-gradient-to-r from-blue-50 to-purple-50` | `bg-[#1e1e1e]` (info banner) |
| `hover:bg-gray-50` | `hover:bg-white/5` |

Key sections to update:
1. **Main container**: Line 329 - `bg-gray-50` to `bg-[#121212]`
2. **Sticky header**: Lines 345-365 - `bg-white` to `bg-[#1a1a1a]`
3. **Info banner**: Lines 368-374 - Light gradients to dark
4. **Loading state**: Lines 378-382 - Update spinner colors
5. **Pending cards**: Lines 402-474 - Light cards to dark cards
6. **Demo pending cards**: Lines 477-536 - Update gradient to dark
7. **Conversation items**: Lines 559-577 - Dark button backgrounds
8. **"Restore demo" button**: Update if visible

---

### Phase 3: Update Swipe Peek-Through Background

**File: `src/components/oneaccord/InlineComposeBar.tsx`**

Currently at line 559, the peek-through shows `bg-gray-50` (light):

```tsx
// Current:
<motion.div className="fixed inset-0 z-30 bg-gray-50" />

// Change to:
<motion.div className="fixed inset-0 z-30 bg-[#121212]" />
```

This ensures the peeking background during swipe matches the dark inbox.

---

### Technical Details

#### Color Palette for OneAccord Dark Theme

```text
Background layers:
- Main background: #121212 (darkest)
- Card/elevated: #1a1a1a
- Input/compose pill: #2b2b2b (already used)
- Hover states: white/5 or white/10

Text:
- Primary: white
- Secondary: gray-400 (#9ca3af)
- Muted: gray-500 (#6b7280)

Borders:
- Standard: white/10
- Accent: blue-500/30 or purple-500/30

Status colors (keep bright for contrast):
- Pending badge: blue-500 to purple-600 gradient
- Accept button: blue-500 to purple-600 gradient
- Decline: gray-700 with gray-400 icon
```

#### Special Considerations

1. **Unread indicators**: Keep the blue dot (`bg-blue-500`) for visibility
2. **Avatar rings**: May need subtle white/10 borders for definition
3. **Demo badges**: Keep gradient badges for distinction but darken container
4. **Confetti**: Works on any background (already positioned via fixed)

---

### Files to Modify

| File | Scope of Changes |
|------|------------------|
| `src/pages/OneAccordPage.tsx` | ~30 class name changes for dark theme |
| `src/components/oneaccord/InlineComposeBar.tsx` | 1 line change (peek background) |

---

### Expected Result

1. **No jarring transition** - Inbox and compose are both dark
2. **Cohesive feel** - Feels like one unified messaging app
3. **Modern aesthetic** - Matches iMessage dark mode / X DMs
4. **Better focus** - Dark theme puts emphasis on content and avatars
5. **Swipe consistency** - Peek-through during swipe shows matching dark background

---

### Visual Preview (Before vs After)

```text
BEFORE:
┌─────────────────────────────┐
│ ██ WHITE HEADER ██████████ │ <- Light
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │ <- Light gray bg
│ ┌───────────────────────┐  │
│ │ WHITE CARD           │  │ <- Light card
│ └───────────────────────┘  │
│                             │
│     * TAP CONVERSATION *    │
│             ▼               │
│ ████████████████████████████│ <- SUDDEN BLACK
│ █ DARK COMPOSE VIEW ████████│
└─────────────────────────────┘

AFTER:
┌─────────────────────────────┐
│ ██ DARK HEADER █████████████│ <- Dark
│ ████████████████████████████│ <- Dark bg
│ ┌───────────────────────┐  │
│ │ DARK CARD             │  │ <- Dark card
│ └───────────────────────┘  │
│                             │
│     * TAP CONVERSATION *    │
│             ▼               │
│ ████████████████████████████│ <- SAME DARK
│ █ DARK COMPOSE VIEW ████████│ <- Seamless!
└─────────────────────────────┘
```

