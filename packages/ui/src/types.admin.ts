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
  /** الهوية / رخصة القيادة / الاستمارة / وثيقة التأمين */
  type: string;
  fileName: string;
  sizeLabel: string;
  uploadedAt: string;
  expiryDate?: string;
  decision?: 'approved' | 'rejected' | null;
  /**
   * Which half of the request the document belongs to. Driver and truck papers
   * arrive together and are decided together, but a reviewer still needs to see
   * them grouped — a licence and a registration are read for different reasons.
   */
  scope: 'driver' | 'truck';
}

/**
 * The truck submitted with a registration request.
 *
 * Deliberately NOT a separately-approvable entity. A driver registers with a
 * truck and its papers; approving the two apart invents a state — approved
 * driver, pending truck — that means nothing operationally and that no screen
 * could act on.
 */
export interface RequestTruck {
  /** e.g. `TRK-2026-0188`. */
  id: string;
  plateNumber: string;
  truckType: string;
  modelName: string;
  modelYear: string;
  /** الاستمارة */
  registrationExpiry: string;
  /** وثيقة التأمين */
  insuranceExpiry: string;
  insurancePolicy: string;
  /** Captions for the 4-plate photo grid — see DocumentViewer/PhotoGrid. */
  photos: string[];
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
  /** The transport company the driver works for. Dues settle to it, not to him. */
  carrierId: string;
  carrierName: string;
  /** Submitted as part of the same request; decided with it. */
  truck: RequestTruck;
}

/* ==========================================================================
   M04-E11 — Carriers (شركات النقل) and what the platform owes them
   ========================================================================== */

export interface CarrierCompany {
  /** e.g. `CAR-2026-014`. */
  id: string;
  name: string;
  initial: string;
  commercialRegistration: string;
  city: string;
  contactName: string;
  mobile: string;
  /** Masked IBAN, e.g. "SA** •••• 4471". */
  bankAccount: string;
  driverCount: number;
  joinedAt: string;
}

/** One completed, not-yet-settled trip inside a carrier's dues. */
export interface CarrierTripDue {
  shipmentId: string;
  route: string;
  driverName: string;
  completedAt: string;
  /** What the customer paid for the trip. */
  tripValue: string;
  /** Platform commission + fees, deducted. */
  platformFee: string;
  /**
   * Approved penalties only. BR-012: a penalty has no financial effect until an
   * admin approves it, so a `Pending Review` penalty must never reach this line.
   */
  penalties: string;
  /** tripValue − platformFee − penalties. */
  net: string;
}

export type CarrierDueStatus = 'قيد المراجعة' | 'جاهز للصرف' | 'تم الصرف';

export interface CarrierDues {
  carrierId: string;
  carrierName: string;
  initial: string;
  /** عدد الرحلات المكتملة غير المسوّاة */
  unsettledTrips: number;
  /** Sum of `trips[].net`. Derived, never typed in — see the carrier-dues screen. */
  totalDue: string;
  status: CarrierDueStatus;
  updatedAt: string;
  bankAccount: string;
  paidAt?: string;
  trips: CarrierTripDue[];
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
   M04-E10 — العمليات المالية

   One flat operations log rather than the payments + double-entry ledger split
   the SRS describes. The ledger view answered a question nobody in this portal
   was asking: an operator wants to see money moving, by type, against a trip or
   a company. Both sides of every entry are still implied by `type` +
   `direction` — a capture credits the platform, a payout debits it.
   ========================================================================== */

export type FinancialOperationType =
  | 'دفعة عميل'
  | 'استرداد'
  | 'عمولة المنصة'
  | 'رسوم'
  | 'غرامة معتمدة'
  | 'صرف مستحقات';

export type FinancialOperationStatus = 'مكتملة' | 'قيد التنفيذ' | 'فاشلة' | 'مستردة';

export interface FinancialOperation {
  /** e.g. `FIN-2026-04412`. */
  id: string;
  type: FinancialOperationType;
  /** The trip this belongs to, when there is one. */
  shipmentId?: string;
  /** الرحلة أو الشركة المرتبطة — whichever names the counterparty. */
  partyName: string;
  /** Formatted, e.g. "3,850.00". */
  amount: string;
  /** Into the platform or out of it. Drives the sign and the tone. */
  direction: 'credit' | 'debit';
  status: FinancialOperationStatus;
  /** Gateway or settlement reference, when the operation has one. */
  reference?: string;
  createdAt: string;
  method?: string;
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
   M04-E15 — Notification dispatch log
   ========================================================================== */

export type DispatchStatus = 'أُرسل' | 'جارٍ الإرسال' | 'فشل جزئي' | 'فشل';

export interface NotificationDispatch {
  /** e.g. `NTF-2026-0318`. */
  id: string;
  /** The template/event this went out under. */
  event: string;
  audience: string;
  channels: string[];
  /** How many recipients it reached. */
  recipients: number;
  status: DispatchStatus;
  sentAt: string;
  /** Set when the send was triggered by an operator rather than by an event. */
  sentBy?: string;
}

/* ==========================================================================
   M04-E01 — Operational updates feed

   Read-only by construction. The home page reports what changed; the queues own
   the decisions. An update carries a destination, never an action — see
   docs/design-system/10-admin-portal-guide.md.
   ========================================================================== */

export type OperationalUpdateKind = 'رحلة' | 'طلب اعتماد' | 'غرامة';

export interface OperationalUpdate {
  id: string;
  kind: OperationalUpdateKind;
  /** `LW-2026-002960` / `DRV-2026-0412` / `PEN-2026-0061`. Rendered LTR. */
  reference: string;
  title: string;
  /** Current state, in the glossary's Arabic. */
  status: string;
  /** Display timestamp, and the sort key. */
  at: string;
  /** Minutes since the session clock — the actual sort key. */
  ageMinutes: number;
  /** Where فتح التفاصيل goes. */
  href: string;
}
