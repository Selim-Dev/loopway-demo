/**
 * Admin-portal domain types (SRS module M04).
 *
 * Same contract as `types.ts`: field names follow the SRS §12 data dictionary
 * so the shapes can be pointed at a real API later without renaming, and every
 * status union is the SRS §7 state set verbatim — not a convenient subset.
 * Arabic labels for these states live in docs/design-system/08-glossary-ar.md;
 * do not coin new ones here.
 */

/* ==========================================================================
   M04-E03 — Drivers
   ========================================================================== */

/** SRS §7 → السائق. */
export type DriverStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Needs More Info'
  | 'Suspended'
  | 'Documents Expired';

export interface DriverDocument {
  id: string;
  /** الهوية / جواز السفر / رخصة القيادة / صورة السائق */
  type: string;
  fileName: string;
  sizeLabel: string;
  uploadedAt: string;
  expiryDate?: string;
  decision?: 'approved' | 'rejected' | null;
}

export interface Driver {
  /** e.g. `DRV-2026-0412`. Always LTR. */
  id: string;
  name: string;
  initial: string;
  identityNumber: string;
  nationality: string;
  mobile: string;
  secondaryMobile?: string;
  /** أنواع الشحنات التي يقبلها السائق. */
  acceptedCargoTypes: string[];
  documents: DriverDocument[];
  status: DriverStatus;
  submittedAt: string;
  /** Version of اتفاقية التزام السائق the driver accepted, + when. */
  agreementVersion: string;
  agreementAcceptedAt: string;
  /** Set when rejected or sent back — surfaced to the driver and the audit log. */
  decisionReason?: string;
  /** Plate of the truck submitted alongside, when there is one. */
  truckPlate?: string;
}

/* ==========================================================================
   M04-E04 — Trucks
   ========================================================================== */

/** SRS §7 → الشاحنة. */
export type TruckStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Needs Update'
  | 'Insurance Expired'
  | 'Registration Expired'
  | 'Suspended';

export interface Truck {
  /** e.g. `TRK-2026-0188`. */
  id: string;
  plateNumber: string;
  truckType: string;
  modelName: string;
  modelYear: string;
  driverName: string;
  driverId: string;
  /** الاستمارة */
  registrationExpiry: string;
  /** وثيقة التأمين */
  insuranceExpiry: string;
  insurancePolicy: string;
  /** Captions for the 4-plate photo grid. */
  photos: string[];
  status: TruckStatus;
  submittedAt: string;
  decisionReason?: string;
}

/* ==========================================================================
   M04-E05 — Customers
   ========================================================================== */

export type AccountStatus = 'Active' | 'Pending Review' | 'Suspended' | 'Documents Expired';

export interface IndividualCustomer {
  id: string;
  name: string;
  initial: string;
  mobile: string;
  city: string;
  status: AccountStatus;
  joinedAt: string;
  shipmentCount: number;
  /** Formatted total spend, e.g. "18,400". */
  totalSpend: string;
  openCases: number;
}

export interface CompanyCustomer {
  id: string;
  companyName: string;
  initial: string;
  commercialRegistration: string;
  vatNumber: string;
  authorizedContact: string;
  mobile: string;
  city: string;
  status: AccountStatus;
  joinedAt: string;
  shipmentCount: number;
  totalSpend: string;
  planName: string;
  openCases: number;
}

/* ==========================================================================
   M04-E06 — Document review queue
   ========================================================================== */

export type DocumentEntityType = 'driver' | 'truck' | 'company' | 'customer' | 'shipment';

/**
 * SRS §13.3: a permit is either Blocking (stops the trip) or Warning
 * (surfaced but not blocking). The distinction drives the badge in the queue.
 */
export type PermitRule = 'blocking' | 'warning' | 'none';

export interface ReviewDocument {
  id: string;
  documentType: string;
  /** وثيقة / تصريح / إثبات / مستند مولد — SRS §13.3 categories. */
  category: 'وثيقة' | 'تصريح' | 'إثبات' | 'مستند مولد';
  entityType: DocumentEntityType;
  entityName: string;
  entityId: string;
  shipmentId?: string;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  sizeLabel: string;
  rule: PermitRule;
  status: 'Under Review' | 'Approved' | 'Rejected' | 'Expired' | 'Uploaded';
  decisionReason?: string;
}

