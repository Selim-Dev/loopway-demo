'use client';

import * as React from 'react';
import type {
  AdminSupportCase,
  AuditAction,
  AuditEntry,
  Compatibility,
  Driver,
  NotificationTemplate,
  Payout,
  Penalty,
  PricingSettings,
  ReviewDocument,
  Truck,
} from '@loopway/ui';
import { DRIVERS } from '@/mocks/drivers';
import { TRUCKS } from '@/mocks/trucks';
import { REVIEW_DOCUMENTS } from '@/mocks/documents';
import { PENALTIES } from '@/mocks/penalties';
import { PAYOUTS } from '@/mocks/finance';
import { ADMIN_SUPPORT_CASES, SEED_AUDIT } from '@/mocks/operations';
import { COMPATIBILITY, PRICING, TEMPLATES } from '@/mocks/settings';

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
  trucks: Truck[];
  documents: ReviewDocument[];
  penalties: Penalty[];
  payouts: Payout[];
  cases: AdminSupportCase[];
  templates: NotificationTemplate[];
  pricing: PricingSettings;
  compatibility: Record<string, Compatibility>;
  audit: AuditEntry[];
}

type Action =
  | { type: 'driver/decide'; id: string; decision: 'Approved' | 'Rejected' | 'Needs More Info' | 'Suspended'; reason?: string }
  | { type: 'driverDoc/decide'; driverId: string; docId: string; decision: 'approved' | 'rejected' }
  | { type: 'truck/decide'; id: string; decision: 'Approved' | 'Rejected' | 'Needs Update' | 'Suspended'; reason?: string }
  | { type: 'document/decide'; id: string; decision: 'Approved' | 'Rejected'; reason?: string }
  | { type: 'penalty/decide'; id: string; decision: 'Approved' | 'Rejected' | 'Adjusted'; amount?: string; reason?: string }
  | { type: 'payouts/release'; ids: string[]; total: string }
  | { type: 'case/resolve'; id: string; resolution: string }
  | { type: 'case/escalate'; id: string; reason: string }
  | { type: 'pricing/update'; next: PricingSettings }
  | { type: 'compatibility/set'; key: string; value: Compatibility; label: string }
  | { type: 'template/update'; next: NotificationTemplate };

const ACTOR = { name: 'فريق التشغيل', id: 'LW-ADM-0001' };

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

    case 'truck/decide': {
      const truck = state.trucks.find((t) => t.id === action.id);
      if (!truck) return state;
      return {
        ...state,
        trucks: state.trucks.map((t) =>
          t.id === action.id ? { ...t, status: action.decision, decisionReason: action.reason } : t,
        ),
        audit: [
          audit(DRIVER_AUDIT_ACTION[action.decision] ?? 'اعتماد', 'شاحنة', truck.id, truck.plateNumber, {
            changes: [{ field: 'الحالة', before: STATUS_AR[truck.status] ?? truck.status, after: STATUS_AR[action.decision] }],
            reason: action.reason,
          }),
          ...state.audit,
        ],
      };
    }

    case 'document/decide': {
      const doc = state.documents.find((d) => d.id === action.id);
      if (!doc) return state;
      return {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.id ? { ...d, status: action.decision, decisionReason: action.reason } : d,
        ),
        audit: [
          audit(action.decision === 'Approved' ? 'اعتماد' : 'رفض', 'وثيقة', doc.id, `${doc.documentType} — ${doc.entityName}`, {
            reason: action.reason,
          }),
          ...state.audit,
        ],
      };
    }

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

    case 'payouts/release':
      return {
        ...state,
        payouts: state.payouts.map((p) =>
          action.ids.includes(p.id) ? { ...p, status: 'Payout Pending' } : p,
        ),
        audit: [
          audit('تحويل مستحقات', 'مستحقات', action.ids.join('، '), `${action.ids.length} مستحقات — ${action.total} ر.س`),
          ...state.audit,
        ],
      };

    case 'case/resolve': {
      const c = state.cases.find((x) => x.id === action.id);
      if (!c) return state;
      return {
        ...state,
        cases: state.cases.map((x) =>
          x.id === action.id ? { ...x, status: 'مغلقة', resolution: action.resolution } : x,
        ),
        audit: [audit('إغلاق بلاغ', 'بلاغ دعم', c.id, c.type, { reason: action.resolution }), ...state.audit],
      };
    }

    case 'case/escalate': {
      const c = state.cases.find((x) => x.id === action.id);
      if (!c) return state;
      return {
        ...state,
        cases: state.cases.map((x) => (x.id === action.id ? { ...x, status: 'قيد المعالجة', priority: 'عالية' } : x)),
        audit: [audit('تصعيد بلاغ', 'بلاغ دعم', c.id, c.type, { reason: action.reason }), ...state.audit],
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

    case 'compatibility/set':
      return {
        ...state,
        compatibility: { ...state.compatibility, [action.key]: action.value },
        audit: [
          audit('تغيير إعداد', 'مصفوفة التوافق', action.key, action.label, {
            changes: [
              {
                field: 'التوافق',
                before: state.compatibility[action.key] ?? 'allowed',
                after: action.value,
              },
            ],
          }),
          ...state.audit,
        ],
      };

    case 'template/update':
      return {
        ...state,
        templates: state.templates.map((t) => (t.id === action.next.id ? action.next : t)),
        audit: [audit('تغيير إعداد', 'قالب إشعار', action.next.id, action.next.event), ...state.audit],
      };

    default:
      return state;
  }
}

const INITIAL: AdminState = {
  drivers: DRIVERS,
  trucks: TRUCKS,
  documents: REVIEW_DOCUMENTS,
  penalties: PENALTIES,
  payouts: PAYOUTS,
  cases: ADMIN_SUPPORT_CASES,
  templates: TEMPLATES,
  pricing: PRICING,
  compatibility: COMPATIBILITY,
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
 * Live queue depths. The sidebar badges read from here, so emptying a queue
 * visibly drops its badge — the single most convincing thing in the demo.
 */
export function useQueueCounts() {
  const { state } = useAdminStore();
  return React.useMemo(
    () => ({
      drivers: state.drivers.filter((d) => d.status === 'Under Review').length,
      trucks: state.trucks.filter((t) => t.status === 'Pending Review').length,
      documents: state.documents.filter((d) => d.status === 'Under Review').length,
      penalties: state.penalties.filter((p) => p.status === 'Pending Review').length,
      payouts: state.payouts.filter((p) => p.status === 'Ready for Payout').length,
      support: state.cases.filter((c) => c.status !== 'مغلقة').length,
    }),
    [state],
  );
}
