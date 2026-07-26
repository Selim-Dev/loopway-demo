'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellPrimary,
  CellSecondary,
  CellStack,
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
  PhotoGrid,
  PrimaryCta,
  RowIcon,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TableCard,
  ViewStateLabel,
  type BadgeTone,
  type Truck,
  type TruckStatus,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/** اعتماد الشاحنات — SRS M04-E04. */

const TAB_STATUS: Record<string, TruckStatus[]> = {
  pending: ['Pending Review'],
  approved: ['Approved'],
  update: ['Needs Update', 'Registration Expired', 'Insurance Expired'],
  suspended: ['Suspended', 'Rejected'],
};

const STATUS_META: Record<TruckStatus, { tone: BadgeTone; label: string }> = {
  'Pending Review': { tone: 'warning', label: 'قيد المراجعة' },
  Approved: { tone: 'success', label: 'معتمدة' },
  Rejected: { tone: 'danger', label: 'مرفوضة' },
  'Needs Update': { tone: 'warning', label: 'تحتاج تحديث' },
  'Insurance Expired': { tone: 'danger', label: 'تأمين منتهٍ' },
  'Registration Expired': { tone: 'danger', label: 'استمارة منتهية' },
  Suspended: { tone: 'danger', label: 'موقوفة' },
};

const TYPES = [
  { value: 'all', label: 'النوع: الكل' },
  { value: 'ستة محاور — سطحة', label: 'ستة محاور — سطحة' },
  { value: 'لوبد', label: 'لوبد' },
  { value: 'مبردة', label: 'مبردة' },
  { value: 'ستائر جانبية', label: 'ستائر جانبية' },
];

/**
 * Expiry urgency. Fixtures live in July 2026, so "today" is the pinned session
 * date rather than the wall clock — same reason the B2B calendar pins it.
 */
const TODAY = new Date(2026, 6, 24);
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function expiryTone(dateAr: string): { tone: BadgeTone; note: string } {
  const m = dateAr.match(/^(\d+)\s+(\S+)\s+(\d{4})$/);
  if (!m) return { tone: 'neutral', note: dateAr };
  const monthIndex = MONTHS.indexOf(m[2]);
  const when = new Date(Number(m[3]), monthIndex < 0 ? 0 : monthIndex, Number(m[1]));
  const days = Math.round((when.getTime() - TODAY.getTime()) / 86_400_000);
  if (days < 0) return { tone: 'danger', note: 'منتهية' };
  if (days <= 30) return { tone: 'warning', note: `تنتهي خلال ${days} يوماً` };
  return { tone: 'success', note: 'سارية' };
}

type Decision = { kind: 'reject' | 'update'; truck: Truck } | null;

