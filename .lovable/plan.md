

# Add Close Button to Mobile Login Modal

## The Problem

The Login modal (sign-in popup) hides the default dialog close button with `[&>button]:hidden`. On mobile there's no way to dismiss it.

## The Fix

Update `src/components/sections/LoginModal.tsx` to add a visible close (X) button in the top-right corner on mobile. On desktop/tablet, the dialog overlay click already handles dismissal, but we'll show the X on all sizes for consistency.

### Changes to `src/components/sections/LoginModal.tsx`

- Import the `X` icon from `lucide-react`
- Add a close button (`<button>`) positioned `absolute top-3 right-3` with a circular background, inside the `DialogContent` but above the `PhoneAuthFlow`
- Keep the default dialog close button hidden (via `[&>button]:hidden`) since we're providing our own styled one
- The button calls `onClose()` on click

### Result

```
DialogContent
  [X button] ← absolute top-right, z-10, circular, subtle background
  PhoneAuthFlow (existing)
```

Only one file changes: `LoginModal.tsx`.

