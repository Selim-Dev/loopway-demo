# 06 — Components

Everything below is exported from `@loopway/ui`. Both portals build from this
package; anything you find yourself re-writing in an app belongs here instead.

```tsx
import { AppShell, IconRail, PageHeader, TripRow /* … */ } from '@loopway/ui';
```

Router-agnostic by design: components that link take a `linkAs` prop
(`linkAs={Link}` in Next). Default is a plain `<a>`.

---

## Shell & navigation

### `AppShell` — the B2B frame
```tsx
<AppShell rail={<IconRail … />}>{children}</AppShell>
```
Page canvas → rounded white card (1440×980 minimum) → rail + content column.
Content children are laid out as a flex column with `--web-col-gap` between
them.

### `IconRail` — 78px icon navigation (B2B)
`items: RailItem[]` · `pathname` · `avatarInitial` · `settingsHref` · `linkAs`

`RailItem` = `{ title, icon, href, matchPrefix? }`. Resolves the active item
itself from `pathname`. Active = green fill + `--web-shadow-rail-active`.
Bottom slot holds the account avatar and the settings gear.

Use when a portal has **≤ 6 destinations**.

### `NavSidebar` + `SidebarShell` — 252px labelled navy navigation (Admin)
`groups: SidebarGroup[]` · `pathname` · `subtitle` · `footer?` · `linkAs`

`SidebarGroup` = `{ label?, items: SidebarItem[] }`;
`SidebarItem` = `{ label, icon, href, count? }`.

Active = `rgba(46,204,113,.16)` tint + a 3px green edge marker. Brand and
footer stay pinned; only the destination list scrolls. `count` renders a green
pill — use it for queue depth (pending approvals, open cases).

Use when a portal has **more than 6 destinations**. Not a new invention — it is
the shell the design shipped in its first company-dashboard iteration.

### `PageHeader` — 66px chrome bar
`title` · `subtitle?` · `tabs?: PageTab[]` · `notificationCount` ·
`accountName` · `accountId` · `accountInitial` · `linkAs`

`PageTab` = `{ label, icon?, href, active }` — the segmented القائمة/التقويم
control. `accountId` renders LTR automatically.

---

## Filter bar

### `FilterBar` / `FilterBarSpacer`
The 44px row between header and content. `FilterBarSpacer` pushes its children
to the far (RTL-left) edge — that is where the primary CTA goes.

### `TabGroup`
`tabs: TabItem[]` · `active` · `onChange`. `TabItem` = `{ key, label, count? }`.
Active tab is navy-filled; its count pill turns green. Omit `count` for tabs
that don't have one (سجل الرحلات).

### `SearchField`
`value` · `onChange` · `placeholder` · `size?: 'md' | 'sm'`. Icon sits at
`right: 13px`; input padding leaves room for it.

### `SelectField`
`value` · `onChange` · `options` · `variant?: 'default' | 'quiet'` ·
`size?` · `aria-label` (required).

`quiet` is the dashed inset variant used by the **view-state control** in the
pagination bar.

### `PrimaryCta`
`icon?` · `onClick` **or** `href` · `disabled` · `title` ·
`variant?: 'primary' | 'secondary'` · `size?` · `linkAs`.

Disabled renders `#BCC8CF` with `cursor: not-allowed` and keeps the `title`
tooltip — **always give a disabled CTA a reason**.

---

## Display atoms

| Component | Props | Notes |
|---|---|---|
| `RefCode` | `size` `weight` `color` | LTR Montserrat reference code |
| `StatusBadge` | `tone: 'success'\|'warning'\|'danger'\|'neutral'` · `pill?` | dot + label on a tinted pill |
| `ScopeTag` | `scope: 'محلية' \| 'دولية'` | international gets the blue tint |
| `StageChip` | `tone` `label` `showSpinner?` `showCheck?` `elapsed?` | the long-form stage sentence |
| `ProgressBar` | `percent` `label?` | 7px track, green fill |
| `AvatarInitial` | `initial` `variant: 'driver'\|'offers'` `shape` `size` `fontSize` | navy for a driver, amber for an offer count |
| `AmountText` | `amount` `direction: 'credit'\|'debit'` `muted?` `hero?` `currency?` | LTR, `+`/`−` prefixed, tone-coloured |
| `RouteChips` | `from` `to` `variant: 'onTint'\|'plain'` | round green dot = pickup, square navy dot = drop-off |

