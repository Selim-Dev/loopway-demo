'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AmountText,
  CellEmpty,
  CellPrimary,
  CellSecondary,
  CellStack,
  DataTable,
  EmptyState,
  ErrorState,
  Icon,
  IconButtonSm,
  LoadingState,
  NoResultsState,
  PaginationBar,
  PanelCta,
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
  WalletCard,
  WalletCta,
  type BadgeTone,
  type IconName,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { WALLET } from '@/mocks/company';
import { TOPUP_METHODS, TOPUP_QUICK_AMOUNTS, TRANSACTIONS } from '@/mocks/transactions';
import styles from './FinanceScreen.module.css';

type FinanceView = 'default' | 'empty' | 'loading' | 'error' | 'noresults';
type PanelMode = 'detail' | 'topup' | null;

const VIEW_OPTIONS = [
  { value: 'default', label: 'افتراضي' },
  { value: 'empty', label: 'لا توجد عمليات' },
  { value: 'loading', label: 'تحميل البيانات' },
  { value: 'error', label: 'تعذّر التحميل' },
  { value: 'noresults', label: 'لا نتائج مطابقة' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'الحالة: الكل' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'pending', label: 'معلّقة' },
  { value: 'failed', label: 'فشلت' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'التاريخ: الكل' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' },
];

const TYPE_META: Record<TransactionType, { label: string; icon: IconName; bg: string; color: string }> = {
  payment: { label: 'دفع رحلة', icon: 'truck', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)' },
  topup: { label: 'شحن رصيد', icon: 'arrowIn', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)' },
  withdraw: { label: 'سحب أموال', icon: 'arrowOut', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)' },
};

const STATUS_TONE: Record<TransactionStatus, BadgeTone> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  completed: 'مكتملة',
  pending: 'معلّقة',
  failed: 'فشلت',
};

const FINAL_LABEL: Record<TransactionStatus, string> = {
  completed: 'تمت العملية بنجاح',
  pending: 'قيد المعالجة',
  failed: 'فشلت العملية',
};

const FINAL_DOT: Record<TransactionStatus, string> = {
  completed: 'var(--lw-green-500)',
  pending: 'var(--lw-amber-500)',
  failed: 'var(--lw-red-500)',
};

