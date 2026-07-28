# 10 — Building the Admin Portal

**Read this before your first `M04` screen.** It exists so the Admin portal is
assembled from the B2B portal's proven vocabulary rather than re-derived from
the SRS.

---

## Start here

1. [05-web-scale.md](05-web-scale.md) — the desktop scale. Non-negotiable.
2. [07-patterns.md](07-patterns.md) — the compositions you will reuse.
3. [08-glossary-ar.md](08-glossary-ar.md) — the approved Arabic labels,
   including the full 23-state machine the B2B portal never surfaces.

Then find your section in the table below.

---

## What is already built

**Ten sections, not sixteen.** `apps/admin` is a complete UI:

- `SidebarShell` + `NavSidebar` — the navy labelled sidebar. Destinations only:
  it carries **no queue badges**.
- `PageHeader` via `AdminHeader` — same 66px chrome as B2B, with the admin
  identity. The support glyph is hidden; there is no support section to reach.
- `src/mocks/` — fixtures for every table, cross-referenced with the B2B
  fixtures: the same `LW-2026-…` and `TXN-2026-…` records appear on both sides,
  which is what makes the two portals read as one product.
- `src/store/AdminStore.tsx` — React context + reducer over a mutable copy of
  the fixtures. Decisions take effect for the session and reset on reload.
  Still no backend, no fetch, no env vars.
- Every list screen wires all five view states through the `حالة العرض` control.

Plus `/account` — the operator's own profile, not an SRS section. Its
permissions block is read-only: roles are assigned in the back office, and a
screen that lets an operator widen their own permissions is the one screen an
audit log cannot save you from.

### Why the SRS's sixteen became ten

The SRS was written before the portal existed. Running it showed six sections
that either belong inside another screen or describe work this portal does not
do. Each removal is recorded in `apps/admin/src/config/sections.ts`:

| Was | Why it went |
|---|---|
| `E04` اعتماد الشاحنات | **merged into the driver request.** A driver registers *with* a truck. Approving them apart invents "approved driver, pending truck" — a state no screen can act on |
| `E06` الوثائق والتصاريح | documents live inside the request they belong to |
| `E07` الدول والموانئ · `E08` أنواع الشحنات | out of the operating model |
| `E13` الدعم · `E14` التقارير | out of the operating model |

**What went with `E13`:** the alternative-POD verification block, which was the
only place the portal demonstrated `BR-011` — that a trip cannot close without
proof of delivery, and what an operator does when the standard proof is
unavailable. Worth knowing if support is ever restored.

### Three things that are pinned on purpose

**`SESSION_DATE`** in `AdminStore.tsx` is a fixed string, not `new Date()`. The
fixtures live in July 2026; a real clock would file every decision two months
before the records it acts on.

**Queue counts are derived** through `useQueueCounts()` — never typed in. They
surface on the dashboard KPI tiles and each queue's filter-bar tabs, not on the
sidebar. See "Queue counts are derived" in [07-patterns.md](07-patterns.md).

**`totalDue` on a carrier is summed from its trip lines**, never written down. A
breakdown that does not add up is worse than no breakdown.

---

## Why Admin uses the sidebar, not the rail

Ten grouped destinations, several with labels long enough to wrap onto two
lines, cannot live on a 78px icon rail. `NavSidebar` is **not an
invention for Admin** — it is the shell the Claude Design project shipped in
its *first* company-dashboard iteration, before the B2B portal moved to the
rail. Same 252px width, same navy, same 11px item radius, same
`rgba(46,204,113,.16)` active tint, same 3px green edge marker.

The only addition is group headings, which reuse the translucent-white ramp the
sidebar already speaks.

---

## Section-by-section

| Section | Route | What is specific to it |
|---|---|---|
| `E01` الرئيسية التشغيلية | `/` | Three KPI tiles and the five newest operational updates. **Reports, never decides** — no approve/reject control exists on this page |
| `E02` إدارة الرحلات | `/shipments` | Admin-only filters; the panel mirrors `/trips/[id]` plus parties, pricing and the per-trip audit trail |
| `E03` اعتماد السائقين | `/drivers` | **One request = driver + truck + both document sets**, one decision, one audit entry. Registration/insurance expiry tints amber inside 30 days, red past due |
| `E12` مراجعة الغرامات | `/penalties` | approve / reject / **adjust amount**. `BR-012`: a penalty is محتملة until approved |
| `E05` العملاء والشركات | `/customers` | `ContentTabs` أفراد / شركات; per-account inner tabs |
| `E10` العمليات المالية | `/finance` | One flat log, not a payments/ledger split. Two row sources are **live store state** — an approved penalty and a paid carrier appear here without a reload |
| `E11` إدارة مستحقات الشركات | `/carrier-dues` | Per-trip breakdown: قيمة الرحلة − عمولة ورسوم − الغرامات المعتمدة = الصافي. Only **approved** penalties may appear on a line |
| `E09` التسعير والرسوم | `/settings/pricing` | Live worked example; saving moves money, so it confirms |
| `E15` إدارة الإشعارات | `/notifications` | Three tabs: إرسال · القوالب · سجل الإرسال. A send appends to the log |
| `E16` سجل القرارات والاعتمادات | `/audit` | Before/after value diff. Read-only — no actions, ever |

