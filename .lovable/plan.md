

# Apple Liquid Glass -- Full App Overhaul

A comprehensive visual upgrade applying Apple's Liquid Glass (glassmorphism) aesthetic to **every surface in the app** except the landing/homepage design. This is a CSS-first approach that upgrades shared utilities and base components so the entire app inherits the new look automatically.

## Scope

**Upgraded (everything inside `/app/*` routes):**
- Layout shell (sidebar, bottom nav, mobile header, mobile drawer)
- All page headers (HomePage, WalletPage, SeedbasePage, GovernancePage, SeededPage, SettingsPage, OneAccordPage, VaultPage, LauncherPage, TransactionHistoryPage)
- All cards across seedfeed, seedbase, wallet, governance
- All modals and drawers (Login, Learn More, PhoneAuthFlow/signup, wallet modals, seedbase modals, governance modals, coming soon, onboarding, welcome walkthrough, quick action, search, comment drawer, impact drawer, amplify, affiliate explainer)
- Buttons (secondary/ghost variants get glass sheen)
- Tabs, badges, and interactive surfaces
- Profile sections, settings sections
- QuickActionButton overlay

**NOT touched:**
- Landing page design (`ScrollingLandingPage`, `MobileScrollNarrative`, `HeroVisualCanvas`, and all hero-states)
- Color system (all HSL variables, brand colors, gradients stay identical)
- Routing, logic, data flow -- zero functional changes

## Strategy: Cascade from the Bottom

Rather than editing 50+ individual component files, we upgrade **5 shared layers** that cascade everywhere:

1. **CSS utility classes** -- upgrade `.glass` and `.glass-strong` in-place + add new `.liquid-glass-*` variants
2. **Base UI primitives** -- Card, Button, Dialog, Drawer, Sheet
3. **Layout shell** -- AppLayout header, BottomNav, Sidebar, MobileDrawer
4. **Modal components** -- LoginModal, LearnMoreModal, PhoneAuthFlow internal surfaces
5. **Page-level custom modals** -- OnboardingModal, WelcomeWalkthrough, ComingSoonModal, and other custom overlays that use inline `bg-black/60 backdrop-blur-sm`

## Detailed Changes

### 1. CSS Utilities (`src/index.css`)

Upgrade existing classes in-place and add new ones:

```css
/* Upgrade existing */
.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.06);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 4px 24px rgba(0, 0, 0, 0.06);
}

/* New additive classes */
.liquid-glass { /* general-purpose translucent panel */ }
.liquid-glass-strong { /* nav bars, sticky headers */ }
.liquid-glass-card { /* cards with inner glow + depth */ }
.liquid-glass-surface { /* subtle page background tint */ }
```

Dark mode variants shift specular highlights to cooler white tones and reduce base opacity.

Because every page header already uses `glass-strong` and every card uses the `Card` component, upgrading these in-place cascades the look across **all pages automatically**.

### 2. Base UI Components

**Card (`card.tsx`)** -- Add faint translucent background + specular inner highlight to the base Card class:
- `bg-card/80 backdrop-blur-xl` + inner `box-shadow` for the light refraction edge
- All seedfeed cards, wallet cards, seedbase cards, governance cards, dashboard cards inherit this automatically

**Button (`button.tsx`)** -- Subtle glass on `secondary` and `ghost` variants:
- Faint `backdrop-blur(8px)` + inner glow on hover
- Primary and destructive variants stay solid

**Dialog (`dialog.tsx`)** -- Enhanced overlay: `backdrop-blur-xl saturate(180%)`; content panel gets `liquid-glass-card` treatment

**Drawer (`drawer.tsx`)** -- Same enhanced overlay; drawer panel gets liquid glass background

**Sheet (`sheet.tsx`)** -- Same enhanced overlay treatment

### 3. Layout Shell (1-2 lines each)

| File | Line | Change |
|------|------|--------|
| `AppLayout.tsx` | 138 | `bg-card/95 backdrop-blur-xl` becomes `liquid-glass-strong` |
| `BottomNav.tsx` | 91 | `bg-card/95 backdrop-blur-xl` becomes `liquid-glass-strong` |
| `Sidebar.tsx` | 37 | `bg-card/90 backdrop-blur-xl` becomes `liquid-glass-strong` |
| `MobileDrawer.tsx` | 65 | Backdrop: enhanced blur+saturate |
| `MobileDrawer.tsx` | 75 | `bg-card` becomes `liquid-glass-strong` with matching bg |

### 4. Modals

**LoginModal (`LoginModal.tsx`)** -- Replace `bg-white` with liquid glass card material (translucent bg, inner highlights, stronger blur)

**LearnMoreModal (`LearnMoreModal.tsx`)** -- DialogContent gets liquid glass material; inner role cards and section backgrounds get glass tint

**PhoneAuthFlow (`PhoneAuthFlow.tsx`)** -- Internal card surfaces (wallet reveal, key reveal, role selection cards) get `liquid-glass-card` for layered depth

