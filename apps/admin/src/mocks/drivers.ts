import type { Driver, DriverDocument, DriverStatus, RequestTruck } from '@loopway/ui';
import { CARRIER_BY_ID } from './carriers';

/**
 * Driver registration requests — SRS M04-E03.
 *
 * ONE request carries the driver, the truck and both sets of papers, and is
 * approved or rejected as one unit. There is no separate truck queue: a driver
 * registers *with* a truck, and "approved driver, pending truck" is a state
 * with no operational meaning.
 *
 * Names, cities and plates follow the realistic-Saudi-data rule in
 * docs/design-system/01-identity.md.
 */

const CARGO = ['بضائع عامة', 'مواد بناء', 'مواد غذائية مبردة', 'مواد خطرة', 'معدات ثقيلة', 'حجم غير اعتيادي'];

const DRIVER_DOCS = [
  { type: 'الهوية الوطنية', fileName: 'national-id.pdf', sizeLabel: '412 ك.ب' },
  { type: 'رخصة القيادة', fileName: 'driving-license.pdf', sizeLabel: '388 ك.ب' },
  { type: 'جواز السفر', fileName: 'passport.pdf', sizeLabel: '620 ك.ب' },
  { type: 'صورة السائق', fileName: 'driver-photo.jpg', sizeLabel: '244 ك.ب' },
];

const TRUCK_DOCS = [
  { type: 'استمارة الشاحنة', fileName: 'registration.pdf', sizeLabel: '356 ك.ب' },
  { type: 'وثيقة التأمين', fileName: 'insurance.pdf', sizeLabel: '298 ك.ب' },
  { type: 'الفحص الدوري', fileName: 'inspection.pdf', sizeLabel: '187 ك.ب' },
];

const PHOTOS = ['الشاحنة — أمامية', 'الشاحنة — جانبية', 'اللوحة', 'المقطورة'];

interface Row {
  id: string;
  name: string;
  initial: string;
  identityNumber: string;
  nationality: string;
  mobile: string;
  cargo: number[];
  carrierId: string;
  status: DriverStatus;
  submittedAt: string;
  agreementVersion: string;
  agreementAcceptedAt: string;
  decisionReason?: string;
  /** Driver documents absent from the submission. */
  missing?: string[];
  licenceExpiry?: string;
  truck: {
    id: string;
    plate: string;
    type: string;
    model: string;
    year: string;
    registrationExpiry: string;
    insuranceExpiry: string;
    policy: string;
  };
}

/**
 * Builds the request's document set. Driver and truck papers land in one array
 * tagged by `scope` — decided together, but grouped in the panel because a
 * licence and a registration are read for different reasons.
 */
function buildDocs(row: Row): DriverDocument[] {
  const short = row.id.replace('DRV-2026-', 'DRV-');
  const driver = DRIVER_DOCS.filter((d) => !row.missing?.includes(d.type)).map((d, i) => ({
    id: `${short}-D${i + 1}`,
    type: d.type,
    fileName: d.fileName,
    sizeLabel: d.sizeLabel,
    uploadedAt: row.submittedAt.split(' · ')[0],
    expiryDate: d.type === 'رخصة القيادة' ? (row.licenceExpiry ?? '9 مايو 2029') : undefined,
    decision: null,
    scope: 'driver' as const,
  }));
  const truck = TRUCK_DOCS.map((d, i) => ({
    id: `${short}-T${i + 1}`,
    type: d.type,
    fileName: d.fileName,
    sizeLabel: d.sizeLabel,
    uploadedAt: row.submittedAt.split(' · ')[0],
    expiryDate:
      d.type === 'استمارة الشاحنة'
        ? row.truck.registrationExpiry
        : d.type === 'وثيقة التأمين'
          ? row.truck.insuranceExpiry
          : undefined,
    decision: null,
    scope: 'truck' as const,
  }));
  return [...driver, ...truck];
}