/* ==========================================================================
   M04-E12 — Penalties
   ========================================================================== */

/** SRS §7 → الغرامة. */
export type PenaltyStatus =
  | 'Potential'
  | 'Awaiting Reason'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Adjusted'
  | 'Applied'
  | 'Disputed';

/** SRS §13.2 — the four penalty triggers. */
export type PenaltyType =
  | 'إلغاء بعد التحرك'
  | 'انتظار التحميل'
  | 'تأخير الجمارك'
  | 'انتظار التفريغ';

export interface Penalty {
  /** e.g. `PEN-2026-0067`. */
  id: string;
  type: PenaltyType;
  shipmentId: string;
  route: string;
  /** العميل / السائق — who the penalty falls on. */
  responsibleParty: 'العميل' | 'السائق';
  responsibleName: string;
  /** What the engine measured, e.g. "تجاوز حد الانتظار بـ 2:40 ساعة". */
  trigger: string;
  /** Suggested by the penalty engine. Never charged until approved — BR-012. */
  proposedAmount: string;
  /** Set once an admin edits the figure. */
  adjustedAmount?: string;
  status: PenaltyStatus;
  raisedAt: string;
  evidence: string[];
  decisionReason?: string;
}

/* ==========================================================================
   M04-E10 — Payments & Ledger
   ========================================================================== */

export type LedgerEntryType =
  | 'Wallet Top-up'
  | 'Authorization'
  | 'Capture'
  | 'Fee'
  | 'Commission'
  | 'Tax'
  | 'Penalty Hold'
  | 'Refund'
  | 'Split'
  | 'Payout'
  | 'Adjustment';

/**
 * Double-entry. `debitParty` and `creditParty` are both required — a
 * single-sided view would misrepresent the ledger.
 */
export interface LedgerEntry {
  /** e.g. `LED-2026-11840`. */
  id: string;
  type: LedgerEntryType;
  shipmentId?: string;
  debitParty: string;
  creditParty: string;
  /** Formatted, e.g. "3,850.00". */
  amount: string;
  currency: 'SAR';
  status: 'Posted' | 'Pending' | 'Reversed';
  reference: string;
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  shipmentId?: string;
  payerName: string;
  payerType: 'فرد' | 'شركة';
  method: string;
  amount: string;
  subtotal?: string;
  vat?: string;
  /** SRS §13.1 payment state matrix. */
  status: 'Pending' | 'Authorized' | 'Captured' | 'Failed' | 'Expired' | 'Refunded';
  gatewayReference: string;
  date: string;
  time: string;
  note?: string;
}

/* ==========================================================================
   M04-E11 — Payouts
   ========================================================================== */

export type PayoutStatus =
  | 'Pending Settlement'
  | 'Ready for Payout'
  | 'Payout Pending'
  | 'Paid Out'
  | 'Failed'
  | 'On Hold';

export interface Payout {
  /** e.g. `PO-2026-0331`. */
  id: string;
  driverName: string;
  driverId: string;
  driverInitial: string;
  /** Trip IDs rolled into this payout. */
  shipmentIds: string[];
  /** Gross earnings before deductions. */
  grossAmount: string;
  /** Penalty holds and platform deductions. */
  deductions: string;
  netAmount: string;
  /** Masked IBAN, e.g. "SA** •••• 4471". */
  bankAccount: string;
  status: PayoutStatus;
  settledAt: string;
  paidAt?: string;
  failureReason?: string;
}

/* ==========================================================================
   M04-E16 — Audit log
   ========================================================================== */

export type AuditAction =
  | 'اعتماد'
  | 'رفض'
  | 'طلب معلومات إضافية'
  | 'تعديل مبلغ'
  | 'تحويل مستحقات'
  | 'تغيير إعداد'
  | 'إغلاق بلاغ'
  | 'تصعيد بلاغ'
  | 'إيقاف حساب';

export interface AuditEntry {
  /** e.g. `AUD-2026-90412`. */
  id: string;
  actor: string;
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityLabel: string;
  /** ISO-ish display string, e.g. "24 يوليو 2026 · 09:14 ص". */
  timestamp: string;
  /** Before/after pairs for the diff view. Empty for pure approvals. */
  changes?: { field: string; before: string; after: string }[];
  reason?: string;
}

