

# Fix Learn More Modal: Mobile Viewport + Seamless Login Transition

## Problem 1: Mobile Modal Cuts Off Buttons

The modal uses `h-full` on mobile but the content area doesn't account for safe areas and the action buttons at the bottom get clipped. The scrollable content area needs proper constraints so buttons remain visible.

### Fix
- On mobile, make the overview content area use `flex-1 overflow-y-auto` with a sticky/fixed bottom action bar
- Move the "Get Started" and "Light Paper" buttons into a separate fixed-bottom container on mobile so they're always visible
- Add `pb-safe` padding to ensure buttons clear the home indicator on notched phones

## Problem 2: "Get Started" Flashes Home Screen

Currently the flow is:
1. Modal closes (shows landing page behind it)
2. 300ms delay
3. Parent scrolls to top
4. Another 300ms delay
5. Login modal opens

This creates a visible flash of the landing page between modals.

### Fix
- Remove the intermediate close/scroll/delay chain
- Instead, keep the Learn More modal open while immediately opening the Login modal (or close and open login simultaneously)
- Simplest approach: In `handleGetStarted`, call `onGetStarted()` directly without closing the modal first. Let the parent handle closing Learn More and opening Login in the same render cycle
- Update parent's `onGetStarted` callback to close Learn More and open Login together with no scroll or delay

## Files to Change

### 1. `src/components/landing/LearnMoreModal.tsx`

**Mobile layout fix (lines 249, 455-481)**:
- Split the overview content into a scrollable body area and a sticky bottom action bar
- The scrollable area gets `flex-1 overflow-y-auto` 
- The action buttons get `flex-shrink-0 sticky bottom-0 bg-background pt-3 pb-4` with safe-area padding on mobile

**Get Started flow fix (lines 108-116)**:
- Simplify `handleGetStarted` to just call `onGetStarted()` directly without closing the modal, scrolling, or adding delays. Let the parent orchestrate the transition.

### 2. `src/components/sections/ScrollingLandingPage.tsx`

**Parent callback fix (lines 175-178)**:
- Update the `onGetStarted` callback to simultaneously close Learn More and open Login in one step, with no `scrollTo` or `setTimeout` delay:
```
onGetStarted={() => {
  setShowLearnMore(false);
  setShowLoginModal(true);
}}
```

## Technical Details

### Mobile button fix structure:
```
overview motion.div (h-full flex flex-col)
  mobile header (flex-shrink-0)
  scrollable content (flex-1 overflow-y-auto)
    headline, summary, dropdowns, roles...
  action buttons (flex-shrink-0, safe-area bottom padding)
```

### Simplified handleGetStarted:
```typescript
const handleGetStarted = () => {
  onGetStarted();
};
```

The parent now handles both closing Learn More and opening Login atomically -- no flash.
