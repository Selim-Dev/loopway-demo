# 11 — Design source map & deviation log

Traceability: which design file each implemented screen came from, and every
place the implementation knowingly differs.

---

## Sources

**B2B portal project** — `2d380b8d-f211-47d2-a44e-afbb60ca7de2`
("لوحة الشركات – رحلاتي")

| File | Role |
|---|---|
| `_standalone-src.dc.html` (906 lines) | **canonical `رحلاتي`** — list + calendar + all six view states + collapsed/expanded rows + the full component logic |
| `trips-screen.dc.html` (871) | the same screen as an importable child; content identical |
| `لوحة الشركات - رحلاتي v2.dc.html` (896) | identical to `trips-screen` apart from its gallery wrapper |
| `سجل العمليات المالية.dc.html` (658) | **canonical finance screen** — wallet, table, detail panel, top-up sheet |
| `لوحة الشركات - رحلاتي.dc.html` (627) | **superseded v1** — table layout + scrim drawer + **the 252px labelled navy sidebar** |
| `رحلاتي-Screen.dc.html` | earlier iteration |
| `assets/loopway-mark.png` | brand mark (see deviation D-1) |
| `uploads/pasted-*.png` (21) | rendered screenshots |

**Design system project** — `772e5514-4469-4e1e-a3c9-283179feb956`
("LoopWay Design System") — `tokens/*.css`, `styles.css`, `readme.md`,
`SKILL.md`, `assets/logos/*`, 20 mobile React primitives, 17 guideline cards.

---

## Screen → source

| Implementation | Source | Status |
|---|---|---|
| `AppShell`, `IconRail`, `PageHeader` | `_standalone-src.dc.html` shell | designed |
| `/trips` list | `_standalone-src.dc.html` | **designed** |
| `TripRow` collapsed + expanded, map preview, tone system | same | **designed** |
| view states `default/empty/loading/error/limit/noresults` | same | **designed** |
| `/trips/calendar`, `TripCalendar`, `buildCalendar` | same | **designed** |
| calendar 372px detail panel | same | **designed** |
| `/finance` wallet + table + detail panel + top-up | `سجل العمليات المالية.dc.html` | **designed** |
| `NavSidebar` / `SidebarShell` | `لوحة الشركات - رحلاتي.dc.html` (v1) | designed, repurposed for Admin |
| `Drawer` scrim pattern, secondary-action labels | v1 | reference only |
| everything else | identity rules + SRS | **derived** |

Component logic ported line-for-line from the design's `DCLogic` class:
`toneColors()` → `TONE`; `actionStyleFor()` → `.actionPrimary/.actionSecondary`;
`whoIconStyleFor()` → `AvatarInitial` variants; `fmt()` → `formatElapsed()`;
`buildCalendar()` → `buildCalendar()`; `applyFilters()` → the screens' filter
memos; `badge()`/`badgeStyle()` → `BADGE_TONE` + `StatusBadge`;
`typeMeta()` → `TYPE_META` in the finance screen.

---

## Deviation log

Every knowing difference. Nothing else differs by intent.

### D-1 · Brand mark is vector, not the source raster — **open**
The design references `assets/loopway-mark.png` (674×349). The file exceeds the
design API's 256 KiB per-read cap and returns truncated, so it could not be
extracted. `LoopwayMark` draws the loop the *same design file* ships in its own
thumbnail template (`stroke #2ECC71`, width 34→52 scaled, round caps,
`d="M-150 0 a75 75 0 1 1 150 0 a75 75 0 1 0 150 0"`).
**To resolve:** drop the real PNG at `apps/*/public/brand/loopway-mark.png` and
swap the component. Same applies to `loopway-logo.png` and `loopway-full.png`.

### D-2 · Icon strokes use `currentColor` — **intentional, no visual change**
The design hard-codes `stroke="var(--lw-navy-800)"` on some icons.
`Icon.tsx` uses `currentColor` throughout so one definition serves white chrome,
the navy sidebar and green tiles. Identical output when the parent sets the
same colour.

### D-3 · Webfonts load via `next/font`, not the CSS `@import` — **intentional**
`tokens/fonts.css`'s Google-Fonts `@import` is dropped by the browser once a
bundler concatenates stylesheets, so Arabic silently fell back to a system
sans. Both apps self-host the same two families through `next/font/google`.
Same families, same weights, no runtime request to Google. The `@import`
remains as the documented fallback for non-bundled use.

