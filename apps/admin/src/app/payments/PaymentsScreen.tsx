'use client';

import * as React from 'react';
import {
  AlertBanner,
  AmountText,
  CellEmpty,
  CellPrimary,
  CellSecondary,
  CellStack,
  ContentTabs,
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
  StatusTimeline,
  TableCard,
  ViewStateLabel,
  type AdminPayment,
  type BadgeTone,
  type IconName,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { ADMIN_PAYMENTS, LEDGER_ENTRIES } from '@/mocks/finance';

/**
 * الدفع والـ Ledger — SRS M04-E10.
 *
 * The ledger tab shows BOTH sides of every entry. A single-column view would
 * misrepresent it: these are double-entry postings, and an operator
 * reconciling a dispute needs to see where the money left and where it landed.
 */

const PAY_STATUS: Record<AdminPayment['status'], { tone: BadgeTone; label: string }> = {
  Pending: { tone: 'warning', label: 'معلّقة' },
  Authorized: { tone: 'warning', label: 'محجوزة' },
  Captured: { tone: 'success', label: 'محصّلة' },
  Failed: { tone: 'danger', label: 'فشلت' },
  Expired: { tone: 'neutral', label: 'منتهية' },
  Refunded: { tone: 'neutral', label: 'مستردة' },
};

const LEDGER_ICON: Record<string, { icon: IconName; bg: string; color: string }> = {
  'Wallet Top-up': { icon: 'arrowIn', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)' },
  Payout: { icon: 'arrowOut', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)' },
  Refund: { icon: 'retry', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)' },
  'Penalty Hold': { icon: 'warning', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)' },
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'الحالة: الكل' },
  { value: 'Captured', label: 'محصّلة' },
  { value: 'Authorized', label: 'محجوزة' },
  { value: 'Pending', label: 'معلّقة' },
  { value: 'Failed', label: 'فشلت' },
  { value: 'Refunded', label: 'مستردة' },
];

const PAYER_OPTIONS = [
  { value: 'all', label: 'الدافع: الكل' },
  { value: 'شركة', label: 'شركات' },
  { value: 'فرد', label: 'أفراد' },
];