function toTruck(row: Row): RequestTruck {
  return {
    id: row.truck.id,
    plateNumber: row.truck.plate,
    truckType: row.truck.type,
    modelName: row.truck.model,
    modelYear: row.truck.year,
    registrationExpiry: row.truck.registrationExpiry,
    insuranceExpiry: row.truck.insuranceExpiry,
    insurancePolicy: row.truck.policy,
    photos: PHOTOS,
  };
}

const ROWS: Row[] = [
  /* ---- Under Review: the queue ---- */
  {
    id: 'DRV-2026-0412', name: 'عبدالرحمن الزهراني', initial: 'ع', identityNumber: '1084472901',
    nationality: 'سعودي', mobile: '0555 412 8870', cargo: [0, 1, 4], carrierId: 'CAR-2026-011',
    status: 'Under Review', submittedAt: '24 يوليو 2026 · 06:12 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '24 يوليو 2026 · 06:10 ص',
    truck: { id: 'TRK-2026-0212', plate: '٧٧٤٢ ل م ن', type: 'شاحنة مسطحة', model: 'مرسيدس أكتروس', year: '2021', registrationExpiry: '14 مارس 2027', insuranceExpiry: '2 أغسطس 2026', policy: 'POL-884120' },
  },
  {
    id: 'DRV-2026-0411', name: 'مشعل الحربي', initial: 'م', identityNumber: '1092230118',
    nationality: 'سعودي', mobile: '0553 908 2214', cargo: [0, 2], carrierId: 'CAR-2026-014',
    status: 'Under Review', submittedAt: '24 يوليو 2026 · 05:41 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '24 يوليو 2026 · 05:38 ص',
    truck: { id: 'TRK-2026-0211', plate: '٢٢٩٠ ب ح د', type: 'شاحنة مبردة', model: 'فولفو FH', year: '2022', registrationExpiry: '30 نوفمبر 2027', insuranceExpiry: '19 يناير 2027', policy: 'POL-772305' },
  },
  {
    id: 'DRV-2026-0409', name: 'ياسر الشمري', initial: 'ي', identityNumber: '2410882375',
    nationality: 'سعودي', mobile: '0556 771 0043', cargo: [3, 4], carrierId: 'CAR-2026-018',
    status: 'Under Review', submittedAt: '23 يوليو 2026 · 08:20 م', licenceExpiry: '2 فبراير 2027',
    agreementVersion: 'v2.1', agreementAcceptedAt: '23 يوليو 2026 · 08:15 م',
    truck: { id: 'TRK-2026-0209', plate: '٣٣٤٨ ي س ر', type: 'صهريج', model: 'سكانيا R450', year: '2020', registrationExpiry: '9 أغسطس 2026', insuranceExpiry: '9 أغسطس 2026', policy: 'POL-660914' },
  },
  {
    id: 'DRV-2026-0408', name: 'محمد آل عمر', initial: 'م', identityNumber: '1077120945',
    nationality: 'سعودي', mobile: '0554 220 6612', cargo: [0], carrierId: 'CAR-2026-011',
    status: 'Under Review', submittedAt: '23 يوليو 2026 · 03:55 م', missing: ['جواز السفر'],
    agreementVersion: 'v2.1', agreementAcceptedAt: '23 يوليو 2026 · 03:50 م',
    truck: { id: 'TRK-2026-0208', plate: '١٥٠٧ م ح م', type: 'شاحنة جافة', model: 'مان TGX', year: '2019', registrationExpiry: '21 يونيو 2027', insuranceExpiry: '4 أبريل 2027', policy: 'POL-551208' },
  },
  {
    id: 'DRV-2026-0406', name: 'سلطان العمري', initial: 'س', identityNumber: '2288104477',
    nationality: 'يمني', mobile: '0558 330 1194', cargo: [0, 1], carrierId: 'CAR-2026-023',
    status: 'Under Review', submittedAt: '23 يوليو 2026 · 11:02 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '23 يوليو 2026 · 10:58 ص',
    truck: { id: 'TRK-2026-0206', plate: '٥٥١٢ س ع ط', type: 'شاحنة مسطحة', model: 'إيسوزو FVZ', year: '2021', registrationExpiry: '12 ديسمبر 2027', insuranceExpiry: '28 يوليو 2026', policy: 'POL-449017' },
  },
  {
    id: 'DRV-2026-0404', name: 'راشد المالكي', initial: 'ر', identityNumber: '1099887221',
    nationality: 'سعودي', mobile: '0551 664 7708', cargo: [2, 0], carrierId: 'CAR-2026-011',
    status: 'Under Review', submittedAt: '22 يوليو 2026 · 07:44 م',
    agreementVersion: 'v2.1', agreementAcceptedAt: '22 يوليو 2026 · 07:40 م',
    truck: { id: 'TRK-2026-0204', plate: '٦٢٠٩ ر ش د', type: 'شاحنة مبردة', model: 'مرسيدس أكتروس', year: '2023', registrationExpiry: '3 مايو 2028', insuranceExpiry: '15 سبتمبر 2027', policy: 'POL-338841' },
  },
  {
    id: 'DRV-2026-0403', name: 'حمد الرشيدي', initial: 'ح', identityNumber: '1066554213',
    nationality: 'سعودي', mobile: '0559 002 3341', cargo: [4, 5], carrierId: 'CAR-2026-014',
    status: 'Under Review', submittedAt: '22 يوليو 2026 · 02:18 م',
    agreementVersion: 'v2.1', agreementAcceptedAt: '22 يوليو 2026 · 02:12 م',
    truck: { id: 'TRK-2026-0203', plate: '٨٨٠١ ك ط ر', type: 'مقطورة منخفضة', model: 'فولفو FMX', year: '2020', registrationExpiry: '17 يناير 2027', insuranceExpiry: '6 يونيو 2027', policy: 'POL-227706' },
  },
  {
    id: 'DRV-2026-0401', name: 'إبراهيم الدوسري', initial: 'إ', identityNumber: '1033221876',
    nationality: 'سعودي', mobile: '0557 118 9925', cargo: [0, 1, 2], carrierId: 'CAR-2026-018',
    status: 'Under Review', submittedAt: '22 يوليو 2026 · 09:30 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '22 يوليو 2026 · 09:24 ص',
    truck: { id: 'TRK-2026-0201', plate: '٤٧١٣ إ ب ر', type: 'شاحنة جافة', model: 'هينو 700', year: '2022', registrationExpiry: '25 أكتوبر 2027', insuranceExpiry: '11 فبراير 2028', policy: 'POL-119425' },
  },
  {
    id: 'DRV-2026-0399', name: 'نايف السبيعي', initial: 'ن', identityNumber: '1055443091',
    nationality: 'سعودي', mobile: '0552 447 3360', cargo: [1, 4], carrierId: 'CAR-2026-027',
    status: 'Under Review', submittedAt: '21 يوليو 2026 · 06:05 م',
    agreementVersion: 'v2.1', agreementAcceptedAt: '21 يوليو 2026 · 06:01 م',
    truck: { id: 'TRK-2026-0199', plate: '١١٩٤ ن ي ف', type: 'شاحنة مسطحة', model: 'مان TGS', year: '2021', registrationExpiry: '8 يوليو 2027', insuranceExpiry: '30 يوليو 2026', policy: 'POL-908812' },
  },
  {
    id: 'DRV-2026-0397', name: 'زياد القرني', initial: 'ز', identityNumber: '2377012648',
    nationality: 'سوداني', mobile: '0556 889 4412', cargo: [0], carrierId: 'CAR-2026-023',
    status: 'Under Review', submittedAt: '21 يوليو 2026 · 12:40 م', missing: ['صورة السائق'],
    agreementVersion: 'v2.1', agreementAcceptedAt: '21 يوليو 2026 · 12:36 م',
    truck: { id: 'TRK-2026-0197', plate: '٢٠٦٦ ز ي د', type: 'شاحنة جافة', model: 'إيسوزو NPR', year: '2018', registrationExpiry: '2 يوليو 2026', insuranceExpiry: '14 مارس 2027', policy: 'POL-770213' },
  },
  {
    id: 'DRV-2026-0395', name: 'وليد البقمي', initial: 'و', identityNumber: '1044120553',
    nationality: 'سعودي', mobile: '0550 227 8834', cargo: [0, 3], carrierId: 'CAR-2026-014',
    status: 'Under Review', submittedAt: '21 يوليو 2026 · 08:12 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '21 يوليو 2026 · 08:08 ص',
    truck: { id: 'TRK-2026-0195', plate: '٦٦٣٠ و ل د', type: 'صهريج', model: 'سكانيا G460', year: '2022', registrationExpiry: '19 أبريل 2028', insuranceExpiry: '27 نوفمبر 2027', policy: 'POL-664402' },
  },
  {
    id: 'DRV-2026-0392', name: 'عادل الجهني', initial: 'ع', identityNumber: '1088776540',
    nationality: 'سعودي', mobile: '0555 664 2201', cargo: [1, 0], carrierId: 'CAR-2026-018',
    status: 'Under Review', submittedAt: '20 يوليو 2026 · 05:22 م',
    agreementVersion: 'v2.1', agreementAcceptedAt: '20 يوليو 2026 · 05:18 م',
    truck: { id: 'TRK-2026-0192', plate: '٩٣٤١ ع د ل', type: 'شاحنة مسطحة', model: 'فولفو FH', year: '2019', registrationExpiry: '6 سبتمبر 2027', insuranceExpiry: '23 مايو 2027', policy: 'POL-553390' },
  },

  /* ---- Already decided — these populate the other tabs ---- */
  {
    id: 'DRV-2026-0388', name: 'خالد ناصر', initial: 'خ', identityNumber: '1022114478',
    nationality: 'سعودي', mobile: '0554 118 2260', cargo: [4, 0], carrierId: 'CAR-2026-011',
    status: 'Approved', submittedAt: '12 يوليو 2026 · 10:04 ص',
    agreementVersion: 'v2.1', agreementAcceptedAt: '12 يوليو 2026 · 10:00 ص',
    truck: { id: 'TRK-2026-0170', plate: '٤٢٨١ ر ن ب', type: 'شاحنة مسطحة', model: 'مرسيدس أروكس', year: '2022', registrationExpiry: '11 يناير 2028', insuranceExpiry: '4 أكتوبر 2027', policy: 'POL-101477' },
  },
  {
    id: 'DRV-2026-0386', name: 'عبدالله الغامدي', initial: 'ع', identityNumber: '1011009922',
    nationality: 'سعودي', mobile: '0553 220 7741', cargo: [1, 0], carrierId: 'CAR-2026-014',
    status: 'Approved', submittedAt: '9 يوليو 2026 · 02:31 م',
    agreementVersion: 'v2.0', agreementAcceptedAt: '9 يوليو 2026 · 02:28 م',
    truck: { id: 'TRK-2026-0166', plate: '٣٣٠٧ ع ب د', type: 'شاحنة جافة', model: 'مان TGX', year: '2021', registrationExpiry: '28 فبراير 2028', insuranceExpiry: '16 ديسمبر 2027', policy: 'POL-220913' },
  },
  {
    id: 'DRV-2026-0384', name: 'سعد المطيري', initial: 'س', identityNumber: '1077665511',
    nationality: 'سعودي', mobile: '0559 447 1120', cargo: [0, 3], carrierId: 'CAR-2026-023',
    status: 'Approved', submittedAt: '5 يوليو 2026 · 08:15 ص',
    agreementVersion: 'v2.0', agreementAcceptedAt: '5 يوليو 2026 · 08:11 ص',
    truck: { id: 'TRK-2026-0161', plate: '٩٩٢٠ س ع د', type: 'صهريج', model: 'سكانيا R500', year: '2020', registrationExpiry: '14 يوليو 2027', insuranceExpiry: '3 مارس 2028', policy: 'POL-447701' },
  },
  {
    id: 'DRV-2026-0380', name: 'فهد العتيبي', initial: 'ف', identityNumber: '1090012234',
    nationality: 'سعودي', mobile: '0551 003 8876', cargo: [0], carrierId: 'CAR-2026-027',
    status: 'Rejected', submittedAt: '3 يوليو 2026 · 04:40 م',
    agreementVersion: 'v2.0', agreementAcceptedAt: '3 يوليو 2026 · 04:36 م',
    decisionReason: 'رخصة القيادة منتهية الصلاحية ولا تغطي فئة المركبة المطلوبة.',
    truck: { id: 'TRK-2026-0157', plate: '٧١٢٤ ف ه د', type: 'شاحنة جافة', model: 'هينو 500', year: '2017', registrationExpiry: '30 يونيو 2026', insuranceExpiry: '30 يونيو 2026', policy: 'POL-330128' },
  },
  {
    id: 'DRV-2026-0377', name: 'بدر الشهراني', initial: 'ب', identityNumber: '1066001199',
    nationality: 'سعودي', mobile: '0558 990 2213', cargo: [0, 1], carrierId: 'CAR-2026-018',
    status: 'Suspended', submittedAt: '28 يونيو 2026 · 11:20 ص',
    agreementVersion: 'v2.0', agreementAcceptedAt: '28 يونيو 2026 · 11:15 ص',
    decisionReason: 'إيقاف مؤقت بعد ثلاثة بلاغات تأخير متتالية — قيد مراجعة فريق التشغيل.',
    truck: { id: 'TRK-2026-0150', plate: '٤٤١٠ ب د ر', type: 'شاحنة مسطحة', model: 'فولفو FM', year: '2019', registrationExpiry: '9 نوفمبر 2027', insuranceExpiry: '21 أغسطس 2027', policy: 'POL-118804' },
  },
  {
    id: 'DRV-2026-0374', name: 'ماجد العنزي', initial: 'م', identityNumber: '1033998877',
    nationality: 'سعودي', mobile: '0555 210 4471', cargo: [0, 4], carrierId: 'CAR-2026-011',
    status: 'Documents Expired', submittedAt: '20 يونيو 2026 · 09:00 ص',
    agreementVersion: 'v2.0', agreementAcceptedAt: '20 يونيو 2026 · 08:55 ص',
    decisionReason: 'انتهت صلاحية الهوية الوطنية بتاريخ 12 يوليو 2026.',
    truck: { id: 'TRK-2026-0144', plate: '٧٧٠٢ م ج د', type: 'مقطورة منخفضة', model: 'مان TGS', year: '2018', registrationExpiry: '5 مايو 2027', insuranceExpiry: '12 يوليو 2026', policy: 'POL-009923' },
  },
];

export const DRIVERS: Driver[] = ROWS.map((row) => ({
  id: row.id,
  name: row.name,
  initial: row.initial,
  identityNumber: row.identityNumber,
  nationality: row.nationality,
  mobile: row.mobile,
  acceptedCargoTypes: row.cargo.map((i) => CARGO[i]),
  documents: buildDocs(row),
  status: row.status,
  submittedAt: row.submittedAt,
  agreementVersion: row.agreementVersion,
  agreementAcceptedAt: row.agreementAcceptedAt,
  decisionReason: row.decisionReason,
  carrierId: row.carrierId,
  carrierName: CARRIER_BY_ID[row.carrierId]?.name ?? row.carrierId,
  truck: toTruck(row),
}));

export { CARGO as DRIVER_CARGO_TYPES };
