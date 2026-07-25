# 05 — The web scale

> **Read this before building any desktop screen.** It is the single most
> likely source of drift between the B2B and Admin portals.

## Why this file exists

The LoopWay design system in `packages/ui/tokens/` was extracted from the
**client mobile app**. Its control heights and type sizes are thumb-sized:

| | Mobile system | Desktop portals |
|---|---|---|
| primary button | **52px** | **44px** |
| small button | 46px | 40px |
| input | 50px | 44px (42px on the finance row) |
| button label | 15.5px | 13.5px |
| body text | 15px | 12.5px |
| card meta | 13.5px | 11.5px |
| card radius | 16–22px | 18–20px |

Using `--h-button` on a portal screen produces a control 8px too tall and a
label 2px too large. It looks *almost* right, which is worse than looking
wrong.

**Every value in `tokens/web.css` is measured from the two designed B2B
screens.** Nothing there is rounded or invented.

---

## Shell geometry

| Token | Value | Notes |
|---|---|---|
| `--web-frame-w` | `1440px` | the design frame |
| `--web-frame-h` | `980px` | |
| `--web-frame-pad` | `28px` | frame inner padding |
| `--web-frame-gap` | `22px` | rail ↔ content |
| `--web-rail-w` | `78px` | B2B icon rail |
| `--web-col-gap` | `18px` | header ↔ filter bar ↔ content |
| `--web-header-h` | `66px` | |
| `--web-header-pad` | `18px 24px` | |
| `--web-panel-w` | `372px` | side panel |

**Fidelity strategy.** The design is a fixed 1440×980 card. In the app that
card is the *minimum*: `.page` enforces `min-width: 1480px` (1440 frame +
2×20px page padding) so **at a 1480×1020 viewport every pixel matches the
design**. Wider viewports let the frame grow fluidly; narrower ones scroll
horizontally rather than reflowing, because reflowing would break fidelity.

The Admin portal uses `SidebarShell` instead — a 252px navy sidebar plus a
`20px 28px 26px` content column, also `min-width: 1440px`.

---

## Control heights

| Token | Value | Used by |
|---|---|---|
| `--web-h-control` | `44px` | search, selects, create CTA |
| `--web-h-action` | `40px` | trip-row action button, header icon buttons |
| `--web-h-tab` | `38px` | filter tabs, expanded-row actions |
| `--web-h-rail-btn` | `44px` | rail nav buttons |
| `--web-h-page-tab` | `34px` | القائمة/التقويم, calendar month nav |
| `--web-h-quiet` | `32px` | view-state select, panel close, row icon button |
| `--web-h-pager` | `30px` | pagination arrows |
| `--web-h-bar` | `22px` | calendar trip bar |

Plus two one-offs kept as literals where they occur: the wallet CTA is **46px**
and the side-panel footer CTA is **42px**.

### The 44 vs 42 variance is real

`رحلاتي` runs its filter row at **44px / radius 13**. `سجل العمليات المالية`
runs the same controls at **42px / radius 12**. That difference exists in the
design source and was preserved rather than harmonised away.

`SearchField`, `SelectField` and `PrimaryCta` therefore take `size="md" | "sm"`
— `md` is the trips row, `sm` is the finance row. Pick by which screen you are
matching, not by taste.

---

## Type ramp

| Token | Value | Used for |
|---|---|---|
| `--web-text-h1` | `28px` | page title in the header |
| `--web-text-h2` | `20px` | calendar month, trip ID on a row |
| `--web-text-h3` | `17px` | empty / error / no-results title |
| `--web-text-h4` | `15px` | side-panel and section titles |
| `--web-text-cta` | `13.5px` | primary CTA label, state-card body |
| `--web-text-value` | `13px` | table cell value, row value |
| `--web-text-meta` | `12.5px` | tab label, stage label, input text |
| `--web-text-label` | `12px` | field labels, panel keys |
| `--web-text-micro` | `11.5px` | dense meta, route chip, weekday |
| `--web-text-tiny` | `11px` | badges, elapsed timer |
| `--web-text-nano` | `10.5px` | column captions, account ID, bar label |
| `--web-text-pico` | `9.5px` | notification count |

Weights: **800** for anything that is a heading, a status label, a badge, an
amount or a reference code. **700** for row values and tab labels. **600** for
meta and body. 500 only on state-card body copy.

---

## Radius

`--web-r-frame 28` · `rail 24` · `card 20` · `panel 18` · `bar 16` ·
`inner 14` · `control 13` · `btn 12` · `chip 11` · `cell 10` · `tag 9` ·
`badge 8`

---

## Shadow

| Token | Value |
|---|---|
| `--web-shadow-frame` | `0 34px 70px -26px rgba(44,62,80,.35)` |
| `--web-shadow-rail` | `0 18px 40px -30px rgba(44,62,80,.4)` |
| `--web-shadow-header` | `0 18px 40px -32px rgba(44,62,80,.4)` |
| `--web-shadow-control` | `0 10px 24px -22px rgba(44,62,80,.5)` |
| `--web-shadow-row` | `0 14px 30px -26px rgba(44,62,80,.5)` |
| `--web-shadow-card` | `0 24px 50px -38px rgba(44,62,80,.5)` |
| `--web-shadow-tooltip` | `0 10px 22px -8px rgba(44,62,80,.6)` |
| `--web-shadow-float` | `0 6px 14px -4px rgba(44,62,80,.5)` |
| `--web-shadow-page-tab` | `0 2px 6px -2px rgba(44,62,80,.28)` |
| `--web-shadow-bar-hot` | `0 8px 18px -6px rgba(44,62,80,.5)` |
| `--web-shadow-rail-active` | `0 10px 20px -12px rgba(46,204,113,.8)` |
| `--web-shadow-cta-sm` | `0 6px 14px -8px rgba(46,204,113,.7)` |

Note the pattern: the *further down the page hierarchy*, the tighter the
spread. A frame gets `-26px`, a control gets `-22px`, a page tab gets `-2px`.

---

## The trip-row grid

```
--web-triprow-side-w        216px
--web-triprow-grid          200px 118px 290px 158px 24px
--web-triprow-pad           15px 28px
--web-triprow-inner-margin  7px
```

Those five columns are, in RTL order: الحمولة · تاريخ الاستلام · stage chip ·
action button · chevron. **Do not make them fractional.** The fixed widths are
what keep the stage chips aligned down the list; `1fr` columns would ragged
them as soon as one cargo string is longer than another.

---

## Misc

`--web-disabled-fill: #BCC8CF` — the fill for a disabled primary CTA. Not a
grey from the neutral ramp; it is its own value in the design, and it is the
only disabled fill in the product.