export function FinanceScreen() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [view, setView] = React.useState<FinanceView>('default');
  const [panelMode, setPanelMode] = React.useState<PanelMode>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [topupAmount, setTopupAmount] = React.useState(1000);
  const [topupCustom, setTopupCustom] = React.useState('');
  const [topupMethod, setTopupMethod] = React.useState<string>('mada');
  const [topupDone, setTopupDone] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRANSACTIONS.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (q) {
        const hay = `${r.id} ${r.shipmentId ?? ''} ${r.from ?? ''} ${r.to ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, statusFilter]);

  const mode: 'list' | FinanceView = view !== 'default' ? view : filtered.length === 0 ? 'noresults' : 'list';

  const selected = selectedId ? TRANSACTIONS.find((t) => t.id === selectedId) : undefined;

  const topupAmt = topupCustom ? Number(topupCustom) || 0 : topupAmount;
  const topupLabel = topupAmt.toLocaleString('en-US');
  const newBalance = (24600 + topupAmt).toLocaleString('en-US');

  const closePanel = () => {
    setPanelMode(null);
    setSelectedId(null);
    setTopupDone(false);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDateFilter('all');
    setView('default');
  };

  return (
    <>
      <Header title="العمليات المالية" subtitle="سجل جميع عمليات الدفع وشحن الرصيد والسحب الخاصة بحساب شركتك" />

      {/* The design computes `onHold` / `pending` but renders neither — the card
          ships with balance + CTA only, and an empty spring between them. That
          exact composition is reproduced here. `WalletCard` still accepts a
          `stats` prop for when those figures are designed in. */}
      <WalletCard
        label="الرصيد المتاح"
        amount={WALLET.available}
        actions={
          <WalletCta icon="arrowIn" onClick={() => { setPanelMode('topup'); setTopupDone(false); }}>
            شحن الرصيد
          </WalletCta>
        }
      />

      <div className={styles.filters}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="ابحث برقم العملية أو رقم الرحلة…"
          size="sm"
          aria-label="ابحث برقم العملية أو رقم الرحلة"
        />
        <SelectField value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} size="sm" aria-label="تصفية حسب الحالة" />
        <SelectField value={dateFilter} onChange={setDateFilter} options={DATE_OPTIONS} size="sm" aria-label="تصفية حسب التاريخ" />
        <div className={styles.filtersSpacer}>
          <PrimaryCta icon="download" variant="secondary" size="sm">
            تنزيل كشف حساب (PDF)
          </PrimaryCta>
        </div>
      </div>

      {mode === 'list' ? (
        <div className={styles.body}>
          <TableCard>
            <DataTable
              head={
                <>
                  <th>العملية</th>
                  <th>الرحلة المرتبطة</th>
                  <th>التاريخ والوقت</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                  <th style={{ width: 44 }} />
                  <th style={{ width: 30 }} />
                </>
              }
            >
              {filtered.map((row) => {
                const meta = TYPE_META[row.type];
                const muted = row.status === 'failed';
                return (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setPanelMode('detail');
                      setSelectedId(row.id);
                    }}
                  >
                    <td>
                      <CellStack>
                        <RowIcon icon={meta.icon} background={meta.bg} color={meta.color} />
                        <div>
                          <CellPrimary ltr>{row.id}</CellPrimary>
                          <CellSecondary>{meta.label}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      {row.shipmentId ? (
                        <>
                          <CellPrimary ltr>{row.shipmentId}</CellPrimary>
                          <CellSecondary>
                            {row.from} ← {row.to}
                          </CellSecondary>
                        </>
                      ) : (
                        <CellEmpty />
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CellPrimary>{row.date}</CellPrimary>
                      <CellSecondary ltr>{row.time}</CellSecondary>
                    </td>
                    <td>
                      <AmountText amount={row.amount} direction={row.type === 'topup' ? 'credit' : 'debit'} muted={muted} />
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</StatusBadge>
                    </td>
                    <td style={{ padding: '13px 10px' }}>
                      <IconButtonSm icon="download" title="تنزيل الفاتورة" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td style={{ padding: '13px 16px 13px 6px', color: 'var(--lw-slate-300)' }}>
                      <Icon name="chevronLeft" size={16} strokeWidth={2} />
                    </td>
                  </tr>
                );
              })}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={filtered.length}
              total={filtered.length}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as FinanceView)}
                    options={VIEW_OPTIONS}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {panelMode === 'detail' && selected ? (
            <SidePanel
              title="تفاصيل العملية"
              onClose={closePanel}
              footer={
                selected.status === 'failed' ? (
                  <PanelCta variant="ghost" href="/support" linkAs={Link}>
                    الإبلاغ عن مشكلة
                  </PanelCta>
                ) : (
                  <PanelCta variant="ghost" icon="download">
                    تنزيل الفاتورة (PDF)
                  </PanelCta>
                )
              }
            >
              <TransactionDetail txn={selected} />
            </SidePanel>
          ) : null}

          {panelMode === 'topup' ? (
            <SidePanel
              title="شحن الرصيد"
              onClose={closePanel}
              footer={
                topupDone ? (
                  <PanelCta onClick={closePanel}>تم</PanelCta>
                ) : (
                  <PanelCta onClick={() => setTopupDone(true)}>شحن {topupLabel} ر.س</PanelCta>
                )
              }
            >
              {topupDone ? (
                <div className={styles.success}>
                  <div className={styles.successGlyph}>
                    <Icon name="check" size={30} strokeWidth={2.6} />
                  </div>
                  <div className={styles.successTitle}>تمت إضافة {topupLabel} ر.س بنجاح</div>
                  <div className={styles.successBody}>رصيدك الجديد: {newBalance} ر.س</div>
                </div>
              ) : (
                <>
                  <SectionLabel>اختر المبلغ</SectionLabel>
                  <div className={styles.chipRow}>
                    {TOPUP_QUICK_AMOUNTS.map((a) => {
                      const active = !topupCustom && topupAmount === a;
                      return (
                        <button
                          key={a}
                          type="button"
                          className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                          onClick={() => {
                            setTopupAmount(a);
                            setTopupCustom('');
                          }}
                        >
                          {a.toLocaleString('en-US')} ر.س
                        </button>
                      );
                    })}
                  </div>

                  <label className={styles.fieldLabel} htmlFor="topup-custom">
                    أو أدخل مبلغاً آخر
                  </label>
                  <input
                    id="topup-custom"
                    className={styles.amountInput}
                    inputMode="numeric"
                    placeholder="0"
                    value={topupCustom}
                    onChange={(e) => setTopupCustom(e.target.value.replace(/[^0-9]/g, ''))}
                  />

                  <div className={styles.block}>
                    <SectionLabel>طريقة الدفع</SectionLabel>
                    {TOPUP_METHODS.map((m) => {
                      const active = topupMethod === m.key;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          className={active ? `${styles.methodCard} ${styles.methodCardActive}` : styles.methodCard}
                          onClick={() => setTopupMethod(m.key)}
                        >
                          <span className={styles.methodBrand}>{m.brand}</span>
                          <span className={styles.methodLabel}>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </SidePanel>
          ) : null}
        </div>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={6} label="جارٍ تحميل العمليات المالية…" /> : null}

      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل سجل العمليات المالية"
          body="حدث خطأ أثناء جلب بيانات العمليات المالية. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}

      {mode === 'empty' ? (
        <EmptyState
          glyph="card"
          title="لا توجد عمليات مالية بعد"
          body="سجل عملياتك سيظهر هنا فور إتمام أول عملية دفع لرحلة أو شحن رصيد."
          action={{ label: 'شحن الرصيد الآن', icon: 'arrowIn', onClick: () => { setView('default'); setPanelMode('topup'); } }}
        />
      ) : null}

      {mode === 'noresults' ? <NoResultsState onClearFilters={resetFilters} /> : null}
    </>
  );
}

function TransactionDetail({ txn }: { txn: Transaction }) {
  const meta = TYPE_META[txn.type];
  const muted = txn.status === 'failed';

  return (
    <>
      <div className={styles.detailHead}>
        <span className={styles.detailId}>{txn.id}</span>
        <StatusBadge tone={STATUS_TONE[txn.status]}>{STATUS_LABEL[txn.status]}</StatusBadge>
      </div>

      <div className={styles.detailType}>{meta.label}</div>
      <div className={styles.detailAmount}>
        <AmountText amount={txn.amount} direction={txn.type === 'topup' ? 'credit' : 'debit'} muted={muted} hero />
      </div>

      {txn.shipmentId ? (
        <div className={styles.block}>
          <SectionLabel>الرحلة المرتبطة</SectionLabel>
          <div className={styles.linkedTrip}>
            <div className={styles.linkedTripId}>{txn.shipmentId}</div>
            <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 700, color: 'var(--lw-navy-900)' }}>
              {txn.from} ← {txn.to}
            </div>
            <div className={styles.linkedCargo}>{txn.cargo}</div>
          </div>
        </div>
      ) : null}

      {txn.subtotal && txn.vat ? (
        <div className={styles.block}>
          <SectionLabel>تفاصيل الفاتورة</SectionLabel>
          <div className={styles.invoice}>
            <div className={styles.invoiceRow}>
              <span>المبلغ قبل الضريبة</span>
              <span className={styles.invoiceValue}>{txn.subtotal} ر.س</span>
            </div>
            <div className={styles.invoiceRow}>
              <span>ضريبة القيمة المضافة (15%)</span>
              <span className={styles.invoiceValue}>{txn.vat} ر.س</span>
            </div>
            <div className={styles.invoiceRow}>
              <span>الإجمالي</span>
              <span className={styles.invoiceValue}>{txn.amount} ر.س</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.block}>
        <SectionLabel>طريقة الدفع</SectionLabel>
        <div className={styles.methodLine}>{txn.method}</div>
      </div>

      <div className={styles.block}>
        <SectionLabel>سجل الحالة</SectionLabel>
        <StatusTimeline
          steps={[
            { label: 'تم إنشاء العملية', meta: `${txn.date} · ${txn.time}`, dotColor: 'var(--lw-slate-300)' },
            { label: FINAL_LABEL[txn.status], note: txn.note, dotColor: FINAL_DOT[txn.status] },
          ]}
        />
      </div>
    </>
  );
}
