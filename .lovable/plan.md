

# Fix Wallet Page: Role Labels + GiverKey

## Issues Found

1. **"activator" displayed raw** (line 148) — the header shows the internal value instead of "Seeder"
2. **keyConfig still says "Activator"** (line 765) — `SeedKey.role` reads `'Activator - Commit & Grow'`
3. **GiverKey missing from keyConfig** — the Keys tab has no config for the new GiverKey type, so it won't render
4. **GiverKey not in type union** for `handleActivateKey` (line 553/555)

## Changes (all in `src/pages/WalletPage.tsx`)

### 1. Role display in header (line 148)
- Old: `<p>...capitalize">{activeRole} since Jan 2024</p>`
- New: `<p>...capitalize">{{ activator: 'Seeder', trustee: 'Trustee', envoy: 'Envoy' }[activeRole] || activeRole} since Jan 2024</p>`

### 2. keyConfig SeedKey role label (line 765)
- Old: `role: 'Activator - Commit & Grow'`
- New: `role: 'Seeder - Commit & Grow'`

### 3. Add GiverKey to keyConfig (after line 776)
Add a new entry:
```text
GiverKey: {
  icon: Heart,       // import Heart from lucide-react
  gradient: 'bg-gradient-to-br from-amber-400 to-amber-600',
  role: 'Giver - Pledge & Fund',
}
```

### 4. Update KeysView type union (lines 553/555)
- Old: `'SeedKey' | 'BaseKey' | 'MissionKey'`
- New: `'SeedKey' | 'BaseKey' | 'MissionKey' | 'GiverKey'`

### 5. Add Heart to lucide-react import (line 6)
Add `Heart` to the existing import.

## What Does NOT Change
- No logic, routing, or permission changes
- Internal `activeRole` value stays `'activator'`
- GiverKey will show as "Inactive" with an "Activate" button (matching existing pattern)

## Risk: Very Low
String label changes and one new config entry.

