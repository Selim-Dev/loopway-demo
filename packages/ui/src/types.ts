/**
 * Domain types.
 *
 * Field names follow the SRS data dictionary (§12) so these shapes can be
 * pointed at a real API later without renaming. Where the Claude Design source
 * introduced a concept the SRS does not have (wallet, subscription plan cap,
 * live waybill), it is marked `@designOriginated`.
 */

import type { Tone } from './tokens';

/** Local vs cross-border. Drives the النطاق tag and permit requirements. */
export type TripScope = 'محلية' | 'دولية';

/** Which tab of رحلاتي a trip belongs to. */
export type TripBucket = 'current' | 'offers' | 'history';

/**
 * The five load states every list surface must implement. `limit` is
 * @designOriginated — it reflects the subscription plan cap.
 */
export type ViewState = 'default' | 'empty' | 'loading' | 'error' | 'limit' | 'noresults';

/** Action button emphasis on a trip row. */
export type ActionKind = 'primary' | 'secondary';

export interface Trip {
  /** Reference code, e.g. `LW-2026-002960`. Always rendered LTR. */
  id: string;
  from: string;
  to: string;
  scope: TripScope;
  /** "معدات ثقيلة • 30 طن" — description • weight, joined by a bullet. */
  cargo: string;
  pickupDate: string;
  /** Short status, used by the filter dropdown. */
  status: string;
  /** Long-form stage sentence, shown inside the stage chip. */
  stage: string;
  /** 0–100. */
  progress: number;
  /** Driver name, or an offer count like "5 عروض". */
  who: string;
  whoSub: string;
  /** True when `who` is a driver; false when it is an offer count. */
  driver: boolean;
  /**
   * Seconds already elapsed at page load. The UI adds a live 1s tick on top —
   * only meaningful when `live` is true.
   */
  baseElapsed?: number;
  action: string;
  kind: ActionKind;
  /** Currently moving: shows a spinner and a running HH:MM:SS timer. */
  live: boolean;
  tone: Tone;
}

/** A trip as it appears on the calendar: day-of-month span, not timestamps. */
export interface CalendarTrip {
  id: string;
  from: string;
  to: string;
  /** Day of month, 1-based. */
  start: number;
  /** Day of month, 1-based, inclusive. */
  end: number;
  status: 'active' | 'scheduled';
  cargo: string;
  driver: string;
}

/** @designOriginated — the SRS has payments but no wallet top-up/withdrawal. */
export type TransactionType = 'payment' | 'topup' | 'withdraw';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  /** e.g. `TXN-2026-01923`. Always rendered LTR. */
  id: string;
  type: TransactionType;
  /** Present on `payment` rows only. */
  shipmentId?: string;
  from?: string;
  to?: string;
  cargo?: string;
  date: string;
  time: string;
  method: string;
  /** Formatted with thousands separators, e.g. "1,240". */
  amount: string;
  /** Pre-VAT amount — payments only. */
  subtotal?: string;
  /** VAT at 15% — payments only. */
  vat?: string;
  status: TransactionStatus;
  /** Explanatory line shown on pending/failed rows. */
  note?: string;
}

export interface CompanyAccount {
  companyName: string;
  /** e.g. `LW-CO-4821`. Always rendered LTR. */
  accountId: string;
  /** Single Arabic letter shown in the avatar tile. */
  initial: string;
  commercialRegistration: string;
  vatNumber: string;
  nationalAddress: string;
  authorizedContact: string;
  /** @designOriginated — subscription plan. */
  planName: string;
  /** @designOriginated — max simultaneously-active trips. */
  maxConcurrent: number;
}

export interface Wallet {
  available: string;
  onHold: string;
  pending: string;
}

export type NotificationKind = 'offer' | 'payment' | 'status' | 'document' | 'support';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tripId?: string;
}

export interface SavedLocation {
  id: string;
  label: string;
  country: string;
  city: string;
  address: string;
  isPort: boolean;
  portName?: string;
  permitRequired: boolean;
  supervisorName?: string;
  supervisorPhone?: string;
}

export interface Broker {
  id: string;
  name: string;
  country: string;
  portOrBorder: string;
  whatsappNumber: string;
  authorizationNumber: string;
  expiryDate: string;
  notes?: string;
}

export type DocumentStatus =
  | 'Required Now'
  | 'Required Later'
  | 'Uploaded'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Expired'
  | 'Archived';

export interface ArchivedDocument {
  id: string;
  /** بوليصة / إثبات تسليم / فاتورة / تصريح … */
  documentType: string;
  tripId?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  expiryDate?: string;
  sizeLabel: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  location?: string;
  actor?: string;
  note?: string;
  state: 'done' | 'active' | 'upcoming';
}

export interface Offer {
  id: string;
  driverName: string;
  driverInitial: string;
  rating: number;
  trips: number;
  truckType: string;
  /** Formatted price, e.g. "3,850". Never a system estimate — see BR-001. */
  price: string;
  eta: string;
  status: 'Submitted' | 'Viewed' | 'Selected' | 'Expired' | 'Rejected';
}

export interface SupportCase {
  id: string;
  type: string;
  tripId?: string;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  status: 'مفتوحة' | 'قيد المعالجة' | 'مغلقة';
  openedAt: string;
  description: string;
}
