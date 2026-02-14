

# Pass 2: Remaining "Activator" Display Text Cleanup

## Overview
Pass 1 covered the major surfaces (onboarding, profile, wallet, feed badges, launcher). This pass catches every remaining user-facing "Activator" string across the app and converts it to "Seeder" (or the appropriate new term). Internal identifiers (`'activator'`) remain unchanged.

---

## File-by-File Changes

### 1. `src/components/shared/GlobalSearchModal.tsx` (line 221)
**Issue**: Displays raw `{user.active_role}` which shows "activator" instead of "Seeder"
- Add a display map and use it: `{{ activator: 'Seeder', trustee: 'Trustee', envoy: 'Envoy' }[user.active_role] || user.active_role}`

### 2. `src/components/shared/AffiliateExplainerModal.tsx` (line 64)
**Issue**: Title reads "How Activators Grow the Network"
- Change to: "How Seeders Grow the Network"

### 3. `src/components/shared/ImpactLeaderboard.tsx` (line 127)
**Issue**: Header reads "Top Activators"
- Change to: "Top Seeders"

### 4. `src/components/shared/ImpactScoreBreakdownModal.tsx` (lines 56-57)
**Issue**: Label reads "Invite Activators" / "Bring new activators who commit seed"
- Change label to: "Invite Seeders"
- Change description to: "Bring new seeders who commit seed"

### 5. `src/pages/GovernancePage.tsx` (line 377)
**Issue**: Leaderboard header reads "Top Activators"
- Change to: "Top Seeders"

### 6. `src/components/seedbase/modals/CommitmentsDetailModal.tsx` (line 49)
**Issue**: Stat label reads "Activators"
- Change to: "Seeders"

### 7. `src/data/mockData.ts` (lines 1203, 1221, 1226, 1494)
**Issues**: Remaining display-facing "Activator" strings in mock data:
- Line 1203 comment: "Activator milestone" -> "Seeder milestone" (comment only)
- Line 1221: `title: 'Activator+ Unlocked'` -> `title: 'Seeder+ Unlocked'`
- Line 1226: `{ label: 'Status', value: 'Activator+' }` -> `{ label: 'Status', value: 'Seeder+' }`
- Line 1494: `{ label: 'Activators', value: 45 }` -> `{ label: 'Seeders', value: 45 }`

---

## What Does NOT Change
- Internal code identifiers: `'activator'` as enum value, variable names like `isActivator`, function names like `ActivatorContent` -- these are code-only, never shown to users
- `viewRole === 'activator'` checks throughout the codebase -- internal logic
- `active_role: 'activator'` in database/API layer -- internal data
- Comments referencing internal logic (e.g., "Activator/Envoy view" in TransparencyDashboard) -- developer-only

## Risk: Very Low
All changes are string literal swaps in display text. No logic changes.

