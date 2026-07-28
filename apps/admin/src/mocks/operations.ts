import type { AdminShipment, AuditEntry, CompanyCustomer, IndividualCustomer, OperationalUpdate } from '@loopway/ui';

/** Shipments, customers, the updates feed and the seed audit log — M04-E01/E02/E05/E16. */

export const ADMIN_SHIPMENTS: AdminShipment[] = [
  { id: 'LW-2026-002960', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'خالد ناصر', from: 'الرياض', to: 'الدمام', scope: 'محلية', cargo: 'معدات ثقيلة • 30 طن', status: 'متجه للاستلام', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '20 يوليو 2026', amount: '3,850' },
  { id: 'LW-2026-002951', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'عبدالله الغامدي', from: 'الدمام', to: 'دبي', scope: 'دولية', cargo: 'مواد بناء • 24 طن', status: 'في الطريق', paymentStatus: 'Captured', documentsComplete: false, hasPenalty: false, hasOpenCase: false, pickupDate: '19 يوليو 2026', amount: '6,200' },
  { id: 'LW-2026-002955', customerName: 'مؤسسة نجد للنقل', customerType: 'شركة', driverName: 'عمر السالم', from: 'جدة', to: 'المدينة', scope: 'محلية', cargo: 'مواد غذائية مبردة • 8 طن', status: 'جاري التحميل', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: true, hasOpenCase: true, pickupDate: '17 يوليو 2026', amount: '2,150' },
  { id: 'LW-2026-002962', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'سعد المطيري', from: 'الرياض', to: 'الكويت', scope: 'دولية', cargo: 'إلكترونيات • 6 طن', status: 'عند الحدود', paymentStatus: 'Captured', documentsComplete: false, hasPenalty: true, hasOpenCase: false, pickupDate: '21 يوليو 2026', amount: '1,240' },
  { id: 'LW-2026-002944', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'ماجد العنزي', from: 'الرياض', to: 'جدة', scope: 'محلية', cargo: 'أثاث منزلي • 12 طن', status: 'جاري التسليم', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '16 يوليو 2026', amount: '2,420' },
  { id: 'LW-2026-002948', customerName: 'سارة العتيبي', customerType: 'فرد', from: 'الرياض', to: 'جدة', scope: 'محلية', cargo: 'أثاث منزلي • 12 طن', status: 'وصلت عروض', paymentStatus: 'Authorized', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '18 يوليو 2026', amount: '980' },
  { id: 'LW-2026-002965', customerName: 'مصنع الخليج للكيماويات', customerType: 'شركة', driverName: 'ناصر القحطاني', from: 'جدة', to: 'أبها', scope: 'محلية', cargo: 'منسوجات • 10 طن', status: 'بانتظار العروض', paymentStatus: 'Pending', documentsComplete: false, hasPenalty: false, hasOpenCase: false, pickupDate: '22 يوليو 2026', amount: '3,000' },
  { id: 'LW-2026-002970', customerName: 'مصنع الخليج للكيماويات', customerType: 'شركة', driverName: 'تركي الشهري', from: 'جدة', to: 'مكة', scope: 'محلية', cargo: 'مواد غذائية • 9 طن', status: 'في الطريق', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '22 يوليو 2026', amount: '4,320' },
  { id: 'LW-2026-002972', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'بندر العتيبي', from: 'الرياض', to: 'نجران', scope: 'محلية', cargo: 'معدات زراعية • 15 طن', status: 'متجه للاستلام', paymentStatus: 'Captured', documentsComplete: false, hasPenalty: false, hasOpenCase: false, pickupDate: '25 يوليو 2026', amount: '4,750' },
  { id: 'LW-2026-002900', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', driverName: 'عبدالله الغامدي', from: 'الرياض', to: 'جدة', scope: 'محلية', cargo: 'أثاث منزلي • 12 طن', status: 'مكتملة', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: true, hasOpenCase: false, pickupDate: '10 يوليو 2026', amount: '1,450' },
  { id: 'LW-2026-002905', customerName: 'مصنع الخليج للكيماويات', customerType: 'شركة', driverName: 'سعد المطيري', from: 'الدمام', to: 'دبي', scope: 'دولية', cargo: 'مواد بناء • 24 طن', status: 'مكتملة', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: true, hasOpenCase: true, pickupDate: '8 يوليو 2026', amount: '6,050' },
  { id: 'LW-2026-002915', customerName: 'سارة العتيبي', customerType: 'فرد', driverName: 'خالد ناصر', from: 'الرياض', to: 'الكويت', scope: 'دولية', cargo: 'إلكترونيات • 6 طن', status: 'مكتملة', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '1 يوليو 2026', amount: '3,180' },
  { id: 'LW-2026-002910', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', from: 'جدة', to: 'مكة', scope: 'محلية', cargo: 'مواد غذائية • 8 طن', status: 'ملغاة', paymentStatus: 'Failed', documentsComplete: false, hasPenalty: true, hasOpenCase: true, pickupDate: '5 يوليو 2026', amount: '1,450' },
  { id: 'LW-2026-002912', customerName: 'شركة الرحلة اللوجستية', customerType: 'شركة', from: 'الرياض', to: 'الدمام', scope: 'محلية', cargo: 'معدات • 20 طن', status: 'منتهية دون عرض', paymentStatus: 'Refunded', documentsComplete: false, hasPenalty: true, hasOpenCase: false, pickupDate: '3 يوليو 2026', amount: '2,900' },
  { id: 'LW-2026-002888', customerName: 'مؤسسة نجد للنقل', customerType: 'شركة', driverName: 'عمر السالم', from: 'الدمام', to: 'الرياض', scope: 'محلية', cargo: 'مواد كيميائية • 18 طن', status: 'مكتملة', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '28 يونيو 2026', amount: '1,420' },
  { id: 'LW-2026-002877', customerName: 'سارة العتيبي', customerType: 'فرد', driverName: 'خالد ناصر', from: 'جدة', to: 'الرياض', scope: 'محلية', cargo: 'أجهزة منزلية • 5 طن', status: 'مكتملة', paymentStatus: 'Captured', documentsComplete: true, hasPenalty: false, hasOpenCase: false, pickupDate: '24 يونيو 2026', amount: '3,010' },
];

export const INDIVIDUAL_CUSTOMERS: IndividualCustomer[] = [
  { id: 'CUS-2026-1042', name: 'سارة العتيبي', initial: 'س', mobile: '0555 118 2044', city: 'الرياض', status: 'Active', joinedAt: '4 مارس 2026', shipmentCount: 9, totalSpend: '18,400', openCases: 0 },
  { id: 'CUS-2026-1038', name: 'نورة الشمري', initial: 'ن', mobile: '0553 220 9981', city: 'جدة', status: 'Active', joinedAt: '18 فبراير 2026', shipmentCount: 4, totalSpend: '7,210', openCases: 1 },
  { id: 'CUS-2026-1031', name: 'عبدالعزيز الحارثي', initial: 'ع', mobile: '0556 447 1120', city: 'الدمام', status: 'Active', joinedAt: '2 فبراير 2026', shipmentCount: 12, totalSpend: '26,880', openCases: 0 },
  { id: 'CUS-2026-1027', name: 'لمياء القحطاني', initial: 'ل', mobile: '0559 003 7712', city: 'الرياض', status: 'Pending Review', joinedAt: '21 يوليو 2026', shipmentCount: 0, totalSpend: '0', openCases: 0 },
  { id: 'CUS-2026-1019', name: 'طارق البلوي', initial: 'ط', mobile: '0551 664 3308', city: 'تبوك', status: 'Suspended', joinedAt: '9 يناير 2026', shipmentCount: 3, totalSpend: '4,120', openCases: 2 },
  { id: 'CUS-2026-1014', name: 'ريم الغامدي', initial: 'ر', mobile: '0558 771 2290', city: 'أبها', status: 'Active', joinedAt: '28 ديسمبر 2025', shipmentCount: 6, totalSpend: '11,340', openCases: 0 },
  { id: 'CUS-2026-1008', name: 'أحمد السالم', initial: 'أ', mobile: '0554 990 1123', city: 'المدينة', status: 'Documents Expired', joinedAt: '12 ديسمبر 2025', shipmentCount: 2, totalSpend: '3,050', openCases: 0 },
];

export const COMPANY_CUSTOMERS: CompanyCustomer[] = [
  { id: 'LW-CO-4821', companyName: 'شركة الرحلة اللوجستية', initial: 'ر', commercialRegistration: '1010457821', vatNumber: '310457821900003', authorizedContact: 'سارة العتيبي', mobile: '0555 123 4821', city: 'الرياض', status: 'Active', joinedAt: '11 يناير 2026', shipmentCount: 38, totalSpend: '106,400', planName: 'باقة الأعمال', openCases: 1 },
  { id: 'LW-CO-5510', companyName: 'مصنع الخليج للكيماويات', initial: 'م', commercialRegistration: '2050119043', vatNumber: '311220984400003', authorizedContact: 'فيصل المنصور', mobile: '0553 887 5510', city: 'الدمام', status: 'Active', joinedAt: '3 فبراير 2026', shipmentCount: 21, totalSpend: '74,120', planName: 'باقة الأعمال', openCases: 1 },
  { id: 'LW-CO-6102', companyName: 'مؤسسة نجد للنقل', initial: 'ن', commercialRegistration: '1010883204', vatNumber: '310884120300003', authorizedContact: 'عبدالمحسن الدوسري', mobile: '0556 220 6102', city: 'الرياض', status: 'Active', joinedAt: '19 فبراير 2026', shipmentCount: 14, totalSpend: '41,880', planName: 'باقة الانطلاق', openCases: 0 },
  { id: 'LW-CO-7340', companyName: 'شركة البحر الأحمر للتوزيع', initial: 'ب', commercialRegistration: '4030229117', vatNumber: '300229117400003', authorizedContact: 'هاني الزهراني', mobile: '0559 118 7340', city: 'جدة', status: 'Pending Review', joinedAt: '23 يوليو 2026', shipmentCount: 0, totalSpend: '0', planName: 'باقة الانطلاق', openCases: 0 },
  { id: 'LW-CO-8055', companyName: 'مستودعات الشرق المتحدة', initial: 'ش', commercialRegistration: '2051447790', vatNumber: '311447790100003', authorizedContact: 'وليد العمري', mobile: '0551 003 8055', city: 'الخبر', status: 'Suspended', joinedAt: '7 ديسمبر 2025', shipmentCount: 8, totalSpend: '19,660', planName: 'باقة الأعمال', openCases: 3 },
  { id: 'LW-CO-9120', companyName: 'الأولى للمقاولات', initial: 'أ', commercialRegistration: '1010774412', vatNumber: '310774412200003', authorizedContact: 'ماجد الرشيد', mobile: '0558 447 9120', city: 'الرياض', status: 'Documents Expired', joinedAt: '15 نوفمبر 2025', shipmentCount: 17, totalSpend: '58,300', planName: 'باقة الأعمال', openCases: 0 },
];

export const SEED_AUDIT: AuditEntry[] = [
  { id: 'AUD-2026-90412', actor: 'فريق التشغيل', actorId: 'LW-ADM-0001', action: 'اعتماد', entityType: 'سائق', entityId: 'DRV-2026-0388', entityLabel: 'خالد ناصر', timestamp: '12 يوليو 2026 · 10:22 ص' },
  { id: 'AUD-2026-90409', actor: 'فريق التشغيل', actorId: 'LW-ADM-0001', action: 'اعتماد', entityType: 'شاحنة', entityId: 'TRK-2026-0170', entityLabel: '٤٢٨١ ر ن ب', timestamp: '12 يوليو 2026 · 10:25 ص' },
  { id: 'AUD-2026-90401', actor: 'المسؤول المالي', actorId: 'LW-ADM-0004', action: 'تعديل مبلغ', entityType: 'غرامة', entityId: 'PEN-2026-0058', entityLabel: 'انتظار التحميل — LW-2026-002900', timestamp: '11 يوليو 2026 · 04:15 م', changes: [{ field: 'المبلغ', before: '240 ر.س', after: '150 ر.س' }], reason: 'جزء من التأخير يعود لازدحام البوابة وليس للعميل.' },
  { id: 'AUD-2026-90388', actor: 'فريق التشغيل', actorId: 'LW-ADM-0001', action: 'رفض', entityType: 'سائق', entityId: 'DRV-2026-0380', entityLabel: 'فهد العتيبي', timestamp: '3 يوليو 2026 · 05:02 م', reason: 'رخصة القيادة منتهية الصلاحية ولا تغطي فئة المركبة المطلوبة.' },
  { id: 'AUD-2026-90377', actor: 'مدير المنصة', actorId: 'LW-ADM-0002', action: 'تغيير إعداد', entityType: 'التسعير', entityId: 'PRICING', entityLabel: 'نسبة العمولة', timestamp: '1 يوليو 2026 · 09:00 ص', changes: [{ field: 'العمولة', before: '10%', after: '12%' }], reason: 'تحديث سياسة التسعير للربع الثالث.' },
  { id: 'AUD-2026-90360', actor: 'المسؤول المالي', actorId: 'LW-ADM-0004', action: 'تحويل مستحقات', entityType: 'مستحقات', entityId: 'PO-2026-0318', entityLabel: 'عبدالله الغامدي — 5,141.30 ر.س', timestamp: '12 يوليو 2026 · 11:00 ص' },
  { id: 'AUD-2026-90341', actor: 'فريق التشغيل', actorId: 'LW-ADM-0001', action: 'إيقاف حساب', entityType: 'سائق', entityId: 'DRV-2026-0377', entityLabel: 'بدر الشهراني', timestamp: '28 يونيو 2026 · 12:04 م', changes: [{ field: 'الحالة', before: 'معتمد', after: 'موقوف' }], reason: 'ثلاثة بلاغات تأخير متتالية خلال أسبوعين.' },
  { id: 'AUD-2026-90322', actor: 'فريق التشغيل', actorId: 'LW-ADM-0001', action: 'إغلاق بلاغ', entityType: 'بلاغ دعم', entityId: 'SC-0201', entityLabel: 'استفسار عن فاتورة', timestamp: '9 يوليو 2026 · 11:40 ص', reason: 'أُرسلت الفاتورة التفصيلية وأُغلق البلاغ باتفاق الطرفين.' },
];

/* ==========================================================================
   M04-E01 — Operational updates

   Only the shipment half is a fixture: `AdminShipment` carries no `updatedAt`,
   so status changes need their own timestamps. The approval-request and
   penalty halves are derived from live store state in AdminHome, which is why
   a decision taken in a queue surfaces here without a reload.

   `ageMinutes` is the sort key. It counts back from the pinned SESSION_DATE in
   AdminStore rather than from a real clock — the fixtures live in July 2026 and
   a wall clock would put every update in the future.
   ========================================================================== */
export const SHIPMENT_UPDATES: OperationalUpdate[] = [
  { id: 'UPD-9012', kind: 'رحلة', reference: 'LW-2026-002962', title: 'الشحنة وصلت إلى منفذ البطحاء', status: 'عند الحدود', at: '24 يوليو 2026 · 09:52 ص', ageMinutes: 18, href: '/shipments' },
  { id: 'UPD-9011', kind: 'رحلة', reference: 'LW-2026-002944', title: 'بدأ تسليم الشحنة في جدة', status: 'جاري التسليم', at: '24 يوليو 2026 · 08:35 ص', ageMinutes: 95, href: '/shipments' },
  { id: 'UPD-9009', kind: 'رحلة', reference: 'LW-2026-002951', title: 'الشحنة تحركت من الدمام إلى دبي', status: 'في الطريق', at: '24 يوليو 2026 · 06:20 ص', ageMinutes: 230, href: '/shipments' },
  { id: 'UPD-9007', kind: 'رحلة', reference: 'LW-2026-002955', title: 'اكتمل التحميل وخرجت الشاحنة', status: 'جاري التحميل', at: '23 يوليو 2026 · 07:40 م', ageMinutes: 890, href: '/shipments' },
  { id: 'UPD-9004', kind: 'رحلة', reference: 'LW-2026-002948', title: 'وصلت خمسة عروض من السائقين', status: 'وصلت عروض', at: '23 يوليو 2026 · 02:05 م', ageMinutes: 1225, href: '/shipments' },
  { id: 'UPD-9001', kind: 'رحلة', reference: 'LW-2026-002970', title: 'تم تأكيد الدفع وحجز المبلغ', status: 'مدفوعة', at: '22 يوليو 2026 · 11:18 ص', ageMinutes: 2812, href: '/shipments' },
];