/* ==========================================================================
   M04-E07 — Geography
   ========================================================================== */

export interface Port {
  id: string;
  name: string;
  cityId: string;
  /** Drives the "هل يحتاج تصريح" branch when a trip is created. */
  requiresPermit: boolean;
  instructions?: string;
  active: boolean;
}

export interface City {
  id: string;
  name: string;
  countryId: string;
  active: boolean;
}

export interface Country {
  id: string;
  name: string;
  /** ISO-2, rendered LTR. */
  code: string;
  active: boolean;
  /** True when the platform operates domestically here vs cross-border only. */
  domestic: boolean;
}

/* ==========================================================================
   M04-E08 — Catalog
   ========================================================================== */

export interface CargoType {
  id: string;
  name: string;
  requiresTemperature: boolean;
  dangerousGoods: boolean;
  specialHandling: boolean;
  oversized: boolean;
  active: boolean;
}

export interface TruckTypeDef {
  id: string;
  name: string;
  /** "حتى 40 طن · 13.6 م" */
  capacityNote: string;
  active: boolean;
}

/* ==========================================================================
   M04-E09 — Pricing
   ========================================================================== */

export interface PricingSettings {
  /** Flat platform fee in SAR. */
  platformFee: string;
  /** Percent, e.g. "12". */
  commissionPercent: string;
  /** Percent, e.g. "15". */
  vatPercent: string;
  /** Percent charged by the gateway. */
  paymentFeePercent: string;
  minimumTripValue: string;
  maximumTripValue: string;
  /** Per-country overrides of the above. */
  countryOverrides: {
    countryId: string;
    countryName: string;
    commissionPercent: string;
    vatPercent: string;
  }[];
}

/* ==========================================================================
   M04-E15 — Notification templates
   ========================================================================== */

export type TemplateEvent =
  | 'وصول عرض جديد'
  | 'اختيار السائق'
  | 'تأكيد الدفع'
  | 'فشل الدفع'
  | 'تغيّر حالة الرحلة'
  | 'وثيقة مطلوبة'
  | 'تصريح على وشك الانتهاء'
  | 'إثبات التسليم'
  | 'غرامة قيد المراجعة'
  | 'تحويل مستحقات';

export interface NotificationTemplate {
  id: string;
  event: TemplateEvent;
  /** Who receives it. */
  audience: 'العميل' | 'السائق' | 'الشركة' | 'الإدارة';
  title: string;
  body: string;
  channels: { push: boolean; inApp: boolean; sms: boolean };
  /** Placeholder tokens available to this template, e.g. `{{tripId}}`. */
  variables: string[];
  active: boolean;
}

/* ==========================================================================
   M04-E02 — Admin shipment view
   ========================================================================== */

export interface AdminShipment {
  id: string;
  customerName: string;
  customerType: 'فرد' | 'شركة';
  driverName?: string;
  from: string;
  to: string;
  scope: 'محلية' | 'دولية';
  cargo: string;
  /** The customer-facing status label, from the glossary. */
  status: string;
  /** SRS §13.1 payment state. */
  paymentStatus: 'Pending' | 'Authorized' | 'Captured' | 'Failed' | 'Refunded';
  documentsComplete: boolean;
  hasPenalty: boolean;
  hasOpenCase: boolean;
  pickupDate: string;
  /** Total charged, formatted. */
  amount: string;
}

/* ==========================================================================
   M04-E13 — Support (admin view)
   ========================================================================== */

export interface SupportMessage {
  id: string;
  author: string;
  role: 'العميل' | 'السائق' | 'الإدارة';
  body: string;
  at: string;
}

export interface AdminSupportCase {
  id: string;
  type: string;
  shipmentId?: string;
  reporter: string;
  reporterRole: 'العميل' | 'السائق' | 'الشركة';
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  status: 'مفتوحة' | 'قيد المعالجة' | 'مغلقة';
  openedAt: string;
  /** "3 أيام" — how long it has been open. */
  age: string;
  description: string;
  messages: SupportMessage[];
  attachments: string[];
  /** M04-E13-F02: the alternative-POD path when normal delivery proof failed. */
  needsAlternativePod: boolean;
  resolution?: string;
}
