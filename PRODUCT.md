# Crumb — Product Specification

## What It Is
Crumb is a tap-fast "sold today" tracker built for small bakeries. It replaces fragmented sales tracking (paper tallies, separate channels, end-of-day reconciliation) with a single counter-tablet screen that unifies all sales — counter walk-ups, phone orders, in-shop walk-ins — into one live, glanceable "sold today" number per pastry. Bestsellers float to the top in real time so the owner-baker can see at a glance what to bake more of tomorrow.

## Users & Roles
- **Owner-Baker (admin):** The bakery proprietor. Logs sales when at the counter, and also reviews bestseller insight, cumulative sold-today across all channels, and back-of-house data (historical trends, pastry catalog management, staff management).
- **Part-time Counter Staff (staff):** Two non-technical part-timers who log sales between serving customers. They see ONLY the tap-to-log sold-today screen. No analytics, no settings, no clutter. They must be able to log a sale in two taps or fewer or they will skip it entirely.

## P0 Features (Must Nail First)
1. **Sold-Today Screen as Home View** — Lands here on login. No detours, no dashboard chrome ahead of it.
2. **Pastry Photo Grid** — Each pastry rendered as a large card with its photo dominating. Photo is the tap target.
3. **One Tap = One Sale** — Tapping a pastry card immediately logs +1 sale for that pastry against today's date. Visual confirmation (count bumps, subtle animation). No modal, no confirmation dialog.
4. **Live Count Per Pastry** — Each card shows its sold-today integer count, big and readable from arm's length.
5. **Live Re-Sort by Bestseller** — As counts change, the grid reorders so today's bestsellers float to the top. Visible movement makes the bakery's daily rhythm tangible.
6. **Owner-Baker Insight View** — Separate route for the owner showing: today's bestseller leaderboard (ranked list with counts), cumulative sold-today across the whole shop, and per-pastry sparkline or trend if cheap to add.

## Secondary Features (post-P0)
- Pastry catalog management (add/edit/archive pastries, upload photos)
- Daily reset behavior (counts roll over at start of day; yesterday's totals archived for trend view)
- Undo last sale (rolling 10-second undo for fat-finger taps)
- Staff management (owner adds/removes counter staff)
- Historical trends (week/month bestsellers)

## UX North Star
**Two-tap sale logging.** That's the entire product thesis. Every design decision answers to this:
- Big tap targets (minimum 120px square, ideally larger on tablet)
- Pastry photos dominate, not text columns
- Counts are glanceable from 2-3 feet away
- Zero confirmation dialogs on the hot path
- Real-time feedback so the staffer KNOWS the tap registered before they look back up at the customer

## Brand & Tone
- **Voice:** Warm, unfussy, neighborhood-bakery. Not corporate, not cutesy. Think hand-lettered chalkboard, not Silicon Valley dashboard.
- **Vibe:** Tactile, edible, a little buttery. Photos of pastries should feel appetizing — soft natural light, golden tones.
- **Copy:** Short, plain. "Sold today: 12" not "Total units moved in current trading period: 12".

## Anti-References (What This Is NOT)
- NOT a POS system. We do not handle payment, cash drawer, receipts, or tax.
- NOT an inventory system. We do not track raw ingredients, dough batches, or stock levels.
- NOT a CRM. We do not capture customer info, loyalty, or marketing.
- NOT a generic admin dashboard with charts everywhere. Charts live ONLY in the owner-baker insight view, and even there they stay quiet.
- NOT a multi-location chain tool. This is one small bakery, one counter tablet.

## Strategic Principles
1. **The counter-tablet screen is sacred.** If a feature would slow down or clutter the tap-to-log flow, it goes elsewhere or doesn't ship.
2. **Photos over text.** Staff recognize pastries by sight, not by name.
3. **Real-time or it doesn't count.** A sold-today number that updates in five seconds is wrong. It updates immediately on tap, and reflects other tablets/sessions within a beat.
4. **Owner gets insight, staff get speed.** The two roles see fundamentally different surfaces.
5. **Optimize for the rushed PT staffer mid-customer-serve.** Not for the owner reviewing at midnight. The owner can tolerate a few extra clicks; the PT cannot.

## Success Signals
- A PT can log a sale in under 2 seconds without looking at the tablet for more than a glance.
- By end of day 1, the owner-baker can see which pastry sold most without doing math.
- Staff stop using paper tallies within the first week.


#CORE TRUTH:
# Product Core Truth

## What it is
**Crumb** — a tap-fast "sold today" tracker for small bakeries. One counter-tablet screen unifies sales from counter walk-ups, phone orders, and in-shop walk-ins into one live sold-today number, with bestsellers floating to the top in real time.

## The problem
Owner currently can't see what actually sold each day. Orders come in from three channels — counter walk-ups, phone orders, and in-shop walk-ins — and none of them roll up into a single sold-today number. By closing time the owner has no view of which pastries flew off the shelf and which sat untouched.

## The economic pain
Without that view, next-morning bake quantities are pure guesswork. Two failure modes both leak revenue:
- **Overbake → waste:** trays of unsold pastries hit the bin at end of day (ingredient + labor cost lost).
- **Underbake → stockouts:** popular items sell out by ~10am, missing peak foot traffic for the rest of the day.

## Who uses it
A team of three:
- **Owner-baker** — opens early, bakes, runs the back-of-house. Primary consumer of the bestseller view and stock alerts.
- **Counter PT #1** — starts at 7am, runs the counter through the morning.
- **Counter PT #2** — joins for the lunch rush.

The part-timers are warm with customers but **not technical** — they actively avoid spreadsheets and "appy" interfaces. UX north star: **two-tap sale logging**, big buttons, pastry photos rather than text columns, glanceable. If logging a sale takes more than a beat between customers, they'll skip it and the data goes stale.

## P0 feature — what the app MUST nail first
A tap-fast **"sold today" tracker** as a single counter-tablet screen:
- Pastry photos are the tap-targets — one tap = one sale logged.
- Tally for each pastry increments live.
- List re-sorts live so today's bestsellers float to the top.
- Unifies the three sales channels (counter, phone, walk-ins) into one live sold-today number.

This is the foundational surface. Everything else depends on it producing clean data.

## Downstream features (post-P0, roadmap candidates)
- Bestseller history view (week / month rollups, repeat-buyer pastries).
- Ingredient stock tracker with low-stock pings.
- Next-morning bake plan generator (suggests quantities from yesterday's sold-today data).
- Phone-order quick-entry mode.

## Confirmed name
**Crumb** — short, warm, bakery-native, fits a tablet icon. Confirmed by user.