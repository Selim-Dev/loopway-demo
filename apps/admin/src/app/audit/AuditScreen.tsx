'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellPrimary,
  CellSecondary,
  CellStack,
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
  TableCard,
  ViewStateLabel,
  type AuditAction,
  type BadgeTone,
  type IconName,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * Audit Log — SRS M04-E16, BR-015.
 *
 * Read-only by definition: an audit trail you can edit is not an audit trail.
 * There are no actions on this screen, ever.
 *
 * It is fed by the session's own activity — every decision taken anywhere in
 * this portal appends here through AdminStore, which is what makes the log
 * demonstrate itself rather than sit on static rows.
 */

const ACTION_META: Record<AuditAction, { tone: BadgeTone; icon: IconName }> = {
  'اعتماد': { tone: 'success', icon: 'check' },
  'رفض': { tone: 'danger', icon: 'close' },
  'طلب معلومات إضافية': { tone: 'warning', icon: 'document' },
  'تعديل مبلغ': { tone: 'warning', icon: 'card' },
  'تحويل مستحقات': { tone: 'success', icon: 'arrowOut' },
  'تغيير إعداد': { tone: 'neutral', icon: 'gear' },
  'إغلاق بلاغ': { tone: 'neutral', icon: 'support' },
  'تصعيد بلاغ': { tone: 'warning', icon: 'warning' },
  'إيقاف حساب': { tone: 'danger', icon: 'user' },
};

const ACTIONS = [
  { value: 'all', label: 'الإجراء: الكل' },
  ...Object.keys(ACTION_META).map((a) => ({ value: a, label: a })),
];

