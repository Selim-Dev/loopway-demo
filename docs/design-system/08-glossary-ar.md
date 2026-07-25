# 08 — Arabic glossary

Binding terminology. Use these exact strings; do not paraphrase in UI copy.

---

## The vocabulary decision that matters most

> **`رحلة` (trip), not `شحنة` (shipment).**

The SRS says `شحنة` throughout. The design says `رحلة` — in the page title
(`رحلاتي`), the tabs (`الرحلات المباشرة`, `سجل الرحلات`), the CTA
(`إنشاء رحلة جديدة`), the empty states, the calendar and every ID label.

**The design wins in the UI.** The SRS wins in code identifiers and data
shapes (`Shipment`, `shipmentId`), because that is what a future API will use.
So: `shipmentId` in a type, `رقم الرحلة` on screen.

`شحنة` survives in UI only where it genuinely means the cargo rather than the
journey — `جاري تحميل الشحنة`, `فاتورة الشحنة`, `بيانات الشحنة`.

---

## Core nouns

| Arabic | English | Notes |
|---|---|---|
| رحلة / رحلات | trip / trips | the journey. The primary object |
| الحمولة | cargo | rendered as `وصف • وزن` — "معدات ثقيلة • 30 طن" |
| البوليصة | waybill | `البوليصة الحية` = the live, auto-regenerating one |
| العرض / العروض | offer / offers | a driver's bid |
| السائق | driver | |
| الشاحنة | truck | |
| النطاق | scope | values: `محلية` / `دولية` |
| المحفظة | wallet | |
| الرصيد المتاح | available balance | |
| الباقة | plan | `باقة الأعمال` |
| البروكر / المخلّص الجمركي | customs broker | both used; broker in the nav, مخلّص in body copy |
| مشرف التحميل / مشرف الاستلام | loading / receiving supervisor | |
| إثبات التسليم (POD) | proof of delivery | gates closure — `BR-011` |
| الغرامة | penalty | always "محتملة" until admin approves — `BR-012` |
| التصريح | permit | `مطلوب الآن` / `مطلوب لاحقاً` |
| الوثيقة | document | |
| العملية | transaction | in the financial log |

---

## Trip statuses

Short label (filter dropdown) → long stage sentence (stage chip) → tone.

### الرحلات المباشرة
| Status | Stage sentence | Tone |
|---|---|---|
| متجه للاستلام | متجه إلى نقطة الاستلام | success |
| جاري التحميل | جاري تحميل الشحنة | success |
| في الطريق | في الطريق إلى الوجهة | success |
| عند الحدود | عبور الحدود | success |
| جاري التسليم | جاري التسليم | success |

### بانتظار العروض
| Status | Stage sentence | Tone |
|---|---|---|
| وصلت عروض | وصلت N عروض — بانتظار الاختيار | warning |
| بانتظار العروض | بانتظار وصول العروض | warning |

### سجل الرحلات
| Status | Stage sentence | Tone |
|---|---|---|
| مكتملة | تم التسليم | done |
| ملغاة | أُلغيت الرحلة | danger |
| منتهية دون عرض | منتهية دون اختيار عرض | neutral |

### The full SRS state machine

The design surfaces the seven customer-facing statuses above. The SRS defines
23. When an Admin screen needs the rest, use these labels:

`Draft` مسودة · `Published/Waiting` منشورة — بانتظار العروض ·
`Offer/Driver Selected` تم اختيار السائق · `Waiting Payment` بانتظار الدفع ·
`Payment Authorized` تم حجز المبلغ · `Paid/Confirmed` مدفوعة ومؤكدة ·
`Preparing for Pickup` التحضير للتحميل · `En Route to Pickup` متجه إلى نقطة الاستلام ·
`Arrived at Pickup` وصل موقع التحميل · `In Loading Area` داخل منطقة التحميل ·
`Loading Completed` اكتمل التحميل · `Documents Received` استلم المستندات ·
`Proof of Loading Submitted` رُفع إثبات التحميل · `En Route to Dropoff` في الطريق إلى التسليم ·
`At Border / Customs` عند الحدود والجمارك · `Arrived at Dropoff` وصل موقع التسليم ·
`In Unloading Area` داخل منطقة التفريغ · `Unloading Completed` اكتمل التفريغ ·
`POD Verification` التحقق من إثبات التسليم · `Delivered` تم التسليم ·
`Closure Review` مراجعة الإغلاق · `Completed` مكتملة ·
`Cancelled` ملغاة / `Cancelled With Penalty` ملغاة مع غرامة ·
`Exception / Support Review` استثناء — قيد المراجعة

