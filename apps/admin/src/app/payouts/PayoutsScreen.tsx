'use client';

import * as React from 'react';
import {
  AlertBanner,
  AmountText,
  AvatarInitial,
  CellPrimary,
  CellSecondary,
  CellStack,
  Checkbox,
  ChipList,
  ConfirmDialog,
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
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TableCard,
  Tag,
  ViewStateLabel,
  type BadgeTone,
  type PayoutStatus,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * Payout Management — SRS M04-E11.
 *
 * Releasing a batch is the most irreversible action in the portal: money
 * leaves. It is the one place bulk selection exists, and the confirm dialog
 * restates the driver count and the total before anything moves.
 */

const TAB_STATUS: Record<string, PayoutStatus[]> = {
  settlement: ['Pending Settlement'],
  ready: ['Ready for Payout'],
  pending: ['Payout Pending'],
  paid: ['Paid Out'],
  failed: ['Failed', 'On Hold'],
};

const STATUS_META: Record<PayoutStatus, { tone: BadgeTone; label: string }> = {
  'Pending Settlement': { tone: 'neutral', label: 'بانتظار التسوية' },
  'Ready for Payout': { tone: 'warning', label: 'جاهزة للتحويل' },
  'Payout Pending': { tone: 'warning', label: 'قيد التحويل' },
  'Paid Out': { tone: 'success', label: 'محوّلة' },
  Failed: { tone: 'danger', label: 'فشلت' },
  'On Hold': { tone: 'danger', label: 'محتجزة' },
};

const num = (s: string) => Number(s.replace(/,/g, '')) || 0;
const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function PayoutsScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('ready');
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState(false);

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS).map(([k, v]) => [k, state.payouts.filter((p) => v.includes(p.status)).length]),
      ) as Record<string, number>,
    [state.payouts],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.payouts.filter((p) => {
      if (!TAB_STATUS[tab].includes(p.status)) return false;
      if (q && !`${p.id} ${p.driverName} ${p.bankAccount}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.payouts, tab, search]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? state.payouts.find((p) => p.id === openId) ?? null : null;

  const selectable = tab === 'ready';
  const selectedRows = rows.filter((r) => selectedIds.includes(r.id));
  const total = selectedRows.reduce((sum, r) => sum + num(r.netAmount), 0);
  const allSelected = selectable && rows.length > 0 && selectedRows.length === rows.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const toggleAll = () => setSelectedIds(allSelected ? [] : rows.map((r) => r.id));
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const release = () => {
    dispatch({ type: 'payouts/release', ids: selectedIds, total: fmt(total) });
    setSelectedIds([]);
    setConfirming(false);
  };

  return (
    <>
      <AdminHeader title="Payout Management" subtitle="مستحقات السائقين من التسوية حتى التحويل الفعلي" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'settlement', label: 'بانتظار التسوية', count: counts.settlement },
            { key: 'ready', label: 'جاهزة للتحويل', count: counts.ready },
            { key: 'pending', label: 'قيد التحويل', count: counts.pending },
            { key: 'paid', label: 'محوّلة', count: counts.paid },
            { key: 'failed', label: 'فشلت', count: counts.failed },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedIds([]);
            setOpenId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث بالسائق أو رقم المستحق…" aria-label="ابحث" />
        <FilterBarSpacer>
          <PrimaryCta
            size="sm"
            icon="arrowOut"
            disabled={selectedRows.length === 0}
            title={selectedRows.length === 0 ? 'اختر مستحقات أولاً' : 'تحويل الدفعة المحددة'}
            onClick={() => setConfirming(true)}
          >
            تحويل دفعة ({selectedRows.length})
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {selectedRows.length > 0 ? (
        <AlertBanner tone="info" icon="card">
          محدَّد {selectedRows.length} مستحقات بإجمالي <span className="lw-ltr">{fmt(total)}</span> ر.س. لن يُحوَّل أي مبلغ قبل
          تأكيدك.
        </AlertBanner>
      ) : null}

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  {selectable ? (
                    <th style={{ width: 44 }}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                        aria-label="تحديد الكل"
                      />
                    </th>
                  ) : null}
                  <th>السائق</th>
                  <th>الرحلات</th>
                  <th>الإجمالي</th>
                  <th>الخصومات</th>
                  <th>الصافي</th>
                  <th>الحساب البنكي</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((p) => (
                <tr key={p.id} onClick={() => setOpenId(p.id)}>
                  {selectable ? (
                    <td style={{ padding: '13px 18px' }}>
                      <Checkbox
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleOne(p.id)}
                        aria-label={`تحديد ${p.driverName}`}
                      />
                    </td>
                  ) : null}
                  <td>
                    <CellStack>
                      <AvatarInitial initial={p.driverInitial} size={36} fontSize={14} />
                      <div>
                        <CellPrimary>{p.driverName}</CellPrimary>
                        <CellSecondary ltr>{p.id}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellPrimary ltr>{p.shipmentIds.length}</CellPrimary>
                  </td>
                  <td>
                    <CellPrimary ltr>{p.grossAmount}</CellPrimary>
                  </td>
                  <td>
                    <CellSecondary ltr>− {p.deductions}</CellSecondary>
                  </td>
                  <td>
                    <AmountText amount={p.netAmount} direction="credit" />
                  </td>
                  <td>
                    <CellSecondary ltr>{p.bankAccount}</CellSecondary>
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
                    options={viewOptions('لا توجد مستحقات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {open ? (
            <SidePanel title="تفاصيل المستحق" onClose={() => setOpenId(null)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <AvatarInitial initial={open.driverInitial} size={44} fontSize={17} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{open.driverName}</div>
                  <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                    <span className="lw-ltr">{open.driverId}</span>
                  </div>
                </div>
                <StatusBadge tone={STATUS_META[open.status].tone}>{STATUS_META[open.status].label}</StatusBadge>
              </div>

              {open.failureReason ? (
                <div style={{ marginBottom: 16 }}>
                  <AlertBanner tone="danger">{open.failureReason}</AlertBanner>
                </div>
              ) : null}

              <AmountText amount={open.netAmount} direction="credit" hero />

              <div style={{ marginTop: 20 }}>
                <SectionLabel>التسوية</SectionLabel>
                <DetailList>
                  <DetailRow label="إجمالي الأرباح">
                    <span className="lw-ltr">{open.grossAmount}</span> ر.س
                  </DetailRow>
                  <DetailRow label="الخصومات والعمولة">
                    <span className="lw-ltr">− {open.deductions}</span> ر.س
                  </DetailRow>
                  <DetailRow label="الصافي المستحق">
                    <span className="lw-ltr">{open.netAmount}</span> ر.س
                  </DetailRow>
                  <DetailRow label="الحساب البنكي">
                    <span className="lw-ltr">{open.bankAccount}</span>
                  </DetailRow>
                  <DetailRow label="تاريخ التسوية">{open.settledAt}</DetailRow>
                  {open.paidAt ? <DetailRow label="تاريخ التحويل">{open.paidAt}</DetailRow> : null}
                </DetailList>
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>الرحلات المشمولة</SectionLabel>
                <ChipList>
                  {open.shipmentIds.map((s) => (
                    <Tag key={s} icon="truck">
                      <span className="lw-ltr">{s}</span>
                    </Tag>
                  ))}
                </ChipList>
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل المستحقات…" /> : null}
      {mode === 'error' ? (
        <ErrorState title="تعذّر تحميل المستحقات" body="حدث خطأ أثناء جلب بيانات المستحقات. أعد المحاولة." onRetry={() => setView('default')} />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="arrowOut" title="لا توجد مستحقات في هذا التبويب" body="مستحقات السائقين تظهر هنا بعد إغلاق الرحلات وتسويتها." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={release}
        tone="warning"
        title="تحويل دفعة المستحقات"
        body="سيُرسل أمر التحويل إلى البنك لكل المستحقات المحددة. لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="تأكيد التحويل"
        summary={
          <>
            <strong>{selectedRows.length}</strong> سائقين · إجمالي <span className="lw-ltr">{fmt(total)}</span> ر.س
            <br />
            {selectedRows.slice(0, 4).map((r) => r.driverName).join('، ')}
            {selectedRows.length > 4 ? ` و${selectedRows.length - 4} آخرين` : ''}
          </>
        }
      />
    </>
  );
}