### D-4 · Frame is a minimum, not a fixed size — **intentional**
The design frame is exactly 1440×980. Here `.page` sets `min-width: 1480px`
(1440 + 2×20px page padding) and the frame is `width: 100%; height: calc(100vh
- 40px); min-height: 980px`. **At a 1480×1020 viewport the rendering matches
the design exactly**; wider grows fluidly; narrower scrolls rather than
reflowing. Agreed fidelity strategy — "pixel-exact at 1440, fluid above".

### D-5 · Design-canvas gallery chrome omitted — **intentional**
`_standalone-src.dc.html` wraps the screen in review furniture: a
`رحلة إدارة الرحلات` heading, numbered `1a`/`1b`… badges and `dc-import`
thumbnails of each state. Those are canvas artifacts, not product UI. The
functional equivalent — the `حالة العرض` selector — **is** kept.

### D-6 · Wallet stats available but not rendered — **matches design**
The finance screen computes `onHold: '11,050'` and `pending: '10,000'` but
renders neither; the card ships balance + CTA with an empty spring between.
That composition is reproduced exactly. `WalletCard` still accepts a `stats`
prop for when those figures are designed in.

### D-7 · Hover states are real CSS — **required**
The design uses Claude Design's `style-hover=""` attribute, which has no
browser equivalent. Every one was translated into a `:hover` rule in the
corresponding CSS Module with the same target values.

### D-8 · `--lw-green-300` added to the colour tokens — **additive**
The waybill CTA's second halo orb references `var(--lw-green-300)`, which the
mobile design system never declared. Added to `colors.css` under a labelled
"web portals" block rather than hard-coded in the component.

### D-9 · Finance filter row is 42px, trips filter row is 44px — **matches design**
A real difference between the two designed screens (42/r12 vs 44/r13),
preserved rather than harmonised. Exposed as `size="sm" | "md"`.

### D-10 · One row expanded at a time — **matches design**
`expandedId` is a single value, exactly as the design's state is.

### D-11 · Live timer starts at 0 on mount — **required**
The design ticks a counter from mount. Reading the clock during render would
desync server and client HTML and produce a hydration mismatch, so
`useSecondTick` starts at 0 on mount and the base offset comes from the
fixture. Visually identical after the first second.

### D-12 · Calendar "today" is pinned, not read from the clock — **required**
Fixtures live in July 2026; a real clock would render an empty month and
desync SSR. `TODAY = { day: 16, month: 6, year: 2026 }`, matching the design's
own hard-coded `todayD/todayM/todayY`.

### D-13 · Keyboard and ARIA affordances added — **additive**
The design's rows are `div`s with `onClick`. Implemented as
`role="button"` + `tabIndex` + Enter/Space, with `role="tablist"/"tab"`,
`aria-selected`, `aria-current`, `aria-label` on icon-only buttons and
`role="progressbar"` on progress bars. No visual change.

### D-14 · `prefers-reduced-motion` block added — **additive**
`global.css` flattens all animation for users who ask for it. The design has no
such block.

---

## Fidelity verification

**What was possible.** The complete design source was read line-by-line — the
906-line `رحلاتي` file and the 658-line finance file, including every inline
style string and the full component logic — and values were transcribed rather
than eyeballed. The running app was then screenshotted at the reference
viewport (1480×1020) and checked against those values.

**What was not possible.** The bundled `لوحة الشركات - رحلاتي (standalone).html`
is 256.4 KB and returns truncated from the design API, and the `.dc.html`
sources need the Claude Design runtime (`support.js`, `_ds_bundle.js`) to
render. **So an automated pixel diff against a live render of the original
could not be produced.** Verification is source-transcription plus visual
review, not an image diff.

To close that gap: export the design to a self-contained HTML/PNG from
claude.ai/design, drop it in `tools/reference/`, and diff against
`tools/shoot.mjs` output at 1480×1020.

**Harness.**
```bash
npm run build:b2b && npx next start -p 3100 --dir apps/b2b
node tools/shoot.mjs ./shots trips=http://localhost:3100/trips
node tools/shoot-flow.mjs ./shots http://localhost:3100 expanded /trips "text:متابعة الرحلة"
```
