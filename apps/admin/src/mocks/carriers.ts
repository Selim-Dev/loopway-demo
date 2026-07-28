import type { CarrierCompany } from '@loopway/ui';

/**
 * شركات النقل — SRS M04-E11.
 *
 * The platform settles with the transport company, not with the driver. Every
 * driver in `drivers.ts` belongs to one of these, and every trip that driver
 * completes rolls into that company's dues.
 *
 * Names and cities follow the realistic-Saudi-data rule in
 * docs/design-system/01-identity.md.
 */
export const CARRIERS: CarrierCompany[] = [
  {
    id: 'CAR-2026-011',
    name: 'شركة الأفق للنقل الثقيل',
    initial: 'أ',
    commercialRegistration: '1010556213',
    city: 'الرياض',
    contactName: 'مشاري القحطاني',
    mobile: '0555 330 1011',
    bankAccount: 'SA** •••• 4471',
    driverCount: 5,
    joinedAt: '8 يناير 2026',
  },
  {
    id: 'CAR-2026-014',
    name: 'مؤسسة الدرب للشحن',
    initial: 'د',
    commercialRegistration: '2050338840',
    city: 'الدمام',
    contactName: 'عبدالعزيز الشمري',
    mobile: '0553 774 2014',
    bankAccount: 'SA** •••• 9082',
    driverCount: 4,
    joinedAt: '2 فبراير 2026',
  },
  {
    id: 'CAR-2026-018',
    name: 'شركة سواعد الجزيرة للنقل',
    initial: 'س',
    commercialRegistration: '4030117725',
    city: 'جدة',
    contactName: 'طلال الحارثي',
    mobile: '0559 201 3018',
    bankAccount: 'SA** •••• 6350',
    driverCount: 4,
    joinedAt: '17 فبراير 2026',
  },
  {
    id: 'CAR-2026-023',
    name: 'مجموعة الميناء للنقل البري',
    initial: 'م',
    commercialRegistration: '2051990436',
    city: 'الدمام',
    contactName: 'ياسر البقمي',
    mobile: '0551 668 4023',
    bankAccount: 'SA** •••• 2218',
    driverCount: 3,
    joinedAt: '4 مارس 2026',
  },
  {
    id: 'CAR-2026-027',
    name: 'شركة نجم الشمال للنقل',
    initial: 'ن',
    commercialRegistration: '1010884471',
    city: 'الرياض',
    contactName: 'سالم الدوسري',
    mobile: '0556 447 9027',
    bankAccount: 'SA** •••• 7714',
    driverCount: 2,
    joinedAt: '21 مارس 2026',
  },
];

export const CARRIER_BY_ID = Object.fromEntries(CARRIERS.map((c) => [c.id, c]));