export function PaymentsScreen() {
  const [tab, setTab] = React.useState('payments');
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [payer, setPayer] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const payments = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADMIN_PAYMENTS.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (payer !== 'all' && p.payerType !== payer) return false;
      if (q && !`${p.id} ${p.shipmentId ?? ''} ${p.payerName} ${p.gatewayReference}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, status, payer]);

  const ledger = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return LEDGER_ENTRIES.filter(
      (l) => !q || `${l.id} ${l.reference} ${l.debitParty} ${l.creditParty} ${l.shipmentId ?? ''}`.toLowerCase().includes(q),
    );
  }, [search]);

  const rowCount = tab === 'payments' ? payments.length : ledger.length;
  const mode = resolveMode(view, rowCount);
  const selected = selectedId ? ADMIN_PAYMENTS.find((p) => p.id === selectedId) ?? null : null;

  return (
    <>
      <AdminHeader title="الدفع والـ Ledger" subtitle="معاملات الدفع وقيود الـ Ledger لكل الأطراف" />

      <FilterBar>
        <ContentTabs
          tabs={[
            { key: 'payments', label: 'المعاملات', count: ADMIN_PAYMENTS.length },
            { key: 'ledger', label: 'قيود Ledger', count: LEDGER_ENTRIES.length },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث برقم العملية أو المرجع…" aria-label="ابحث" />
        {tab === 'payments' ? (
          <>
            <SelectField value={status} onChange={setStatus} options={STATUS_OPTIONS} aria-label="تصفية حسب الحالة" />
            <SelectField value={payer} onChange={setPayer} options={PAYER_OPTIONS} aria-label="تصفية حسب الدافع" />
          </>
        ) : null}
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير كشف
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            {tab === 'payments' ? (
              <DataTable
                head={
                  <>
                    <th>العملية</th>
                    <th>الدافع</th>
                    <th>الرحلة</th>
                    <th>الطريقة</th>
                    <th>المبلغ</th>
                    <th>مرجع البوابة</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {payments.map((p) => (
                  <tr key={p.id} onClick={() => setSelectedId(p.id)}>
                    <td>
                      <CellStack>
                        <RowIcon icon="card" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                        <div>
                          <CellPrimary ltr>{p.id}</CellPrimary>
                          <CellSecondary>
                            {p.date} · {p.time}
                          </CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary>{p.payerName}</CellPrimary>
                      <CellSecondary>{p.payerType}</CellSecondary>
                    </td>
                    <td>{p.shipmentId ? <CellPrimary ltr>{p.shipmentId}</CellPrimary> : <CellEmpty />}</td>
                    <td>
                      <CellSecondary>{p.method}</CellSecondary>
                    </td>
                    <td>
                      <AmountText amount={p.amount} direction="debit" muted={p.status === 'Failed'} />
                    </td>
                    <td>
                      <CellSecondary ltr>{p.gatewayReference}</CellSecondary>
                    </td>
                    <td>
                      <StatusBadge tone={PAY_STATUS[p.status].tone}>{PAY_STATUS[p.status].label}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </DataTable>
            ) : (
              <DataTable
                head={
                  <>
                    <th>القيد</th>
                    <th>النوع</th>
                    <th>مدين</th>
                    <th>دائن</th>
                    <th>المبلغ</th>
                    <th>المرجع</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {ledger.map((l) => {
                  const meta = LEDGER_ICON[l.type] ?? {
                    icon: 'card' as IconName,
                    bg: 'var(--lw-icon-tint-bg)',
                    color: 'var(--lw-navy-800)',
                  };
                  return (
                    <tr key={l.id}>
                      <td>
                        <CellStack>
                          <RowIcon icon={meta.icon} background={meta.bg} color={meta.color} />
                          <div>
                            <CellPrimary ltr>{l.id}</CellPrimary>
                            <CellSecondary>{l.createdAt}</CellSecondary>
                          </div>
                        </CellStack>
                      </td>
                      <td>
                        <CellPrimary ltr>{l.type}</CellPrimary>
                      </td>
                      <td>
                        <CellPrimary>{l.debitParty}</CellPrimary>
                      </td>
                      <td>
                        <CellPrimary>{l.creditParty}</CellPrimary>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <CellPrimary ltr>
                          {l.amount} {l.currency}
                        </CellPrimary>
                      </td>
                      <td>
                        <CellSecondary ltr>{l.reference}</CellSecondary>
                      </td>
                      <td>
                        <StatusBadge tone={l.status === 'Posted' ? 'success' : l.status === 'Pending' ? 'warning' : 'neutral'}>
                          {l.status === 'Posted' ? 'مرحّل' : l.status === 'Pending' ? 'معلّق' : 'معكوس'}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </DataTable>
            )}

            <PaginationBar
              attached
              showArrows={false}
              count={rowCount}
              total={rowCount}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا توجد معاملات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel title="تفاصيل العملية" onClose={() => setSelectedId(null)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr' }}>
                  {selected.id}
                </span>
                <StatusBadge tone={PAY_STATUS[selected.status].tone}>{PAY_STATUS[selected.status].label}</StatusBadge>
              </div>

              <AmountText amount={selected.amount} direction="debit" muted={selected.status === 'Failed'} hero />

              {selected.note ? (
                <div style={{ marginTop: 14 }}>
                  <AlertBanner tone={selected.status === 'Failed' ? 'danger' : 'warning'}>{selected.note}</AlertBanner>
                </div>
              ) : null}

              {selected.subtotal && selected.vat ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>تفاصيل الفاتورة</SectionLabel>
                  <DetailList>
                    <DetailRow label="المبلغ قبل الضريبة">
                      <span className="lw-ltr">{selected.subtotal}</span> ر.س
                    </DetailRow>
                    <DetailRow label="ضريبة القيمة المضافة (15%)">
                      <span className="lw-ltr">{selected.vat}</span> ر.س
                    </DetailRow>
                    <DetailRow label="الإجمالي">
                      <span className="lw-ltr">{selected.amount}</span> ر.س
                    </DetailRow>
                  </DetailList>
                </div>
              ) : null}

              <div style={{ marginTop: 20 }}>
                <SectionLabel>البيانات</SectionLabel>
                <DetailList>
                  <DetailRow label="الدافع">
                    {selected.payerName} · {selected.payerType}
                  </DetailRow>
                  <DetailRow label="طريقة الدفع">{selected.method}</DetailRow>
                  <DetailRow label="مرجع البوابة">
                    <span className="lw-ltr">{selected.gatewayReference}</span>
                  </DetailRow>
                  {selected.shipmentId ? (
                    <DetailRow label="الرحلة">
                      <span className="lw-ltr">{selected.shipmentId}</span>
                    </DetailRow>
                  ) : null}
                </DetailList>
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>سجل الحالة</SectionLabel>
                <StatusTimeline
                  steps={[
                    { label: 'تم إنشاء العملية', meta: `${selected.date} · ${selected.time}`, dotColor: 'var(--lw-slate-300)' },
                    {
                      label:
                        selected.status === 'Captured'
                          ? 'تم التحصيل'
                          : selected.status === 'Failed'
                            ? 'فشلت العملية'
                            : selected.status === 'Refunded'
                              ? 'تم الاسترداد'
                              : 'قيد المعالجة',
                      note: selected.note,
                      dotColor:
                        selected.status === 'Captured'
                          ? 'var(--lw-green-500)'
                          : selected.status === 'Failed'
                            ? 'var(--lw-red-500)'
                            : 'var(--lw-amber-500)',
                    },
                  ]}
                />
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={6} label="جارٍ تحميل المعاملات…" /> : null}
      {mode === 'error' ? (
        <ErrorState title="تعذّر تحميل المعاملات" body="حدث خطأ أثناء جلب البيانات المالية. أعد المحاولة." onRetry={() => setView('default')} />
      ) : null}
      {mode === 'empty' ? <EmptyState glyph="card" title="لا توجد معاملات" body="ستظهر هنا كل عمليات الدفع وقيود الـ Ledger." /> : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setStatus('all');
            setPayer('all');
            setView('default');
          }}
        />
      ) : null}
    </>
  );
}