export function AuditScreen() {
  const { state } = useAdminStore();
  const [search, setSearch] = React.useState('');
  const [action, setAction] = React.useState('all');
  const [entity, setEntity] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [openId, setOpenId] = React.useState<string | null>(null);

  const entities = React.useMemo(
    () => [
      { value: 'all', label: 'الكيان: الكل' },
      ...Array.from(new Set(state.audit.map((a) => a.entityType))).map((e) => ({ value: e, label: e })),
    ],
    [state.audit],
  );

  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.audit.filter((a) => {
      if (action !== 'all' && a.action !== action) return false;
      if (entity !== 'all' && a.entityType !== entity) return false;
      if (q && !`${a.id} ${a.actor} ${a.entityId} ${a.entityLabel}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state.audit, search, action, entity]);

  const mode = resolveMode(view, rows.length);
  const open = openId ? state.audit.find((a) => a.id === openId) ?? null : null;

  return (
    <>
      <AdminHeader title="سجل القرارات والاعتمادات" subtitle="سجل كل إجراء حساس: من فعله، ومتى، وما القيمة قبل وبعد" />

      <FilterBar>
        <SearchField value={search} onChange={setSearch} placeholder="ابحث بالمستخدم أو الكيان…" aria-label="ابحث في السجل" />
        <SelectField value={action} onChange={setAction} options={ACTIONS} aria-label="تصفية حسب الإجراء" />
        <SelectField value={entity} onChange={setEntity} options={entities} aria-label="تصفية حسب الكيان" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير السجل
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      <AlertBanner tone="info" icon="document">
        السجل للقراءة فقط ولا يمكن تعديله أو حذف أي قيد منه. كل إجراء تتخذه في اللوحة يُضاف هنا تلقائياً.
      </AlertBanner>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>الوقت</th>
                  <th>المستخدم</th>
                  <th>الإجراء</th>
                  <th>الكيان</th>
                  <th>المرجع</th>
                  <th>السبب</th>
                </>
              }
            >
              {rows.map((a) => {
                const meta = ACTION_META[a.action] ?? { tone: 'neutral' as BadgeTone, icon: 'document' as IconName };
                return (
                  <tr key={a.id} onClick={() => setOpenId(a.id)}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <CellPrimary>{a.timestamp}</CellPrimary>
                      <CellSecondary ltr>{a.id}</CellSecondary>
                    </td>
                    <td>
                      <CellPrimary>{a.actor}</CellPrimary>
                      <CellSecondary ltr>{a.actorId}</CellSecondary>
                    </td>
                    <td>
                      <CellStack>
                        <RowIcon
                          icon={meta.icon}
                          background={
                            meta.tone === 'success'
                              ? 'var(--color-success-bg)'
                              : meta.tone === 'danger'
                                ? 'var(--color-danger-bg)'
                                : meta.tone === 'warning'
                                  ? 'var(--color-warning-bg)'
                                  : 'var(--lw-icon-tint-bg)'
                          }
                          color={
                            meta.tone === 'success'
                              ? 'var(--lw-green-700)'
                              : meta.tone === 'danger'
                                ? 'var(--lw-red-600)'
                                : meta.tone === 'warning'
                                  ? 'var(--lw-amber-600)'
                                  : 'var(--lw-navy-800)'
                          }
                        />
                        <StatusBadge tone={meta.tone}>{a.action}</StatusBadge>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary>{a.entityLabel}</CellPrimary>
                      <CellSecondary>{a.entityType}</CellSecondary>
                    </td>
                    <td>
                      <CellSecondary ltr>{a.entityId}</CellSecondary>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <CellSecondary>{a.reason ?? '—'}</CellSecondary>
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
                    options={viewOptions('السجل فارغ')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {open ? (
            <SidePanel title="تفاصيل القيد" onClose={() => setOpenId(null)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-latin)', direction: 'ltr' }}>{open.id}</span>
                <StatusBadge tone={(ACTION_META[open.action] ?? { tone: 'neutral' as BadgeTone }).tone}>{open.action}</StatusBadge>
              </div>

              <DetailList>
                <DetailRow label="المستخدم">
                  {open.actor} · <span className="lw-ltr">{open.actorId}</span>
                </DetailRow>
                <DetailRow label="الوقت">{open.timestamp}</DetailRow>
                <DetailRow label="نوع الكيان">{open.entityType}</DetailRow>
                <DetailRow label="الكيان">{open.entityLabel}</DetailRow>
                <DetailRow label="المعرّف">
                  <span className="lw-ltr">{open.entityId}</span>
                </DetailRow>
              </DetailList>

              {open.changes?.length ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>القيمة قبل وبعد</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {open.changes.map((c) => (
                      <div
                        key={c.field}
                        style={{
                          border: '1px solid var(--lw-border-subtle)',
                          borderRadius: 'var(--web-r-btn)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '8px 12px',
                            background: 'var(--lw-bg-subtle)',
                            fontSize: 'var(--web-text-label)',
                            fontWeight: 700,
                            color: 'var(--lw-navy-900)',
                          }}
                        >
                          {c.field}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                          <div style={{ padding: '10px 12px', borderLeft: '1px solid var(--lw-divider-2)' }}>
                            <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)' }}>قبل</div>
                            <div style={{ fontSize: 'var(--web-text-meta)', fontWeight: 700, color: 'var(--lw-red-600)', marginTop: 4 }}>
                              {c.before}
                            </div>
                          </div>
                          <div style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)' }}>بعد</div>
                            <div style={{ fontSize: 'var(--web-text-meta)', fontWeight: 700, color: 'var(--lw-green-700)', marginTop: 4 }}>
                              {c.after}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {open.reason ? (
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>السبب المسجَّل</SectionLabel>
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
                    {open.reason}
                  </div>
                </div>
              ) : null}
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل السجل…" /> : null}

      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل السجل"
          body="حدث خطأ أثناء جلب قيود السجل. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}

      {mode === 'empty' ? <EmptyState glyph="clock" title="السجل فارغ" body="سيمتلئ السجل تلقائياً مع أول إجراء إداري." /> : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setAction('all');
            setEntity('all');
            setView('default');
          }}
        />
      ) : null}
    </>
  );
}
