import type { ArchivedDocument, Offer, TimelineEvent } from '@loopway/ui';

/**
 * Trip-workspace fixtures.
 *
 * SRS BR-001 is load-bearing here: the platform never shows a reference or
 * estimated price. Offers carry the DRIVER'S price and nothing else — there is
 * deliberately no "متوسط السوق" or "السعر المقترح" field anywhere.
 */

export const TRIP_TIMELINE: TimelineEvent[] = [
  { id: 'EV-01', label: 'نُشر الطلب', timestamp: '18 يوليو 2026 · 09:12 ص', actor: 'شركة الرحلة اللوجستية', state: 'done' },
  { id: 'EV-02', label: 'وصلت العروض', timestamp: '18 يوليو 2026 · 10:40 ص', note: 'وصلت 5 عروض من سائقين مؤهلين.', state: 'done' },
  { id: 'EV-03', label: 'تم اختيار السائق', timestamp: '19 يوليو 2026 · 08:05 ص', actor: 'خالد ناصر', state: 'done' },
  { id: 'EV-04', label: 'تم تأكيد الدفع', timestamp: '19 يوليو 2026 · 08:19 ص', note: 'خُصم مبلغ الرحلة من محفظة الشركة ويُحرَّر للسائق بعد تأكيد التسليم.', state: 'done' },
  { id: 'EV-05', label: 'التحضير للتحميل', timestamp: '20 يوليو 2026 · 06:30 ص', note: 'اكتملت الوثائق المطلوبة قبل التحميل.', state: 'done' },
  { id: 'EV-06', label: 'متجه إلى نقطة الاستلام', timestamp: '20 يوليو 2026 · 07:48 ص', location: 'الرياض — المنطقة الصناعية الثانية', state: 'active' },
  { id: 'EV-07', label: 'دخل منطقة التحميل', timestamp: '—', state: 'upcoming' },
  { id: 'EV-08', label: 'اكتمل التحميل', timestamp: '—', state: 'upcoming' },
  { id: 'EV-09', label: 'في الطريق إلى التسليم', timestamp: '—', state: 'upcoming' },
  { id: 'EV-10', label: 'إثبات التسليم POD', timestamp: '—', note: 'إثبات التسليم شرط لإغلاق الرحلة.', state: 'upcoming' },
];

export const TRIP_OFFERS: Offer[] = [
  { id: 'OF-001', driverName: 'خالد ناصر', driverInitial: 'خ', rating: 4.9, trips: 212, truckType: 'ستة محاور — سطحة', price: '3,850', eta: 'الوصول خلال 9 ساعات', status: 'Selected' },
  { id: 'OF-002', driverName: 'فيصل الدوسري', driverInitial: 'ف', rating: 4.7, trips: 148, truckType: 'ستة محاور — سطحة', price: '4,100', eta: 'الوصول خلال 11 ساعة', status: 'Submitted' },
  { id: 'OF-003', driverName: 'ناصر القحطاني', driverInitial: 'ن', rating: 4.8, trips: 301, truckType: 'ستة محاور — لوبد', price: '4,250', eta: 'الوصول خلال 10 ساعات', status: 'Submitted' },
  { id: 'OF-004', driverName: 'تركي الشهري', driverInitial: 'ت', rating: 4.5, trips: 96, truckType: 'ستة محاور — سطحة', price: '4,400', eta: 'الوصول خلال 12 ساعة', status: 'Viewed' },
  { id: 'OF-005', driverName: 'بندر العتيبي', driverInitial: 'ب', rating: 4.6, trips: 174, truckType: 'ستة محاور — سطحة', price: '4,600', eta: 'الوصول خلال 8 ساعات', status: 'Submitted' },
];

export const TRIP_DOCUMENTS: ArchivedDocument[] = [
  { id: 'DOC-9001', documentType: 'البوليصة', tripId: 'LW-2026-002960', uploadedBy: 'النظام', uploadedAt: '20 يوليو 2026', status: 'Approved', sizeLabel: '184 ك.ب' },
  { id: 'DOC-9002', documentType: 'فاتورة الشحنة', tripId: 'LW-2026-002960', uploadedBy: 'شركة الرحلة اللوجستية', uploadedAt: '19 يوليو 2026', status: 'Approved', sizeLabel: '96 ك.ب' },
  { id: 'DOC-9003', documentType: 'إثبات التحميل', tripId: 'LW-2026-002960', uploadedBy: 'خالد ناصر', uploadedAt: '—', status: 'Required Later', sizeLabel: '—' },
  { id: 'DOC-9004', documentType: 'إثبات التسليم POD', tripId: 'LW-2026-002960', uploadedBy: 'خالد ناصر', uploadedAt: '—', status: 'Required Later', sizeLabel: '—' },
];

/** أرشيف المستندات — company-wide, across trips (SRS M03-E07). */
export const DOCUMENT_ARCHIVE: ArchivedDocument[] = [
  { id: 'DOC-8801', documentType: 'البوليصة', tripId: 'LW-2026-002900', uploadedBy: 'النظام', uploadedAt: '10 يوليو 2026', status: 'Archived', sizeLabel: '176 ك.ب' },
  { id: 'DOC-8802', documentType: 'إثبات التسليم POD', tripId: 'LW-2026-002900', uploadedBy: 'عبدالله الغامدي', uploadedAt: '11 يوليو 2026', status: 'Approved', sizeLabel: '1.2 م.ب' },
  { id: 'DOC-8803', documentType: 'فاتورة ضريبية', tripId: 'LW-2026-002905', uploadedBy: 'النظام', uploadedAt: '8 يوليو 2026', status: 'Archived', sizeLabel: '88 ك.ب' },
  { id: 'DOC-8804', documentType: 'تصريح ميناء', tripId: 'LW-2026-002905', uploadedBy: 'شركة الرحلة اللوجستية', uploadedAt: '7 يوليو 2026', status: 'Approved', expiryDate: '7 أكتوبر 2026', sizeLabel: '340 ك.ب' },
  { id: 'DOC-8805', documentType: 'شهادة منشأ', tripId: 'LW-2026-002915', uploadedBy: 'شركة الرحلة اللوجستية', uploadedAt: '1 يوليو 2026', status: 'Under Review', sizeLabel: '512 ك.ب' },
  { id: 'DOC-8806', documentType: 'السجل التجاري', uploadedBy: 'شركة الرحلة اللوجستية', uploadedAt: '2 يناير 2026', status: 'Approved', expiryDate: '14 سبتمبر 2026', sizeLabel: '620 ك.ب' },
  { id: 'DOC-8807', documentType: 'شهادة الضريبة', uploadedBy: 'شركة الرحلة اللوجستية', uploadedAt: '2 يناير 2026', status: 'Approved', sizeLabel: '410 ك.ب' },
];

export const COMPANY_DOCUMENTS: ArchivedDocument[] = DOCUMENT_ARCHIVE.filter((d) => !d.tripId);