**OnboardingModal (`OnboardingModal.tsx`)** -- `bg-card/95 backdrop-blur-xl` upgraded to `liquid-glass-strong`

**WelcomeWalkthrough (`WelcomeWalkthrough.tsx`)** -- Same upgrade from `bg-card/95 backdrop-blur-xl` to `liquid-glass-strong`

**ComingSoonModal (`ComingSoonModal.tsx`)** -- Backdrop gets enhanced blur+saturate

**Wallet modals** (AddFunds, Withdraw, Send, Request, KeyActivation) -- Backdrop overlays get enhanced blur treatment

**Seedbase modals** (CommitSeed, GiveToProvision, LaunchMission, etc.) -- All use Dialog/Drawer base, so they inherit upgrades automatically

**QuickActionButton** -- The full-screen overlay gets enhanced backdrop blur+saturate

**GlobalSearchModal, AffiliateExplainerModal, AmplifyModal, AmplifyPromptModal** -- Backdrop overlays enhanced

### 5. Page-Level Surfaces

All page headers already use `glass-strong` which gets upgraded in-place:
- HomePage, WalletPage, SeedbasePage, GovernancePage, SeededPage, SettingsPage, OneAccordPage, VaultPage, LauncherPage, TransactionHistoryPage

Sticky tab bars (e.g., GovernancePage line 99 `bg-background/95 backdrop-blur-sm`) get upgraded to `liquid-glass-strong`.

## Files Modified (complete list)

| # | File | Scope |
|---|------|-------|
| 1 | `src/index.css` | Core liquid glass utilities + upgrade `.glass` / `.glass-strong` + dark mode |
| 2 | `src/components/ui/card.tsx` | Translucent bg + inner specular highlight |
| 3 | `src/components/ui/button.tsx` | Glass sheen on secondary/ghost |
| 4 | `src/components/ui/dialog.tsx` | Enhanced overlay blur+saturate |
| 5 | `src/components/ui/drawer.tsx` | Enhanced overlay blur+saturate |
| 6 | `src/components/ui/sheet.tsx` | Enhanced overlay blur+saturate |
| 7 | `src/components/layout/AppLayout.tsx` | Mobile header class (1 line) |
| 8 | `src/components/layout/BottomNav.tsx` | Nav bar class (1 line) |
| 9 | `src/components/layout/Sidebar.tsx` | Sidebar class (1 line) |
| 10 | `src/components/layout/MobileDrawer.tsx` | Drawer panel + backdrop |
| 11 | `src/components/sections/LoginModal.tsx` | Liquid glass card bg |
| 12 | `src/components/landing/LearnMoreModal.tsx` | Liquid glass material on modal |
| 13 | `src/components/onboarding/PhoneAuthFlow.tsx` | Glass card on wallet/key/role surfaces |
| 14 | `src/components/shared/OnboardingModal.tsx` | Upgrade to liquid-glass-strong |
| 15 | `src/components/onboarding/WelcomeWalkthrough.tsx` | Upgrade to liquid-glass-strong |
| 16 | `src/components/shared/ComingSoonModal.tsx` | Enhanced backdrop |
| 17 | `src/components/shared/QuickActionButton.tsx` | Enhanced overlay backdrop |
| 18 | `src/components/shared/GlobalSearchModal.tsx` | Enhanced backdrop |
| 19 | `src/components/shared/AffiliateExplainerModal.tsx` | Enhanced backdrop |
| 20 | `src/components/social/AmplifyPromptModal.tsx` | Enhanced backdrop |
| 21 | `src/pages/GovernancePage.tsx` | Sticky tab bar upgrade (1 line) |

## What This Covers

- **Sidebar** -- liquid glass
- **Bottom nav** -- liquid glass
- **Mobile header** -- liquid glass
- **Mobile drawer** -- liquid glass
- **All cards** (seedfeed, wallet, seedbase, governance, dashboard, impact, etc.) -- via Card component upgrade
- **All modals** -- via Dialog/Drawer upgrade + individual modal fixes
- **All page headers** -- via `.glass-strong` upgrade
- **Login/Signup** -- liquid glass card
- **Learn More** -- liquid glass
- **Settings, Profile, Wallet, Vault, Governance, Shop, OneAccord, Launcher** -- all inherit from shared components
- **Buttons** -- subtle glass on secondary/ghost

## Risk Mitigation

- All changes are purely visual (CSS classes + Tailwind utilities)
- `.glass` and `.glass-strong` upgraded in-place so all 37 files using them benefit automatically without individual edits
- Card component upgrade cascades to all card instances across the entire app
- Dialog/Drawer/Sheet upgrades cascade to all modals
- Landing page is completely excluded -- no files in `src/components/sections/ScrollingLandingPage.tsx`, `MobileScrollNarrative.tsx`, or `src/components/landing/hero-states/` are touched
- Dark mode is handled in every new/upgraded utility class
- Zero logic, routing, or data changes

