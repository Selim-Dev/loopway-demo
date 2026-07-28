'use client';

import * as React from 'react';
import type {
  AuditAction,
  AuditEntry,
  CarrierDues,
  Driver,
  NotificationDispatch,
  NotificationTemplate,
  Penalty,
  PricingSettings,
} from '@loopway/ui';
import { DRIVERS } from '@/mocks/drivers';
import { PENALTIES } from '@/mocks/penalties';
import { CARRIER_DUES } from '@/mocks/finance';
import { SEED_AUDIT } from '@/mocks/operations';
import { DISPATCHES, PRICING, TEMPLATES } from '@/mocks/settings';

/**
 * In-session admin state.
 *
 * Holds a mutable copy of the fixtures so a decision actually lands: approving
 * a driver removes them from the queue, drops the sidebar badge, and appends an
 * `AuditEntry` — which is what makes /audit fill up from the session's own
 * activity rather than sitting on static rows.
 *
 * SRS BR-015 is the reason every mutating action writes an audit entry. It is
 * not a nice-to-have here; it is the requirement.
 *
 * State resets on reload. There is no backend, no persistence, no fetch.
 */

interface AdminState {
  drivers: Driver[];
  penalties: Penalty[];
  carrierDues: CarrierDues[];
  templates: NotificationTemplate[];
  dispatches: NotificationDispatch[];
  pricing: PricingSettings;
  audit: AuditEntry[];
}

type Action =
  /** One decision for the whole registration request — driver, truck and papers. */
  | { type: 'driver/decide'; id: string; decision: 'Approved' | 'Rejected' | 'Needs More Info' | 'Suspended'; reason?: string }
  | { type: 'driverDoc/decide'; driverId: string; docId: string; decision: 'approved' | 'rejected' }
  | { type: 'penalty/decide'; id: string; decision: 'Approved' | 'Rejected' | 'Adjusted'; amount?: string; reason?: string }
  | { type: 'dues/pay'; carrierId: string }
  | { type: 'pricing/update'; next: PricingSettings }
  | { type: 'template/update'; next: NotificationTemplate }
  | { type: 'notification/send'; dispatch: NotificationDispatch };

/**
 * The signed-in operator. Exported so the header and the account screen show
 * the same identity the audit entries are filed under — three copies of the
 * same name is how they drift apart.
 */
export const ACTOR = {
  name: 'فريق التشغيل',
  id: 'LW-ADM-0001',
  initial: 'ت',
  role: 'مسؤول تشغيل',
  email: 'ops@loopway.sa',
  phone: '0555 000 1001',
  joinedAt: '3 فبراير 2026',
};

/**
 * Timestamps are derived from a fixed session clock rather than `Date.now()`.
 * The fixtures live in July 2026, so a real clock would file today's decision
 * two months before every seeded entry and the log would read backwards.
 */
const SESSION_DATE = '24 يوليو 2026';
let auditSeq = 90500;

function audit(
  action: AuditAction,
  entityType: string,
  entityId: string,
  entityLabel: string,
  extra: Partial<AuditEntry> = {},
): AuditEntry {
  auditSeq += 1;
  const minute = String(auditSeq % 60).padStart(2, '0');
  return {
    id: `AUD-2026-${auditSeq}`,
    actor: ACTOR.name,
    actorId: ACTOR.id,
    action,
    entityType,
    entityId,
    entityLabel,
    timestamp: `${SESSION_DATE} · 10:${minute} ص`,
    ...extra,
  };
}

const DRIVER_AUDIT_ACTION: Record<string, AuditAction> = {
  Approved: 'اعتماد',
  Rejected: 'رفض',
  'Needs More Info': 'طلب معلومات إضافية',
  Suspended: 'إيقاف حساب',
};