export function TrucksScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('pending');
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<Decision>(null);

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS).map(([k, v]) => [k, state.trucks.filter((t) => v.includes(t.status)).length]),
      ) as Record<string, number>,
    [state.trucks],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.trucks.filter((t) => {
      if (!TAB_STATUS[tab].includes(t.status)) return false;
      if (type !== 'all' && t.truckType !== type) return false;
      if (q && !`${t.id} ${t.plateNumber} ${t.driverName} ${t.modelName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.trucks, tab, type, search]);

  const mode = resolveMode(view, rows.length);
  const selected = selectedId ? state.trucks.find((t) => t.id === selectedId) ?? null : null;

  const decide = (id: string, status: TruckStatus, reason?: string) => {
    dispatch({ type: 'truck/decide', id, decision: status as never, reason });
    setSelectedId(null);
    setDecision(null);
  };

  return (
    <>
      <AdminHeader title="اعتماد الشاحنات" subtitle="مراجعة بيانات الشاحنة والاستمارة والتأمين والصور واعتمادها" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'pending', label: 'بانتظار المراجعة', count: counts.pending },
            { key: 'approved', label: 'معتمدة', count: counts.approved },
            { key: 'update', label: 'تحتاج تحديث', count: counts.update },
            { key: 'suspended', label: 'موقوفة', count: counts.suspended },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث باللوحة أو السائق…" aria-label="ابحث عن شاحنة" />
        <SelectField value={type} onChange={setType} options={TYPES} aria-label="تصفية حسب النوع" />
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
                  <th>اللوحة</th>
                  <th>النوع</th>
                  <th>السائق</th>
                  <th>الموديل</th>
                  <th>الاستمارة</th>
                  <th>التأمين</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((t) => {
                const reg = expiryTone(t.registrationExpiry);
                const ins = expiryTone(t.insuranceExpiry);
                return (
                  <tr key={t.id} onClick={() => setSelectedId(t.id)}>
                    <td>
                      <CellStack>
                        <RowIcon icon="truck" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                        <div>
                          <CellPrimary ltr>{t.plateNumber}</CellPrimary>
                          <CellSecondary ltr>{t.id}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary>{t.truckType}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary>{t.driverName}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary>{t.modelName}</CellPrimary>
                      <CellSecondary ltr>{t.modelYear}</CellSecondary>
                    </td>
                    <td>
                      <StatusBadge tone={reg.tone}>{t.registrationExpiry}</StatusBadge>
                    </td>
                    <td>
                      <StatusBadge tone={ins.tone}>{t.insuranceExpiry}</StatusBadge>
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_META[t.status].tone}>{STATUS_META[t.status].label}</StatusBadge>
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
                    options={viewOptions('لا توجد شاحنات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel
              title="مراجعة الشاحنة"
              onClose={() => setSelectedId(null)}
              footer={
                selected.status === 'Pending Review' || selected.status === 'Needs Update' ? (
                  <>
                    <PanelCta icon="check" onClick={() => decide(selected.id, 'Approved')}>
                      اعتماد الشاحنة
                    </PanelCta>
                    <PanelCta variant="ghost" onClick={() => setDecision({ kind: 'update', truck: selected })}>
                      طلب تحديث الوثائق
                    </PanelCta>
                    <PanelCta variant="danger" onClick={() => setDecision({ kind: 'reject', truck: selected })}>
                      رفض الشاحنة
                    </PanelCta>
                  </>
                ) : undefined
              }
            >
              <TruckDetail truck={selected} />
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل بيانات الشاحنات…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل الشاحنات"
          body="حدث خطأ أثناء جلب قائمة الشاحنات. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="truck" title="لا توجد شاحنات في هذا التبويب" body="طلبات اعتماد الشاحنات الجديدة ستظهر هنا." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setType('all');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={decision?.kind === 'reject'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.truck.id, 'Rejected', reason)}
        tone="danger"
        title="رفض الشاحنة"
        body={`لن تتمكن الشاحنة ${decision?.truck.plateNumber ?? ''} من استقبال أي رحلات. سيصل السائق إشعار بالسبب.`}
        confirmLabel="تأكيد الرفض"
        reasonRequired
      />

      <ConfirmDialog
        open={decision?.kind === 'update'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => decision && decide(decision.truck.id, 'Needs Update', reason)}
        tone="warning"
        title="طلب تحديث وثائق الشاحنة"
        body="يبقى الطلب مفتوحاً وسيصل السائق إشعار بما هو مطلوب تحديثه."
        confirmLabel="إرسال الطلب"
        reasonRequired
        reasonLabel="ما المطلوب تحديثه"
        reasonPlaceholder="مثال: وثيقة التأمين منتهية — ارفع الوثيقة الجديدة سارية المفعول."
      />
    </>
  );
}

function TruckDetail({ truck }: { truck: Truck }) {
  const reg = expiryTone(truck.registrationExpiry);
  const ins = expiryTone(truck.insuranceExpiry);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 19, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr', color: 'var(--lw-navy-900)' }}>
          {truck.plateNumber}
        </span>
        <StatusBadge tone={STATUS_META[truck.status].tone}>{STATUS_META[truck.status].label}</StatusBadge>
      </div>

      {truck.decisionReason ? (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner tone="danger">{truck.decisionReason}</AlertBanner>
        </div>
      ) : null}

      {reg.tone !== 'success' || ins.tone !== 'success' ? (
        <div style={{ marginBottom: 16 }}>
          <AlertBanner tone={reg.tone === 'danger' || ins.tone === 'danger' ? 'danger' : 'warning'}>
            {reg.tone !== 'success' ? `الاستمارة: ${reg.note}. ` : ''}
            {ins.tone !== 'success' ? `التأمين: ${ins.note}.` : ''}
          </AlertBanner>
        </div>
      ) : null}

      <SectionLabel>بيانات الشاحنة</SectionLabel>
      <DetailList>
        <DetailRow label="النوع">{truck.truckType}</DetailRow>
        <DetailRow label="الموديل">
          {truck.modelName} · <span className="lw-ltr">{truck.modelYear}</span>
        </DetailRow>
        <DetailRow label="السائق">{truck.driverName}</DetailRow>
        <DetailRow label="رقم السائق">
          <span className="lw-ltr">{truck.driverId}</span>
        </DetailRow>
        <DetailRow label="تاريخ التقديم">{truck.submittedAt}</DetailRow>
      </DetailList>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>صور الشاحنة</SectionLabel>
        <PhotoGrid captions={truck.photos} />
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>الوثائق</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DocumentViewer
            name="vehicle-registration.pdf"
            meta={`الاستمارة · تنتهي ${truck.registrationExpiry} · ${reg.note}`}
            onDownload={() => {}}
          />
          <DocumentViewer
            name="insurance-policy.pdf"
            meta={`وثيقة التأمين ${truck.insurancePolicy} · تنتهي ${truck.insuranceExpiry} · ${ins.note}`}
            onDownload={() => {}}
          />
        </div>
      </div>
    </>
  );
}
