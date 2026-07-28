'use client';

import * as React from 'react';
import {
  CellPrimary,
  CellSecondary,
  CellStack,
  ChipList,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
  FilterBar,
  FilterBarSpacer,
  FormSelect,
  LoadingState,
  NoResultsState,
  PageBody,
  PaginationBar,
  PanelCta,
  PrimaryCta,
  RowIcon,
  SearchField,
  Section,
  SectionLabel,
  SelectField,
  SidePanel,
  Split,
  StatusBadge,
  TabGroup,
  TableCard,
  Tag,
  TextArea,
  TextInput,
  Toggle,
  ViewStateLabel,
  type BadgeTone,
  type DispatchStatus,
  type NotificationTemplate,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * إدارة الإشعارات — SRS M04-E15.
 *
 * Three tabs, because "notifications" is three jobs: sending one now, editing
 * the templates events send automatically, and reading what actually went out.
 * The third is the one that turns the first two from settings into operations —
 * a send with no log is a claim.
 */

const AUDIENCES = [
  { value: 'العميل', label: 'العملاء' },
  { value: 'السائق', label: 'السائقون' },
  { value: 'الشركة', label: 'شركات النقل' },
  { value: 'الكل', label: 'الجميع' },
];

/** Rough reach per audience — shown so the operator knows the blast radius. */
const REACH: Record<string, number> = { 'العميل': 268, 'السائق': 191, 'الشركة': 53, 'الكل': 512 };

const SAMPLE: Record<string, string> = {
  '{{tripId}}': 'LW-2026-002960',
  '{{driverName}}': 'خالد ناصر',
  '{{amount}}': '3,850',
  '{{from}}': 'الرياض',
  '{{to}}': 'الدمام',
  '{{status}}': 'في الطريق',
  '{{timestamp}}': '24 يوليو 2026 · 09:14 ص',
  '{{documentType}}': 'تصريح دخول ميناء',
  '{{permitType}}': 'تصريح مواد خطرة',
  '{{expiryDate}}': '12 ديسمبر 2026',
  '{{ttl}}': '30 دقيقة',
  '{{bankAccount}}': 'SA** •••• 4471',
  '{{tripCount}}': '3',
};

function fill(body: string) {
  return Object.entries(SAMPLE).reduce((s, [k, v]) => s.split(k).join(v), body);
}

const DISPATCH_TONE: Record<DispatchStatus, BadgeTone> = {
  'أُرسل': 'success',
  'جارٍ الإرسال': 'warning',
  'فشل جزئي': 'warning',
  'فشل': 'danger',
};

const TEMPLATE_AUDIENCES = [
  { value: 'all', label: 'الجمهور: الكل' },
  { value: 'العميل', label: 'العميل' },
  { value: 'السائق', label: 'السائق' },
  { value: 'الشركة', label: 'الشركة' },
  { value: 'الإدارة', label: 'الإدارة' },
];

export function NotificationsScreen() {
  const { state, dispatch } = useAdminStore();
  // Lands on القوالب, not إرسال. Two reasons: a compose form has no list, so it
  // cannot carry the five view states every other section does; and landing on
  // a screen whose primary button reaches 268 people is the wrong default.
  // Sending is a deliberate act you navigate to.
  const [tab, setTab] = React.useState('templates');
  const [view, setView] = React.useState<AdminViewState>('default');

  /* ---- Tab 1: compose ---- */
  const [audience, setAudience] = React.useState('العميل');
  const [templateId, setTemplateId] = React.useState(state.templates[0]?.id ?? '');
  const [body, setBody] = React.useState(state.templates[0]?.body ?? '');
  const [channels, setChannels] = React.useState({ push: true, inApp: true, sms: false });
  const [confirming, setConfirming] = React.useState(false);

  const selectedTemplate = state.templates.find((t) => t.id === templateId);
  const activeChannels = [
    channels.push ? 'Push' : null,
    channels.inApp ? 'داخل التطبيق' : null,
    channels.sms ? 'SMS' : null,
  ].filter(Boolean) as string[];
  const recipients = REACH[audience] ?? 0;
  const canSend = body.trim().length > 0 && activeChannels.length > 0;

  /* ---- Tab 2: templates ---- */
  const [search, setSearch] = React.useState('');
  const [tplAudience, setTplAudience] = React.useState('all');
  const [draft, setDraft] = React.useState<NotificationTemplate | null>(null);

  const templateRows = state.templates.filter((t) => {
    if (tplAudience !== 'all' && t.audience !== tplAudience) return false;
    const q = search.trim();
    return !q || t.event.includes(q) || t.title.includes(q);
  });

  /* ---- Tab 3: log ---- */
  const [logSearch, setLogSearch] = React.useState('');
  const logRows = state.dispatches.filter((d) => {
    const q = logSearch.trim();
    return !q || d.event.includes(q) || d.id.includes(q);
  });

  const listCount = tab === 'templates' ? templateRows.length : tab === 'log' ? logRows.length : 1;
  const mode = resolveMode(view, listCount);

  return (
    <>
      <AdminHeader title="إدارة الإشعارات" subtitle="إرسال الإشعارات، وإدارة القوالب، وسجل الإرسال" />

      <FilterBar>
        <TabGroup
          tabs={[
            { key: 'send', label: 'إرسال إشعار' },
            { key: 'templates', label: 'القوالب', count: state.templates.length },
            { key: 'log', label: 'سجل الإرسال', count: state.dispatches.length },
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab === 'templates' ? (
          <>
            <SearchField value={search} onChange={setSearch} placeholder="ابحث بالحدث أو العنوان…" aria-label="ابحث عن قالب" />
            <SelectField value={tplAudience} onChange={setTplAudience} options={TEMPLATE_AUDIENCES} aria-label="تصفية حسب الجمهور" />
          </>
        ) : null}
        {tab === 'log' ? (
          <SearchField value={logSearch} onChange={setLogSearch} placeholder="ابحث برقم الإرسال أو الحدث…" aria-label="ابحث في السجل" />
        ) : null}
        <FilterBarSpacer>
          {tab === 'templates' ? (
            <PrimaryCta size="sm" icon="plus">
              إضافة قالب
            </PrimaryCta>
          ) : null}
        </FilterBarSpacer>
      </FilterBar>

      {/* ==================== Tab 1 — compose ==================== */}
      {tab === 'send' ? (
        <PageBody>
          <Split>
            <Section title="إرسال إشعار" subtitle="يصل فوراً لكل من يطابق الجمهور المحدد">
              <Field label="الجمهور" required help={`يصل تقريباً إلى ${recipients} مستلماً.`} htmlFor="aud">
                <FormSelect id="aud" value={audience} onChange={(e) => setAudience(e.target.value)}>
                  {AUDIENCES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </FormSelect>
              </Field>

              <Field label="القالب" help="اختر قالباً جاهزاً أو عدّل النص أدناه." htmlFor="tpl">
                <FormSelect
                  id="tpl"
                  value={templateId}
                  onChange={(e) => {
                    setTemplateId(e.target.value);
                    setBody(state.templates.find((t) => t.id === e.target.value)?.body ?? '');
                  }}
                >
                  {state.templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.event}
                    </option>
                  ))}
                </FormSelect>
              </Field>

              <Field label="نص الإشعار" required error={body.trim().length === 0} help={body.trim().length === 0 ? 'النص مطلوب قبل الإرسال.' : 'يدعم متغيّرات القالب.'} htmlFor="body">
                <TextArea id="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
              </Field>

              <div style={{ marginTop: 4 }}>
                <SectionLabel>القنوات</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Toggle checked={channels.push} onChange={(v) => setChannels((c) => ({ ...c, push: v }))} label="Push" />
                  <Toggle checked={channels.inApp} onChange={(v) => setChannels((c) => ({ ...c, inApp: v }))} label="داخل التطبيق" />
                  <Toggle
                    checked={channels.sms}
                    onChange={(v) => setChannels((c) => ({ ...c, sms: v }))}
                    label="رسالة نصية SMS"
                    help="لها تكلفة لكل رسالة — استخدمها للأحداث الحرجة فقط."
                  />
                </div>
              </div>
            </Section>

            <Section title="المعاينة" subtitle="بمتغيّرات نموذجية معبّأة">
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: 'var(--web-r-btn)',
                  border: '1px solid var(--lw-border-subtle)',
                  background: 'var(--lw-bg-subtle)',
                }}
              >
                <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 800, color: 'var(--lw-navy-900)' }}>
                  {selectedTemplate?.title ?? 'إشعار من LoopWay'}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 'var(--web-text-meta)',
                    fontWeight: 600,
                    color: 'var(--lw-slate-600)',
                    lineHeight: 1.8,
                  }}
                >
                  {fill(body) || 'اكتب نص الإشعار لتظهر المعاينة هنا.'}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <SectionLabel>المتغيّرات المتاحة</SectionLabel>
                <ChipList>
                  {(selectedTemplate?.variables ?? []).map((v) => (
                    <Tag key={v}>{v}</Tag>
                  ))}
                </ChipList>
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <PrimaryCta
                  size="sm"
                  icon="bell"
                  disabled={!canSend}
                  title={canSend ? undefined : 'اكتب نص الإشعار واختر قناة واحدة على الأقل.'}
                  onClick={() => setConfirming(true)}
                >
                  إرسال الآن
                </PrimaryCta>
                <span style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', alignSelf: 'center' }}>
                  {activeChannels.length ? activeChannels.join(' · ') : 'لم تُختر أي قناة'}
                </span>
              </div>
            </Section>
          </Split>
        </PageBody>
      ) : null}

      {/* ==================== Tab 2 — templates ==================== */}
      {tab === 'templates' && mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            <DataTable
              head={
                <>
                  <th>الحدث</th>
                  <th>الجمهور</th>
                  <th>العنوان</th>
                  <th>القنوات</th>
                  <th>الحالة</th>
                </>
              }
            >
              {templateRows.map((t) => (
                <tr key={t.id} onClick={() => setDraft(t)}>
                  <td>
                    <CellStack>
                      <RowIcon icon="bell" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                      <div>
                        <CellPrimary>{t.event}</CellPrimary>
                        <CellSecondary ltr>{t.id}</CellSecondary>
                      </div>
                    </CellStack>
                  </td>
                  <td>
                    <CellPrimary>{t.audience}</CellPrimary>
                  </td>
                  <td style={{ maxWidth: 260 }}>
                    <CellSecondary>{t.title}</CellSecondary>
                  </td>
                  <td>
                    <ChipList>
                      {t.channels.push ? <Tag>Push</Tag> : null}
                      {t.channels.inApp ? <Tag>داخل التطبيق</Tag> : null}
                      {t.channels.sms ? <Tag>SMS</Tag> : null}
                    </ChipList>
                  </td>
                  <td>
                    <StatusBadge tone={t.active ? 'success' : 'neutral'}>{t.active ? 'مفعّل' : 'معطّل'}</StatusBadge>
                  </td>
                </tr>
              ))}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={templateRows.length}
              total={state.templates.length}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا توجد قوالب')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {draft ? (
            <SidePanel
              title="تعديل القالب"
              onClose={() => setDraft(null)}
              footer={
                <PanelCta
                  icon="check"
                  onClick={() => {
                    dispatch({ type: 'template/update', next: draft });
                    setDraft(null);
                  }}
                >
                  حفظ القالب
                </PanelCta>
              }
            >
              <Field label="الحدث" htmlFor="ev">
                <TextInput id="ev" value={draft.event} readOnly />
              </Field>
              <Field label="عنوان الإشعار" required htmlFor="ti">
                <TextInput id="ti" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </Field>
              <Field label="نص الإشعار" required help="المتغيّرات أدناه تُستبدل بالقيم الحقيقية عند الإرسال." htmlFor="bd">
                <TextArea id="bd" rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              </Field>

              <SectionLabel>المتغيّرات</SectionLabel>
              <ChipList>
                {draft.variables.map((v) => (
                  <Tag key={v}>{v}</Tag>
                ))}
              </ChipList>

              <div style={{ marginTop: 18 }}>
                <SectionLabel>المعاينة</SectionLabel>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--web-r-btn)',
                    background: 'var(--lw-bg-subtle)',
                    fontSize: 'var(--web-text-meta)',
                    fontWeight: 600,
                    color: 'var(--lw-slate-600)',
                    lineHeight: 1.75,
                  }}
                >
                  {fill(draft.body)}
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Toggle
                  checked={draft.channels.push}
                  onChange={(v) => setDraft({ ...draft, channels: { ...draft.channels, push: v } })}
                  label="Push"
                />
                <Toggle
                  checked={draft.channels.inApp}
                  onChange={(v) => setDraft({ ...draft, channels: { ...draft.channels, inApp: v } })}
                  label="داخل التطبيق"
                />
                <Toggle
                  checked={draft.channels.sms}
                  onChange={(v) => setDraft({ ...draft, channels: { ...draft.channels, sms: v } })}
                  label="رسالة نصية SMS"
                  help="استخدمها للأحداث الحرجة فقط — لها تكلفة لكل رسالة."
                />
                <Toggle
                  checked={draft.active}
                  onChange={(v) => setDraft({ ...draft, active: v })}
                  label="القالب مفعّل"
                  help="عند التعطيل لا يُرسل أي إشعار لهذا الحدث."
                />
              </div>
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {/* ==================== Tab 3 — dispatch log ==================== */}
      {tab === 'log' && mode === 'list' ? (
        <PageBody>
          <TableCard>
            <DataTable
              head={
                <>
                  <th>رقم الإرسال</th>
                  <th>الحدث</th>
                  <th>الجمهور</th>
                  <th>القنوات</th>
                  <th>المستلمون</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                </>
              }
            >
              {logRows.map((d) => (
                <tr key={d.id}>
                  <td>
                    <CellPrimary ltr>{d.id}</CellPrimary>
                    {d.sentBy ? <CellSecondary>أرسله {d.sentBy}</CellSecondary> : <CellSecondary>تلقائي</CellSecondary>}
                  </td>
                  <td>
                    <CellPrimary>{d.event}</CellPrimary>
                  </td>
                  <td>
                    <CellSecondary>{d.audience}</CellSecondary>
                  </td>
                  <td>
                    <ChipList>
                      {d.channels.map((c) => (
                        <Tag key={c}>{c}</Tag>
                      ))}
                    </ChipList>
                  </td>
                  <td>
                    <CellPrimary ltr>{d.recipients}</CellPrimary>
                  </td>
                  <td>
                    <StatusBadge tone={DISPATCH_TONE[d.status]}>{d.status}</StatusBadge>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <CellSecondary>{d.sentAt}</CellSecondary>
                  </td>
                </tr>
              ))}
            </DataTable>

            <PaginationBar
              attached
              showArrows={false}
              count={logRows.length}
              total={state.dispatches.length}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا يوجد سجل إرسال')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>
        </PageBody>
      ) : null}

      {tab !== 'send' && mode === 'loading' ? <LoadingState rows={4} label="جارٍ التحميل…" /> : null}
      {tab !== 'send' && mode === 'error' ? (
        <ErrorState
          title="تعذّر التحميل"
          body="حدث خطأ أثناء جلب البيانات. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {tab !== 'send' && mode === 'empty' ? (
        <EmptyState
          glyph="bell"
          title={tab === 'log' ? 'لا يوجد سجل إرسال' : 'لا توجد قوالب'}
          body={tab === 'log' ? 'سيمتلئ السجل مع أول إشعار يُرسَل.' : 'أضف قالباً لكل حدث يحتاج إشعاراً.'}
        />
      ) : null}
      {tab !== 'send' && mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setLogSearch('');
            setTplAudience('all');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          dispatch({
            type: 'notification/send',
            dispatch: {
              id: `NTF-2026-0${320 + state.dispatches.length}`,
              event: selectedTemplate?.event ?? 'إشعار مخصص',
              audience,
              channels: activeChannels,
              recipients,
              status: 'أُرسل',
              sentAt: '24 يوليو 2026 · 10:00 ص',
              sentBy: 'فريق التشغيل',
            },
          });
          setConfirming(false);
          setTab('log');
        }}
        tone="warning"
        title="إرسال الإشعار"
        body="سيصل الإشعار فوراً ولا يمكن سحبه بعد الإرسال."
        confirmLabel="تأكيد الإرسال"
        summary={
          <>
            <span className="lw-ltr">{recipients}</span> مستلماً · {audience} · {activeChannels.join(' · ')}
          </>
        }
      />
    </>
  );
}
