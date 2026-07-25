# LoopWay — Design & UI Reference

This folder is the contract for building LoopWay's **web portals**: the B2B
Company Portal (`apps/b2b`, SRS module `M03`) and the Admin Portal
(`apps/admin`, SRS module `M04`).

If you are about to build an Admin screen, read **[10-admin-portal-guide.md](10-admin-portal-guide.md)**
first. It tells you which of the patterns below each `M04` section reuses and
what you are not allowed to invent.

---

## The three source documents

| Source | What it is | Where it lives |
|---|---|---|
| **SRS** | `LoopWay_Vlora_SRS_UI_Ready_AR.md` — 5,036 lines, four platforms, 15 business rules, a 23-state shipment machine, a 21-entity data dictionary, five appendix matrices. **The authority on behaviour.** | repo root |
| **Claude Design — B2B portal** | Project `2d380b8d-f211-47d2-a44e-afbb60ca7de2` ("لوحة الشركات – رحلاتي"). Two finished screens. **The authority on appearance.** | claude.ai/design |
| **Claude Design — design system** | Project `772e5514-4469-4e1e-a3c9-283179feb956` ("LoopWay Design System"). Token CSS, 20 React primitives, 17 guideline cards, brand `readme.md`. **The authority on identity.** | claude.ai/design |

When appearance and behaviour disagree, they are reconciled explicitly — never
silently. Every reconciliation is recorded in
[11-design-source-map.md](11-design-source-map.md).

---

## The labelling convention

Every screen in this product is one of two things, and the code says which:

**DESIGNED** — Claude Design drew it. Reproduce it to the pixel. Deviating is a
bug, and any deviation that *is* necessary gets logged in
[11-design-source-map.md](11-design-source-map.md).

> Only two screens are DESIGNED: `رحلاتي` (list + calendar, all six view
> states, collapsed and expanded rows) and `سجل العمليات المالية` (wallet card,
> table, detail panel, top-up sheet).

**DERIVED** — nobody drew it. It was built from the identity rules in this
folder plus the corresponding SRS requirement. Every derived file carries a
header comment saying so and naming its SRS section. Derived screens are
*proposals*: when a designer draws the real thing, the design wins.

---

## Reading order

| File | Read it when |
|---|---|
| [01-identity.md](01-identity.md) | Ever writing user-facing copy, or choosing a colour |
| [02-tokens.md](02-tokens.md) | You need a value and don't know which token holds it |
| [03-typography-rtl.md](03-typography-rtl.md) | Anything involving Arabic, numerals, IDs, currency or dates |
| [04-iconography.md](04-iconography.md) | You need an icon that isn't in the set |
| [05-web-scale.md](05-web-scale.md) | **Before your first desktop screen.** Non-negotiable |
| [06-components.md](06-components.md) | Choosing what to build with |
| [07-patterns.md](07-patterns.md) | Composing a whole screen |
| [08-glossary-ar.md](08-glossary-ar.md) | Naming anything in Arabic |
| [09-ia-and-routes.md](09-ia-and-routes.md) | Adding a route or a nav entry |
| [10-admin-portal-guide.md](10-admin-portal-guide.md) | Building any `M04` screen |
| [11-design-source-map.md](11-design-source-map.md) | Auditing fidelity, or wondering why something differs from the design |

---

## The five rules that matter most

1. **The web scale is not the mobile scale.** The design system's tokens were
   extracted from the *client mobile app* (52px buttons, 15.5px labels). The
   portals run 44/40/38/34px controls and a 13.5→10.5px type ramp. Use
   `tokens/web.css`. See [05-web-scale.md](05-web-scale.md).
2. **Numerals, IDs, currency, dates and timers stay LTR inside RTL copy.**
   There is a `.lw-ltr` utility and a `RefCode` component. See
   [03-typography-rtl.md](03-typography-rtl.md).
3. **Spacing is not an 8px grid.** 7, 9, 11, 13 and 22px are real values in
   this product. Copy the number; don't snap it.
4. **Every list surface implements all five view states** — default, empty,
   loading, error, no-results (plus `limit` where a plan cap applies. See
   [07-patterns.md](07-patterns.md).
5. **`BR-001`: the platform never shows a reference or estimated price.** No
   "suggested price", no "market average", no range hint — anywhere, ever. Price
   comes from the customer (fixed) or the driver (tender).

---

## Where the code is

```
packages/ui/
├─ tokens/          colors · typography · spacing · effects · fonts (verbatim
│                   from the design system) + web.css (the desktop scale)
├─ styles/global.css  the single stylesheet both apps import
└─ src/
   ├─ icons/Icon.tsx   the whole icon set, paths lifted from the design
   ├─ tokens.ts        typed mirrors: TONE, BADGE_TONE, WEB geometry
   ├─ types.ts         domain types, named after the SRS data dictionary
   ├─ hooks.ts         formatElapsed, useSecondTick
   └─ components/      everything in 06-components.md

apps/b2b/    the Company Portal  (npm run dev:b2b   → :3000)
apps/admin/  the Admin Portal    (npm run dev:admin → :3001)
```

No backend, no API routes, no environment variables. All data comes from
`apps/*/src/mocks/`, typed against `@loopway/ui`'s domain types so the shapes
are ready for a real API later.
