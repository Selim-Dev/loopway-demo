# 04 — Iconography

## There is no icon library

The upstream product has **no icon font, no sprite sheet, and no SVG/PNG icon
assets**. Every icon across ~30 screens is a hand-authored inline `<svg>` — but
all of them share one disciplined recipe.

`packages/ui/src/icons/Icon.tsx` collects the recurring ones into a single
component. **Every path in it is lifted verbatim from a designed screen.**
Nothing was redrawn from memory, and no third-party icon set is installed.

Do not add `lucide-react`, `heroicons`, `react-icons` or similar. Their stroke
weights, corner treatment and optical sizing do not match, and mixing them is
immediately visible.

---

## The stroke recipe

If you must add an icon, match this exactly:

```
viewBox     0 0 24 24
fill        none
stroke      currentColor
strokeWidth 1.6 – 2.4   (1.9 is the default; 2.0 for chevrons, 2.2 for plus,
                         2.6 for the check, 1.8 for empty-state glyphs)
linecap     round
linejoin    round
```

**Colour always comes from the surrounding text tone**, never a one-off brand
colour:

| Context | Colour |
|---|---|
| default / actionable | `--lw-navy-800` |
| muted, disabled, chevrons | `--lw-slate-500` / `--lw-slate-400` |
| the icon itself communicates state | the matching status colour |
| on a green/navy fill | `#fff` |

**Icons sit inside a tinted rounded-square badge** (10–14px radius) when used
as a leading glyph in a list row or action tile — never bare on white at large
size. The badge sizes in use: 44px (KPI tile), 40px, 36px (table row), 34px
(action row).

**No emoji. No Unicode symbol characters.** Anywhere.

---

## One intentional deviation from the source

The design hard-codes stroke colours on a few icons — the bell ships
`stroke="var(--lw-navy-800)"`, the search glass `stroke="var(--lw-slate-400)"`.
In `Icon.tsx` **every stroke is `currentColor`** and the call site owns the
colour.

Rendered output is identical when the parent sets the same colour, and it means
one `bell` works on white chrome, on a navy sidebar and inside a green tile
without three copies. This is the only change made to any path data.

---

## The set

Twenty-eight names, all `<Icon name="…" />`:

**Navigation & chrome**
`home` · `truck` · `card` · `user` · `gear` · `bell` · `support` · `list` ·
`calendar`

**Controls**
`search` · `plus` · `chevronDown` · `chevronRight` · `chevronLeft` · `close` ·
`check` · `retry` · `expand`

**State & meaning**
`clock` · `warning` · `shield` · `emptyTruck`

**Documents & money**
`upload` · `download` · `document` · `waybill` · `arrowIn` · `arrowOut`

### Two special cases

**`RouteArrow`** — the arrow between origin and destination chips. Non-square
`0 0 20 12` viewBox, kept separate rather than forced onto the 24×24 grid,
exactly as the design has it.

**`LoopwayMark`** — the brand mark. Takes `width` and `color`; use
`color="#fff"` when it sits on a green or navy fill.

> **Substitution note.** The design files reference a raster
> `assets/loopway-mark.png`. That file exceeds the design API's 256 KiB
> per-read limit and comes back truncated, so it could not be extracted.
> `LoopwayMark` draws the loop geometry the *same design file* ships in its own
> thumbnail template — `stroke #2ECC71`, round caps,
> `d="M-150 0 a75 75 0 1 1 150 0 a75 75 0 1 0 150 0"`. To use the real raster,
> drop it at `apps/*/public/brand/loopway-mark.png` and swap the component.
> Logged in [11-design-source-map.md](11-design-source-map.md).

---

## Icons that carry meaning, not decoration

Two shapes in this product are **semantic** and must not be swapped:

- **Round green dot** = pickup / origin.
- **Square navy dot** (`border-radius: 2px`) = drop-off / destination.

They appear on the trip-row route chips, in the calendar panel and in the
drawer. Making them both circles loses information.

Likewise the stage chip's leading glyph: **spinner** = something is in
progress, **check** = delivered. Never both, never neither.

---

## Sizes in use

`22` rail nav · `21` header icon buttons, rail gear · `20` alert banner, KPI
tile · `19` sidebar nav · `18` CTA glyph, table row icon, list-row glyph ·
`17` page tabs, wallet CTA · `16` chevrons, panel close · `15` inline button
glyph, stage check · `14` map-preview button, select chevron · `13` wallet
shield, timeline check · `12` elapsed clock, quiet select chevron.

Pass `size` as a number; the component sets both width and height.
