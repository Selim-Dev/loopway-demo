# 12 — The marketing site

**Read this before touching `apps/site`.** It is the only surface in the
workspace that is allowed to break rules from
[01-identity.md](01-identity.md), and this file is the complete list of what it
breaks and why.

---

## What it is

`apps/site` is the public page: bilingual (عربي / English), one screen of copy
per section, and — the part that matters — **the real product embedded in it**.

The hero does not show a picture of a shipment row. It renders
`TripRow` from `@loopway/ui`, fed the same `LW-2026-002960` fixture the B2B
portal uses, with `useSecondTick` driving a timer that is genuinely counting.
The wallet is `WalletCard`. The offers panel obeys `BR-001` because it is built
from the same components that obey it everywhere else.

That is the whole argument of the page, and it is the reason not to swap those
components for screenshots when they become inconvenient. **A screenshot can be
faked. A running component cannot.**

---

## The rules that still bind

These come straight from [01-identity.md](01-identity.md) and are not
negotiable on any surface:

- Sentence case. **No exclamation marks. No emoji.** فصحى, second-person direct.
- Navy `#2C3E50` and brand green `#2ECC71`. Amber for pending, red **only** for
  destructive. No new hues.
- Borders **and** shadow together; shadows tinted navy, never black.
- Real Saudi/Gulf names and real city pairs from the sample-data list.
- **No stock photography, no illustration, no 3D render, no generated imagery.**
- **No fabricated customers, logos, testimonials or metrics.** The proof strip
  states four things the product actually does. If we cannot stand behind a
  number, it does not appear — which is why there is no "10,000 shipments
  delivered" band anywhere on the page.

## The three rules it extends

Each extension is scoped, and each one is here rather than in the token layer so
it cannot leak into the portals.

### 1. A display type scale

The product's largest text is 20px. A hero needs six times that. `--mk-*` in
`apps/site/src/styles/marketing.css` adds a fluid `clamp()` scale — one value
per role rather than one per breakpoint.

**Arabic display type needs more leading than Latin at the same size.** Below
about `line-height: 1.2` the dots and descenders collide. The hero runs 1.24.

### 2. Motion beyond the functional set

The product allows four functional animations and no decorative ones. The site
adds a bounded set:

| Motion | Spec | Repeats |
|---|---|---|
| road draw | `stroke-dashoffset`, 2.2s | once, on load |
| waypoint reveal | fade + 6px rise, 90ms stagger | once |
| section reveal | opacity + 14px, 0.55s | once per element |
| **truck along the road** | `<animateMotion>`, 16s linear | **loops** |

The looping truck is the site's **one** decorative infinite animation. It is
granted on exactly the reasoning that granted the waybill glow: the loop *is*
the brand mark, so a vehicle travelling it is the logo explaining itself. Do not
add a second one.

Everything collapses under `prefers-reduced-motion: reduce` — the road is drawn,
the waypoints are placed, and the truck is **parked mid-route**, not hidden.
SMIL cannot read the media query, so `HeroRoad` checks `matchMedia` itself and
renders a frozen `<animateMotion>` instead.

### 3. The navy field as a surface

The hero and the rules section use navy as a full-bleed ground rather than as
chrome. One radial highlight at `rgba(255,255,255,.06)` sits at the top of the
leading edge. That is the only tonal lift, and it stays inside the navy ramp —
no second hue, no mesh, no blobs.

---

## Typography

Four families, each with a job:

| Family | Carries |
|---|---|
| **IBM Plex Sans Arabic** | site headlines and Arabic body |
| **IBM Plex Sans** | English headlines and body |
| **Tajawal** | *inside `.productScope` only* |
| **Montserrat** | numerals, IDs, amounts (`--font-latin`) |

The split is the point. Site chrome speaks Plex; the embedded panels render in
the product's own Tajawal + Montserrat, so the live surfaces read as *the
product* rather than as page furniture. `.productScope` in `marketing.css`
restores `--font-sans` for that subtree.

All four are self-hosted by `next/font`, so the running site makes **no request
to Google** — the same fix documented in [03-typography-rtl.md](03-typography-rtl.md).

**On `/en` the embedded product panels stay Arabic.** That is correct, not an
oversight: the product is Arabic-first and the English page explains an Arabic
product. A one-line caption under the hero says so.

---

## Bilingual mechanics

Two locales, two **root layouts**, no dynamic segment:

```
app/(ar)/layout.tsx   →  <html lang="ar" dir="rtl">   route /
app/(en)/layout.tsx   →  <html lang="en" dir="ltr">   route /en
```

`lang` and `dir` have to be right in the server-rendered markup — flipping them
on the client ships the wrong direction on first paint. Next only lets a layout
own `<html>` if it is a root layout, hence the route groups. Arabic gets the
bare `/` rather than a redirect, which is right for an Arabic-first product.

Copy lives in `src/content/ar.ts` and `en.ts`, both typed `Dictionary`. **A key
present in one language and missing from the other is a compile error**, not a
blank section on a live page. Add to `types.ts` first, then to both files.

---

## The responsive rule, which is the opposite of the portals'

[05-web-scale.md](05-web-scale.md) has the portals enforce `min-width: 1440px`
and scroll horizontally rather than reflow. That is a deliberate fidelity call
for a desktop back-office, and it is **exactly wrong here**: this page's first
viewer is on a phone.

Two consequences worth knowing before you edit a grid:

**`ProductFrame` scales, it does not reflow.** A real portal component is laid
out at its true width inside a clipped box and fitted with
`transform: scale()` from a `ResizeObserver`. Every proportion, border and
shadow stays pixel-exact; the timers keep running. Re-authoring narrow variants
of `TripRow` would mean the marketing site shows components the product does not
have, which forfeits the entire claim.

**Every grid track is `minmax(0, 1fr)`, never `1fr`.** A bare `1fr` is
`minmax(auto, 1fr)`, and that `auto` floor is min-content — so a long Arabic
word, or a `ProductFrame` sitting at its true 1000px layout width, silently
widens the whole document. In RTL that does not merely add a scrollbar: the
viewport anchors to the wrong edge and the page renders visibly shifted with
its content cut off. Grid items hosting a frame also need `min-width: 0`.

**The check that catches it:** scripted, not eyeballed. Call `window.scrollTo(2000, 0)`
and assert `window.scrollX === 0` at 360, 390, 768, 1024 and 1480, in both
locales. Element rectangles are not a valid test — `getBoundingClientRect`
reports layout boxes even for content an ancestor has clipped, so it produces
false positives everywhere `ProductFrame` is used.

---

## Adding a section

1. Add its copy to `Dictionary` in `content/types.ts`, then to **both** `ar.ts`
   and `en.ts`.
2. Compose it in `components/Sections.tsx` using `mkShell`, `mkEyebrow`,
   `mkSectionTitle`, `mkLead`.
3. Reach for a real `@loopway/ui` component before drawing a mockup of one.
4. Every grid track `minmax(0, 1fr)`. Run the scroll check above.
5. If it animates, it animates **once** — the loop budget is spent.
