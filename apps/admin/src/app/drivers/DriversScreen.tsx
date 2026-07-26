'use client';

import * as React from 'react';
import {
  AlertBanner,
  AvatarInitial,
  CellPrimary,
  CellSecondary,
  CellStack,
  ChipList,
  ConfirmDialog,
  DataTable,
  DetailList,
  DetailRow,
  DocumentViewer,
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
  Tag,
  ViewStateLabel,
  type BadgeTone,
  type Driver,
  type DriverStatus,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * اعتماد السائقين — SRS M04-E03.
 *
 * The reference implementation of the approval-queue pattern: tabs by status,
 * a table, a review SidePanel with per-document decisions, and a decision
 * footer whose destructive branch routes through ConfirmDialog.
 *
 * "Rejecting always requires a reason. No silent rejects." —
 * docs/design-system/10-admin-portal-guide.md
 */

const TAB_STATUS: Record<string, DriverStatus[]> = {
  pending: ['Under Review', 'Submitted', 'Needs More Info'],
  approved: ['Approved'],
  rejected: ['Rejected'],
  suspended: ['Suspended', 'Documents Expired'],
};

const STATUS_META: Record<DriverStatus, { tone: BadgeTone; label: string }> = {
  Draft: { tone: 'neutral', label: 'مسودة' },
  Submitted: { tone: 'warning', label: 'مُقدَّم' },
  'Under Review': { tone: 'warning', label: 'قيد المراجعة' },
  Approved: { tone: 'success', label: 'معتمد' },
  Rejected: { tone: 'danger', label: 'مرفوض' },
  'Needs More Info': { tone: 'warning', label: 'بحاجة معلومات' },
  Suspended: { tone: 'danger', label: 'موقوف' },
  'Documents Expired': { tone: 'danger', label: 'وثائق منتهية' },
};

const NATIONALITIES = [
  { value: 'all', label: 'الجنسية: الكل' },
  { value: 'سعودي', label: 'سعودي' },
  { value: 'يمني', label: 'يمني' },
  { value: 'سوداني', label: 'سوداني' },
];

type Decision = { kind: 'reject' | 'suspend' | 'info'; driver: Driver } | null;

export function DriversScreen() {
  const { state, dispatch } = useAdminStore();

  const [tab, setTab] = React.useState('pending');
  const [search, setSearch] = React.useState('');
  const [nationality, setNationality] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<Decision>(null);

  const counts = React.useMemo(
    () => ({
      pending: state.drivers.filter((d) => TAB_STATUS.pending.includes(d.status)).length,
      approved: state.drivers.filter((d) => TAB_STATUS.approved.includes(d.status)).length,
      rejected: state.drivers.filter((d) => TAB_STATUS.rejected.includes(d.status)).length,
      suspended: state.drivers.filter((d) => TAB_STATUS.suspended.includes(d.status)).length,
    }),
    [state.drivers],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.drivers.filter((d) => {
      if (!TAB_STATUS[tab].includes(d.status)) return false;
      if (nationality !== 'all' && d.nationality !== nationality) return false;
      if (q && !`${d.id} ${d.name} ${d.mobile} ${d.identityNumber}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.drivers, tab, nationality, search]);

  const mode = resolveMode(view, rows.length);
  const selected = selectedId ? state.drivers.find((d) => d.id === selectedId) ?? null : null;

  const resetFilters = () => {
    setSearch('');
    setNationality('all');
    setView('default');
  };

  const decide = (id: string, status: DriverStatus, reason?: string) => {
    dispatch({ type: 'driver/decide', id, decision: status as never, reason });
    setSelectedId(null);
    setDecision(null);
  };

  return (
    <>
      <AdminHeader title="اعتماد السائقين" subtitle="مراجعة طلبات تسجيل السائقين ووثائقهم واعتمادها أو رفضها" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'pending', label: 'بانتظار المراجعة', count: counts.pending },
            { key: 'approved', label: 'معتمدون', count: counts.approved },
            { key: 'rejected', label: 'مرفوضون', count: counts.rejected },
            { key: 'suspended', label: 'موقوفون', count: counts.suspended },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedId(null);
          }}
        />
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="ابحث بالاسم أو الجوال أو رقم الهوية…"
          aria-label="ابحث عن سائق"
        />
        <SelectField value={nationality} onChange={setNationality} options={NATIONALITIES} aria-label="تصفية حسب الجنسية" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير القائمة
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>السائق</th>
                  <th>الجوال</th>
                  <th>الجنسية</th>
                  <th>أنواع الشحنات المقبولة</th>
                  <th>الوثائق</th>
                  <th>تاريخ التقديم</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((d) => {
                const meta = STATUS_META[d.status];
                const decided = d.documents.filter((x) => x.decision === 'approved').length;
                return (
                  <tr key={d.id} onClick={() => setSelectedId(d.id)}>
                    <td>
                      <CellStack>
                        <AvatarInitial initial={d.initial} size={36} fontSize={14} />
                        <div>
                          <CellPrimary>{d.name}</CellPrimary>
                          <CellSecondary ltr>{d.id}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary ltr>{d.mobile}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary>{d.nationality}</CellPrimary>
                    </td>
                    <td>
                      <CellSecondary>{d.acceptedCargoTypes.join('، ')}</CellSecondary>
                    </td>
                    <td>
                      <CellPrimary ltr>
                        {decided}/{d.documents.length}
                      </CellPrimary>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CellSecondary>{d.submittedAt}</CellSecondary>
                    </td>
                    <td>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </td>
                  </tr>
                );
              })}
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
                    options={viewOptions('لا يوجد سائقون')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel
              title="مراجعة السائق"
              onClose={() => setSelectedId(null)}
              footer={
                selected.status === 'Under Review' || selected.status === 'Needs More Info' ? (
                  <>
                    <PanelCta icon="check" onClick={() => decide(selected.id, 'Approved')}>
                      اعتماد السائق
                    </PanelCta>
                    <PanelCta variant="ghost" onClick={() => setDecision({ kind: 'info', driver: selected })}>
                      طلب معلومات إضافية
                    </PanelCta>
                    <PanelCta variant="danger" onClick={() => setDecision({ kind: 'reject', driver: selected })}>
                      رفض الطلب
                    </PanelCta>
                  </>
                ) : selected.status === 'Approved' ? (
                  <PanelCta variant="danger" onClick={() => setDecision({ kind: 'suspend', driver: selected })}>
                    إيقاف الحساب
                  </PanelCta>
                ) : undefined
              }
            >
              <DriverDetail driver={selected} onDoc={(docId, d) => dispatch({ type: 'driverDoc/decide', driverId: selected.id, docId, decision: d })} />
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={6} label="جارٍ تحميل طلبات السائقين…" /> : null}

      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل طلبات السائقين"
          body="حدث خطأ أثناء جلب قائمة السائقين. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}

      {mode === 'empty' ? (
        <EmptyState
          glyph="user"
          title="لا توجد طلبات في هذا التبويب"
          body="طلبات تسجيل السائقين الجديدة ستظهر هنا فور تقديمها من التطبيق."
        />
      ) : null}

      {mode === 'noresults' ? <NoResultsState onClearFilters={resetFilters} /> : null}

      {/* ---- Decision dialogs. Every one of these requires a reason. ---- */}
      <ConfirmDialog
        open={decision?.kind === 'reject'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.driver.id, 'Rejected', reason)}
        tone="danger"
        title="رفض طلب السائق"
        body={`سيُبلَّغ ${decision?.driver.name ?? ''} بالرفض وبالسبب الذي تكتبه. لن يتمكن من استقبال أي طلبات.`}
        confirmLabel="تأكيد الرفض"
        reasonRequired
      />

      <ConfirmDialog
        open={decision?.kind === 'suspend'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.driver.id, 'Suspended', reason)}
        tone="danger"
        title="إيقاف حساب السائق"
        body={`سيتوقف ${decision?.driver.name ?? ''} عن استقبال الطلبات فوراً. الرحلات الجارية لا تتأثر.`}
        confirmLabel="تأكيد الإيقاف"
        reasonRequired
        reasonLabel="سبب الإيقاف"
      />

      <ConfirmDialog
        open={decision?.kind === 'info'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.driver.id, 'Needs More Info', reason)}
        tone="warning"
        title="طلب معلومات إضافية"
        body={`سيبقى الطلب مفتوحاً وسيصل ${decision?.driver.name ?? ''} إشعار بما هو مطلوب منه.`}
        confirmLabel="إرسال الطلب"
        reasonRequired
        reasonLabel="ما المطلوب من السائق"
        reasonPlaceholder="مثال: أعد رفع رخصة القيادة بصورة واضحة تُظهر تاريخ الانتهاء."
      />
    </>
  );
}

function DriverDetail({
  driver,
  onDoc,
}: {
  driver: Driver;
  onDoc: (docId: string, decision: 'approved' | 'rejected') => void;
}) {
  const meta = STATUS_META[driver.status];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AvatarInitial initial={driver.initial} size={44} fontSize={17} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{driver.name}</div>
          <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
            <span className="lw-ltr">{driver.id}</span>
          </div>
        </div>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      {driver.decisionReason ? (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner tone={driver.status === 'Approved' ? 'info' : 'danger'}>{driver.decisionReason}</AlertBanner>
        </div>
      ) : null}

      <SectionLabel>البيانات الشخصية</SectionLabel>
      <DetailList>
        <DetailRow label="رقم الهوية">
          <span className="lw-ltr">{driver.identityNumber}</span>
        </DetailRow>
        <DetailRow label="الجنسية">{driver.nationality}</DetailRow>
        <DetailRow label="الجوال">
          <span className="lw-ltr">{driver.mobile}</span>
        </DetailRow>
        <DetailRow label="تاريخ التقديم">{driver.submittedAt}</DetailRow>
        {driver.truckPlate ? (
          <DetailRow label="الشاحنة المرفقة">
            <span className="lw-ltr">{driver.truckPlate}</span>
          </DetailRow>
        ) : null}
      </DetailList>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>أنواع الشحنات المقبولة</SectionLabel>
        <ChipList>
          {driver.acceptedCargoTypes.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </ChipList>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>الوثائق</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {driver.documents.map((doc) => (
            <DocumentViewer
              key={doc.id}
              name={doc.fileName}
              meta={`${doc.type} · ${doc.sizeLabel}${doc.expiryDate ? ` · تنتهي ${doc.expiryDate}` : ''}`}
              decision={doc.decision}
              onDownload={() => {}}
              onApprove={() => onDoc(doc.id, 'approved')}
              onReject={() => onDoc(doc.id, 'rejected')}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>اتفاقية التزام السائق</SectionLabel>
        <DetailList>
          <DetailRow label="الإصدار">
            <span className="lw-ltr">{driver.agreementVersion}</span>
          </DetailRow>
          <DetailRow label="وقت القبول">{driver.agreementAcceptedAt}</DetailRow>
        </DetailList>
      </div>
    </>
  );
}