---

## Two patterns you will build repeatedly

### Approval queue (E03, E12)

Every one of these is the same shape:

```
FilterBar   [status tabs with counts] [search] [type filter] → spacer → bulk action
TableCard   entity · submitted · type · status · [عرض]
SidePanel   full record, documents, decision footer
            └─ اعتماد (primary) · رفض (danger) · طلب معلومات إضافية (ghost)
```

Rules:
- **Rejecting always requires a reason.** No silent rejects.
- The decision footer is a `SidePanel` footer, not a floating bar.
- Queue depth belongs on the filter-bar status tabs and the dashboard KPI tile.
  Not on the sidebar — that carries destinations only.
- **One decision per real-world event.** `/drivers` decides a driver, a truck
  and two document sets together and writes ONE audit entry. Each document still
  carries its own verdict inside the panel: a submission can be sound apart from
  one bad paper, and the reviewer has to be able to say exactly that.
- Every decision writes to the Audit Log (`BR-015`) — say so in the UI.
- All five view states, same as B2B.

### Settings CRUD (E09, E15)

```
PageHeader   title + one-line purpose
AlertBanner  when a setting has live financial or operational effect
TableCard    current values, inline edit or row → panel
SidePanel    add / edit form using the derived form pattern
```

Rules:
- Anything that changes money or blocks operations gets a confirm step.
- Show the effective date of a change where one applies.
- Never allow deleting a value that is referenced by a live shipment — disable
  it and say why in the `title`.

---

## Rules that constrain Admin specifically

**`BR-012` — penalties are review-then-apply.** A penalty is `محتملة` until an
admin approves it. The UI must never present a penalty as already charged, and
`تعديل المبلغ` is a first-class action alongside approve and reject.

**`BR-015` — every sensitive action is audited.** Approvals, rejections,
financial adjustments, setting changes, file uploads and penalty decisions all
write to the Audit Log. Surface this rather than hiding it; the sidebar footer
already says so.

**`BR-001` still applies.** Even in Admin, the platform shows no reference or
estimated price. Admin sees the customer's Base Price and the drivers' bids —
never a system suggestion.

**Privacy (SRS §10).** Do not surface a driver's full sensitive documents to
company-side views. Admin sees everything; that boundary lives in the UI too.

**Override actions need a visible policy.** Changing a driver or bypassing POD
is explicitly out of MVP scope without an audit and permission story. Do not
add such a button because it seems convenient.

---

## What not to invent

- **No new colours.** If a state needs a colour, it maps to one of the five
  tones. Add a mapping, not a hex.
- **No new shadows or radii.** They are all in `web.css`.
- **No icon library.** Match the stroke recipe in
  [04-iconography.md](04-iconography.md) or extend `Icon.tsx` with a path
  drawn to it.
- **No chart library** until charts are designed. `/reports` uses horizontal
  bar rows built from tokens for exactly this reason.
- **No second animated CTA.** The waybill glow is the one exception.
- **No new shell.** `SidebarShell` for Admin, `AppShell` for B2B.

---

## Checklist before you call a section done

- [ ] All five view states implemented and reachable
- [ ] Arabic labels taken from [08-glossary-ar.md](08-glossary-ar.md)
- [ ] Every ID, amount, date and percentage is LTR-isolated
- [ ] Disabled controls carry a `title` explaining why
- [ ] Rejections and destructive actions require a reason or confirmation
- [ ] No hard-coded hex, shadow or radius
- [ ] New components exported from `packages/ui` and documented in
      [06-components.md](06-components.md)
- [ ] Screen renders correctly at 1480×1020 with no horizontal body scroll
- [ ] Any decision the screen takes moves its tab count and the dashboard tile,
      **and** appends an audit entry — check `/audit` after using it
- [ ] Any figure that is a sum is computed from its parts, not typed in
- [ ] Verify by CLICKING through the sidebar, never `page.goto` — a reload
      remounts the store and resets the session, so a reload between "approve"
      and "check the other screen" tests nothing
- [ ] `npm run build` and `npm run typecheck` clean
