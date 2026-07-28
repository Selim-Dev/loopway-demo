'use client';

import * as React from 'react';
import {
  AmountText,
  CellPrimary,
  CellSecondary,
  CellStack,
  DataTable,
  DetailList,
  DetailRow,
  EmptyState,
  ErrorState,
  FilterBar,
  FilterBarSpacer,
  LoadingState,
  NoResultsState,
  PageBody,
  PaginationBar,
  PrimaryCta,
  RowIcon,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TableCard,
  ViewStateLabel,
  type BadgeTone,
  type FinancialOperation,
  type FinancialOperationType,
  type IconName,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { FINANCIAL_OPERATIONS, formatMoney, parseMoney } from '@/mocks/finance';
import { useAdminStore } from '@/store/AdminStore';

/**
 * العمليات المالية — SRS M04-E10.
 *
 * One flat log, not the payments + double-entry ledger split the SRS describes.
 * The ledger view answered a question nobody in this portal was asking; an
 * operator wants to see money moving, by type, against a trip or a company.
 *
 * Two of the row sources are LIVE store state rather than fixtures: approving a
 * penalty in /penalties produces a `غرامة معتمدة` row here, and paying a
 * carrier in /carrier-dues produces a `صرف مستحقات` row. That is what makes
 * BR-012 — no financial effect before approval — observable rather than
 * captioned.
 */

const TYPE_META: Record<FinancialOperationType, { tone: BadgeTone; icon: IconName }> = {
  'دفعة عميل': { tone: 'success', icon: 'arrowIn' },
  'استرداد': { tone: 'neutral', icon: 'arrowOut' },
  'عمولة المنصة': { tone: 'success', icon: 'card' },
  'رسوم': { tone: 'neutral', icon: 'card' },
  'غرامة معتمدة': { tone: 'warning', icon: 'warning' },
  'صرف مستحقات': { tone: 'neutral', icon: 'arrowOut' },
};

const STATUS_TONE: Record<string, BadgeTone> = {
  'مكتملة': 'success',
  'قيد التنفيذ': 'warning',
  'فاشلة': 'danger',
  'مستردة': 'neutral',
};

const TYPES = [
  { value: 'all', label: 'النوع: الكل' },
  ...(Object.keys(TYPE_META) as FinancialOperationType[]).map((t) => ({ value: t, label: t })),
];

const STATUSES = [
  { value: 'all', label: 'الحالة: الكل' },
  { value: 'مكتملة', label: 'مكتملة' },
  { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
  { value: 'فاشلة', label: 'فاشلة' },
  { value: 'مستردة', label: 'مستردة' },
];

export function FinanceScreen() {
  const { state } = useAdminStore();
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [openId, setOpenId] = React.useState<string | null>(null);

  /** Fixture rows plus everything this session has caused to happen. */
  const operations = React.useMemo<FinancialOperation[]>(() => {
    const seenRefs = new Set(FINANCIAL_OPERATIONS.map((o) => o.reference).filter(Boolean));

    const fromPenalties: FinancialOperation[] = state.penalties
      .filter((p) => p.status === 'Approved' || p.status === 'Adjusted')
      .map((p) => ({
        id: `FIN-2026-9${p.id.replace('PEN-2026-', '')}`,
        type: 'غرامة معتمدة' as const,
        shipmentId: p.shipmentId,
        partyName: p.responsibleName,
        amount: formatMoney(parseMoney(p.adjustedAmount ?? p.proposedAmount)),
        direction: 'credit' as const,
        status: 'مكتملة' as const,
        reference: p.id,
        createdAt: p.raisedAt,
      }))
      .filter((o) => !seenRefs.has(o.reference));

    const fromDues: FinancialOperation[] = state.carrierDues
      .filter((d) => d.status === 'تم الصرف')
      .map((d) => ({
        id: `FIN-2026-8${d.carrierId.replace('CAR-2026-', '')}`,
        type: 'صرف مستحقات' as const,
        partyName: d.carrierName,
        amount: d.totalDue,
        direction: 'debit' as const,
        status: 'مكتملة' as const,
        reference: d.carrierId,
        createdAt: d.updatedAt,
      }))
      .filter((o) => !seenRefs.has(o.reference));

    return [...fromPenalties, ...fromDues, ...FINANCIAL_OPERATIONS];
  }, [state.penalties, state.carrierDues]);

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return operations.filter((o) => {
      if (type !== 'all' && o.type !== type) return false;
      if (status !== 'all' && o.status !== status) return false;
      if (q && !`${o.id} ${o.partyName} ${o.shipmentId ?? ''} ${o.reference ?? ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [operations, search, type, status]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? operations.find((o) => o.id === openId) ?? null : null;

  const inflow = rows
    .filter((o) => o.direction === 'credit' && o.status === 'مكتملة')
    .reduce((s, o) => s + parseMoney(o.amount), 0);
  const outflow = rows
    .filter((o) => o.direction === 'debit' && o.status === 'مكتملة')
    .reduce((s, o) => s + parseMoney(o.amount), 0);

  return (
    <>
      <AdminHeader
        title="العمليات المالية"
        subtitle="كل الحركات المالية على المنصة — مدفوعات واستردادات وعمولة ورسوم وغرامات معتمدة"
      />

      <FilterBar>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="ابحث برقم العملية أو الرحلة أو الشركة…"
          aria-label="ابحث في العمليات"
        />
        <SelectField value={type} onChange={setType} options={TYPES} aria-label="تصفية حسب النوع" />
        <SelectField value={status} onChange={setStatus} options={STATUSES} aria-label="تصفية حسب الحالة" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>رقم العملية</th>
                  <th>نوع العملية</th>
                  <th>الرحلة أو الشركة</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                </>
              }
            >
              {rows.map((o) => {
                const meta = TYPE_META[o.type];
                return (
                  <tr key={o.id} onClick={() => setOpenId(o.id)}>
                    <td>
                      <CellPrimary ltr>{o.id}</CellPrimary>
                      {o.reference ? <CellSecondary ltr>{o.reference}</CellSecondary> : null}
                    </td>
                    <td>
                      <CellStack>
                        <RowIcon
                          icon={meta.icon}
                          background={
                            meta.tone === 'success'
                              ? 'var(--color-success-bg)'
                              : meta.tone === 'warning'
                                ? 'var(--color-warning-bg)'
                                : 'var(--lw-icon-tint-bg)'
                          }
                          color={
                            meta.tone === 'success'
                              ? 'var(--lw-green-700)'
                              : meta.tone === 'warning'
                                ? 'var(--lw-amber-600)'
                                : 'var(--lw-navy-800)'
                          }
                        />
                        <CellPrimary>{o.type}</CellPrimary>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary>{o.partyName}</CellPrimary>
                      {o.shipmentId ? <CellSecondary ltr>{o.shipmentId}</CellSecondary> : <CellSecondary>—</CellSecondary>}
                    </td>
                    <td>
                      <AmountText amount={o.amount} direction={o.direction} currency="ر.س" />
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_TONE[o.status] ?? 'neutral'}>{o.status}</StatusBadge>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CellSecondary>{o.createdAt}</CellSecondary>
                    </td>
                  </tr>
                );
              })}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={rows.length}
              total={operations.length}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا توجد عمليات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                  {/* Totals for the current filter, not for everything — a sum
                      that ignores the filter above it is a misreading waiting
                      to happen. */}
                  <span style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-600)' }}>
                    وارد <span className="lw-ltr">{formatMoney(inflow)}</span> · صادر{' '}
                    <span className="lw-ltr">{formatMoney(outflow)}</span> ر.س
                  </span>
                </>
              }
            />
          </TableCard>

          {open ? (
            <SidePanel title="تفاصيل العملية" onClose={() => setOpenId(null)}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span className="lw-ltr" style={{ fontSize: 15, fontWeight: 800 }}>
                  {open.id}
                </span>
                <StatusBadge tone={STATUS_TONE[open.status] ?? 'neutral'}>{open.status}</StatusBadge>
              </div>

              <DetailList>
                <DetailRow label="نوع العملية">{open.type}</DetailRow>
                <DetailRow label="الطرف المرتبط">{open.partyName}</DetailRow>
                {open.shipmentId ? (
                  <DetailRow label="الرحلة">
                    <span className="lw-ltr">{open.shipmentId}</span>
                  </DetailRow>
                ) : null}
                <DetailRow label="المبلغ">
                  <AmountText amount={open.amount} direction={open.direction} currency="ر.س" />
                </DetailRow>
                <DetailRow label="الاتجاه">{open.direction === 'credit' ? 'وارد للمنصة' : 'صادر من المنصة'}</DetailRow>
                {open.method ? <DetailRow label="الوسيلة">{open.method}</DetailRow> : null}
                {open.reference ? (
                  <DetailRow label="المرجع">
                    <span className="lw-ltr">{open.reference}</span>
                  </DetailRow>
                ) : null}
                <DetailRow label="التاريخ">{open.createdAt}</DetailRow>
              </DetailList>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>ملاحظة</SectionLabel>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--web-r-btn)',
                    background: 'var(--lw-bg-subtle)',
                    fontSize: 'var(--web-text-label)',
                    fontWeight: 600,
                    color: 'var(--lw-slate-600)',
                    lineHeight: 1.7,
                  }}
                >
                  {open.type === 'غرامة معتمدة'
                    ? 'هذه الغرامة اعتمدتها الإدارة، ولذلك ظهرت هنا وخُصمت من مستحقات الشركة. الغرامة قيد المراجعة لا أثر مالي لها.'
                    : open.type === 'صرف مستحقات'
                      ? 'صرف مستحقات شركة نقل بعد اكتمال المراجعة. المبلغ صافٍ بعد العمولة والرسوم والغرامات المعتمدة.'
                      : 'العملية مسجّلة في سجل القرارات والاعتمادات مع المستخدم والوقت.'}
                </div>
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل العمليات المالية…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل العمليات"
          body="حدث خطأ أثناء جلب الحركات المالية. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="card" title="لا توجد عمليات مالية" body="ستظهر الحركات المالية هنا فور تسجيل أول عملية." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setType('all');
            setStatus('all');
            setView('default');
          }}
        />
      ) : null}
    </>
  );
}
