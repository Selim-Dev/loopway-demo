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

**All sixteen sections are built.** `apps/admin` is a complete UI, not a
scaffold:

- `SidebarShell` + `NavSidebar` — the navy labelled sidebar, all 16 sections
  registered and grouped, with **derived** queue counts.
- `PageHeader` — same 66px chrome as B2B, with the admin identity.
- `src/mocks/` — fixtures for every table, sized so pagination is real and
  cross-referenced with the B2B fixtures: the same `LW-2026-…` and `TXN-2026-…`
  records appear on both sides, which is what makes the two portals read as one
  product.
- `src/store/AdminStore.tsx` — React context + reducer holding a mutable copy of
  the fixtures. Decisions actually take effect for the session: approving a
  driver removes the row, drops the sidebar badge and appends an audit entry.
  State resets on reload. Still no backend, no fetch, no env vars.
- Every screen wires all five view states through the `حالة العرض` control in
  its `PaginationBar`.

`SectionPage` — the placeholder these screens replaced — has been deleted. If
you are adding a seventeenth section, build it from the patterns below.

Plus one route that is **not** an SRS section: `/account`
(`apps/admin/src/app/account/AccountScreen.tsx`). `PageHeader` puts an account
chip on every screen, and that chip has to land somewhere. Its permissions
block is read-only — roles are assigned in the back office, and a screen that
lets an operator widen their own permissions is the one screen an audit log
cannot save you from.

> **`PageHeader` defaults its three chrome links to B2B routes** —
> `/notifications`, `/support`, `/account`. Admin must pass its own
> `notificationsHref` / `supportHref` / `accountHref`, or the bell and the
> account chip 404. `AdminHeader` now does. Pass `linkAs={Link}` too, otherwise
> the chrome navigates with full page reloads.

### Two things that are pinned on purpose

**`SESSION_DATE`** in `AdminStore.tsx` is a fixed string, not `new Date()`. The
fixtures live in July 2026; a real clock would file every decision two months
before the records it acts on and the audit log would read backwards.

**Queue counts are derived** through `useQueueCounts()`, never written into
`ADMIN_GROUPS`. See "Queue counts are derived" in
[07-patterns.md](07-patterns.md).

---

## Why Admin uses the sidebar, not the rail

Sixteen destinations cannot live on a 78px icon rail. `NavSidebar` is **not an
invention for Admin** — it is the shell the Claude Design project shipped in
its *first* company-dashboard iteration, before the B2B portal moved to the
rail. Same 252px width, same navy, same 11px item radius, same
`rgba(46,204,113,.16)` active tint, same 3px green edge marker.

The only addition is group headings, which reuse the translucent-white ramp the
sidebar already speaks.

---

## Section-by-section

| Section | Reuse | New work | Built at |
|---|---|---|---|
| `M04-E01` الرئيسية التشغيلية | KPI tiles, decision-queue rows, `AlertBanner` | figures derived live from the store | `apps/admin/src/app/AdminHome.tsx` |
| `M04-E02` إدارة الشحنات | `FilterBar` · `DataTable` · `SidePanel` · **all five view states** | admin-only filters (customer, driver, admin status); the workspace mirrors `/trips/[id]` with intervention actions | `apps/admin/src/app/shipments/ShipmentsScreen.tsx` |
| `M04-E03` اعتماد السائقين | approval-queue pattern (below) · `StatusBadge` · document rows | side-by-side document viewer; reject-with-reason dialog | `apps/admin/src/app/drivers/DriversScreen.tsx` |
| `M04-E04` اعتماد الشاحنات | identical to E03 | truck-photo grid; expiry tracking for استمارة / تأمين | `apps/admin/src/app/trucks/TrucksScreen.tsx` |
| `M04-E05` العملاء والشركات | `TabGroup` (أفراد / شركات) · `DataTable` · `SidePanel` | per-account tabs: وثائق / شحنات / مدفوعات | `apps/admin/src/app/customers/CustomersScreen.tsx` |
| `M04-E06` الوثائق والتصاريح | approval-queue pattern · `DataTable` | one queue across all entity types; Blocking vs Warning distinction | `apps/admin/src/app/documents/DocumentsScreen.tsx` |
| `M04-E07` الدول والموانئ | settings-CRUD pattern (below) | nested country → city → port editor; "does this port require a permit" | `apps/admin/src/app/settings/geography/GeographyScreen.tsx` |
| `M04-E08` أنواع الشحنات والشاحنات | settings-CRUD pattern | **compatibility matrix** — a real new component | `apps/admin/src/app/settings/catalog/CatalogScreen.tsx` |
| `M04-E09` التسعير والرسوم | derived form pattern · `AlertBanner` | a live example calculation; changes here move money, so confirm before save | `apps/admin/src/app/settings/pricing/PricingScreen.tsx` |
| `M04-E10` الدفع والـ Ledger | `DataTable` · `AmountText` · `SidePanel` · `StatusTimeline` | ledger entries are double-entry — show both sides | `apps/admin/src/app/payments/PaymentsScreen.tsx` |
| `M04-E11` Payout Management | `DataTable` · `AmountText` · `StatusBadge` | batch selection + a confirm step | `apps/admin/src/app/payouts/PayoutsScreen.tsx` |
| `M04-E12` مراجعة الغرامات | approval-queue pattern · `SidePanel` | approve / reject / **adjust amount**. See the rule below | `apps/admin/src/app/penalties/PenaltiesScreen.tsx` |
| `M04-E13` الدعم والاستثناءات | `DataTable` · `SidePanel` · `StatusBadge` | case thread; alternative-POD verification | `apps/admin/src/app/support/SupportScreen.tsx` |
| `M04-E14` التقارير | the bar-row pattern from `/reports` | wider date range + export | `apps/admin/src/app/reports/ReportsScreen.tsx` |
| `M04-E15` الإشعارات والقوالب | settings-CRUD pattern | template editor with variable tokens | `apps/admin/src/app/templates/TemplatesScreen.tsx` |
| `M04-E16` Audit Log | `DataTable` · `FilterBar` · full `StatusTimeline` | before/after value diff | `apps/admin/src/app/audit/AuditScreen.tsx` |

---

## Two patterns you will build repeatedly

### Approval queue (E03, E04, E06, E12)

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
- Queue depth belongs on the sidebar item as a `count`.
- Every decision writes to the Audit Log (`BR-015`) — say so in the UI.
- All five view states, same as B2B.

### Settings CRUD (E07, E08, E09, E15)

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
- [ ] Any decision the screen takes moves the sidebar count **and** appends an
      audit entry — check `/audit` after using it
- [ ] `npm run build` and `npm run typecheck` clean
