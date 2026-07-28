import type { NotificationDispatch, NotificationTemplate, PricingSettings } from '@loopway/ui';

/** Settings fixtures — SRS M04-E09 (pricing) and M04-E15 (notifications). */

/* ---- Pricing (E09) ---- */
export const PRICING: PricingSettings = {
  platformFee: '25',
  commissionPercent: '12',
  vatPercent: '15',
  paymentFeePercent: '2.1',
  minimumTripValue: '300',
  maximumTripValue: '80,000',
  countryOverrides: [
    { countryId: 'AE', countryName: 'الإمارات', commissionPercent: '14', vatPercent: '5' },
    { countryId: 'KW', countryName: 'الكويت', commissionPercent: '13', vatPercent: '0' },
    { countryId: 'BH', countryName: 'البحرين', commissionPercent: '13', vatPercent: '10' },
  ],
};

/* ---- Notification templates (E15) ---- */
export const TEMPLATES: NotificationTemplate[] = [
  { id: 'TPL-01', event: 'وصول عرض جديد', audience: 'العميل', title: 'وصل عرض جديد على رحلتك', body: 'وصلك عرض جديد على الرحلة {{tripId}} من {{driverName}} بقيمة {{amount}} ر.س. راجع العروض واختر السائق المناسب.', channels: { push: true, inApp: true, sms: false }, variables: ['{{tripId}}', '{{driverName}}', '{{amount}}'], active: true },
  { id: 'TPL-02', event: 'اختيار السائق', audience: 'السائق', title: 'تم اختيارك لتنفيذ رحلة', body: 'تم اختيارك لتنفيذ الرحلة {{tripId}} من {{from}} إلى {{to}}. الرحلة محجوزة لك حتى اكتمال دفع العميل.', channels: { push: true, inApp: true, sms: true }, variables: ['{{tripId}}', '{{from}}', '{{to}}'], active: true },
  { id: 'TPL-03', event: 'تأكيد الدفع', audience: 'العميل', title: 'تم تأكيد الدفع', body: 'تم خصم {{amount}} ر.س مقابل الرحلة {{tripId}}. رصيدك محفوظ بأمان ويُحرَّر للسائق فقط بعد تأكيد التسليم.', channels: { push: true, inApp: true, sms: false }, variables: ['{{tripId}}', '{{amount}}'], active: true },
  { id: 'TPL-04', event: 'فشل الدفع', audience: 'العميل', title: 'تعذّرت عملية الدفع', body: 'لم تكتمل عملية الدفع للرحلة {{tripId}}. تحقّق من طريقة الدفع وأعد المحاولة خلال {{ttl}} حتى لا يُحرَّر السائق.', channels: { push: true, inApp: true, sms: true }, variables: ['{{tripId}}', '{{ttl}}'], active: true },
  { id: 'TPL-05', event: 'تغيّر حالة الرحلة', audience: 'العميل', title: 'تحديث على رحلتك', body: 'الرحلة {{tripId}} أصبحت في حالة «{{status}}» بتاريخ {{timestamp}}.', channels: { push: true, inApp: true, sms: false }, variables: ['{{tripId}}', '{{status}}', '{{timestamp}}'], active: true },
  { id: 'TPL-06', event: 'وثيقة مطلوبة', audience: 'الشركة', title: 'وثيقة مطلوبة قبل التحميل', body: 'الرحلة {{tripId}} تحتاج {{documentType}} قبل بدء التحميل. ارفع الوثيقة من ملف الرحلة.', channels: { push: true, inApp: true, sms: false }, variables: ['{{tripId}}', '{{documentType}}'], active: true },
  { id: 'TPL-07', event: 'تصريح على وشك الانتهاء', audience: 'الشركة', title: 'تصريح يقترب من الانتهاء', body: 'التصريح {{permitType}} ينتهي في {{expiryDate}}. جدّده قبل انتهائه لتفادي تعطّل الرحلات.', channels: { push: false, inApp: true, sms: false }, variables: ['{{permitType}}', '{{expiryDate}}'], active: true },
  { id: 'TPL-08', event: 'إثبات التسليم', audience: 'العميل', title: 'تم تسليم شحنتك', body: 'تم تسليم الرحلة {{tripId}} وتأكيد الاستلام. يُحرَّر مبلغ الشحنة للسائق وتُغلق الرحلة.', channels: { push: true, inApp: true, sms: true }, variables: ['{{tripId}}'], active: true },
  { id: 'TPL-09', event: 'غرامة قيد المراجعة', audience: 'العميل', title: 'غرامة محتملة قيد المراجعة', body: 'أُنشئت غرامة محتملة بقيمة {{amount}} ر.س على الرحلة {{tripId}}. لن تُطبَّق مالياً قبل مراجعة الإدارة واعتمادها.', channels: { push: false, inApp: true, sms: false }, variables: ['{{tripId}}', '{{amount}}'], active: true },
  { id: 'TPL-10', event: 'تحويل مستحقات', audience: 'السائق', title: 'تم تحويل مستحقاتك', body: 'حُوّل مبلغ {{amount}} ر.س إلى حسابك {{bankAccount}} مقابل {{tripCount}} رحلات.', channels: { push: true, inApp: true, sms: true }, variables: ['{{amount}}', '{{bankAccount}}', '{{tripCount}}'], active: true },
];

/* ---- Notification dispatch log (E15) ---- */
export const DISPATCHES: NotificationDispatch[] = [
  { id: 'NTF-2026-0318', event: 'وصول عرض جديد', audience: 'العميل', channels: ['Push', 'داخل التطبيق'], recipients: 1, status: 'أُرسل', sentAt: '24 يوليو 2026 · 09:41 ص' },
  { id: 'NTF-2026-0317', event: 'اعتماد طلب التسجيل', audience: 'السائق', channels: ['Push', 'SMS'], recipients: 1, status: 'أُرسل', sentAt: '24 يوليو 2026 · 08:12 ص' },
  { id: 'NTF-2026-0316', event: 'تذكير بانتهاء وثيقة', audience: 'السائق', channels: ['Push'], recipients: 34, status: 'أُرسل', sentAt: '23 يوليو 2026 · 07:00 ص', sentBy: 'فريق التشغيل' },
  { id: 'NTF-2026-0314', event: 'تأكيد الدفع', audience: 'العميل', channels: ['Push', 'داخل التطبيق'], recipients: 1, status: 'أُرسل', sentAt: '21 يوليو 2026 · 09:15 ص' },
  { id: 'NTF-2026-0311', event: 'تحديث حالة الشحنة', audience: 'العميل', channels: ['داخل التطبيق'], recipients: 148, status: 'فشل جزئي', sentAt: '20 يوليو 2026 · 06:30 م', sentBy: 'فريق التشغيل' },
  { id: 'NTF-2026-0308', event: 'إشعار صيانة مجدولة', audience: 'الكل', channels: ['Push', 'داخل التطبيق'], recipients: 512, status: 'أُرسل', sentAt: '19 يوليو 2026 · 10:00 م', sentBy: 'مدير المنصة' },
  { id: 'NTF-2026-0305', event: 'تحويل المستحقات', audience: 'الشركة', channels: ['SMS'], recipients: 1, status: 'أُرسل', sentAt: '12 يوليو 2026 · 11:02 ص' },
  { id: 'NTF-2026-0301', event: 'رفض طلب التسجيل', audience: 'السائق', channels: ['Push', 'SMS'], recipients: 1, status: 'فشل', sentAt: '3 يوليو 2026 · 05:05 م' },
];
