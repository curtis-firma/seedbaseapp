

# Pass 1: Copy-Only Role Label + Giver Key Updates

## Overview
This pass updates all user-facing text to reflect the new role naming and adds "GiverKey" as a visible (Coming Soon) concept. No internal identifiers, routing, permissions, or logic change. The internal value `activator` stays everywhere in code -- only the **display label** changes to "Seeder".

## Core Display Mapping (locked in)

| Internal value | Old display | New display | Key |
|---|---|---|---|
| `activator` | Activator | **Seeder** | SeedKey |
| `trustee` | Trustee | Trustee | BaseKey |
| `envoy` | Envoy | Envoy | MissionKey |
| *(new concept)* | -- | **Giver** | GiverKey *(Coming Soon)* |
| *(status only)* | -- | Activator/Ambassador | Not a role |

---

## File-by-File Changes

### 1. `src/types/seedbase.ts`
- `KeyType`: Add `'GiverKey'` to the union: `'SeedKey' | 'BaseKey' | 'MissionKey' | 'GiverKey'`
- `RoleBadge`: Replace `'Activator'` with `'Seeder'`, add `'Giver'`: becomes `'Trustee' | 'Recipient' | 'Official' | 'Envoy' | 'Seeder' | 'Giver'`
- `UserRole` stays `'activator' | 'trustee' | 'envoy'` (no change)

### 2. `src/components/shared/ViewRoleBadge.tsx`
- Change `activator.label` from `'Activator'` to `'Seeder'`
- "Viewing as" badge will now say "Viewing as Seeder"

### 3. `src/components/shared/KeyGatedCard.tsx`
- `SeedKey` config: description -> `'Commit a seed to get started'`, action -> `'Become a Seeder'`
- Add `GiverKey` entry: name `'GiverKey'`, description `'Pledge long-term. Fund missions consistently.'`, gradient `'bg-amber-500'`, action `'Coming Soon'`

### 4. `src/pages/LauncherPage.tsx`
- Add a 4th launch option for Giver: `{ id: 'pledge', title: 'Make a Pledge', description: 'Fund missions consistently over time', icon: Heart, gradient: 'bg-amber-500', requiredKey: 'GiverKey' }`
- Update "Your Keys" section: add `{ type: 'GiverKey', icon: Heart, label: 'GiverKey' }` (will show as Inactive since no one has it yet)
- Update tagline from `"Activators commit. Trustees steward. Envoys execute."` to `"Seeders commit. Trustees steward. Envoys execute. Givers sustain."`

### 5. `src/components/seedbase/SeedbaseCommandBar.tsx`
- The `actionsByRole` map uses `activator` as key (internal) -- keep that key
- No label changes needed here (action labels like "Commit Seed", "Vote" are action-names, not role-names)
- The command bar already works because `viewRole` is the internal value; it will continue to work

### 6. `src/components/onboarding/PhoneAuthFlow.tsx`
- `ROLE_OPTIONS[0]` (activator): Change `title` from `'Activator'` to `'Seeder'`
- Update `tagline` to `'Commit a seed. Share impact. Earn rewards as the network grows.'`
- Update `description` to `'Commit capital, share impact, earn rewards'`
- Update `bullets` to `['Commit USDC as seed', 'Share impact moments', 'Earn rewards as the network grows']`
- Update `details.who` to `'Anyone who wants to give and see their generosity multiply'`
- Update `details.whatYouDo` entries to match Seeder copy
- Update `details.whatYouGet` entries to match Seeder copy
- Update Trustee tagline to `'Steward and grow a Seedbase. Approve missions. Keep everything transparent.'`
- Update Envoy tagline to `'Deliver missions. Verify outcomes. Report impact.'`
- Update success toast: keep as-is (says "Welcome to Seedbase")

### 7. `src/data/mockData.ts`
- Change all `roleBadge: 'Activator'` instances (approximately 10 occurrences) to `roleBadge: 'Seeder'`
- The `mockUser` object keeps `activeRole: 'activator'` (internal, no change)
- The `mockUser.keys` array: add `{ type: 'GiverKey', isActive: false }` entry

### 8. `src/pages/HomePage.tsx`
- Change the feed mapping that sets `roleBadge: 'Activator'` to `roleBadge: 'Seeder'`
- Update any `roleConfig.activator.label` from `'Activator'` to `'Seeder'` if present

### 9. `src/pages/ProfilePage.tsx`
- Where `activeRole` is displayed raw (shows "activator"), add a display map:
  ```
  const roleDisplayName = { activator: 'Seeder', trustee: 'Trustee', envoy: 'Envoy' }
  ```
- Use `roleDisplayName[activeRole]` instead of raw `activeRole`

### 10. `src/components/seedfeed/FeedRenderer.tsx`
- Update the badge variant mapping: change `'Activator'` check to `'Seeder'` in the ternary (line ~98):
  - Before: `item.roleBadge === 'Trustee' ? 'trustee' : item.roleBadge === 'Envoy' ? 'envoy' : 'activator'`
  - After: `item.roleBadge === 'Trustee' ? 'trustee' : item.roleBadge === 'Envoy' ? 'envoy' : item.roleBadge === 'Seeder' ? 'activator' : 'activator'`
  - (The internal variant `'activator'` stays for styling -- just the badge text changes)

### 11. `src/components/shared/ProfileMenuTrigger.tsx`
- Change activator label from `'Activator'` to `'Seeder'`

### 12. `src/components/landing/LearnMoreModal.tsx`
- Change `'Activators'` title to `'Seeders'`
- Update description to match new Seeder copy
- Update Trustee/Envoy descriptions to match new canonical copy

### 13. `src/components/shared/OnboardingModal.tsx`
- Change activator title from `'Activator'` to `'Seeder'`
- Update tagline and descriptions to match new Seeder copy
- Change progression text from `'Activator -> Trustee -> Envoy'` to `'Seeder -> Trustee -> Envoy'`
- Update Trustee/Envoy descriptions to match new canonical copy

---

## What Does NOT Change
- Internal enum `UserRole = 'activator' | 'trustee' | 'envoy'` -- unchanged
- All routing, permissions, `isKeyActive()` logic -- unchanged
- Database schema -- unchanged
- `SeedbaseCommandBar` action labels (these are action names, not role names) -- unchanged
- `viewRole` / `activeRole` internal values -- unchanged
- `UserContext` logic -- unchanged

## Risk Level: Low
All changes are string literals, display labels, and one new union member (`'GiverKey'`). The `GiverKey` is added as a type but no logic enables it yet -- it just appears in the Keys list as "Inactive" and in KeyGatedCard as "Coming Soon".

