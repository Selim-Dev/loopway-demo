'use client';

import * as React from 'react';
import {
  AlertBanner,
  AmountText,
  AvatarInitial,
  CellPrimary,
  CellSecondary,
  CellStack,
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
  PanelCta,
  PrimaryCta,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TableCard,
  ViewStateLabel,
  type BadgeTone,
  type CarrierDueStatus,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { formatMoney, parseMoney } from '@/mocks/finance';
import { useAdminStore } from '@/store/AdminStore';
import styles from './CarrierDues.module.css';

/**
 * إدارة مستحقات الشركات — SRS M04-E11.
 *
 * The platform settles with the transport company, not with the driver. The
 * substance of this screen is the per-trip breakdown in the panel: trip value,
 * minus platform commission and fees, minus APPROVED penalties, equals the net
 * owed.
 *
 * Two rules meet in that table:
 *   BR-012 — a penalty has no financial effect until an admin approves it, so a
 *            `Pending Review` penalty must never appear on a line here.
 *   Arithmetic — `totalDue` is summed from the lines, never typed in. A total
 *            that does not add up is worse than no total.
 */

const STATUS_TONE: Record<CarrierDueStatus, BadgeTone> = {
  'قيد المراجعة': 'warning',
  'جاهز للصرف': 'success',
  'تم الصرف': 'neutral',
};

const TABS: { key: string; label: string; status?: CarrierDueStatus }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'review', label: 'قيد المراجعة', status: 'قيد المراجعة' },
  { key: 'ready', label: 'جاهز للصرف', status: 'جاهز للصرف' },
  { key: 'paid', label: 'تم الصرف', status: 'تم الصرف' },
];

const CITY_FILTER = [
  { value: 'all', label: 'المدينة: الكل' },
  { value: 'الرياض', label: 'الرياض' },
  { value: 'الدمام', label: 'الدمام' },
  { value: 'جدة', label: 'جدة' },
];

