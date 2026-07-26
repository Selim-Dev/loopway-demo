'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellEmpty,
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
  RowIcon,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TableCard,
  Tag,
  ViewStateLabel,
  type AdminSupportCase,
  type BadgeTone,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * الدعم والاستثناءات — SRS M04-E13.
 *
 * E13-F02 is the part that matters most: when normal POD fails, an admin has
 * to verify delivery some other way. That block is surfaced prominently rather
 * than buried, because BR-011 makes POD the gate on closing a trip — without
 * an alternative the trip cannot close at all.
 */

const PRIORITY: Record<string, BadgeTone> = { 'عالية': 'danger', 'متوسطة': 'warning', 'منخفضة': 'neutral' };
const STATUS: Record<string, BadgeTone> = { 'مفتوحة': 'warning', 'قيد المعالجة': 'warning', 'مغلقة': 'neutral' };

const TAB_STATUS: Record<string, string[]> = {
  open: ['مفتوحة'],
  progress: ['قيد المعالجة'],
  closed: ['مغلقة'],
};

const PRIORITIES = [
  { value: 'all', label: 'الأولوية: الكل' },
  { value: 'عالية', label: 'عالية' },
  { value: 'متوسطة', label: 'متوسطة' },
  { value: 'منخفضة', label: 'منخفضة' },
];

type Decision = { kind: 'resolve' | 'escalate'; c: AdminSupportCase } | null;

