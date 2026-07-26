# 07 — Screen patterns

Components are pieces; these are the compositions. Reuse a pattern before
inventing a layout.

---

## Page shell

```
page canvas (#EEF1F3, 20px padding, min-width 1480)
└─ frame (white, r28, 28px padding, 22px gap, --web-shadow-frame)
   ├─ rail (78px)  or  sidebar (252px navy)
   └─ content column (flex, gap 18px)
      ├─ PageHeader          flex: none
      ├─ FilterBar           flex: none   (optional)
      ├─ AlertBanner         flex: none   (conditional)
      └─ body                flex: 1, min-height: 0   ← the only scrolling part
```

`min-height: 0` on the body is load-bearing: without it a flex child refuses to
shrink and the whole page scrolls instead of the list.

Scrolling regions carry `className="lw-scroll"` for the thin `#cdd6dc` bar.

---

## Page header

Title block on the RTL right; controls on the left, in this order:
**page tabs → notifications → support → divider → account chip**.

`subtitle` is for a one-line explanation of the screen
("سجل جميع عمليات الدفع وشحن الرصيد والسحب الخاصة بحساب شركتك"), not for
status. Status belongs in the body.

---

## Filter bar

Order, right to left: **TabGroup → SearchField → SelectFields → spacer → CTA**.

- Tabs carry counts only where a count is meaningful.
- Selects always show their own label in the "all" option
  (`الحالة: الكل`, `النطاق: الكل`, `التاريخ: الكل`) so the bar reads without
  external labels.
- The status options depend on the active tab — live statuses, offer statuses
  and history statuses are three different lists.
- Switching tabs **resets the status filter and collapses any expanded row**.
- The primary CTA sits inside `FilterBarSpacer`, and when a plan cap is hit it
  goes disabled *with* a `title` explaining why.

---

## The five view states

**Every list surface implements all of them.** This is a contract, not a
nice-to-have — the design ships a visible `حالة العرض` selector precisely so
each state is reachable and reviewable.

| State | Trigger | Renders |
|---|---|---|
| `default` | data present | the list |
| `empty` | no records at all | `EmptyState` + primary action |
| `loading` | fetch in flight | `LoadingState` — static skeleton rows + spinner |
| `error` | fetch failed | `ErrorState` + إعادة المحاولة |
| `noresults` | filters exclude everything | `NoResultsState` + مسح جميع الفلاتر |
| `limit` | plan cap reached *(B2B only)* | amber `AlertBanner` + disabled CTA, list still shown |

`empty` and `noresults` are different states with different copy and different
recovery actions. Do not collapse them.

Keep the `حالة العرض` control in the pagination bar. It is a design affordance
for review, and it is how a reviewer checks all five without a backend.

---

## Tone

Five tones drive every status surface (`TONE` in `src/tokens.ts`):

| Tone | When | Row tint | Text | ID ink |
|---|---|---|---|---|
| `success` | live / in transit / paid | `#E9F9F0` | green-700 | green-600 |
| `warning` | awaiting offers / pending / needs attention | amber-100 | amber-600 | amber-600 |
| `danger` | cancelled / failed | red-100b | red-600 | red-600 |
| `done` | delivered & closed | `#E9F9F0` | green-700 | **navy-800** |
| `neutral` | expired without an offer / archived | icon-tint | slate-600 | slate-600 |

`done` shares the green tint with `success` but inks its ID navy — a completed
trip is no longer live, so it stops shouting. That distinction is deliberate.

`BADGE_TONE` is the flatter four-tone set for badges on white (tables, panels).

---

## Expandable row

Used by `رحلاتي`. Collapsed = one grid row. Expanded adds:

- a map preview on the identity rail (the rail switches from centred to
  top-aligned and the row grows),
- a hairline divider inset `0 20px`,
- a three-column strip: **progress · driver-or-offers · actions**, with
  `border-right` dividers between columns.

Only one row is expanded at a time. Clicking the collapsed rail expands;
clicking the grid toggles; the action button expands without toggling closed.

---

## Side panel

372px, slides in with `lw-panel-in .28s`. Sits **beside** the content
(`display: flex; gap: 14px`), not over it — no scrim, because the list stays
useful while the panel is open.

Structure: fixed header (title + 32px close) → scrolling body (18px padding) →
optional fixed footer with one full-width `PanelCta`.

Use a scrim `Drawer` only when the background genuinely must not be
interactive.

---

## Data table

`TableCard` → `DataTable` → rows. Sticky `--lw-bg-subtle` head, `min-width:
920px`, rows hover to `--lw-bg-subtle`, hairline `--lw-divider-2` between rows.

Cell recipe: `CellPrimary` (13px/700 navy) over `CellSecondary` (11px/600
slate, `margin-top: 2px`). Pass `ltr` for codes and times. Leading icon goes in
a 36px `RowIcon` badge. Trailing utility button is a 32px `IconButtonSm` that
**stops propagation** so it doesn't open the row.

Attach the `PaginationBar` with `attached` so it welds to the card bottom.

---

## Wallet card

The only gradient in the product:
`radial-gradient(130% 160% at 100% 0%, #3D5571 0%, #2C3E50 60%)`, one
`rgba(255,255,255,.05)` decorative circle at `left:-46px; top:-46px`, and a
`rgba(255,255,255,.14)` "محمي" chip.

Layout: figure block → optional stats → **spring** → actions. The design ships
balance + CTA only, with an empty spring between them; the `stats` prop exists
for when those figures are designed in.