export function CarrierDuesScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState(false);

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        TABS.map((t) => [t.key, t.status ? state.carrierDues.filter((d) => d.status === t.status).length : state.carrierDues.length]),
      ),
    [state.carrierDues],
  );

  const rows = React.useMemo(() => {
    const wanted = TABS.find((t) => t.key === tab)?.status;
    const q = search.trim();
    return state.carrierDues.filter((d) => {
      if (wanted && d.status !== wanted) return false;
      if (q && !`${d.carrierName} ${d.carrierId}`.includes(q)) return false;
      return true;
    });
  }, [state.carrierDues, tab, search]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? state.carrierDues.find((d) => d.carrierId === openId) ?? null : null;

  return (
    <>
      <AdminHeader
        title="إدارة مستحقات الشركات"
        subtitle="مستحقات شركات النقل مفصّلة حسب الرحلات، من المراجعة حتى الصرف"
      />

      <FilterBar>
        <TabGroup
          tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] }))}
          active={tab}
          onChange={setTab}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث باسم الشركة…" aria-label="ابحث عن شركة" />
        <SelectField value="all" onChange={() => {}} options={CITY_FILTER} aria-label="تصفية حسب المدينة" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير كشف المستحقات
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>الشركة</th>
                  <th>رحلات غير مسوّاة</th>
                  <th>إجمالي المستحقات</th>
                  <th>الحالة</th>
                  <th>آخر تحديث</th>
                </>
              }
            >
              {rows.map((d) => (
                <tr key={d.carrierId} onClick={() => setOpenId(d.carrierId)}>
                  <td>
                    <CellStack>
                      <AvatarInitial initial={d.initial} variant="driver" size={34} fontSize={13} />
                      <div>
                        <CellPrimary>{d.carrierName}</CellPrimary>
                        <CellSecondary ltr>{d.carrierId}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellPrimary ltr>{d.unsettledTrips}</CellPrimary>
                    <CellSecondary>رحلة مكتملة</CellSecondary>
                  </td>
                  <td>
                    <AmountText amount={d.totalDue} direction="debit" currency="ر.س" muted={d.status === 'تم الصرف'} />
                  </td>
                  <td>
                    <StatusBadge tone={STATUS_TONE[d.status]}>{d.status}</StatusBadge>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellSecondary>{d.updatedAt}</CellSecondary>
                  </td>
                </tr>
              ))}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={rows.length}
              total={state.carrierDues.length}
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
            <SidePanel
              title="تفاصيل المستحقات"
              onClose={() => setOpenId(null)}
              footer={
                open.status === 'جاهز للصرف' ? (
                  <PanelCta icon="arrowOut" onClick={() => setConfirming(true)}>
                    صرف المستحقات
                  </PanelCta>
                ) : undefined
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{open.carrierName}</span>
                <StatusBadge tone={STATUS_TONE[open.status]}>{open.status}</StatusBadge>
              </div>

              <DetailList>
                <DetailRow label="معرّف الشركة">
                  <span className="lw-ltr">{open.carrierId}</span>
                </DetailRow>
                <DetailRow label="الحساب البنكي">
                  <span className="lw-ltr">{open.bankAccount}</span>
                </DetailRow>
                <DetailRow label="رحلات غير مسوّاة">
                  <span className="lw-ltr">{open.unsettledTrips}</span> رحلة
                </DetailRow>
                <DetailRow label="آخر تحديث">{open.updatedAt}</DetailRow>
                {open.paidAt ? <DetailRow label="تاريخ الصرف">{open.paidAt}</DetailRow> : null}
              </DetailList>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>تفصيل المستحقات حسب الرحلات</SectionLabel>

                <div className={styles.breakdown}>
                  {open.trips.map((t) => (
                    <div key={t.shipmentId} className={styles.trip}>
                      <div className={styles.tripHead}>
                        <span className={`${styles.tripId} lw-ltr`}>{t.shipmentId}</span>
                        <span className={styles.tripRoute}>{t.route}</span>
                      </div>
                      <div className={styles.tripMeta}>
                        {t.driverName} · اكتملت في {t.completedAt}
                      </div>

                      <dl className={styles.lines}>
                        <div className={styles.line}>
                          <dt>قيمة الرحلة</dt>
                          <dd className="lw-ltr">{t.tripValue}</dd>
                        </div>
                        <div className={styles.line}>
                          <dt>عمولة ورسوم المنصة</dt>
                          <dd className={`${styles.deduct} lw-ltr`}>− {t.platformFee}</dd>
                        </div>
                        {parseMoney(t.penalties) > 0 ? (
                          <div className={styles.line}>
                            <dt>الغرامات المعتمدة</dt>
                            <dd className={`${styles.deduct} lw-ltr`}>− {t.penalties}</dd>
                          </div>
                        ) : null}
                        <div className={`${styles.line} ${styles.lineNet}`}>
                          <dt>الصافي</dt>
                          <dd className="lw-ltr">{t.net}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}

                  <div className={styles.total}>
                    <span>إجمالي المستحق للشركة</span>
                    <span className="lw-ltr">{open.totalDue} ر.س</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <AlertBanner tone="info" icon="document">
                  الغرامات الظاهرة أعلاه معتمدة من الإدارة فقط. الغرامة قيد المراجعة لا تُخصم من المستحقات.
                </AlertBanner>
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل المستحقات…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل المستحقات"
          body="حدث خطأ أثناء جلب مستحقات شركات النقل. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="truck" title="لا توجد مستحقات" body="ستظهر المستحقات هنا بعد اكتمال أول رحلة غير مسوّاة." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setTab('all');
            setView('default');
          }}
        />
      ) : null}

      {/* The most irreversible action in the portal: money leaves the platform. */}
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          if (open) dispatch({ type: 'dues/pay', carrierId: open.carrierId });
          setConfirming(false);
        }}
        tone="warning"
        title="صرف مستحقات الشركة"
        body="سيُحوَّل المبلغ إلى حساب الشركة البنكي ولا يمكن التراجع عن العملية من داخل اللوحة."
        confirmLabel="تأكيد الصرف"
        summary={
          open ? (
            <>
              {open.carrierName} · <span className="lw-ltr">{open.unsettledTrips}</span> رحلة · صافٍ{' '}
              <span className="lw-ltr">{open.totalDue}</span> ر.س إلى <span className="lw-ltr">{open.bankAccount}</span>
            </>
          ) : undefined
        }
      />
    </>
  );
}

export { formatMoney };
