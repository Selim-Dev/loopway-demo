# 09 — Information architecture & routes

## The IA decision

The SRS lists **eleven** functional sections for the company dashboard
(`M03-E01…E11`). The design ships a rail with **four** destinations plus a
settings gear.

**The design's IA wins**, and the missing seven are folded in rather than
promoted to rail items. Rationale: a 78px icon rail cannot carry eleven
unlabelled destinations, and the design's grouping is coherent — the calendar
belongs *inside* trips, and brokers/locations/documents belong *inside* the
account.

| SRS section | Where it lives | Route |
|---|---|---|
| `M03-E01` تسجيل ودخول الشركة | outside the shell | `/login`, `/verify` |
| `M03-E01-F02` بيانات ووثائق الشركة | under الملف الشخصي | `/account/company` |
| `M03-E02` الصفحة الرئيسية | rail item 1 | `/` |
| `M03-E03` إدارة الشحنات | rail item 2 | `/trips`, `/trips/[id]` |
| `M03-E04` إنشاء شحنة من الويب | under رحلاتي | `/trips/new` |
| `M03-E05` التقويم | **a page tab inside** رحلاتي | `/trips/calendar` |
| `M03-E06` المدفوعات والفواتير | rail item 3 | `/finance` |
| `M03-E07` أرشيف المستندات | under الملف الشخصي | `/account/documents` |
| `M03-E08` المواقع المحفوظة | under الملف الشخصي | `/account/locations` |
| `M03-E09` البروكرز المحفوظين | **named in** rail item 4 | `/account/brokers` |
| `M03-E10` الدعم والتنبيهات | header icons | `/notifications`, `/support` |
| `M03-E11` تقارير خفيفة | reachable from الرئيسية | `/reports` |

> **Rule for adding a rail item: don't.** Four is the design's IA. New
> functionality goes under an existing destination, or into the header icons.
> If a fifth truly is needed, that is a design decision, not an implementation
> one.

---

## Things the design added that the SRS does not have

These are **product additions originating in the design**, not inventions of
this implementation. They are built, and flagged:

| Addition | Where | Note |
|---|---|---|
| Wallet with available balance | finance | SRS has payments, not a company wallet UI |
| Top-up flow (chips → method → success) | finance panel | |
| Withdrawal transactions | finance table | |
| **Subscription plan cap** (`maxConcurrent`, "بلوغ حد الباقة") | trips, settings | drives a whole view state |
| `البوليصة الحية` as an animated CTA | trip row, workspace | consistent with `BR-013` |
| Three-tab split of trips (مباشرة / بانتظار العروض / سجل) | trips | SRS implies one list |

If the business does not want the plan cap, the `limit` view state and its
banner come out together.

---

## B2B routes (`apps/b2b`, port 3000)

| Route | Screen | Source |
|---|---|---|
| `/login` | دخول الشركة | derived |
| `/verify` | رمز التحقق (OTP) | derived |
| `/` | الرئيسية — KPIs, Action Required, live trips, quick actions | derived |
| `/trips` | **رحلاتي — list** (3 tabs, filters, expandable rows, 6 view states) | **designed** |
| `/trips/calendar` | **رحلاتي — calendar** (lane-packed bars, 372px panel) | **designed** |
| `/trips/[id]` | تفاصيل الرحلة — 5 tabs: نظرة عامة / التتبّع / العروض / المستندات / الدفع | derived |
| `/trips/[id]/waybill` | البوليصة الحية — document view | derived |
| `/trips/new` | إنشاء رحلة جديدة — 6-step wizard | derived |
| `/finance` | **سجل العمليات المالية** (wallet, table, detail panel, top-up) | **designed** |
| `/account` | الملف الشخصي — overview | derived |
| `/account/company` | بيانات ووثائق الشركة | derived |
| `/account/brokers` | البروكرز المحفوظين | derived |
| `/account/locations` | المواقع المحفوظة | derived |
| `/account/documents` | أرشيف المستندات | derived |
| `/notifications` | مركز التنبيهات | derived |
| `/support` | الدعم والبلاغات | derived |
| `/reports` | التقارير | derived |
| `/settings` | الإعدادات والباقة | derived |

Route groups: `(portal)` wraps everything in `AppShell`; `(auth)` renders bare
— there is no rail or account chip before sign-in.

---

## Admin routes (`apps/admin`, port 3001)

**Ten destinations, not sixteen.** The SRS describes sixteen `M04-E*`
sections; running the portal showed the operating model is narrower. Six of
them either belong inside another screen or are not work this portal does — see
`apps/admin/src/config/sections.ts`, which lists each removal and why.

| Group | Route | Section | SRS |
|---|---|---|---|
| — | `/` | الصفحة الرئيسية التشغيلية | `M04-E01` |
| — | `/shipments` | إدارة الرحلات | `M04-E02` |
| الاعتماد والمراجعة | `/drivers` | اعتماد السائقين | `M04-E03` |
| | `/penalties` | مراجعة الغرامات | `M04-E12` |
| الحسابات والمال | `/customers` | العملاء والشركات | `M04-E05` |
| | `/finance` | العمليات المالية | `M04-E10` |
| | `/carrier-dues` | إدارة مستحقات الشركات | `M04-E11` |
| الإعدادات | `/settings/pricing` | التسعير والرسوم | `M04-E09` |
| | `/notifications` | إدارة الإشعارات | `M04-E15` |
| التشغيل | `/audit` | سجل القرارات والاعتمادات | `M04-E16` |

Plus `/account` — the operator's own profile, which is not an SRS section. It
exists because `PageHeader` puts an account chip on every screen and that chip
has to land somewhere.

**Removed, with the reason:**

| Was | Why it went |
|---|---|
| `/trucks` `E04` | merged into the driver request — a driver registers *with* a truck, and "approved driver, pending truck" is a state no screen can act on |
| `/documents` `E06` | documents live inside the request they belong to |
| `/settings/geography` `E07`, `/settings/catalog` `E08` | out of the operating model |
| `/support` `E13`, `/reports` `E14` | out of the operating model |

Routes were renamed with their labels: `/payments` → `/finance`, `/payouts` →
`/carrier-dues`, `/templates` → `/notifications`. A page titled
إدارة مستحقات الشركات served from `/payouts` is a trap for the next reader.

Ten grouped destinations with labels long enough to wrap is why Admin uses
`NavSidebar` rather than `IconRail`.
See [10-admin-portal-guide.md](10-admin-portal-guide.md).

---

## Mock data

`apps/b2b/src/mocks/` — `trips.ts`, `calendar.ts`, `transactions.ts`,
`company.ts`, `notifications.ts`, `workspace.ts`.
`apps/admin/src/config/sections.ts` holds the Admin IA plus its fixtures.

Typed against `@loopway/ui`'s domain types, which are named after the SRS §12
data dictionary (`Trip`/`shipmentId`, `Offer`, `Transaction`, `Document`,
`Broker`, `SavedLocation`, `TimelineEvent`, `SupportCase`) so the shapes are
ready for a real API.

**The trips, calendar and transaction fixtures are the exact records from the
design** — same IDs, routes, cargo strings, dates, progress values, elapsed
seeds and VAT breakdowns. Keeping them identical is what makes a visual diff
against the design source meaningful. Do not "improve" them.

**"Today" is pinned** to `{ day: 16, month: 6, year: 2026 }` (July is month 6,
0-based) rather than read from the clock: the fixtures live in July 2026, so a
real clock would render an empty calendar, and a fixed date keeps server and
client renders identical.

No `fetch`, no API routes, no environment variables anywhere.
