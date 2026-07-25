# 01 — Brand identity

LoopWay is a land-freight and trucking marketplace for Saudi Arabia and the
Gulf. Shippers post a trip (route, cargo, truck type, fixed price or open
tender), qualified drivers accept or bid, and the trip is tracked door-to-door
through a live timeline and an auto-regenerating digital waybill (**البوليصة**).
Money is escrowed in an in-app wallet and released only after delivery is
confirmed.

The product is **Arabic-first and RTL**, with numerals, currency and reference
codes staying LTR inline.

---

## The two-tone brand

Everything is navy or green, on a quiet neutral field.

**Deep navy `#2C3E50`** — chrome, headings, primary text, the Admin sidebar,
the wallet card, avatars, active filter tabs. It is the *structure* colour.

**Brand green `#2ECC71`** (hover `#27AE60`) — every primary action, every
success state, the active rail item, progress fill, the live-waybill CTA. It is
the *go* colour. Nothing else is green.

Then a disciplined semantic layer:

| Meaning | Colour | Used for |
|---|---|---|
| success / active / in transit | green | live trips, completed payments, approved documents |
| pending / needs attention | amber `#F39C12`, text `#9A6B12` | awaiting offers, plan-limit warning, expiring documents, scheduled calendar bars |
| error / destructive / cancelled | red `#E74C3C`, text `#C0392B` | failed payments, cancelled trips, validation errors |
| neutral / informational | slate | expired-without-offer, archived, muted meta |
| link / informational text | blue `#2D6CC0` | "مسح جميع الفلاتر", inline explanatory links |

**Red is reserved.** It never means "important" — only destructive or failed.

---

## Voice and tone

Professional, concise, reassuring. A B2B/logistics register even when the
reader is an individual shipper. **Formal written Arabic (فصحى)**, never
colloquial. Second-person direct address: *شحنتك، رصيدك، باقتك*.

**Hard rules, observed across ~30 production screens:**

- Sentence case throughout.
- **No exclamation marks. Anywhere.**
- **No emoji. Ever.** Not in UI, not in sample data, not in empty states.
- Short declaratives over long sentences.
- No Unicode symbol characters as decoration — icons are SVG (see [04](04-iconography.md)).

### Money and trust language is explicit, and repeated

Because the product escrows payment, the copy says so plainly rather than
burying it in terms:

> رصيدك محفوظ بأمان. يُحرَّر المبلغ للسائق فقط بعد تأكيد التسليم.

> المبلغ محجوز بأمان ويُحرَّر للسائق فقط بعد تأكيد التسليم.

> بتأكيدك الاستلام، يُحرَّر مبلغ الشحنة للسائق وتُغلق الشحنة.

### Errors are specific and instructive, never generic

> يرجى اختيار تاريخ الرحلة.

> هذه الشاحنة لا تدعم الحمولة المختارة. اختر شاحنة موصى بها للمتابعة.

> لم نعثر على رحلات تطابق بحثك أو الفلاتر المحددة. جرّب تعديل الفلاتر.

Never "حدث خطأ ما" on its own. If a retry is possible, offer the button.

### Success states are warm but brief — one line, no embellishment

> تمت إضافة 5,000 ر.س بنجاح

> تم تحديث رقم الجوال بنجاح

### Disabled controls explain themselves

Anything disabled carries a `title` saying why:

> وصلت إلى الحد الأقصى للرحلات الحالية في باقتك

---

## Sample data

Use realistic Saudi/Gulf Arabic names and real city pairs. Never
"John Doe" / "Lorem ipsum" / "شركة تجريبية".

**Names in use:** سارة العتيبي · عبدالله الغامدي · خالد ناصر · عمر السالم ·
سعد المطيري · ماجد العنزي · فيصل الدوسري · ناصر القحطاني · تركي الشهري ·
بندر العتيبي

**Routes in use:** الرياض↔جدة · الرياض↔الدمام · الدمام↔دبي · جدة↔المدينة ·
الرياض↔الكويت · جدة↔مكة · جدة↔أبها · الرياض↔نجران

**Reference-code formats:** trip `LW-2026-002960` · transaction `TXN-2026-01923`
· company `LW-CO-4821` · admin `LW-ADM-0001` · document `DOC-8801` · support
case `SC-0219`

---

## Depth, motion and imagery

**Borders + shadow together, never shadow alone.** Card borders are
barely-there neutrals (`#ECF0F2`, `#E7ECEF`); shadows are always tinted navy
(`rgba(44,62,80,…)`), never pure black, and lean on large negative spread
(`-14px` to `-38px`) so they read as *close and soft* rather than floating.

**No colored left-border accents.** That pattern does not exist in this product.

**Backgrounds are flat colour.** No gradients, no textures, no photography, no
illustration — with exactly one exception: the wallet balance card, which uses
`radial-gradient(130% 160% at 100% 0%, #3D5571 0%, #2C3E50 60%)` plus one faint
`rgba(255,255,255,.05)` decorative circle. Do not add a second exception.

**Animation is minimal and functional.** Never decorative, never infinite —
with one deliberate exception:

| Motion | Where | Spec |
|---|---|---|
| spinner | any in-progress state | 360° linear, `.7s`–`.8s` |
| success pop-in | every "done" confirmation | scale `.5 → 1.08 → 1` + fade, `.5s` |
| panel slide-in | side panels | `translateX(24px)` + fade, `.28s` |
| toast slide-up | confirmations | `translateY(30px)` + fade |
| **waybill glow** | the `البوليصة الحية` CTA only | breathing box-shadow `3.2s` + two blurred drifting orbs |

No hover-lift, no parallax, no skeleton shimmer — **loading skeletons are
static grey blocks**, deliberately. Everything respects
`prefers-reduced-motion`.

The waybill glow is the single stretch of the "minimal motion" rule, and it is
earned: SRS `BR-013` makes the waybill a live document that regenerates on
every material event, and the animation is what communicates "live". **Do not
copy this treatment onto ordinary CTAs.**

**Hover and press.** Buttons *darken* on hover (`#2ECC71 → #27AE60`; borders
`#DCE3E7 → #C7D0D6`). Never lighten, never fade opacity, never scale on press.

**Imagery.** There is none. Empty states use an icon in a tinted circle, not an
illustration. Where a photo would go (proof of delivery), the source used a
neutral placeholder box; the trip-row map preview is a hand-drawn abstract SVG
plate, not a map tile. Follow that rather than sourcing stock photography.
