# 02 — Tokens

All tokens are CSS custom properties in `packages/ui/tokens/`, pulled in by
`packages/ui/styles/global.css`, which is the only stylesheet an app imports.

```
tokens/fonts.css       webfont declarations
tokens/colors.css      base palette + semantic aliases
tokens/typography.css  families, weights, type scale, leading, tracking
tokens/spacing.css     spacing scale + control heights   (MOBILE scale)
tokens/effects.css     radius, shadow, borders, motion, shared keyframes
tokens/web.css         the DESKTOP scale — see 05-web-scale.md
```

`colors`, `typography`, `spacing`, `effects` and `fonts` are **copied
byte-for-byte from the Claude Design system project**. Do not edit them to suit
a screen; if a value is missing, it belongs in `web.css`.

---

## Rule: base vs semantic

`colors.css` has two halves.

**Base palette** (`--lw-*`) — raw values, numbered light→dark. Reach for these
when you need a *specific* colour: a tint, a border, a chart bar.

**Semantic aliases** (`--color-*`) — meaning, not value. Prefer these in
components: `--color-text-primary`, `--color-success-bg`,
`--color-border-default`, `--color-danger-text`.

If you write a hex literal in a component, you have almost certainly skipped a
token. The few legitimate exceptions are documented inline where they occur
(the tone tints `#E9F9F0` / `#F2FBF6` / `#FFFBF2` / `#FEF5F4`, which the design
authored as inline values and which live in `TONE` in `src/tokens.ts`).

---

## Colour

### Brand green
| Token | Value | Use |
|---|---|---|
| `--lw-green-50` | `#F2FBF6` | today-cell fill, stage-chip background |
| `--lw-green-100` | `#E9F9F0` | success tint, row tint |
| `--lw-green-200` | `#C6EED7` | border on green tint |
| `--lw-green-300` | `#7FE0A8` | **web-only** — the waybill halo orb |
| `--lw-green-500` | `#2ECC71` | primary CTA fill, active rail, progress fill |
| `--lw-green-600` | `#27AE60` | CTA hover/press, trip-ID ink on live rows |
| `--lw-green-700` | `#1E8449` | success text on a green tint |

### Navy / slate
`--lw-navy-900 #2C3E50` primary text & chrome · `--lw-navy-800 #34495E` icons &
secondary buttons · `--lw-navy-700 #51606E` body secondary ·
`--lw-slate-600 #5B6A75` tertiary · `--lw-slate-500 #8A98A4` meta &
placeholders · `--lw-slate-400 #9AA7B0` quiet icons · `--lw-slate-300 #B4BFC6`
· `--lw-slate-200 #C7D0D6` chevrons & hover borders · `--lw-slate-100 #CBD5DB`

### Surfaces & borders
`--lw-bg-canvas #EEF1F3` page · `--lw-bg-subtle #F7F9FA` inset rows ·
`--lw-surface #FFFFFF` cards · `--lw-border #DCE3E7` inputs ·
`--lw-border-subtle #E7ECEF` icon buttons · `--lw-border-faint #ECF0F2` card
hairlines · `--lw-divider-2 #F0F3F4` list rows · `--lw-track #EAEEF0` progress
& skeletons · `--lw-icon-tint-bg #EEF2F4` neutral icon badges

### Status
Danger `--lw-red-100 / -100b / -border / -border-b / -500 / -600 / -700` ·
Warning `--lw-amber-100 / -border / -500 / -600 / -700` · Info
`--lw-blue-600 #2D6CC0`

### The tone system
Five tones drive every status surface. The full mapping lives in
`packages/ui/src/tokens.ts` as `TONE` (row tints) and `BADGE_TONE` (flat
badges on white). See [07-patterns.md](07-patterns.md) → "Tone".

---

## Typography

Families: `--font-arabic` Tajawal · `--font-latin` Montserrat ·
`--font-sans` = Tajawal, Montserrat, sans-serif (the default on every surface).

Weights: 400 / 500 / 600 / 700 / **800**. Headings run 700–800 with negative
tracking; body sits at 500–600.

Mobile type scale (`--text-*`): `display 34` `section 28` `h1 23` `h2 21`
`h3 19` `h4 17` `body-lg 15.5` `body 15` `body-sm 14` `label 13.5`
`caption 13` `meta 12.5` `small 12` `micro 11.5` `tiny 11` `nano 10.5`.

**The portals use the `--web-text-*` ramp instead.** See
[05-web-scale.md](05-web-scale.md).

Tracking: `--tracking-tight -.5px` (large headings) · `--tracking-snug -.3px`
(most headings, reference codes) · `--tracking-wide .3px` (small caps-ish
labels).

---

## Spacing

**The product is not on an 8px grid.** 7, 9, 11, 13, 14, 18 and 22px recur
constantly and were authored deliberately. `--space-1…18` documents the values
actually observed: `4 6 7 8 9 10 11 12 13 14 16 18 20 22 24 28 32 40`.

Copy the exact number from the design or from `web.css`. Snapping to 4/8
*will* show — the trip-row inner panel margin is 7px, the calendar column gap
is 6px while its weekday header gap is 8px, and both are intentional.

Semantic spacings: `--gap-icon-label 8px` · `--gap-row 9px` ·
`--gap-card 15px` · `--pad-card 14px 15px` · `--pad-input 0 14px`.

Control heights in `spacing.css` (`--h-button 52px`, `--h-input 50px`, …) are
**mobile**. The only place the portals use them is the OTP screen, where that
control exists nowhere else.

---

## Radius

`--radius-xs 7` · `sm 9` · `md 11` · **`lg 12` — the workhorse** · `xl 14` ·
`2xl 16` · `3xl 18` · `4xl 20` · `5xl 22` (the mobile shipment card, the single
largest radius on any content surface) · `pill 999`.

The portals add `--web-r-*` on top; see [05](05-web-scale.md).

---

## Shadow

Always navy-tinted, never black. Always paired with a hairline border on cards.

`--shadow-xs` `sm` `card` `card-lg` `card-xl` `dropdown` `balance-card`
`phone` — plus green-tinted CTA shadows `--shadow-cta`, `cta-soft`, `cta-lg`.

The portals add `--web-shadow-*` (frame, rail, header, control, row, card,
tooltip, float, page-tab, bar-hot, rail-active, cta-sm).

---

## Motion

`--ease-standard cubic-bezier(.4,0,.2,1)` · `--duration-fast .15s` ·
`--duration-base .5s` · `--duration-spin .7s` · `--duration-spin-slow .8s`.

Shared keyframes ship with the tokens: `lw-spin` `lw-pop` `lw-sheet` `lw-fade`
`lw-slideup` `lw-pulse`. The portal-only ones live in `styles/global.css`:
`lw-waybill-glow` `lw-waybill-dot` `lw-waybill-bg` `lw-halo-a` `lw-halo-b`
`lw-panel-in` `lw-check-pop` `lw-drawer-in` `lw-scrim-in`.

`global.css` also ships a `prefers-reduced-motion` block that flattens
everything — do not bypass it with inline animation.
