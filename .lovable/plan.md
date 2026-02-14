
# 3 Fixes: Sidebar Role Switcher, Mobile Logo, Profile Consolidation

## Fix 1: Desktop Sidebar "View As" -- Replace Pills with Dropdown

**Problem**: The three role pills ("Seeder", "Trustee", "Envoy") are crammed into the 260px sidebar and get truncated, making them unreadable.

**Solution**: Add a `dropdown` variant to `ViewRoleBadge` that renders a single button showing the current role (icon + full label) with a dropdown menu to switch. Use this variant in the desktop sidebar.

### Changes:
- **`src/components/shared/ViewRoleBadge.tsx`**: Add a `dropdown` variant using Radix `DropdownMenu`. The trigger shows the selected role with its gradient color; the menu lists all three roles with icons and color accents. Solid `bg-card` background on menu, `z-50`.
- **`src/components/layout/Sidebar.tsx`**: Change `variant="full"` to `variant="dropdown"` on the ViewRoleBadge. Also show a small role icon when sidebar is collapsed.

---

## Fix 2: Mobile Drawer Logo -- Use Combined Logo

**Problem**: The mobile drawer header uses `variant="wordmark"` which shows a black-only wordmark without the blue square icon. Should match the rest of the app.

**Solution**: Change to `variant="combined"` in MobileDrawer.

### Changes:
- **`src/components/layout/MobileDrawer.tsx`** (line 79): Change `variant="wordmark"` to `variant="combined"`

---

## Fix 3: Profile Page Consolidation

**Problem**: "View Profile" in the mobile drawer navigates to `/app/profile` (ProfilePage) which is separate from the bottom nav "User" tab (`/app/wallet`). The profile page often appears empty, creating a broken experience.

**Solution**: Remove the separate profile route. Redirect the drawer's profile link to `/app/wallet`. Add an "Edit Profile" button on the WalletPage header that links to Settings.

### Changes:
- **`src/components/layout/MobileDrawer.tsx`** (line 93): Change navigation from `/app/profile` to `/app/wallet`, update label to "My Account"
- **`src/App.tsx`** (line 81): Remove the `/app/profile` route
- **`src/pages/WalletPage.tsx`**: Add a small "Edit Profile" icon button in the header area that navigates to `/app/settings`
- **`src/components/layout/BottomNav.tsx`** (line 78): Remove `/app/profile` from active index detection

---

## Technical Summary

| File | Change |
|------|--------|
| `src/components/shared/ViewRoleBadge.tsx` | Add `dropdown` variant using Radix DropdownMenu |
| `src/components/layout/Sidebar.tsx` | Use `variant="dropdown"` instead of `variant="full"` |
| `src/components/layout/MobileDrawer.tsx` | Logo: `combined` variant; Profile link: `/app/wallet` |
| `src/App.tsx` | Remove `/app/profile` route |
| `src/pages/WalletPage.tsx` | Add "Edit Profile" button in header |
| `src/components/layout/BottomNav.tsx` | Clean up `/app/profile` from active index |