`StageChip` conventions: spinner when live or awaiting offers, check when
delivered, elapsed timer **only** when live.

---

## The signature component

### `TripRow`
```tsx
<TripRow
  trip={trip} expanded={…} onToggle={…}
  elapsed={trip.live ? formatElapsed(trip.baseElapsed + tick) : undefined}
  waybillHref={`/trips/${trip.id}/waybill`} linkAs={Link}
/>
```

Tone-tinted outer card, 216px identity rail on the RTL right, white detail
panel on the left. Collapsed it is a five-column grid; expanded it grows an
abstract SVG map preview on the rail and a three-column detail strip
(progress · driver-or-offers · actions) below.

The whole row is keyboard-operable (`role="button"`, Enter/Space) and the
action button stops propagation so it can behave differently later without
also toggling.

### `LiveWaybillButton`
The `البوليصة الحية` CTA: breathing glow + two blurred drifting orbs. **The
only animated CTA in the product.** Justified by `BR-013`. Do not reuse the
treatment elsewhere.

---

## Feedback & view states

| Component | Purpose |
|---|---|
| `LoadingState` | `rows` skeleton blocks + spinner + label. **Static blocks — no shimmer.** |
| `ErrorState` | red glyph + title + body + إعادة المحاولة |
| `EmptyState` | neutral glyph + title + body + optional primary action |
| `NoResultsState` | amber search glyph + مسح جميع الفلاتر |
| `StateCard` | the shared 70px-padded white card the four above are built on |
| `AlertBanner` | `tone: 'warning'\|'danger'\|'info'\|'success'` — inline strip |
| `Spinner` | bare spinner |

---

## Surfaces

| Component | Purpose |
|---|---|
| `Card` / `tight` | white surface + hairline + navy shadow (`tight` = 18px radius, lighter shadow — table shells) |
| `SidePanel` | 372px slide-in; `title`, `onClose`, `footer` slot |
| `PanelCta` | `primary` / `ghost` / `danger` footer button |
| `SectionLabel`, `PanelHint` | panel body heading + inset note |
| `DetailList` / `DetailRow` | key/value rows with hairline dividers |
| `PaginationBar` | count + arrows, hosts the view-state control on the left; `attached` welds it to a table card |
| `TableCard` + `DataTable` | sticky head, hover rows, `min-width: 920px` |
| `CellStack`, `CellPrimary`, `CellSecondary`, `CellEmpty`, `RowIcon`, `IconButtonSm` | table cell building blocks (`ltr` prop on the cell texts) |
| `WalletCard` + `WalletCta` | the one gradient surface; optional `stats` |
| `StatusTimeline` | dot + connector + label/meta/note steps |

---

## Calendar

### `TripCalendar`
`trips` · `month` · `year` · `today` · `highlightedId` · `onHover` ·
`onSelect` · `onPrev` · `onNext` · `onToday`

Month grid with **lane-packed multi-day bars**. `buildCalendar()` is exported
separately if you need the layout without the chrome.

Also exported: `MONTH_NAMES_AR`, `WEEKDAYS_AR`.

---

## Hooks & helpers

| Export | Purpose |
|---|---|
| `formatElapsed(seconds)` | → `"HH:MM:SS"` |
| `useSecondTick(enabled)` | once-per-second counter, starts at 0 on mount so SSR and first client render agree (no hydration mismatch) |
| `TONE` | the five row tones — tint / text / border / stageBg / id / dot |
| `BADGE_TONE` | the four flat badge tones |
| `WEB` | typed shell geometry |

---

## Adding a component

1. Does an existing one cover it with a prop? Prefer the prop.
2. Is the value in `web.css`? If not, add it there first — not as a literal.
3. Write the CSS Module with a header comment naming the design source, or
   marking it DERIVED.
4. Export it from `src/index.ts`.
5. **Add a row to this file.** A component that isn't documented here will be
   re-invented by whoever builds the Admin portal.
