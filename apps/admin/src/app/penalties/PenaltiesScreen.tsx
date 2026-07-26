'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellPrimary,
  CellSecondary,
  CellStack,
  ChipList,
  ConfirmDialog,
  DataTable,
  DetailList,
  DetailRow,
  EmptyState,
  ErrorState,
  Field,
  FilterBar,
  FilterBarSpacer,
  LoadingState,
  NoResultsState,
  PageBody,
  PaginationBar,
  PanelCta,
  PrimaryCta,
  RowIcon,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TableCard,
  Tag,
  TextInput,
  ViewStateLabel,
  type BadgeTone,
  type Penalty,
  type PenaltyStatus,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * مراجعة الغرامات — SRS M04-E12.
 *
 * BR-012 is the whole point of this screen: a penalty is `محتملة` until an
 * admin decides. Nothing here has been charged, and the UI must never imply
 * otherwise. `تعديل المبلغ` is a first-class third action, not an edge case —
 * the SRS penalty matrix (§13.2) lists Adjusted as a real outcome.
 */

const TAB_STATUS: Record<string, PenaltyStatus[]> = {
  pending: ['Pending Review', 'Potential', 'Awaiting Reason'],
  approved: ['Approved', 'Applied'],
  rejected: ['Rejected'],
  adjusted: ['Adjusted'],
};

const STATUS_META: Record<PenaltyStatus, { tone: BadgeTone; label: string }> = {
  Potential: { tone: 'warning', label: 'محتملة' },
  'Awaiting Reason': { tone: 'warning', label: 'بانتظار السبب' },
  'Pending Review': { tone: 'warning', label: 'قيد المراجعة' },
  Approved: { tone: 'success', label: 'معتمدة' },
  Rejected: { tone: 'neutral', label: 'مرفوضة' },
  Adjusted: { tone: 'success', label: 'معدّلة' },
  Applied: { tone: 'success', label: 'مطبّقة' },
  Disputed: { tone: 'danger', label: 'متنازع عليها' },
};

const TYPES = [
  { value: 'all', label: 'النوع: الكل' },
  { value: 'إلغاء بعد التحرك', label: 'إلغاء بعد التحرك' },
  { value: 'انتظار التحميل', label: 'انتظار التحميل' },
  { value: 'تأخير الجمارك', label: 'تأخير الجمارك' },
  { value: 'انتظار التفريغ', label: 'انتظار التفريغ' },
];

const PARTIES = [
  { value: 'all', label: 'الطرف: الكل' },
  { value: 'العميل', label: 'العميل' },
  { value: 'السائق', label: 'السائق' },
];

type Decision = { kind: 'approve' | 'reject' | 'adjust'; penalty: Penalty } | null;

