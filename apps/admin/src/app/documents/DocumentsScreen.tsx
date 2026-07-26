'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellEmpty,
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
  type DocumentEntityType,
  type ReviewDocument,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * مراجعة الوثائق والتصاريح — SRS M04-E06.
 *
 * The Blocking / Warning split (SRS §13.3) is the operationally important bit:
 * a blocking permit stops the trip, a warning one only flags it. The queue
 * surfaces that distinction on every row rather than burying it in the panel.
 */

const STATUS_META: Record<ReviewDocument['status'], { tone: BadgeTone; label: string }> = {
  'Under Review': { tone: 'warning', label: 'قيد المراجعة' },
  Approved: { tone: 'success', label: 'معتمدة' },
  Rejected: { tone: 'danger', label: 'مرفوضة' },
  Expired: { tone: 'danger', label: 'منتهية' },
  Uploaded: { tone: 'neutral', label: 'مرفوعة' },
};

const ENTITY_LABEL: Record<DocumentEntityType, string> = {
  driver: 'سائق',
  truck: 'شاحنة',
  company: 'شركة',
  customer: 'عميل',
  shipment: 'رحلة',
};

const ENTITY_ICON: Record<DocumentEntityType, 'user' | 'truck' | 'home' | 'document'> = {
  driver: 'user',
  truck: 'truck',
  company: 'home',
  customer: 'user',
  shipment: 'document',
};

const TABS: { key: string; label: string; match: (d: ReviewDocument) => boolean }[] = [
  { key: 'all', label: 'الكل', match: () => true },
  { key: 'driver', label: 'سائقون', match: (d) => d.entityType === 'driver' },
  { key: 'truck', label: 'شاحنات', match: (d) => d.entityType === 'truck' },
  { key: 'company', label: 'شركات', match: (d) => d.entityType === 'company' || d.entityType === 'customer' },
  { key: 'shipment', label: 'رحلات', match: (d) => d.entityType === 'shipment' },
];

const RULES = [
  { value: 'all', label: 'القاعدة: الكل' },
  { value: 'blocking', label: 'مانعة (Blocking)' },
  { value: 'warning', label: 'تحذيرية (Warning)' },
  { value: 'none', label: 'بدون قاعدة' },
];

const STATUSES = [
  { value: 'pending', label: 'الحالة: قيد المراجعة' },
  { value: 'all', label: 'الحالة: الكل' },
  { value: 'Approved', label: 'معتمدة' },
  { value: 'Rejected', label: 'مرفوضة' },
  { value: 'Expired', label: 'منتهية' },
];

