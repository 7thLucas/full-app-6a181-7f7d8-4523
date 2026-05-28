# Crumb — Design Guidelines

## Design Philosophy
Crumb feels like a warm, well-loved bakery: hand-lettered, golden-hour, tactile. The UI gets out of the way of the pastries themselves — photos are the hero, chrome is hushed. Counter-tablet first: every surface assumes a tablet held at arm's length on a flour-dusted counter, tapped by floury fingers.

## Color Palette

### Primary (Crust & Crumb)
- **Crust Gold** `#C8924A` — warm golden-brown, the signature accent (bestseller crown, active states, CTAs)
- **Toasted Caramel** `#8B5A2B` — deep bakery brown, used for primary text on light surfaces
- **Butter Cream** `#FAF3E3` — soft warm off-white, the primary canvas / background
- **Fresh Flour** `#FFFFFF` — pure white, used for cards and elevated surfaces

### Secondary
- **Strawberry Jam** `#C84A4A` — for destructive actions, undo, alerts (used sparingly)
- **Spearmint** `#7BA98E` — for confirm/success states (sale logged confirmation)

### Neutrals
- **Char** `#2A1F18` — primary text on light surfaces, near-black with a warm undertone
- **Soft Ash** `#6B5D52` — secondary text, muted labels
- **Pastry Edge** `#E8DDC7` — subtle borders, dividers, card outlines

### Semantic
- Success: Spearmint `#7BA98E`
- Warning: Crust Gold `#C8924A`
- Destructive: Strawberry Jam `#C84A4A`
- Info: Toasted Caramel `#8B5A2B`

## Typography

### Font Families
- **Display / Headings:** "Fraunces" (or system serif fallback) — warm, slightly hand-lettered serif. Used for screen titles and the big sold-today numbers.
- **Body / UI:** "Inter" (or system sans fallback) — clean, legible at small sizes. Used for labels, body, buttons.

### Scale (tablet-optimized — counts and tap targets are large)
- **Hero count (per-pastry sold today):** 48px / 700 weight / Fraunces — must be readable from 2-3 feet.
- **Cumulative sold-today (owner view):** 72px / 700 weight / Fraunces
- **Pastry name on card:** 20px / 600 weight / Inter
- **Page title:** 32px / 700 weight / Fraunces
- **Section heading:** 18px / 600 weight / Inter
- **Body:** 16px / 400 weight / Inter
- **Label / meta:** 14px / 500 weight / Inter, Soft Ash color
- **Caption:** 12px / 500 weight / Inter

## Components

### Pastry Card (THE hero component)
- Minimum tap area: 160px × 200px on tablet (larger preferred)
- Photo: fills top 70% of card, rounded top corners, object-cover
- Pastry name: bottom-left, 20px Inter 600
- Sold-today count: bottom-right, 48px Fraunces 700, Crust Gold color
- Card background: Fresh Flour `#FFFFFF`
- Card border: 1px Pastry Edge, radius 16px
- Elevation: soft shadow, 0 2px 8px rgba(42,31,24,0.08)
- Tap feedback: 100ms scale-down to 0.97 + soft warm flash overlay + count bump with subtle bounce
- Bestseller badge (top-3): a small Crust Gold pill/crown in the top-right corner of the photo

### Grid Layout
- Tablet (primary target, landscape): 3 columns, 24px gap
- Tablet portrait: 2 columns
- Phone (degraded experience): 2 columns, smaller cards
- Grid re-sorts with a smooth 300ms ease-out transition (FLIP-style) so cards visibly slide into new ranks

### Buttons
- Primary: Crust Gold bg, Char text, 16px Inter 600, 14px vertical padding, 24px horizontal, radius 12px
- Secondary: transparent bg, Toasted Caramel border + text
- Destructive: Strawberry Jam bg, white text
- Minimum height 48px (tablet tap target standard)

### Sidebar / Navigation (owner only)
- Sidebar uses Butter Cream bg, Pastry Edge right border
- Active nav item: Crust Gold left bar accent + Toasted Caramel text
- Staff role never sees a sidebar — they see only the sold-today screen with a small avatar/logout in the top corner

### Top Bar (on sold-today screen)
- Minimal: bakery name lockup (left), today's date (center, Soft Ash 14px), user avatar + logout (right)
- Height 64px, transparent background blending into Butter Cream canvas

### Live Count Bump Animation
- On tap: count increments, briefly scales to 1.15x and color-pulses to a slightly brighter gold, then settles back over 250ms

### Undo Toast (post-tap)
- Bottom-center toast: "Sold: Croissant. Undo" with a 10-second countdown ring
- Strawberry Jam undo link, dismisses on timeout

### Leaderboard (owner insight view)
- Ranked list, top-3 with subtle Crust Gold rank badges
- Each row: rank, pastry thumbnail (48px round), name, sold-today count, small sparkline (last 7 days) if available
- Cumulative sold-today displayed huge at top of view (72px Fraunces)

## Elevation
- **Level 0 (canvas):** Butter Cream background, no shadow
- **Level 1 (cards):** Fresh Flour bg, 0 2px 8px rgba(42,31,24,0.08)
- **Level 2 (modals, popovers):** Fresh Flour bg, 0 8px 24px rgba(42,31,24,0.12)
- **Level 3 (toasts, floating):** Fresh Flour bg, 0 12px 32px rgba(42,31,24,0.16)

## Spacing & Radius
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Page padding: 24px (tablet)
- Card radius: 16px
- Button radius: 12px
- Input radius: 10px
- Avatar radius: full (circle)

## Iconography
- Lucide icons, 24px default, stroke width 2
- Tint: Toasted Caramel for default, Crust Gold for active/selected

## Motion
- Default transition: 200ms ease-out
- Re-sort transition: 300ms ease-out (FLIP)
- Tap feedback: 100ms in, 250ms settle
- Avoid bouncy/playful springs in the hot path — they delay perceived response. Keep things crisp.

## Accessibility
- All tap targets minimum 48px (cards far exceed this)
- Contrast: body text Char on Butter Cream meets WCAG AA
- Crust Gold on white meets AA for large text only — use Toasted Caramel for small body when needed on white
- Focus rings: 2px Crust Gold outline, 2px offset

## Imagery Guidelines
- Pastry photos: warm, natural light, soft golden tones, square or 4:5 crop, food centered with shallow background
- Avoid stock-photo sterility — prefer photos that look like the bakery's own
- Placeholder when no photo: Butter Cream background with a small pastry-shaped silhouette in Pastry Edge color

## What to Avoid
- Cold blues/greys (this is a warm bakery, not a fintech dashboard)
- Heavy gradients or glassmorphism
- Dense data tables on the staff-facing surface (they live in the owner-baker view only, and even there stay minimal)
- Modal confirmations on the tap-to-log flow — they break the two-tap promise
- Tiny text anywhere on the counter-tablet screen