export function SupportScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('open');
  const [search, setSearch] = React.useState('');
  const [priority, setPriority] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<Decision>(null);

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS).map(([k, v]) => [k, state.cases.filter((c) => v.includes(c.status)).length]),
      ) as Record<string, number>,
    [state.cases],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.cases.filter((c) => {
      if (!TAB_STATUS[tab].includes(c.status)) return false;
      if (priority !== 'all' && c.priority !== priority) return false;
      if (q && !`${c.id} ${c.type} ${c.reporter} ${c.shipmentId ?? ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.cases, tab, priority, search]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? state.cases.find((c) => c.id === openId) ?? null : null;

  return (
    <>
      <AdminHeader title="الدعم والاستثناءات" subtitle="بلاغات الدعم والنزاعات والتحقق البديل من التسليم" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'open', label: 'مفتوحة', count: counts.open },
            { key: 'progress', label: 'قيد المعالجة', count: counts.progress },
            { key: 'closed', label: 'مغلقة', count: counts.closed },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k);
            setOpenId(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث برقم البلاغ أو المُبلِّغ…" aria-label="ابحث" />
        <SelectField value={priority} onChange={setPriority} options={PRIORITIES} aria-label="تصفية حسب الأولوية" />
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
                  <th>البلاغ</th>
                  <th>الرحلة</th>
                  <th>المُبلِّغ</th>
                  <th>الأولوية</th>
                  <th>العمر</th>
                  <th>الحالة</th>
                </>
              }
            >
              {rows.map((c) => (
                <tr key={c.id} onClick={() => setOpenId(c.id)}>
                  <td>
                    <CellStack>
                      <RowIcon
                        icon={c.needsAlternativePod ? 'warning' : 'support'}
                        background={c.needsAlternativePod ? 'var(--color-danger-bg)' : 'var(--lw-icon-tint-bg)'}
                        color={c.needsAlternativePod ? 'var(--lw-red-600)' : 'var(--lw-navy-800)'}
                      />
                      <div>
                        <CellPrimary>{c.type}</CellPrimary>
                        <CellSecondary ltr>{c.id}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>{c.shipmentId ? <CellPrimary ltr>{c.shipmentId}</CellPrimary> : <CellEmpty />}</td>
                  <td>
                    <CellPrimary>{c.reporter}</CellPrimary>
                    <CellSecondary>{c.reporterRole}</CellSecondary>
                  </td>
                  <td>
                    <StatusBadge tone={PRIORITY[c.priority]}>{c.priority}</StatusBadge>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellSecondary>{c.age}</CellSecondary>
                  </td>
                  <td>
                    <StatusBadge tone={STATUS[c.status]}>{c.status}</StatusBadge>
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
                    options={viewOptions('لا توجد بلاغات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {open ? (
            <SidePanel
              title="تفاصيل البلاغ"
              onClose={() => setOpenId(null)}
              footer={
                open.status !== 'مغلقة' ? (
                  <>
                    <PanelCta icon="check" onClick={() => setDecision({ kind: 'resolve', c: open })}>
                      إغلاق البلاغ
                    </PanelCta>
                    <PanelCta variant="ghost" onClick={() => setDecision({ kind: 'escalate', c: open })}>
                      تصعيد
                    </PanelCta>
                  </>
                ) : undefined
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr' }}>{open.id}</span>
                <StatusBadge tone={PRIORITY[open.priority]}>{open.priority}</StatusBadge>
              </div>

              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{open.type}</div>
              <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 600, color: 'var(--lw-slate-600)', marginTop: 8, lineHeight: 1.7 }}>
                {open.description}
              </div>

              {open.needsAlternativePod ? (
                <div style={{ marginTop: 16 }}>
                  <AlertBanner tone="danger">
                    تعذّر إثبات التسليم بالطريقة المعتادة. إثبات التسليم شرط لإغلاق الرحلة — راجع الأدلة أدناه واعتمد تحققاً بديلاً.
                  </AlertBanner>
                </div>
              ) : null}

              {open.resolution ? (
                <div style={{ marginTop: 16 }}>
                  <AlertBanner tone="success" icon="check">
                    {open.resolution}
                  </AlertBanner>
                </div>
              ) : null}

              <div style={{ marginTop: 20 }}>
                <SectionLabel>البيانات</SectionLabel>
                <DetailList>
                  <DetailRow label="المُبلِّغ">
                    {open.reporter} · {open.reporterRole}
                  </DetailRow>
                  {open.shipmentId ? (
                    <DetailRow label="الرحلة المرتبطة">
                      <span className="lw-ltr">{open.shipmentId}</span>
                    </DetailRow>
                  ) : null}
                  <DetailRow label="تاريخ الفتح">{open.openedAt}</DetailRow>
                  <DetailRow label="عمر البلاغ">{open.age}</DetailRow>
                </DetailList>
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionLabel>المحادثة</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {open.messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--web-r-inner)',
                        background: m.role === 'الإدارة' ? 'var(--color-success-bg)' : 'var(--lw-bg-subtle)',
                        border: `1px solid ${m.role === 'الإدارة' ? 'var(--lw-green-200)' : 'var(--lw-border-subtle)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 'var(--web-text-label)', fontWeight: 800, color: 'var(--lw-navy-900)' }}>
                          {m.author}
                        </span>
                        <span style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)' }}>
                          {m.at}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 600, color: 'var(--lw-slate-600)', marginTop: 6, lineHeight: 1.7 }}>
                        {m.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {open.attachments.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>المرفقات</SectionLabel>
                  {open.needsAlternativePod ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {open.attachments.map((a) => (
                        <DocumentViewer key={a} name={a} meta="دليل مقدَّم من المُبلِّغ" onDownload={() => {}} />
                      ))}
                    </div>
                  ) : (
                    <ChipList>
                      {open.attachments.map((a) => (
                        <Tag key={a} icon="document">
                          {a}
                        </Tag>
                      ))}
                    </ChipList>
                  )}
                </div>
              ) : null}
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل البلاغات…" /> : null}
      {mode === 'error' ? (
        <ErrorState title="تعذّر تحميل البلاغات" body="حدث خطأ أثناء جلب بلاغات الدعم. أعد المحاولة." onRetry={() => setView('default')} />
      ) : null}
      {mode === 'empty' ? <EmptyState glyph="support" title="لا توجد بلاغات" body="بلاغات الدعم من العملاء والسائقين ستظهر هنا." /> : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setPriority('all');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={decision?.kind === 'resolve'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => {
          if (decision) dispatch({ type: 'case/resolve', id: decision.c.id, resolution: reason });
          setDecision(null);
          setOpenId(null);
        }}
        title="إغلاق البلاغ"
        body="يُبلَّغ المُبلِّغ بالقرار ونصّ الحل الذي تكتبه، ويُسجَّل في سجل التدقيق."
        confirmLabel="تأكيد الإغلاق"
        reasonRequired
        reasonLabel="ملخص الحل"
        reasonPlaceholder="اشرح ما تم عمله وكيف عولجت المشكلة."
      />

      <ConfirmDialog
        open={decision?.kind === 'escalate'}
        onClose={() => setDecision(null)}
        onConfirm={(reason) => {
          if (decision) dispatch({ type: 'case/escalate', id: decision.c.id, reason });
          setDecision(null);
        }}
        tone="warning"
        title="تصعيد البلاغ"
        body="تُرفع أولوية البلاغ إلى عالية ويُحال إلى فريق مختص."
        confirmLabel="تأكيد التصعيد"
        reasonRequired
        reasonLabel="سبب التصعيد"
      />
    </>
  );
}
