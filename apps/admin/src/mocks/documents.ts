import type { ReviewDocument } from '@loopway/ui';

/**
 * Document & permit review queue — SRS M04-E06.
 *
 * 23 `Under Review` records match the sidebar badge. The `rule` field carries
 * the SRS §13.3 distinction that actually matters operationally: a Blocking
 * permit stops the trip, a Warning one does not.
 */

let n = 8800;
const id = () => `DOC-${++n}`;

function d(
  documentType: string,
  category: ReviewDocument['category'],
  entityType: ReviewDocument['entityType'],
  entityName: string,
  entityId: string,
  rule: ReviewDocument['rule'],
  extra: Partial<ReviewDocument> = {},
): ReviewDocument {
  return {
    id: id(),
    documentType,
    category,
    entityType,
    entityName,
    entityId,
    uploadedBy: entityName,
    uploadedAt: '23 يوليو 2026',
    sizeLabel: '482 ك.ب',
    rule,
    status: 'Under Review',
    ...extra,
  };
}

export const REVIEW_DOCUMENTS: ReviewDocument[] = [
  /* ---- Permits on live trips: the ones that block ---- */
  d('تصريح دخول ميناء جبل علي', 'تصريح', 'shipment', 'شركة الرحلة اللوجستية', 'LW-CO-4821', 'blocking', {
    shipmentId: 'LW-2026-002951',
    expiryDate: '30 أغسطس 2026',
  }),
  d('تصريح مواد خطرة', 'تصريح', 'shipment', 'مصنع الخليج للكيماويات', 'LW-CO-5510', 'blocking', {
    shipmentId: 'LW-2026-002965',
    expiryDate: '12 ديسمبر 2026',
  }),
  d('تصريح حجم غير اعتيادي', 'تصريح', 'shipment', 'شركة الرحلة اللوجستية', 'LW-CO-4821', 'blocking', {
    shipmentId: 'LW-2026-002972',
  }),
  d('بيان جمركي', 'تصريح', 'shipment', 'عبدالله الغامدي', 'DRV-2026-0386', 'blocking', {
    shipmentId: 'LW-2026-002951',
  }),
  d('تصريح دخول ميناء الملك عبدالعزيز', 'تصريح', 'shipment', 'مؤسسة نجد للنقل', 'LW-CO-6102', 'blocking', {
    shipmentId: 'LW-2026-002960',
    expiryDate: '5 نوفمبر 2026',
  }),

  /* ---- Permits that warn but don't block ---- */
  d('شهادة منشأ', 'وثيقة', 'shipment', 'شركة الرحلة اللوجستية', 'LW-CO-4821', 'warning', {
    shipmentId: 'LW-2026-002962',
  }),
  d('بيان تعبئة', 'وثيقة', 'shipment', 'مؤسسة نجد للنقل', 'LW-CO-6102', 'warning', {
    shipmentId: 'LW-2026-002955',
  }),
  d('تصريح تحميل ليلي', 'تصريح', 'shipment', 'مصنع الخليج للكيماويات', 'LW-CO-5510', 'warning', {
    shipmentId: 'LW-2026-002970',
  }),

  /* ---- Driver documents ---- */
  d('الهوية الوطنية', 'وثيقة', 'driver', 'عبدالرحمن الزهراني', 'DRV-2026-0412', 'none'),
  d('رخصة القيادة', 'وثيقة', 'driver', 'عبدالرحمن الزهراني', 'DRV-2026-0412', 'none', { expiryDate: '9 مايو 2029' }),
  d('الهوية الوطنية', 'وثيقة', 'driver', 'مشعل الحربي', 'DRV-2026-0411', 'none'),
  d('رخصة القيادة', 'وثيقة', 'driver', 'ياسر الشمري', 'DRV-2026-0409', 'none', { expiryDate: '2 فبراير 2027' }),
  d('جواز السفر', 'وثيقة', 'driver', 'سلطان العمري', 'DRV-2026-0406', 'none', { expiryDate: '17 يونيو 2030' }),
  d('رخصة القيادة', 'وثيقة', 'driver', 'راشد المالكي', 'DRV-2026-0404', 'none'),
  d('الهوية الوطنية', 'وثيقة', 'driver', 'حمد الرشيدي', 'DRV-2026-0403', 'none'),
  d('صورة السائق', 'وثيقة', 'driver', 'زياد القرني', 'DRV-2026-0397', 'none'),

  /* ---- Truck documents ---- */
  d('استمارة المركبة', 'وثيقة', 'truck', '٧٧٤٢ ل م ن', 'TRK-2026-0188', 'none', { expiryDate: '18 مارس 2027' }),
  d('وثيقة التأمين', 'وثيقة', 'truck', '٧٧٤٢ ل م ن', 'TRK-2026-0188', 'none', { expiryDate: '4 أغسطس 2026' }),
  d('استمارة المركبة', 'وثيقة', 'truck', '٥٥١٢ س ع ط', 'TRK-2026-0185', 'none', { expiryDate: '30 يوليو 2026' }),
  d('بطاقة التشغيل', 'وثيقة', 'truck', '٨٨٠١ ك ط ر', 'TRK-2026-0183', 'none'),

  /* ---- Company documents ---- */
  d('السجل التجاري', 'وثيقة', 'company', 'شركة الرحلة اللوجستية', 'LW-CO-4821', 'none', {
    expiryDate: '14 سبتمبر 2026',
  }),
  d('شهادة الضريبة', 'وثيقة', 'company', 'مصنع الخليج للكيماويات', 'LW-CO-5510', 'none'),
  d('العنوان الوطني', 'وثيقة', 'company', 'مؤسسة نجد للنقل', 'LW-CO-6102', 'none'),

  /* ---- Already decided ---- */
  d('إثبات التسليم POD', 'إثبات', 'shipment', 'عبدالله الغامدي', 'DRV-2026-0386', 'none', {
    shipmentId: 'LW-2026-002900',
    status: 'Approved',
    uploadedAt: '11 يوليو 2026',
  }),
  d('إثبات التحميل', 'إثبات', 'shipment', 'سعد المطيري', 'DRV-2026-0384', 'none', {
    shipmentId: 'LW-2026-002905',
    status: 'Approved',
    uploadedAt: '8 يوليو 2026',
  }),
  d('البوليصة', 'مستند مولد', 'shipment', 'النظام', 'SYSTEM', 'none', {
    shipmentId: 'LW-2026-002900',
    status: 'Approved',
    uploadedAt: '10 يوليو 2026',
  }),
  d('رخصة القيادة', 'وثيقة', 'driver', 'فهد العتيبي', 'DRV-2026-0380', 'none', {
    status: 'Rejected',
    uploadedAt: '3 يوليو 2026',
    decisionReason: 'الرخصة منتهية ولا تغطي فئة المركبة.',
  }),
  d('الهوية الوطنية', 'وثيقة', 'driver', 'ماجد العنزي', 'DRV-2026-0374', 'none', {
    status: 'Expired',
    uploadedAt: '20 يونيو 2026',
    expiryDate: '12 يوليو 2026',
  }),
  d('وثيقة التأمين', 'وثيقة', 'truck', '٧٧٠٢ م ج د', 'TRK-2026-0164', 'none', {
    status: 'Expired',
    uploadedAt: '20 يونيو 2026',
    expiryDate: '2 يوليو 2026',
  }),
];