---

## Calendar lane packing

Per week: collect the trips overlapping it, sort by start column then by span
length descending, then greedy first-fit into lanes. Week height is
`30 + laneCount * 26 + 6` — 30px reserves the day numbers, each lane is a 22px
bar plus 4px row-gap.

Bar corners are `9px` on a true start/end and `3px` where the bar continues
into the next week, so a multi-week trip reads as one object.

Hovering dims every other bar to `.26` and lifts the hot one 1px with
`--web-shadow-bar-hot`. `highlightedId` accepts the hovered *or* selected id so
the selection stays highlighted after the pointer leaves.

Day cells: in-month white + hairline · out-of-month `#F3F6F7`, no border ·
today `#F2FBF6` + 1.5px green border, with the number in a green circle.

Note the intentional inconsistency: the weekday header row uses `gap: 8px`
while the day grid uses `column-gap: 6px`. That is how the design has it.

---

## Forms (derived screens)

Two-column `formGrid`, `14px 18px` gap; full-width fields span `1 / -1`.
Label 12px/600 slate-600, with an amber `*` when required. Controls are 44px,
radius 12, `1px solid --lw-border`, focus → green border + 4px
`--color-focus-ring`. Help text 11.5px/600 slate-500 under the control.

Choice cards (truck type, pricing mode) are 1.5px-bordered tiles that turn
green-bordered on a `--color-success-bg` fill when selected.

**`BR-001` in forms:** no field, hint, placeholder or helper text may suggest a
price. The pricing step asks for a Base Price or opens a tender; it never
proposes a number or a range.

---

## Stepper (wizard)

Numbered 26px dots joined by 26px bars. Active = green fill; completed = green
tint + check glyph; upcoming = neutral tint. Labels 12px, active goes 800.
Steps are clickable — a wizard that traps you is worse than one you can skim.

Below it: content, then a sticky `actionBar` with an autosave note on the right
and إلغاء / السابق / التالي on the left.

---

## Timeline

Two variants:

**Compact** (`StatusTimeline`) — 10px dot, 1px connector. For a two- or
three-step transaction history in a panel.

**Full** (the trip workspace) — 22px dot holding a check or clock glyph, 2px
connector, and three states: `done` (green fill), `active` (green ring, white
fill), `upcoming` (grey ring, muted label). For the trip's event log.

The `Timeline` component is the full variant, and it takes a fourth state the
trip workspace did not need: `danger`, for the step where something went wrong —
a failed capture, a rejected document, a penalty trigger.

---

## Decision surface: panel footer vs. dialog

Every Admin approval queue makes the same choice, and it should be made the same
way each time.

**The `SidePanel` footer holds the decision.** The reviewer reads the request in
the panel and acts in the panel — approve, request more information, edit an
amount. No overlay. The list stays visible behind it, which matters because the
next item in the queue is the next thing they will do.

**`ConfirmDialog` is only for the irreversible branch.** Reject, suspend,
delete, release a payout. It is centred, it scrims, it restates what is about to
happen and to whom, and where a reason is required it **keeps the confirm button
disabled until the reason has content**.

The split is not stylistic. A dialog on every action trains the operator to
dismiss dialogs, which is exactly the reflex you do not want on the one action
that moves money. Reserve the interruption for the things that cannot be undone.

Reason text is mandatory on rejection because it is the only thing the driver or
company receives. "Rejected" with no reason is a support ticket the platform
created for itself.

---

## Queue counts are derived, never written down

A sidebar badge that says 12 while the table shows 11 is worse than no badge.
Counts come from the same state the tables filter, through one selector
(`useQueueCounts`), so a decision moves the number in the same render as it
moves the row.

The corollary: seed data has to match. If the fixture file says twelve drivers
are under review, the badge says 12 because it counted them — not because
someone typed 12 into the nav config.

---

## Every sensitive action writes to the audit log

`BR-015`. In the UI this is three things, all required:

1. The reducer appends an `AuditEntry` in the same action that mutates — not in
   the component, so no screen can forget.
2. The entry carries **before and after values**, the actor, and the reason.
   `/audit` renders them as a two-column diff; an entry with no before-value is
   an entry nobody can review.
3. The UI **says so**. The audit screen carries a banner stating that the log is
   read-only, and the sidebar footer states that sensitive actions are recorded.
   Telling operators they are logged is part of the control, not decoration.

`/audit` has no actions on it. Not "no actions yet" — none, ever. An audit trail
you can edit is not an audit trail.

---

## Charts

There are none, and that is a decision rather than a gap.

The design system defines no axes, no gridlines, no legend, no plotting palette
and no chart type. Reaching for a chart library means inventing all five on the
spot, in a product whose whole point is that its surfaces were derived rather
than improvised — and it drifts the moment a second person adds a second chart.

`BarList` covers what the reports actually need: ranked comparison. Label,
value, proportional bar, brand green unless a status colour means something.
When the brand does grow a chart language, it gets designed once and lands here.

---

## Stacked text inside a link

`ListRow`, `KpiTile` and the `PageHeader` account chip all render a title over a
meta line **inside a single `<a>`**, which means the two lines are `<span>`s —
block elements are not valid inside an anchor's inline context in the markup
these were derived from.

So the wrapper must carry `display: flex; flex-direction: column`. Without it
the spans stay inline and the two lines render as one run of text with no space
between them — `LW-2026-002948وصلت 5 عروض`. It reads as a data bug rather than a
CSS one, which is what makes it worth writing down.