export function DocumentsScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [rule, setRule] = React.useState('all');
  const [status, setStatus] = React.useState('pending');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [rejecting, setRejecting] = React.useState<ReviewDocument | null>(null);

  const pendingCount = (m: (d: ReviewDocument) => boolean) =>
    state.documents.filter((d) => d.status === 'Under Review' && m(d)).length;

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const tabMatch = TABS.find((t) => t.key === tab)!.match;
    return state.documents.filter((d) => {
      if (!tabMatch(d)) return false;
      if (rule !== 'all' && d.rule !== rule) return false;
      if (status === 'pending' ? d.status !== 'Under Review' : status !== 'all' && d.status !== status) return false;
      if (q && !`${d.id} ${d.documentType} ${d.entityName} ${d.shipmentId ?? ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.documents, tab, rule, status, search]);

  const mode = resolveMode(view, rows.length);
  const selected = selectedId ? state.documents.find((d) => d.id === selectedId) ?? null : null;

  const decide = (id: string, decision: 'Approved' | 'Rejected', reason?: string) => {
    dispatch({ type: 'document/decide', id, decision, reason });
    setSelectedId(null);
    setRejecting(null);
  };

  return (
    <>
      <AdminHeader title="مراجعة الوثائق والتصاريح" subtitle="طابور مراجعة موحّد لكل الوثائق والتصاريح على مستوى المنصة" />

      <FilterBar>
        <TabGroup
          tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: pendingCount(t.match) }))}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setSelectedId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث بالمستند أو الكيان…" aria-label="ابحث عن مستند" />
        <SelectField value={status} onChange={setStatus} options={STATUSES} aria-label="تصفية حسب الحالة" />
        <SelectField value={rule} onChange={setRule} options={RULES} aria-label="تصفية حسب القاعدة" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير الطابور
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>المستند</th>
                  <th>الكيان</th>
                  <th>الرحلة</th>
                  <th>رُفع</th>
                  <th>تنتهي</th>
                  <th>القاعدة</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((d) => (
                <tr key={d.id} onClick={() => setSelectedId(d.id)}>
                  <td>
                    <CellStack>
                      <RowIcon icon="document" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                      <div>
                        <CellPrimary>{d.documentType}</CellPrimary>
                        <CellSecondary>{d.category}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellStack>
                      <RowIcon icon={ENTITY_ICON[d.entityType]} background="var(--lw-bg-subtle)" color="var(--lw-slate-500)" />
                      <div>
                        <CellPrimary>{d.entityName}</CellPrimary>
                        <CellSecondary>{ENTITY_LABEL[d.entityType]}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>{d.shipmentId ? <CellPrimary ltr>{d.shipmentId}</CellPrimary> : <CellEmpty />}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellSecondary>{d.uploadedAt}</CellSecondary>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {d.expiryDate ? <CellSecondary>{d.expiryDate}</CellSecondary> : <CellEmpty />}
                  </td>
                  <td>
                    {d.rule === 'blocking' ? (
                      <StatusBadge tone="danger">مانعة</StatusBadge>
                    ) : d.rule === 'warning' ? (
                      <StatusBadge tone="warning">تحذيرية</StatusBadge>
                    ) : (
                      <CellEmpty />
                    )}
                  </td>
                  <td>
                    <StatusBadge tone={STATUS_META[d.status].tone}>{STATUS_META[d.status].label}</StatusBadge>
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
                    options={viewOptions('لا توجد وثائق')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel
              title="مراجعة المستند"
              onClose={() => setSelectedId(null)}
              footer={
                selected.status === 'Under Review' ? (
                  <>
                    <PanelCta icon="check" onClick={() => decide(selected.id, 'Approved')}>
                      اعتماد المستند
                    </PanelCta>
                    <PanelCta variant="danger" onClick={() => setRejecting(selected)}>
                      رفض وطلب إعادة الرفع
                    </PanelCta>
                  </>
                ) : undefined
              }
            >
              {selected.rule === 'blocking' ? (
                <div style={{ marginBottom: 16 }}>
                  <AlertBanner tone="danger">
                    تصريح مانع — لا يمكن بدء التحميل على الرحلة المرتبطة قبل اعتماده.
                  </AlertBanner>
                </div>
              ) : selected.rule === 'warning' ? (
                <div style={{ marginBottom: 16 }}>
                  <AlertBanner tone="warning">تصريح تحذيري — لا يمنع الرحلة لكنه يظهر كتنبيه للأطراف.</AlertBanner>
                </div>
              ) : null}

              {selected.decisionReason ? (
                <div style={{ marginBottom: 16 }}>
                  <AlertBanner tone="danger">{selected.decisionReason}</AlertBanner>
                </div>
              ) : null}

              <DocumentViewer
                tall
                name={`${selected.documentType}.pdf`}
                meta={`${selected.category} · ${selected.sizeLabel}`}
                onDownload={() => {}}
                onExpand={() => {}}
              />

              <div style={{ marginTop: 20 }}>
                <SectionLabel>بيانات المستند</SectionLabel>
                <DetailList>
                  <DetailRow label="المعرّف">
                    <span className="lw-ltr">{selected.id}</span>
                  </DetailRow>
                  <DetailRow label="الكيان">
                    {selected.entityName} · {ENTITY_LABEL[selected.entityType]}
                  </DetailRow>
                  <DetailRow label="رقم الكيان">
                    <span className="lw-ltr">{selected.entityId}</span>
                  </DetailRow>
                  {selected.shipmentId ? (
                    <DetailRow label="الرحلة المرتبطة">
                      <span className="lw-ltr">{selected.shipmentId}</span>
                    </DetailRow>
                  ) : null}
                  <DetailRow label="رفعه">{selected.uploadedBy}</DetailRow>
                  <DetailRow label="تاريخ الرفع">{selected.uploadedAt}</DetailRow>
                  {selected.expiryDate ? <DetailRow label="تاريخ الانتهاء">{selected.expiryDate}</DetailRow> : null}
                </DetailList>
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={6} label="جارٍ تحميل طابور الوثائق…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل طابور الوثائق"
          body="حدث خطأ أثناء جلب الوثائق. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="document" title="لا توجد وثائق للمراجعة" body="الوثائق والتصاريح المرفوعة حديثاً ستظهر هنا." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setRule('all');
            setStatus('pending');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={rejecting !== null}
        onClose={() => setRejecting(null)}
        onConfirm={(reason) => rejecting && decide(rejecting.id, 'Rejected', reason)}
        tone="danger"
        title="رفض المستند"
        body={`سيُطلب من ${rejecting?.uploadedBy ?? ''} إعادة رفع «${rejecting?.documentType ?? ''}» مع السبب الذي تكتبه.`}
        confirmLabel="تأكيد الرفض"
        reasonRequired
        reasonPlaceholder="مثال: الصورة غير واضحة ولا يظهر فيها تاريخ الانتهاء."
      />
    </>
  );
}
