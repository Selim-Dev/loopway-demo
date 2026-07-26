'use client';

import * as React from 'react';
import {
  AlertBanner,
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
  RouteChips,
  ScopeTag,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  Tag,
  ChipList,
  TableCard,
  Timeline,
  ViewStateLabel,
  type AdminShipment,
  type BadgeTone,
  type TimelineItem,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { ADMIN_SHIPMENTS } from '@/mocks/operations';
import { useAdminStore } from '@/store/AdminStore';

/**
 * إدارة الرحلات — SRS M04-E02.
 *
 * Admin sees what the B2B portal deliberately does not: who the customer is,
 * which driver took it, the payment state, and whether a penalty or case is
 * attached. BR-001 still holds — no reference price anywhere, only what was
 * actually charged.
 */

const PAY_META: Record<AdminShipment['paymentStatus'], { tone: BadgeTone; label: string }> = {
  Pending: { tone: 'warning', label: 'معلّق' },
  Authorized: { tone: 'warning', label: 'محجوز' },
  Captured: { tone: 'success', label: 'محصّل' },
  Failed: { tone: 'danger', label: 'فشل' },
  Refunded: { tone: 'neutral', label: 'مسترد' },
};

const LIVE = ['متجه للاستلام', 'جاري التحميل', 'في الطريق', 'عند الحدود', 'جاري التسليم'];

const TABS = [
  { key: 'all', label: 'الكل', match: () => true },
  { key: 'active', label: 'نشطة', match: (s: AdminShipment) => LIVE.includes(s.status) },
  { key: 'awaiting', label: 'بانتظار الدفع', match: (s: AdminShipment) => s.paymentStatus === 'Authorized' || s.paymentStatus === 'Pending' },
  { key: 'done', label: 'مكتملة', match: (s: AdminShipment) => s.status === 'مكتملة' },
  { key: 'cancelled', label: 'ملغاة', match: (s: AdminShipment) => s.status === 'ملغاة' || s.status === 'منتهية دون عرض' },
  { key: 'exception', label: 'استثناءات', match: (s: AdminShipment) => s.hasPenalty || s.hasOpenCase || !s.documentsComplete },
];

const CUSTOMER_TYPES = [
  { value: 'all', label: 'العميل: الكل' },
  { value: 'شركة', label: 'شركات' },
  { value: 'فرد', label: 'أفراد' },
];

const SCOPES = [
  { value: 'all', label: 'النطاق: الكل' },
  { value: 'محلية', label: 'محلية' },
  { value: 'دولية', label: 'دولية' },
];

export function ShipmentsScreen() {
  const { state } = useAdminStore();
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [ctype, setCtype] = React.useState('all');
  const [scope, setScope] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [openId, setOpenId] = React.useState<string | null>(null);

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const match = TABS.find((t) => t.key === tab)!.match;
    return ADMIN_SHIPMENTS.filter((s) => {
      if (!match(s)) return false;
      if (ctype !== 'all' && s.customerType !== ctype) return false;
      if (scope !== 'all' && s.scope !== scope) return false;
      if (q && !`${s.id} ${s.customerName} ${s.driverName ?? ''} ${s.from} ${s.to}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tab, search, ctype, scope]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? ADMIN_SHIPMENTS.find((s) => s.id === openId) ?? null : null;

  const openPenalties = open ? state.penalties.filter((p) => p.shipmentId === open.id) : [];
  const openCases = open ? state.cases.filter((c) => c.shipmentId === open.id) : [];
  const openDocs = open ? state.documents.filter((d) => d.shipmentId === open.id) : [];
  const openAudit: TimelineItem[] = open
    ? state.audit
        .filter((a) => a.entityId === open.id || a.entityLabel.includes(open.id))
        .map((a) => ({ id: a.id, label: `${a.action} — ${a.entityType}`, meta: `${a.actor} · ${a.timestamp}`, note: a.reason, state: 'done' as const }))
    : [];

  return (
    <>
      <AdminHeader title="إدارة الرحلات" subtitle="كل الشحنات على مستوى المنصة مع فلاتر وتفاصيل تشغيلية كاملة" />

      <FilterBar>
        <ContentTabs
          tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: ADMIN_SHIPMENTS.filter(t.match).length }))}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setOpenId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث برقم الرحلة أو العميل أو السائق…" aria-label="ابحث" />
        <SelectField value={ctype} onChange={setCtype} options={CUSTOMER_TYPES} aria-label="تصفية حسب نوع العميل" />
        <SelectField value={scope} onChange={setScope} options={SCOPES} aria-label="تصفية حسب النطاق" />
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
                  <th>الرحلة</th>
                  <th>العميل</th>
                  <th>السائق</th>
                  <th>المسار</th>
                  <th>الحالة</th>
                  <th>الدفع</th>
                  <th>المبلغ</th>
                  <th>تنبيهات</th>
                </>
              }
            >
              {rows.map((s) => (
                <tr key={s.id} onClick={() => setOpenId(s.id)}>
                  <td>
                    <CellStack>
                      <RowIcon icon="truck" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                      <div>
                        <CellPrimary ltr>{s.id}</CellPrimary>
                        <CellSecondary>{s.pickupDate}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellPrimary>{s.customerName}</CellPrimary>
                    <CellSecondary>{s.customerType}</CellSecondary>
                  </td>
                  <td>{s.driverName ? <CellPrimary>{s.driverName}</CellPrimary> : <CellEmpty />}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellPrimary>
                      {s.from} ← {s.to}
                    </CellPrimary>
                    <CellSecondary>{s.cargo}</CellSecondary>
                  </td>
                  <td>
                    <CellPrimary>{s.status}</CellPrimary>
                  </td>
                  <td>
                    <StatusBadge tone={PAY_META[s.paymentStatus].tone}>{PAY_META[s.paymentStatus].label}</StatusBadge>
                  </td>
                  <td>
                    <CellPrimary ltr>{s.amount} ر.س</CellPrimary>
                  </td>
                  <td>
                    <ChipList>
                      {s.hasPenalty ? <Tag tone="warning">غرامة</Tag> : null}
                      {s.hasOpenCase ? <Tag tone="danger">بلاغ</Tag> : null}
                      {!s.documentsComplete ? <Tag tone="warning">وثائق ناقصة</Tag> : null}
                      {s.hasPenalty || s.hasOpenCase || !s.documentsComplete ? null : <CellSecondary>—</CellSecondary>}
                    </ChipList>
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
                    options={viewOptions('لا توجد شحنات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {open ? (
            <SidePanel title="ملف الشحنة" onClose={() => setOpenId(null)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr' }}>{open.id}</span>
                <ScopeTag scope={open.scope} />
              </div>

              <RouteChips from={open.from} to={open.to} variant="plain" />

              {open.hasPenalty || open.hasOpenCase || !open.documentsComplete ? (
                <div style={{ marginTop: 16 }}>
                  <AlertBanner tone="warning">
                    {[
                      open.hasPenalty ? 'غرامة محتملة قيد المراجعة' : null,
                      open.hasOpenCase ? 'بلاغ دعم مفتوح' : null,
                      !open.documentsComplete ? 'وثائق أو تصاريح ناقصة' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </AlertBanner>
                </div>
              ) : null}

              <div style={{ marginTop: 20 }}>
                <SectionLabel>الأطراف</SectionLabel>
                <DetailList>
                  <DetailRow label="العميل">
                    {open.customerName} · {open.customerType}
                  </DetailRow>
                  <DetailRow label="السائق">{open.driverName ?? 'لم يُختر بعد'}</DetailRow>
                </DetailList>
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>التشغيل والتسعير</SectionLabel>
                <DetailList>
                  <DetailRow label="الحمولة">{open.cargo}</DetailRow>
                  <DetailRow label="تاريخ الاستلام">{open.pickupDate}</DetailRow>
                  <DetailRow label="الحالة">{open.status}</DetailRow>
                  <DetailRow label="حالة الدفع">
                    <StatusBadge tone={PAY_META[open.paymentStatus].tone}>{PAY_META[open.paymentStatus].label}</StatusBadge>
                  </DetailRow>
                  <DetailRow label="المبلغ المحصّل">
                    <span className="lw-ltr">{open.amount}</span> ر.س
                  </DetailRow>
                </DetailList>
              </div>

              {openDocs.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>الوثائق والتصاريح</SectionLabel>
                  <ChipList>
                    {openDocs.map((d) => (
                      <Tag key={d.id} tone={d.rule === 'blocking' ? 'danger' : d.rule === 'warning' ? 'warning' : 'neutral'} icon="document">
                        {d.documentType}
                      </Tag>
                    ))}
                  </ChipList>
                </div>
              ) : null}

              {openPenalties.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>الغرامات</SectionLabel>
                  <DetailList>
                    {openPenalties.map((p) => (
                      <DetailRow key={p.id} label={p.type}>
                        <span className="lw-ltr">{p.adjustedAmount ?? p.proposedAmount}</span> ر.س
                      </DetailRow>
                    ))}
                  </DetailList>
                </div>
              ) : null}

              {openCases.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>بلاغات الدعم</SectionLabel>
                  <DetailList>
                    {openCases.map((c) => (
                      <DetailRow key={c.id} label={c.type}>
                        {c.status}
                      </DetailRow>
                    ))}
                  </DetailList>
                </div>
              ) : null}

              {openAudit.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>سجل الإجراءات الإدارية</SectionLabel>
                  <Timeline items={openAudit} />
                </div>
              ) : null}
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={6} label="جارٍ تحميل الشحنات…" /> : null}
      {mode === 'error' ? (
        <ErrorState title="تعذّر تحميل الشحنات" body="حدث خطأ أثناء جلب قائمة الشحنات. أعد المحاولة." onRetry={() => setView('default')} />
      ) : null}
      {mode === 'empty' ? <EmptyState glyph="emptyTruck" title="لا توجد شحنات" body="الشحنات المنشورة على المنصة ستظهر هنا." /> : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setCtype('all');
            setScope('all');
            setView('default');
          }}
        />
      ) : null}
    </>
  );
}
