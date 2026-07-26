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
| `StatusTimeline` | dot + connector + label/meta/note steps — the **compact** variant. For the full 22px-glyph version see `Timeline` below |

---

## Layout

Promoted out of `apps/b2b/src/app/(portal)/derived.module.css` when the Admin
portal needed the same pieces. Nothing here was re-authored — the rules were
lifted verbatim and the B2B screens repointed at the package, which is why the
B2B portal renders identically before and after.

| Component | Props | Notes |
|---|---|---|
| `PageBody` | `variant: 'stack' \| 'row'` | `stack` = scrolling column; `row` = table + side panel |
| `Grid` | `cols: 2 \| 3 \| 4` | equal-width card grid |
| `Split` | `ratio` | two panes, main + aside |
| `Section` | `title` `subtitle` `action` `flush` | the white card with a titled head. `flush` removes body padding — use it when the body is a list or table |
| `ListRow` | `icon` `iconBackground` `iconColor` `title` `meta` `metaSecondary` `side` `href` `onClick` `unread` `linkAs` | the 36px-glyph list row. `linkAs={Link}` to route with `next/link` |
| `ContentTabs` | `tabs` `value` `onChange` | navy pill set **inside** a page body — distinct from `TabGroup`, which lives in the filter bar |
| `ActionBar` | `note` + children | a filter/action strip for screens that have no table to attach one to |
| `Tag` / `ChipList` | `tone` | small labels; `ChipList` wraps them with the right gaps |
| `KpiTile` / `KpiGrid` | `label` `value` `suffix` `icon` `background` `color` `href` `linkAs` · `cols` | de-duplicates the tile that had been copied into both portals |
| `InlineLink`, `Muted` | — | the two text atoms the sections kept re-declaring |

> **`ListRow`, `KpiTile` and `PageHeader`'s account chip render their two lines
> as `<span>`** so the whole row can be a single `<a>`. That makes the
> container's `display: flex; flex-direction: column` load-bearing — drop it and
> the two lines run together on one line with no space between them. If you
> build another stacked-text row, set it on the wrapper.

---

## Forms

| Component | Props | Notes |
|---|---|---|
| `FormGrid` | `cols` | the two-column field grid |
| `Field` | `label` `required` `help` `error` `wide` `htmlFor` | label + control + help line. `error` renders `help` in danger red; `wide` spans both columns |
| `TextInput` | `ltr` `unit` + native input props | `ltr` isolates IDs/amounts inside RTL copy; `unit` renders the trailing ر.س / % chip |
| `TextArea` | `rows` + native props | |
| `FormSelect` | `options` `value` `onChange` | the form-scale select (`SelectField` is the filter-bar one) |
| `ChoiceRow` / `ChoiceCard` | `columns: 2 \| 3` · `active` `title` `body` `onClick` | radio-style selectable cards |
| `Toggle` | `checked` `onChange` `label` `help` | 44×26 track, green when on; **the knob slides left** because the product is RTL |
| `Checkbox` | `checked` `indeterminate` `onChange` | `indeterminate` is what makes a select-all header checkbox honest |

---

## Overlays

### `Modal`
`open` · `onClose` · `title` · `subtitle` · `wide` · `footer` · children
(`wide` = 720px instead of 480px — for a document review or a wide form.)

Scrim `var(--color-scrim)` + the `lw-scrim-in` / `lw-drawer-in` keyframes that
were already declared in `packages/ui/styles/global.css`. Esc closes, body
scroll locks while open, focus returns to the trigger on close, and a mousedown
on the scrim dismisses.

### `ConfirmDialog`
`open` · `onClose` · `onConfirm(reason)` · `title` · `body` ·
`tone: 'default' \| 'danger' \| 'warning'` · `confirmLabel` · `cancelLabel` ·
`reasonRequired` · `reasonLabel` · `reasonPlaceholder` · `summary`

Built on `Modal`. When `reasonRequired` is set the confirm button stays
**disabled until the reason is non-empty**, and the field's help line says why.
This is the mechanism behind the Admin rule *"rejecting always requires a
reason — no silent rejects."* Use it for irreversible actions only; reversible
decisions belong in the `SidePanel` footer.

`summary` is a strip above the reason field for counts and totals — the bulk
payout release uses it to restate driver count and amount before the operator
commits.

### `ModalButton`
`variant: 'primary' \| 'ghost' \| 'danger'` — the dialog footer button.

---

## Timeline (full)

### `Timeline`
`items: { id, label, meta?, note?, state }[]` ·
`state: 'done' \| 'active' \| 'upcoming' \| 'danger'`

22px glyph dots and a 2px connector. **Not** interchangeable with
`StatusTimeline` — that one is the compact two-or-three-step history that sits
inside a side panel. Use `Timeline` when the sequence is the content of the
screen, `StatusTimeline` when it is a detail on something else.

---

## Documents

### `DocumentViewer`
`name` · `meta` · `src` · `tall` · `onDownload` · `onExpand` ·
`onApprove` / `onReject` · `decision: 'approved' \| 'rejected' \| null`

With no `src` it renders the **diagonal-hatch placeholder plate**, not an image.
`01-identity.md` rules photography out of this product, so a document preview is
a plate with a glyph and a caption — never stock imagery.

`onApprove`/`onReject` render the per-document decision strip, which is what the
driver and truck queues need: a request can be sound apart from one bad
document, and the reviewer has to be able to say exactly that. Once `decision`
is set the buttons are replaced by the outcome.

`meta` is composed by the caller (`"PDF · 620 ك.ب"`) — the component does not
format file sizes.

### `PhotoGrid`
`captions: string[]` — a grid of hatch plates for the truck photo set.

---

## Matrix

### `CompatibilityMatrix`
`rows` (cargo types) · `columns` (truck types) ·
`value: Record<"rowId:columnId", Compatibility>` · `onChange` · `readOnly`

Clicking a cell cycles `allowed → warning → blocked`. Missing entries read as
`allowed`. `COMPATIBILITY_LABEL` exports the approved Arabic for the three
states — do not coin your own.

---

## Charts

### `BarList` + `toBarData()`
`data: { label, value, percent, color? }[]`

**There is no chart library in this product, deliberately.** The brand has no
chart vocabulary — no axes, no legends, no plotting palette are defined anywhere
in the design system, so any real chart would be invented from scratch and drift
on first contact. `BarList` says the same thing with tokens the product already
speaks.

`value` is rendered as-is, so pre-format it. `toBarData(rows, format?)` takes
`{label, value: number, color?}[]`, normalises `percent` against the largest
row, and applies `format` (default `toLocaleString('en-US')`).

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
