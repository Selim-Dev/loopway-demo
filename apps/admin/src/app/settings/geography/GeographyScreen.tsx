'use client';

import * as React from 'react';
import {
  AlertBanner,
  CellPrimary,
  CellSecondary,
  CellStack,
  DataTable,
  EmptyState,
  ErrorState,
  Field,
  FilterBar,
  FilterBarSpacer,
  FormGrid,
  ListRow,
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
  Split,
  Section,
  TextArea,
  TextInput,
  Toggle,
  ViewStateLabel,
  type Port,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { CITIES, COUNTRIES, PORTS } from '@/mocks/settings';
import { ADMIN_SHIPMENTS } from '@/mocks/operations';

/**
 * الدول والمدن والموانئ — SRS M04-E07.
 *
 * Country → city → port drill-down. The `يتطلب تصريح` toggle on a port is the
 * setting that actually reaches the customer: it is what makes the create-trip
 * flow demand a permit. Nothing referenced by a live shipment can be
 * deactivated — the control is disabled and says why.
 */

export function GeographyScreen() {
  const [countryId, setCountryId] = React.useState('SA');
  const [cityId, setCityId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [editing, setEditing] = React.useState<Port | null>(null);
  const [requiresPermit, setRequiresPermit] = React.useState(false);

  const cities = React.useMemo(() => CITIES.filter((c) => c.countryId === countryId), [countryId]);

  const ports = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const cityIds = new Set(cities.map((c) => c.id));
    return PORTS.filter((p) => {
      if (!cityIds.has(p.cityId)) return false;
      if (cityId && p.cityId !== cityId) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cities, cityId, search]);

  const mode = resolveMode(view, ports.length);

  /** A city is locked while any non-closed shipment still routes through it. */
  const cityInUse = (name: string) =>
    ADMIN_SHIPMENTS.some(
      (s) => (s.from === name || s.to === name) && s.status !== 'مكتملة' && s.status !== 'ملغاة',
    );

  const openPort = (p: Port) => {
    setEditing(p);
    setRequiresPermit(p.requiresPermit);
  };

  return (
    <>
      <AdminHeader title="الدول والمدن والموانئ" subtitle="الدول المدعومة ومدنها وموانئها وهل يتطلب الميناء تصريحاً" />

      <FilterBar>
        <SelectField
          value={countryId}
          onChange={(v) => {
            setCountryId(v);
            setCityId(null);
          }}
          options={COUNTRIES.map((c) => ({ value: c.id, label: `${c.name}${c.active ? '' : ' (معطّلة)'}` }))}
          aria-label="اختر الدولة"
        />
        <SelectField
          value={cityId ?? 'all'}
          onChange={(v) => setCityId(v === 'all' ? null : v)}
          options={[{ value: 'all', label: 'المدينة: الكل' }, ...cities.map((c) => ({ value: c.id, label: c.name }))]}
          aria-label="اختر المدينة"
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث باسم الميناء…" aria-label="ابحث عن ميناء" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" icon="plus">
            إضافة ميناء
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      <AlertBanner tone="warning">
        تعطيل دولة أو مدينة يمنع إنشاء رحلات جديدة إليها. الرحلات الجارية لا تتأثر.
      </AlertBanner>

      <PageBody variant="row">
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Split>
            <Section title="الدول المدعومة" subtitle={`${COUNTRIES.filter((c) => c.active).length} دول نشطة`} flush>
              {COUNTRIES.map((c) => (
                <ListRow
                  key={c.id}
                  icon="home"
                  title={c.name}
                  meta={
                    <>
                      <span className="lw-ltr">{c.code}</span> · {c.domestic ? 'شحن محلي ودولي' : 'شحن دولي فقط'} ·{' '}
                      {CITIES.filter((x) => x.countryId === c.id).length} مدن
                    </>
                  }
                  onClick={() => {
                    setCountryId(c.id);
                    setCityId(null);
                  }}
                  side={
                    <StatusBadge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'نشطة' : 'معطّلة'}</StatusBadge>
                  }
                />
              ))}
            </Section>

            <Section
              title="مدن الدولة المختارة"
              subtitle={COUNTRIES.find((c) => c.id === countryId)?.name}
              flush
              action={
                <PrimaryCta size="sm" variant="secondary" icon="plus">
                  إضافة مدينة
                </PrimaryCta>
              }
            >
              {cities.map((c) => {
                const locked = cityInUse(c.name);
                return (
                  <ListRow
                    key={c.id}
                    icon="home"
                    title={c.name}
                    meta={`${PORTS.filter((p) => p.cityId === c.id).length} موانئ ومنافذ`}
                    onClick={() => setCityId(c.id)}
                    side={
                      <>
                        {locked ? (
                          <span title="لا يمكن تعطيلها — مرتبطة برحلات جارية">
                            <StatusBadge tone="warning">مستخدمة</StatusBadge>
                          </span>
                        ) : null}
                        <StatusBadge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'نشطة' : 'معطّلة'}</StatusBadge>
                      </>
                    }
                  />
                );
              })}
            </Section>
          </Split>

          {mode === 'list' ? (
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div
                      style={{
                        flex: 1,
                        minHeight: 0,
                        background: '#fff',
                        border: '1px solid var(--lw-border-faint)',
                        borderRadius: 'var(--web-r-panel)',
                        boxShadow: 'var(--web-shadow-header)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      <DataTable
                        head={
                          <>
                            <th>الميناء / المنفذ</th>
                            <th>المدينة</th>
                            <th>يتطلب تصريح</th>
                            <th>تعليمات خاصة</th>
                            <th>الحالة</th>
                          </>
                        }
                      >
                        {ports.map((p) => (
                          <tr key={p.id} onClick={() => openPort(p)}>
                            <td>
                              <CellStack>
                                <RowIcon icon="truck" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                                <div>
                                  <CellPrimary>{p.name}</CellPrimary>
                                  <CellSecondary ltr>{p.id}</CellSecondary>
                                </div>
                              </CellStack>
                            </td>
                            <td>
                              <CellPrimary>{CITIES.find((c) => c.id === p.cityId)?.name ?? '—'}</CellPrimary>
                            </td>
                            <td>
                              <StatusBadge tone={p.requiresPermit ? 'warning' : 'neutral'}>
                                {p.requiresPermit ? 'نعم' : 'لا'}
                              </StatusBadge>
                            </td>
                            <td style={{ maxWidth: 320 }}>
                              <CellSecondary>{p.instructions ?? '—'}</CellSecondary>
                            </td>
                            <td>
                              <StatusBadge tone={p.active ? 'success' : 'neutral'}>
                                {p.active ? 'نشط' : 'معطّل'}
                              </StatusBadge>
                            </td>
                          </tr>
                        ))}
                      </DataTable>

                      <PaginationBar
                        attached
                        showArrows={false}
                        count={ports.length}
                        total={ports.length}
                        left={
                          <>
                            <ViewStateLabel>حالة العرض:</ViewStateLabel>
                            <SelectField
                              value={view}
                              onChange={(v) => setView(v as AdminViewState)}
                              options={viewOptions('لا توجد موانئ')}
                              variant="quiet"
                              aria-label="حالة العرض"
                            />
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل الموانئ…" /> : null}
          {mode === 'error' ? (
            <ErrorState
              title="تعذّر تحميل الموانئ"
              body="حدث خطأ أثناء جلب بيانات الموانئ والمنافذ. تحقّق من اتصالك ثم أعد المحاولة."
              onRetry={() => setView('default')}
            />
          ) : null}
          {mode === 'empty' ? (
            <EmptyState glyph="truck" title="لا توجد موانئ لهذه المدينة" body="أضف ميناءً أو منفذاً ليصبح متاحاً عند إنشاء الرحلات." />
          ) : null}
          {mode === 'noresults' ? (
            <NoResultsState
              onClearFilters={() => {
                setSearch('');
                setCityId(null);
                setView('default');
              }}
            />
          ) : null}
        </div>

        {editing ? (
          <SidePanel
            title="تعديل الميناء"
            onClose={() => setEditing(null)}
            footer={
              <>
                <PanelCta icon="check" onClick={() => setEditing(null)}>
                  حفظ التغييرات
                </PanelCta>
                <PanelCta variant="ghost" onClick={() => setEditing(null)}>
                  إلغاء
                </PanelCta>
              </>
            }
          >
            <FormGrid columns={1}>
              <Field label="اسم الميناء" required htmlFor="port-name">
                <TextInput id="port-name" defaultValue={editing.name} />
              </Field>
              <Field label="المدينة" required htmlFor="port-city">
                <TextInput id="port-city" defaultValue={CITIES.find((c) => c.id === editing.cityId)?.name} disabled />
              </Field>
            </FormGrid>

            <div style={{ marginTop: 20 }}>
              <SectionLabel>قواعد الدخول</SectionLabel>
              <Toggle
                checked={requiresPermit}
                onChange={setRequiresPermit}
                label="يتطلب تصريح دخول"
                help="عند التفعيل، تطلب المنصة تصريح دخول من العميل قبل بدء التحميل على أي رحلة تمر بهذا الميناء."
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <Field label="تعليمات خاصة" help="تظهر للسائق داخل ملف الرحلة عند الوصول." htmlFor="port-notes">
                <TextArea id="port-notes" defaultValue={editing.instructions ?? ''} />
              </Field>
            </div>

            {requiresPermit !== editing.requiresPermit ? (
              <div style={{ marginTop: 16 }}>
                <AlertBanner tone="warning">
                  تغيير قاعدة التصريح يسري على الرحلات الجديدة فقط ولا يؤثر على الرحلات الجارية.
                </AlertBanner>
              </div>
            ) : null}
          </SidePanel>
        ) : null}
      </PageBody>
    </>
  );
}
