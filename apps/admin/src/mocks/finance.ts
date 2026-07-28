import type { CarrierDues, CarrierTripDue, FinancialOperation } from '@loopway/ui';
import { CARRIER_BY_ID } from './carriers';

/**
 * العمليات المالية والمستحقات — SRS M04-E10 / M04-E11.
 *
 * The `TXN-2026-…` and `LW-2026-…` ids are the SAME records the B2B portal
 * shows at /finance and /trips. That overlap is deliberate: it is what makes
 * the two portals read as one product rather than two demos.
 */

export const FINANCIAL_OPERATIONS: FinancialOperation[] = [
  { id: 'FIN-2026-04412', type: 'دفعة عميل', shipmentId: 'LW-2026-002962', partyName: 'شركة الرحلة اللوجستية', amount: '1,240.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01923', createdAt: '21 يوليو 2026 · 09:14 ص', method: 'مدى •••• 7723' },
  { id: 'FIN-2026-04413', type: 'عمولة المنصة', shipmentId: 'LW-2026-002962', partyName: 'شركة الرحلة اللوجستية', amount: '148.80', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01923', createdAt: '21 يوليو 2026 · 09:14 ص' },
  { id: 'FIN-2026-04410', type: 'دفعة عميل', partyName: 'شركة الرحلة اللوجستية', amount: '5,000.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01918', createdAt: '20 يوليو 2026 · 04:40 م', method: 'بطاقة ائتمان •••• 4412' },
  { id: 'FIN-2026-04404', type: 'دفعة عميل', shipmentId: 'LW-2026-002960', partyName: 'شركة الرحلة اللوجستية', amount: '3,850.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01911', createdAt: '20 يوليو 2026 · 08:02 ص', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04405', type: 'رسوم', shipmentId: 'LW-2026-002960', partyName: 'شركة الرحلة اللوجستية', amount: '25.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01911', createdAt: '20 يوليو 2026 · 08:02 ص' },
  { id: 'FIN-2026-04406', type: 'عمولة المنصة', shipmentId: 'LW-2026-002960', partyName: 'شركة الرحلة اللوجستية', amount: '401.74', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01911', createdAt: '20 يوليو 2026 · 08:02 ص' },
  { id: 'FIN-2026-04398', type: 'دفعة عميل', shipmentId: 'LW-2026-002951', partyName: 'شركة الرحلة اللوجستية', amount: '6,200.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01905', createdAt: '19 يوليو 2026 · 11:27 ص', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04399', type: 'عمولة المنصة', shipmentId: 'LW-2026-002951', partyName: 'شركة الرحلة اللوجستية', amount: '688.96', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01905', createdAt: '19 يوليو 2026 · 11:27 ص' },
  { id: 'FIN-2026-04390', type: 'دفعة عميل', shipmentId: 'LW-2026-002948', partyName: 'سارة العتيبي', amount: '980.00', direction: 'credit', status: 'قيد التنفيذ', reference: 'TXN-2026-01874', createdAt: '18 يوليو 2026 · 10:05 ص', method: 'مدى •••• 2214' },
  { id: 'FIN-2026-04384', type: 'دفعة عميل', shipmentId: 'LW-2026-002955', partyName: 'مؤسسة نجد للنقل', amount: '2,150.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01888', createdAt: '17 يوليو 2026 · 07:45 ص', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04377', type: 'دفعة عميل', shipmentId: 'LW-2026-002910', partyName: 'شركة الرحلة اللوجستية', amount: '1,450.00', direction: 'credit', status: 'فاشلة', reference: 'TXN-2026-01881', createdAt: '16 يوليو 2026 · 12:20 م', method: 'مدى •••• 7723' },
  { id: 'FIN-2026-04366', type: 'دفعة عميل', shipmentId: 'LW-2026-002970', partyName: 'مصنع الخليج للكيماويات', amount: '4,320.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01852', createdAt: '14 يوليو 2026 · 01:40 م', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04358', type: 'صرف مستحقات', partyName: 'شركة نجم الشمال للنقل', amount: '5,601.34', direction: 'debit', status: 'مكتملة', reference: 'CAR-2026-027', createdAt: '12 يوليو 2026 · 11:00 ص' },
  { id: 'FIN-2026-04351', type: 'دفعة عميل', shipmentId: 'LW-2026-002900', partyName: 'شركة الرحلة اللوجستية', amount: '1,450.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01840', createdAt: '10 يوليو 2026 · 09:30 ص', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04344', type: 'غرامة معتمدة', shipmentId: 'LW-2026-002900', partyName: 'شركة نجم الشمال للنقل', amount: '90.00', direction: 'credit', status: 'مكتملة', reference: 'PEN-2026-0058', createdAt: '11 يوليو 2026 · 04:15 م' },
  { id: 'FIN-2026-04338', type: 'دفعة عميل', shipmentId: 'LW-2026-002905', partyName: 'مصنع الخليج للكيماويات', amount: '6,050.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01820', createdAt: '8 يوليو 2026 · 01:12 م', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04330', type: 'استرداد', shipmentId: 'LW-2026-002912', partyName: 'شركة الرحلة اللوجستية', amount: '2,900.00', direction: 'debit', status: 'مستردة', reference: 'TXN-2026-01833', createdAt: '3 يوليو 2026 · 09:40 ص', method: 'محفظة LoopWay' },
  { id: 'FIN-2026-04322', type: 'دفعة عميل', shipmentId: 'LW-2026-002915', partyName: 'سارة العتيبي', amount: '3,180.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01812', createdAt: '1 يوليو 2026 · 07:20 ص', method: 'بطاقة ائتمان •••• 9982' },
  { id: 'FIN-2026-04315', type: 'رسوم', shipmentId: 'LW-2026-002915', partyName: 'سارة العتيبي', amount: '25.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01812', createdAt: '1 يوليو 2026 · 07:20 ص' },
  { id: 'FIN-2026-04308', type: 'دفعة عميل', partyName: 'مؤسسة نجد للنقل', amount: '7,500.00', direction: 'credit', status: 'مكتملة', reference: 'TXN-2026-01804', createdAt: '28 يونيو 2026 · 03:55 م', method: 'مدى •••• 6610' },
];

/* ==========================================================================
   Carrier dues
   ========================================================================== */

const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (s: string) => Number(s.replace(/,/g, ''));

/** `net` is computed, never typed — a breakdown that does not add up is worse
 *  than no breakdown at all. */
function trip(
  shipmentId: string,
  route: string,
  driverName: string,
  completedAt: string,
  tripValue: number,
  platformFee: number,
  penalties = 0,
): CarrierTripDue {
  return {
    shipmentId,
    route,
    driverName,
    completedAt,
    tripValue: money(tripValue),
    platformFee: money(platformFee),
    penalties: money(penalties),
    net: money(tripValue - platformFee - penalties),
  };
}

interface DuesRow {
  carrierId: string;
  status: CarrierDues['status'];
  updatedAt: string;
  paidAt?: string;
  trips: CarrierTripDue[];
}

const DUES_ROWS: DuesRow[] = [
  {
    carrierId: 'CAR-2026-011',
    status: 'جاهز للصرف',
    updatedAt: '21 يوليو 2026 · 09:15 ص',
    trips: [
      trip('LW-2026-002960', 'الرياض ← الدمام', 'خالد ناصر', '20 يوليو 2026', 3347.83, 426.74),
      trip('LW-2026-002944', 'الرياض ← جدة', 'ماجد العنزي', '19 يوليو 2026', 2104.35, 268.1),
      trip('LW-2026-002877', 'الرياض ← الكويت', 'خالد ناصر', '15 يوليو 2026', 3010.0, 383.4),
    ],
  },
  {
    carrierId: 'CAR-2026-014',
    status: 'جاهز للصرف',
    updatedAt: '20 يوليو 2026 · 04:10 م',
    trips: [
      trip('LW-2026-002951', 'الدمام ← دبي', 'عبدالله الغامدي', '19 يوليو 2026', 5391.3, 688.96),
      trip('LW-2026-002965', 'جدة ← أبها', 'مشعل الحربي', '18 يوليو 2026', 2608.7, 332.17),
    ],
  },
  {
    carrierId: 'CAR-2026-018',
    status: 'قيد المراجعة',
    updatedAt: '19 يوليو 2026 · 11:40 ص',
    trips: [
      // The 150.00 here is PEN-2026-0065, already approved. A penalty still
      // under review must never appear on this line — BR-012.
      trip('LW-2026-002955', 'جدة ← المدينة', 'عادل الجهني', '17 يوليو 2026', 1869.57, 236.14, 150.0),
      trip('LW-2026-002972', 'الرياض ← نجران', 'إبراهيم الدوسري', '17 يوليو 2026', 4130.43, 526.11),
    ],
  },
  {
    carrierId: 'CAR-2026-023',
    status: 'قيد المراجعة',
    updatedAt: '19 يوليو 2026 · 08:05 ص',
    trips: [
      trip('LW-2026-002970', 'جدة ← مكة', 'سعد المطيري', '18 يوليو 2026', 3756.52, 478.3),
      trip('LW-2026-002915', 'الرياض ← الكويت', 'سلطان العمري', '16 يوليو 2026', 2765.22, 352.1),
    ],
  },
  {
    carrierId: 'CAR-2026-027',
    status: 'تم الصرف',
    updatedAt: '12 يوليو 2026 · 11:00 ص',
    paidAt: '12 يوليو 2026',
    trips: [
      trip('LW-2026-002900', 'الرياض ← جدة', 'نايف السبيعي', '10 يوليو 2026', 1260.87, 160.55, 90.0),
      trip('LW-2026-002905', 'الدمام ← دبي', 'نايف السبيعي', '8 يوليو 2026', 5260.87, 669.85),
    ],
  },
];

export const CARRIER_DUES: CarrierDues[] = DUES_ROWS.map((row) => {
  const carrier = CARRIER_BY_ID[row.carrierId];
  return {
    carrierId: row.carrierId,
    carrierName: carrier?.name ?? row.carrierId,
    initial: carrier?.initial ?? '؟',
    unsettledTrips: row.trips.length,
    totalDue: money(row.trips.reduce((sum, t) => sum + num(t.net), 0)),
    status: row.status,
    updatedAt: row.updatedAt,
    bankAccount: carrier?.bankAccount ?? '—',
    paidAt: row.paidAt,
    trips: row.trips,
  };
});

export { money as formatMoney, num as parseMoney };
