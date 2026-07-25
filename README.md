# LoopWay / Vlora — Web Portals

UI-only implementation of the LoopWay land-freight marketplace's two web
surfaces. **No backend, no API calls, no external integrations** — every screen
runs on typed mock data.

| App | What it is | Dev |
|---|---|---|
| `apps/b2b` | **لوحة الشركات** — the B2B Company Portal (SRS `M03`) | `npm run dev:b2b` → http://localhost:3000 |
| `apps/admin` | **لوحة الإدارة** — the Admin Portal (SRS `M04`), scaffolded | `npm run dev:admin` → http://localhost:3001 |
| `packages/ui` | The shared LoopWay design layer both apps build on | — |

Arabic-first, RTL, Tajawal + Montserrat. Reference viewport **1480×1020**
(a 1440×980 design frame plus 20px page padding).

---

## Quick start

```bash
npm install
npm run dev:b2b     # http://localhost:3000
npm run dev:admin   # http://localhost:3001
```

```bash
npm run build       # both apps
npm run typecheck   # both apps
npm run lint        # both apps
```

---

## Deploying a demo

Both apps are fully static — see **[docs/DEPLOY.md](docs/DEPLOY.md)** for
Vercel setup (two projects, one repo) and the four things to know before
sharing the link.

---

## Read this before changing anything visual

**[`docs/design-system/`](docs/design-system/00-README.md)** is the contract.
Start at `00-README.md`. The three files that will save you the most time:

- **[05-web-scale.md](docs/design-system/05-web-scale.md)** — the desktop token
  scale. The design system's own tokens are *mobile* scale; using them on a
  portal screen looks almost-right, which is worse than wrong.
- **[07-patterns.md](docs/design-system/07-patterns.md)** — the screen
  compositions to reuse instead of inventing a layout.
- **[10-admin-portal-guide.md](docs/design-system/10-admin-portal-guide.md)** —
  mandatory before building any Admin section.

---

## Designed vs derived

Only two screens were drawn by Claude Design and are reproduced to the pixel:

- **`رحلاتي`** — `/trips` and `/trips/calendar`: three tabs, filters,
  expandable tone-tinted rows with live `HH:MM:SS` timers, a lane-packed
  calendar, and all six view states.
- **`سجل العمليات المالية`** — `/finance`: wallet card, transaction table,
  detail panel with VAT breakdown, and the top-up flow.

Everything else is **derived** — built from the identity rules plus the
matching SRS requirement, and labelled as such in a header comment on every
file. When a designer draws the real thing, the design wins.

Full traceability and every knowing deviation:
**[11-design-source-map.md](docs/design-system/11-design-source-map.md)**.

---

## Layout

```
docs/design-system/   the design + UI contract (00–11)
packages/ui/
  tokens/             colors · typography · spacing · effects · fonts
                      (verbatim from the design system) + web.css (desktop scale)
  styles/global.css   the single stylesheet both apps import
  src/                Icon set, components, domain types, hooks
apps/b2b/src/
  app/(portal)/       signed-in screens, inside the rail + header shell
  app/(auth)/         sign-in + OTP, outside the shell
  mocks/              fixtures — the exact records from the design
apps/admin/src/
  config/sections.ts  the 16 M04 sections, each with its SRS ref and patterns
tools/                screenshot harness for fidelity checks
```

---

## Three rules that bite

1. **Numerals, IDs, currency, dates and timers stay LTR inside RTL copy.** Use
   `RefCode`, `AmountText` or the `.lw-ltr` utility — never raw text.
2. **Spacing is not an 8px grid.** 7, 9, 11, 13 and 22px are real. Copy the
   number; don't snap it.
3. **`BR-001`: the platform never shows a reference or estimated price.** No
   suggestion, no market average, no range hint — anywhere.

---

## Fidelity harness

```bash
npm run build:b2b
cd apps/b2b && npx next start -p 3100

node tools/shoot.mjs ./shots trips=http://localhost:3100/trips
node tools/shoot-flow.mjs ./shots http://localhost:3100 expanded /trips "text:متابعة الرحلة"
```

Both shoot at 1480×1020. See
[11-design-source-map.md](docs/design-system/11-design-source-map.md) →
"Fidelity verification" for what this does and does not prove.