---

## Transaction types & statuses

| Type | Arabic | Icon tint |
|---|---|---|
| `payment` | دفع رحلة | neutral |
| `topup` | شحن رصيد | green |
| `withdraw` | سحب أموال | amber |

| Status | Arabic | Timeline label | Tone |
|---|---|---|---|
| `completed` | مكتملة | تمت العملية بنجاح | success |
| `pending` | معلّقة | قيد المعالجة | warning |
| `failed` | فشلت | فشلت العملية | danger |

---

## Document statuses

`Required Now` مطلوبة الآن · `Required Later` مطلوبة لاحقاً ·
`Uploaded` مرفوعة · `Under Review` قيد المراجعة · `Approved` معتمدة ·
`Rejected` مرفوضة · `Expired` منتهية · `Archived` مؤرشفة

---

## Standard UI strings

Reuse these verbatim rather than writing new ones.

**Navigation** — الرئيسية · رحلاتي · سجل العمليات المالية ·
الملف الشخصي وإعدادات البروكر · الإعدادات · القائمة · التقويم · اليوم

**Filters** — `الحالة: الكل` · `النطاق: الكل` · `التاريخ: الكل` ·
هذا الأسبوع · هذا الشهر · `حالة العرض:` · مسح جميع الفلاتر

**Search placeholders** — `ابحث برقم الرحلة أو الموقع…` ·
`ابحث برقم العملية أو رقم الرحلة…`

**Actions** — إنشاء رحلة جديدة · متابعة الرحلة · عرض العروض · عرض التفاصيل ·
رفع المستندات · البوليصة الحية · شحن الرصيد · تنزيل الفاتورة (PDF) ·
تنزيل كشف حساب (PDF) · إعادة المحاولة · إلغاء الرحلة · الإبلاغ عن مشكلة ·
فتح صفحة الرحلة الكاملة · تم · التالي · السابق · إلغاء · حفظ التغييرات

**Column captions** — الحمولة · تاريخ الاستلام · العملية · الرحلة المرتبطة ·
التاريخ والوقت · المبلغ · الحالة · تقدم الرحلة · إجراءات الرحلة

**Pagination** — `1 - N من N`

**Empty / error copy**

> لا توجد رحلات مباشرة
> ابدأ بإنشاء رحلة جديدة وستظهر هنا فور انطلاقها مع متابعة حية.

> لا توجد رحلات بانتظار العروض
> الرحلات الجديدة التي تنتظر عروض السائقين ستظهر هنا.

> تعذّر تحميل الرحلات
> حدث خطأ أثناء جلب بيانات الرحلات. تحقّق من اتصالك ثم أعد المحاولة.

> لا توجد نتائج مطابقة
> لم نعثر على رحلات تطابق بحثك أو الفلاتر المحددة. جرّب تعديل الفلاتر.

> لا توجد عمليات مالية بعد
> سجل عملياتك سيظهر هنا فور إتمام أول عملية دفع لرحلة أو شحن رصيد.

> تعذّر تحميل سجل العمليات المالية
> حدث خطأ أثناء جلب بيانات العمليات المالية. تحقّق من اتصالك ثم أعد المحاولة.

> جارٍ تحميل الرحلات…  /  جارٍ تحميل العمليات المالية…

> لقد وصلت إلى الحد الأقصى للرحلات الحالية المسموح به في باقتك
> *(tooltip on the disabled CTA:)* وصلت إلى الحد الأقصى للرحلات الحالية في باقتك

---

## Dates and months

Arabic month names, Gregorian calendar, day-first, no leading zero:
**`20 يوليو 2026`**.

`['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']`

Weekdays, starting Sunday:
`['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']`

Times use `ص` / `م`: `09:14 ص`, `16:40 م`. Durations:
`1 يوم` · `يومان` · `3–10 أيام` · `11+ يوماً`.

Currency: `ر.س` after the figure in body copy (`3,850 ر.س`); `SAR` before it
on the wallet hero. Thousands separated with `,` — never Eastern-Arabic digits.