export function PenaltiesScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('pending');
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [party, setParty] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<Decision>(null);
  const [amount, setAmount] = React.useState('');

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS).map(([k, v]) => [k, state.penalties.filter((p) => v.includes(p.status)).length]),
      ) as Record<string, number>,
    [state.penalties],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.penalties.filter((p) => {
      if (!TAB_STATUS[tab].includes(p.status)) return false;
      if (type !== 'all' && p.type !== type) return false;
      if (party !== 'all' && p.responsibleParty !== party) return false;
      if (q && !`${p.id} ${p.shipmentId} ${p.responsibleName} ${p.route}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.penalties, tab, type, party, search]);

  const mode = resolveMode(view, rows.length);
  const selected = selectedId ? state.penalties.find((p) => p.id === selectedId) ?? null : null;

  const decide = (id: string, d: 'Approved' | 'Rejected' | 'Adjusted', reason?: string, amt?: string) => {
    dispatch({ type: 'penalty/decide', id, decision: d, reason, amount: amt });
    setSelectedId(null);
    setDecision(null);
    setAmount('');
  };

  return (
    <>
      <AdminHeader title="مراجعة الغرامات" subtitle="الغرامات المحتملة قبل أي أثر مالي — اعتماد أو رفض أو تعديل" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'pending', label: 'بانتظار القرار', count: counts.pending },
            { key: 'approved', label: 'معتمدة', count: counts.approved },
            { key: 'adjusted', label: 'معدّلة', count: counts.adjusted },
            { key: 'rejected', label: 'مرفوضة', count: counts.rejected },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث برقم الغرامة أو الرحلة…" aria-label="ابحث عن غرامة" />
        <SelectField value={type} onChange={setType} options={TYPES} aria-label="تصفية حسب النوع" />
        <SelectField value={party} onChange={setParty} options={PARTIES} aria-label="تصفية حسب الطرف المسؤول" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير القائمة
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      <AlertBanner tone="warning">
        الغرامات هنا محتملة ولم تُخصم من أي طرف. لا يقع أي أثر مالي قبل اعتمادك للقرار.
      </AlertBanner>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>الغرامة</th>
                  <th>الرحلة</th>
                  <th>الطرف المسؤول</th>
                  <th>سبب الإنشاء</th>
                  <th>المبلغ المقترح</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((p) => (
                <tr key={p.id} onClick={() => setSelectedId(p.id)}>
                  <td>
                    <CellStack>
                      <RowIcon icon="warning" background="var(--color-warning-bg)" color="var(--lw-amber-600)" />
                      <div>
                        <CellPrimary>{p.type}</CellPrimary>
                        <CellSecondary ltr>{p.id}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellPrimary ltr>{p.shipmentId}</CellPrimary>
                    <CellSecondary>{p.route}</CellSecondary>
                  </td>
                  <td>
                    <CellPrimary>{p.responsibleName}</CellPrimary>
                    <CellSecondary>{p.responsibleParty}</CellSecondary>
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <CellSecondary>{p.trigger}</CellSecondary>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellPrimary ltr>{p.adjustedAmount ?? p.proposedAmount} ر.س</CellPrimary>
                    {p.adjustedAmount ? <CellSecondary ltr>كان {p.proposedAmount}</CellSecondary> : null}
                  </td>
                  <td>
                    <StatusBadge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</StatusBadge>
                  </td>
                </tr>
              ))}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={rows.length}
              total={rows.length}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا توجد غرامات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel
              title="مراجعة الغرامة"
              onClose={() => setSelectedId(null)}
              footer={
                TAB_STATUS.pending.includes(selected.status) ? (
                  <>
                    <PanelCta icon="check" onClick={() => setDecision({ kind: 'approve', penalty: selected })}>
                      اعتماد الغرامة
                    </PanelCta>
                    <PanelCta
                      variant="ghost"
                      onClick={() => {
                        setAmount(selected.proposedAmount.replace(/,/g, ''));
                        setDecision({ kind: 'adjust', penalty: selected });
                      }}
                    >
                      تعديل المبلغ
                    </PanelCta>
                    <PanelCta variant="danger" onClick={() => setDecision({ kind: 'reject', penalty: selected })}>
                      رفض الغرامة
                    </PanelCta>
                  </>
                ) : undefined
              }
            >
              <PenaltyDetail penalty={selected} />
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل الغرامات…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل الغرامات"
          body="حدث خطأ أثناء جلب قائمة الغرامات. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="warning" title="لا توجد غرامات في هذا التبويب" body="الغرامات المحتملة الجديدة ستظهر هنا فور إنشائها من محرك الغرامات." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setType('all');
            setParty('all');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={decision?.kind === 'approve'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.penalty.id, 'Approved', reason)}
        tone="warning"
        title="اعتماد الغرامة"
        body={`سيُخصم المبلغ من ${decision?.penalty.responsibleName ?? ''} عند التسوية. هذا أول أثر مالي للغرامة.`}
        confirmLabel="تأكيد الاعتماد"
        reasonRequired
        reasonLabel="مبرر الاعتماد"
        summary={
          decision ? (
            <>
              <span className="lw-ltr">{decision.penalty.proposedAmount}</span> ر.س · {decision.penalty.type} ·{' '}
              <span className="lw-ltr">{decision.penalty.shipmentId}</span>
            </>
          ) : undefined
        }
      />

      <ConfirmDialog
        open={decision?.kind === 'reject'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.penalty.id, 'Rejected', reason)}
        tone="danger"
        title="رفض الغرامة"
        body="تُلغى الغرامة نهائياً ولا يقع أي خصم. يُبلَّغ الطرفان بالقرار وسببه."
        confirmLabel="تأكيد الرفض"
        reasonRequired
      />

      {/* Adjust is a decision, not a form — so it gets the same dialog treatment,
          with an amount field ahead of the mandatory justification. */}
      <ConfirmDialog
        open={decision?.kind === 'adjust'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.penalty.id, 'Adjusted', reason, amount)}
        tone="warning"
        title="تعديل مبلغ الغرامة"
        body={`المبلغ المقترح من محرك الغرامات ${decision?.penalty.proposedAmount ?? ''} ر.س. أدخل المبلغ المعتمد وسبب التعديل.`}
        confirmLabel="اعتماد المبلغ المعدّل"
        reasonRequired
        reasonLabel="سبب التعديل"
        summary={
          <Field label="المبلغ المعتمد (ر.س)" required htmlFor="pen-amount">
            <TextInput
              id="pen-amount"
              ltr
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </Field>
        }
      />
    </>
  );
}

function PenaltyDetail({ penalty }: { penalty: Penalty }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr', color: 'var(--lw-navy-900)' }}>
          {penalty.id}
        </span>
        <StatusBadge tone={STATUS_META[penalty.status].tone}>{STATUS_META[penalty.status].label}</StatusBadge>
      </div>

      <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 600, color: 'var(--lw-slate-500)' }}>{penalty.type}</div>
      <div
        style={{
          marginTop: 6,
          fontSize: 30,
          fontWeight: 800,
          fontFamily: 'var(--font-latin)',
          direction: 'ltr',
          unicodeBidi: 'isolate',
          color: 'var(--lw-navy-900)',
        }}
      >
        {penalty.adjustedAmount ?? penalty.proposedAmount} <span style={{ fontSize: 15, fontFamily: 'var(--font-sans)' }}>ر.س</span>
      </div>

      {penalty.decisionReason ? (
        <div style={{ marginTop: 16 }}>
          <AlertBanner tone={penalty.status === 'Rejected' ? 'info' : 'warning'}>{penalty.decisionReason}</AlertBanner>
        </div>
      ) : null}

      <div style={{ marginTop: 20 }}>
        <SectionLabel>سبب الإنشاء</SectionLabel>
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
          {penalty.trigger}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>التفاصيل</SectionLabel>
        <DetailList>
          <DetailRow label="الرحلة">
            <span className="lw-ltr">{penalty.shipmentId}</span>
          </DetailRow>
          <DetailRow label="المسار">{penalty.route}</DetailRow>
          <DetailRow label="الطرف المسؤول">
            {penalty.responsibleName} · {penalty.responsibleParty}
          </DetailRow>
          <DetailRow label="تاريخ الإنشاء">{penalty.raisedAt}</DetailRow>
          {penalty.adjustedAmount ? (
            <DetailRow label="المبلغ الأصلي">
              <span className="lw-ltr">{penalty.proposedAmount}</span> ر.س
            </DetailRow>
          ) : null}
        </DetailList>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>الأدلة</SectionLabel>
        <ChipList>
          {penalty.evidence.map((e) => (
            <Tag key={e} icon="document">
              {e}
            </Tag>
          ))}
        </ChipList>
      </div>
    </>
  );
}
