import type {
  CargoType,
  City,
  Compatibility,
  Country,
  NotificationTemplate,
  Port,
  PricingSettings,
  TruckTypeDef,
} from '@loopway/ui';

/** Settings fixtures — SRS M04-E07 / E08 / E09 / E15. */

/* ---- Geography (E07) ---- */
export const COUNTRIES: Country[] = [
  { id: 'SA', name: 'السعودية', code: 'SA', active: true, domestic: true },
  { id: 'AE', name: 'الإمارات', code: 'AE', active: true, domestic: false },
  { id: 'KW', name: 'الكويت', code: 'KW', active: true, domestic: false },
  { id: 'BH', name: 'البحرين', code: 'BH', active: true, domestic: false },
  { id: 'QA', name: 'قطر', code: 'QA', active: false, domestic: false },
  { id: 'OM', name: 'عُمان', code: 'OM', active: false, domestic: false },
];

export const CITIES: City[] = [
  { id: 'RUH', name: 'الرياض', countryId: 'SA', active: true },
  { id: 'JED', name: 'جدة', countryId: 'SA', active: true },
  { id: 'DMM', name: 'الدمام', countryId: 'SA', active: true },
  { id: 'MED', name: 'المدينة', countryId: 'SA', active: true },
  { id: 'MKH', name: 'مكة', countryId: 'SA', active: true },
  { id: 'ABT', name: 'أبها', countryId: 'SA', active: true },
  { id: 'NJR', name: 'نجران', countryId: 'SA', active: true },
  { id: 'TBK', name: 'تبوك', countryId: 'SA', active: true },
  { id: 'KHB', name: 'الخبر', countryId: 'SA', active: true },
  { id: 'DXB', name: 'دبي', countryId: 'AE', active: true },
  { id: 'AUH', name: 'أبوظبي', countryId: 'AE', active: true },
  { id: 'SHJ', name: 'الشارقة', countryId: 'AE', active: false },
  { id: 'KWI', name: 'مدينة الكويت', countryId: 'KW', active: true },
  { id: 'BAH', name: 'المنامة', countryId: 'BH', active: true },
];

export const PORTS: Port[] = [
  { id: 'P-KAP', name: 'ميناء الملك عبدالعزيز', cityId: 'DMM', requiresPermit: true, instructions: 'الدخول عبر البوابة 3 فقط. التصريح يُقدَّم ورقياً عند البوابة مع صورة الاستمارة.', active: true },
  { id: 'P-JIP', name: 'ميناء جدة الإسلامي', cityId: 'JED', requiresPermit: true, instructions: 'يُشترط تصريح ساري ورقم حجز بوابة مسبق.', active: true },
  { id: 'P-RDP', name: 'الميناء الجاف بالرياض', cityId: 'RUH', requiresPermit: false, active: true },
  { id: 'P-JAP', name: 'ميناء جبل علي', cityId: 'DXB', requiresPermit: true, instructions: 'تصريح المنطقة الحرة إلزامي قبل التحميل بـ 24 ساعة.', active: true },
  { id: 'P-KHP', name: 'ميناء الخفجي', cityId: 'DMM', requiresPermit: true, active: true },
  { id: 'P-SHW', name: 'منفذ الشويخ', cityId: 'KWI', requiresPermit: true, instructions: 'يتطلب بيان جمركي مُخلَّص مسبقاً.', active: true },
  { id: 'P-BTH', name: 'منفذ البطحاء', cityId: 'DMM', requiresPermit: true, active: true },
  { id: 'P-KFB', name: 'جسر الملك فهد', cityId: 'KHB', requiresPermit: false, active: true },
];

/* ---- Catalog (E08) ---- */
export const CARGO_TYPES: CargoType[] = [
  { id: 'C-GEN', name: 'بضائع عامة', requiresTemperature: false, dangerousGoods: false, specialHandling: false, oversized: false, active: true },
  { id: 'C-BLD', name: 'مواد بناء', requiresTemperature: false, dangerousGoods: false, specialHandling: false, oversized: false, active: true },
  { id: 'C-RFR', name: 'مواد غذائية مبردة', requiresTemperature: true, dangerousGoods: false, specialHandling: true, oversized: false, active: true },
  { id: 'C-DNG', name: 'مواد خطرة', requiresTemperature: false, dangerousGoods: true, specialHandling: true, oversized: false, active: true },
  { id: 'C-HVY', name: 'معدات ثقيلة', requiresTemperature: false, dangerousGoods: false, specialHandling: true, oversized: true, active: true },
  { id: 'C-OVR', name: 'حجم غير اعتيادي', requiresTemperature: false, dangerousGoods: false, specialHandling: true, oversized: true, active: true },
  { id: 'C-ELC', name: 'إلكترونيات', requiresTemperature: false, dangerousGoods: false, specialHandling: true, oversized: false, active: true },
  { id: 'C-TXT', name: 'منسوجات', requiresTemperature: false, dangerousGoods: false, specialHandling: false, oversized: false, active: true },
];

export const TRUCK_TYPE_DEFS: TruckTypeDef[] = [
  { id: 'T-FB6', name: 'ستة محاور — سطحة', capacityNote: 'حتى 40 طن · 13.6 م', active: true },
  { id: 'T-LOW', name: 'لوبد', capacityNote: 'حتى 60 طن · ارتفاعات غير اعتيادية', active: true },
  { id: 'T-RFR', name: 'مبردة', capacityNote: 'حتى 25 طن · −25° إلى +25°', active: true },
  { id: 'T-CUR', name: 'ستائر جانبية', capacityNote: 'حتى 24 طن · تحميل جانبي', active: true },
  { id: 'T-BOX', name: 'صندوق مغلق', capacityNote: 'حتى 18 طن', active: true },
  { id: 'T-TNK', name: 'صهريج', capacityNote: 'حتى 35,000 لتر', active: false },
];

/**
 * Compatibility matrix — keyed `${cargoId}:${truckId}`.
 * Only the non-default cells are stored; anything missing reads as `allowed`.
 */
export const COMPATIBILITY: Record<string, Compatibility> = {
  'C-RFR:T-FB6': 'blocked',
  'C-RFR:T-LOW': 'blocked',
  'C-RFR:T-CUR': 'blocked',
  'C-RFR:T-BOX': 'warning',
  'C-DNG:T-FB6': 'warning',
  'C-DNG:T-CUR': 'blocked',
  'C-DNG:T-RFR': 'blocked',
  'C-DNG:T-BOX': 'warning',
  'C-HVY:T-RFR': 'blocked',
  'C-HVY:T-CUR': 'blocked',
  'C-HVY:T-BOX': 'blocked',
  'C-OVR:T-FB6': 'warning',
  'C-OVR:T-RFR': 'blocked',
  'C-OVR:T-CUR': 'blocked',
  'C-OVR:T-BOX': 'blocked',
  'C-ELC:T-FB6': 'warning',
  'C-ELC:T-LOW': 'blocked',
  'C-TXT:T-LOW': 'warning',
  'C-GEN:T-LOW': 'warning',
  'C-BLD:T-RFR': 'blocked',
  'C-BLD:T-BOX': 'warning',
};

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
