'use client';

import * as React from 'react';
import {
  CellPrimary,
  CellSecondary,
  CellStack,
  ChipList,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
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
  TableCard,
  Tag,
  TextArea,
  TextInput,
  Toggle,
  ViewStateLabel,
  type NotificationTemplate,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * الإشعارات والقوالب — SRS M04-E15.
 *
 * Editing copy that goes out under the brand's name, so the preview is not
 * decoration: it renders the body with its tokens filled from a sample so an
 * operator can see the actual sentence before saving.
 */

const AUDIENCES = [
  { value: 'all', label: 'الجمهور: الكل' },
  { value: 'العميل', label: 'العميل' },
  { value: 'السائق', label: 'السائق' },
  { value: 'الشركة', label: 'الشركة' },
  { value: 'الإدارة', label: 'الإدارة' },
];

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

export function TemplatesScreen() {
  const { state, dispatch } = useAdminStore();
  const [search, setSearch] = React.useState('');
  const [audience, setAudience] = React.useState('all');
  const [draft, setDraft] = React.useState<NotificationTemplate | null>(null);
  const [view, setView] = React.useState<AdminViewState>('default');

  const rows = state.templates.filter((t) => {
    if (audience !== 'all' && t.audience !== audience) return false;
    const q = search.trim();
    return !q || t.event.includes(q) || t.title.includes(q);
  });

  const mode = resolveMode(view, rows.length);

  return (
    <>
      <AdminHeader title="الإشعارات والقوالب" subtitle="قوالب إشعارات النظام لكل حدث" />

      <FilterBar>
        <SearchField value={search} onChange={setSearch} placeholder="ابحث بالحدث أو العنوان…" aria-label="ابحث عن قالب" />
        <SelectField value={audience} onChange={setAudience} options={AUDIENCES} aria-label="تصفية حسب الجمهور" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" icon="plus">
            إضافة قالب
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
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
            {rows.map((t) => (
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
                <td style={{ maxWidth: 280 }}>
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
            count={rows.length}
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
              <>
                <PanelCta
                  icon="check"
                  onClick={() => {
                    dispatch({ type: 'template/update', next: draft });
                    setDraft(null);
                  }}
                >
                  حفظ القالب
                </PanelCta>
                <PanelCta variant="ghost" onClick={() => setDraft(null)}>
                  إلغاء
                </PanelCta>
              </>
            }
          >
            <SectionLabel>{draft.event}</SectionLabel>

            <Field label="عنوان الإشعار" required htmlFor="tpl-title">
              <TextInput
                id="tpl-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>

            <div style={{ marginTop: 14 }}>
              <Field label="نص الإشعار" required help="استخدم المتغيرات أدناه — تُستبدل بالقيم الحقيقية عند الإرسال." htmlFor="tpl-body">
                <TextArea
                  id="tpl-body"
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </Field>
            </div>

            <div style={{ marginTop: 16 }}>
              <SectionLabel>المتغيرات المتاحة</SectionLabel>
              <ChipList>
                {draft.variables.map((v) => (
                  <Tag key={v}>
                    <span className="lw-ltr">{v}</span>
                  </Tag>
                ))}
              </ChipList>
            </div>

            <div style={{ marginTop: 20 }}>
              <SectionLabel>معاينة</SectionLabel>
              <div
                style={{
                  padding: '14px 15px',
                  borderRadius: 'var(--web-r-inner)',
                  background: 'var(--lw-bg-subtle)',
                  border: '1px solid var(--lw-border-subtle)',
                }}
              >
                <div style={{ fontSize: 'var(--web-text-meta)', fontWeight: 800, color: 'var(--lw-navy-900)' }}>
                  {fill(draft.title)}
                </div>
                <div
                  style={{
                    fontSize: 'var(--web-text-label)',
                    fontWeight: 600,
                    color: 'var(--lw-slate-600)',
                    marginTop: 6,
                    lineHeight: 1.7,
                  }}
                >
                  {fill(draft.body)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SectionLabel>قنوات الإرسال</SectionLabel>
              <Toggle
                checked={draft.channels.push}
                onChange={(v) => setDraft({ ...draft, channels: { ...draft.channels, push: v } })}
                label="إشعار Push"
                help="يصل على جهاز المستخدم حتى والتطبيق مغلق."
              />
              <Toggle
                checked={draft.channels.inApp}
                onChange={(v) => setDraft({ ...draft, channels: { ...draft.channels, inApp: v } })}
                label="داخل التطبيق"
                help="يظهر في مركز التنبيهات."
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

      {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل القوالب…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل القوالب"
          body="حدث خطأ أثناء جلب قوالب الإشعارات. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? (
        <EmptyState glyph="bell" title="لا توجد قوالب" body="أضف قالباً لكل حدث يحتاج إشعاراً." />
      ) : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setAudience('all');
            setView('default');
          }}
        />
      ) : null}
    </>
  );
}