const STATUS_AR: Record<string, string> = {
  Approved: 'معتمد',
  Rejected: 'مرفوض',
  'Needs More Info': 'بحاجة معلومات إضافية',
  Suspended: 'موقوف',
  'Needs Update': 'يحتاج تحديث',
  'Under Review': 'قيد المراجعة',
  'Pending Review': 'قيد المراجعة',
};

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case 'driver/decide': {
      const driver = state.drivers.find((d) => d.id === action.id);
      if (!driver) return state;
      return {
        ...state,
        drivers: state.drivers.map((d) =>
          d.id === action.id ? { ...d, status: action.decision, decisionReason: action.reason } : d,
        ),
        audit: [
          audit(DRIVER_AUDIT_ACTION[action.decision], 'سائق', driver.id, driver.name, {
            changes: [{ field: 'الحالة', before: STATUS_AR[driver.status] ?? driver.status, after: STATUS_AR[action.decision] }],
            reason: action.reason,
          }),
          ...state.audit,
        ],
      };
    }

    case 'driverDoc/decide':
      return {
        ...state,
        drivers: state.drivers.map((d) =>
          d.id === action.driverId
            ? {
                ...d,
                documents: d.documents.map((doc) =>
                  doc.id === action.docId ? { ...doc, decision: action.decision } : doc,
                ),
              }
            : d,
        ),
      };

    case 'penalty/decide': {
      const pen = state.penalties.find((p) => p.id === action.id);
      if (!pen) return state;
      const changes =
        action.decision === 'Adjusted' && action.amount
          ? [{ field: 'المبلغ', before: `${pen.proposedAmount} ر.س`, after: `${action.amount} ر.س` }]
          : [{ field: 'الحالة', before: 'قيد المراجعة', after: action.decision === 'Approved' ? 'معتمدة' : 'مرفوضة' }];
      return {
        ...state,
        penalties: state.penalties.map((p) =>
          p.id === action.id
            ? { ...p, status: action.decision, adjustedAmount: action.amount ?? p.adjustedAmount, decisionReason: action.reason }
            : p,
        ),
        audit: [
          audit(
            action.decision === 'Adjusted' ? 'تعديل مبلغ' : action.decision === 'Approved' ? 'اعتماد' : 'رفض',
            'غرامة',
            pen.id,
            `${pen.type} — ${pen.shipmentId}`,
            { changes, reason: action.reason },
          ),
          ...state.audit,
        ],
      };
    }

    case 'dues/pay': {
      const dues = state.carrierDues.find((d) => d.carrierId === action.carrierId);
      if (!dues) return state;
      return {
        ...state,
        carrierDues: state.carrierDues.map((d) =>
          d.carrierId === action.carrierId
            ? { ...d, status: 'تم الصرف' as const, paidAt: SESSION_DATE, updatedAt: `${SESSION_DATE} · 10:00 ص` }
            : d,
        ),
        audit: [
          audit('تحويل مستحقات', 'مستحقات شركة', dues.carrierId, `${dues.carrierName} — ${dues.totalDue} ر.س`, {
            changes: [{ field: 'الحالة', before: dues.status, after: 'تم الصرف' }],
          }),
          ...state.audit,
        ],
      };
    }

    case 'pricing/update': {
      const before = state.pricing;
      const next = action.next;
      const changes = (
        [
          ['رسوم المنصة', 'platformFee'],
          ['العمولة', 'commissionPercent'],
          ['ضريبة القيمة المضافة', 'vatPercent'],
          ['رسوم الدفع', 'paymentFeePercent'],
          ['الحد الأدنى', 'minimumTripValue'],
          ['الحد الأعلى', 'maximumTripValue'],
        ] as const
      )
        .filter(([, key]) => before[key] !== next[key])
        .map(([field, key]) => ({ field, before: String(before[key]), after: String(next[key]) }));

      if (changes.length === 0) return state;

      return {
        ...state,
        pricing: next,
        audit: [audit('تغيير إعداد', 'التسعير', 'PRICING', 'التسعير والرسوم والضرائب', { changes }), ...state.audit],
      };
    }

    case 'template/update':
      return {
        ...state,
        templates: state.templates.map((t) => (t.id === action.next.id ? action.next : t)),
        audit: [audit('تغيير إعداد', 'قالب إشعار', action.next.id, action.next.event), ...state.audit],
      };

    case 'notification/send':
      return {
        ...state,
        dispatches: [action.dispatch, ...state.dispatches],
        audit: [
          audit('تغيير إعداد', 'إشعار', action.dispatch.id, `${action.dispatch.event} — ${action.dispatch.audience}`, {
            reason: `أُرسل إلى ${action.dispatch.recipients} مستلماً عبر ${action.dispatch.channels.join('، ')}.`,
          }),
          ...state.audit,
        ],
      };

    default:
      return state;
  }
}

const INITIAL: AdminState = {
  drivers: DRIVERS,
  penalties: PENALTIES,
  carrierDues: CARRIER_DUES,
  templates: TEMPLATES,
  dispatches: DISPATCHES,
  pricing: PRICING,
  audit: SEED_AUDIT,
};

const StoreContext = React.createContext<{ state: AdminState; dispatch: React.Dispatch<Action> } | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, INITIAL);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error('useAdminStore must be used inside <AdminStoreProvider>');
  return ctx;
}

/**
 * Live queue depths. The home KPI tiles and each queue's own filter tabs read
 * from here; the sidebar carries destinations only, so emptying a queue moves
 * the number where the work is, not in the nav.
 */
export function useQueueCounts() {
  const { state } = useAdminStore();
  return React.useMemo(
    () => ({
      drivers: state.drivers.filter((d) => d.status === 'Under Review').length,
      penalties: state.penalties.filter((p) => p.status === 'Pending Review').length,
    }),
    [state],
  );
}
