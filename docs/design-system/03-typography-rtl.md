# 03 — Typography, RTL and the LTR rule

## The stack

```css
font-family: 'Tajawal', 'Montserrat', sans-serif;   /* every surface */
```

**Tajawal** carries Arabic. **Montserrat** carries Latin text, numerals and
reference codes. Because Tajawal has no Latin glyphs for the weights we use,
the cascade does the split automatically — but where it matters (IDs, money,
timers) we set `font-family: var(--font-latin)` explicitly rather than trusting
fallback.

### How fonts are actually loaded

`tokens/fonts.css` declares a Google Fonts `@import`. That works for a
standalone HTML mock, **but it does not survive a bundler**: Next concatenates
stylesheets and any `@import` that ends up mid-file is dropped by the browser,
so the fonts silently fall back to a system sans.

Both apps therefore load the same two families through `next/font/google`
(`apps/*/src/app/fonts.ts`), which self-hosts them at build time, and remap the
tokens in `globals.css`:

```css
:root {
  --font-arabic: var(--lw-font-tajawal), sans-serif;
  --font-latin:  var(--lw-font-montserrat), sans-serif;
  --font-sans:   var(--lw-font-tajawal), var(--lw-font-montserrat), sans-serif;
}
```

Net effect: identical families, zero runtime requests to Google, no FOUT.
The `@import` stays in the token file as the documented fallback for anyone
consuming the raw CSS outside a bundler.

**If Arabic ever renders in a system font, this is the first thing to check.**

---

## The binding LTR rule

> Numerals, currency, reference codes, phone numbers, dates and elapsed timers
> render **left-to-right inside right-to-left copy**, in Montserrat.

This is standard mixed-direction typography for a Gulf Arabic product, and it
is not optional — `LW-2026-002960` reversed is unreadable and
`− 1,240 ر.س` with the wrong bidi run puts the sign in the wrong place.

### Applies to

trip IDs (`LW-2026-002960`) · transaction IDs (`TXN-2026-01923`) · account IDs
(`LW-CO-4821`) · document IDs (`DOC-8801`) · currency (`24,600` / `3,850 ر.س`)
· phone numbers (`0555 123 4821`) · percentages (`72%`) · elapsed timers
(`03:12:47`) · times (`09:14 ص`) · plate numbers · CR and VAT numbers ·
pagination counts (`1 - 10 من 10`) · plan usage (`7 / 8`).

### How to do it

Three tools, in order of preference:

**1. `RefCode` — a reference code with its own type sizing**
```tsx
<RefCode size={20} weight={800} color={TONE[tone].id}>{trip.id}</RefCode>
```

**2. `.lw-ltr` — a global utility, for a fragment inside a sentence**
```tsx
<span className={styles.value}>ماجد العنزي · <span className="lw-ltr">0555 210 4471</span></span>
```

**3. Inline, when a component already owns the style**
```css
direction: ltr;
unicode-bidi: isolate;
font-family: var(--font-latin);
```

`unicode-bidi: isolate` is the important half — without it the fragment still
participates in the surrounding bidi run and a leading `+`/`−` can jump to the
wrong end.

### Never

- Do not force Eastern-Arabic digit shaping on these.
- Do not wrap a whole Arabic sentence in `direction: ltr` to fix one number
  inside it. Isolate the number.
- Do not let a `−`/`+` prefix drift: `AmountText` composes prefix, figure and
  currency inside one isolated LTR run for exactly this reason.

---

## The Tajawal vs IBM Plex Sans Arabic discrepancy

A "UI Style Guide" PDF uploaded to the source project names **IBM Plex Sans
Arabic** as the brand typeface. Every one of the ~30 production screens
actually reviewed renders in **Tajawal + Montserrat**.

**Resolution: Tajawal wins.** The extensive, consistent, actively-developed
prototype implementation is treated as ground truth over a single static sheet.

This is flagged, not hidden. If the PDF represents a newer direction the
business wants honored, the change is a one-line edit in `tokens/fonts.css` plus
`apps/*/src/app/fonts.ts` — nothing else in the system hard-codes a family.

---

## Type ramps

The mobile ramp (`--text-*`) and the desktop ramp (`--web-text-*`) are
different scales for different surfaces. Portals use `--web-text-*`. See
[05-web-scale.md](05-web-scale.md).

The one place a portal legitimately uses mobile tokens is the sign-in / OTP
screen (`--h-input 50px`, `--h-otp-box 56px`, `--w-otp-box 46px`,
`--border-otp 2px`) — the OTP control exists nowhere else, so the mobile
system is the only reference for it.

---

## RTL mechanics

- `<html lang="ar" dir="rtl">` on both apps. Nothing else sets direction.
- **Physical CSS properties are used deliberately.** The design was authored
  inside a `dir="rtl"` container using `margin-right: auto`, `border-right`,
  `padding-left`, `left: 11px` and so on. Those were copied verbatim, because
  "translating" them to logical properties changes the rendering. Read them as
  "as-authored", not as bugs.
- `margin-right: auto` inside a `dir="rtl"` flex row pushes content to the
  **visual left** — that is how the filter bar's create-trip CTA and the
  finance PDF button land at the far edge.
- CSS Grid line numbers count along the inline axis, which in RTL runs
  right-to-left. The calendar relies on this: `grid-column: 2 / 8` spans days
  6→11 rightwards-to-leftwards, matching the design without any mirroring.
- Icons are **not** mirrored wholesale. `chevronLeft`/`chevronRight` are named
  for the glyph they draw, and each call site picks the one that points the
  right way in RTL — "next" points left.
