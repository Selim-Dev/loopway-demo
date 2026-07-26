'use client';

import * as React from 'react';
import {
  ActionBar,
  AlertBanner,
  CellPrimary,
  CellSecondary,
  CellStack,
  ChipList,
  CompatibilityMatrix,
  ContentTabs,
  DataTable,
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
  Section,
  SearchField,
  SelectField,
  StatusBadge,
  TableCard,
  Tag,
  ViewStateLabel,
  COMPATIBILITY_LABEL,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { CARGO_TYPES, TRUCK_TYPE_DEFS } from '@/mocks/settings';
import { useAdminStore } from '@/store/AdminStore';

/**
 * أنواع الشحنات والشاحنات — SRS M04-E08.
 *
 * The compatibility matrix (E08-F02) is the reason this section is not just
 * two CRUD tables: it encodes Blocked Combinations and Warning Rules, which is
 * what stops a customer picking a refrigerated load on a flatbed.
 */
export function CatalogScreen() {
  const { state, dispatch } = useAdminStore();
  const [tab, setTab] = React.useState('cargo');
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<AdminViewState>('default');

  const cargo = CARGO_TYPES.filter((c) => c.name.includes(search.trim()));
  const trucks = TRUCK_TYPE_DEFS.filter((t) => t.name.includes(search.trim()));

  const activeCargo = CARGO_TYPES.filter((c) => c.active);
  const activeTrucks = TRUCK_TYPE_DEFS.filter((t) => t.active);
  const count = tab === 'cargo' ? cargo.length : tab === 'trucks' ? trucks.length : activeCargo.length;
  const mode = resolveMode(view, count);

  // One control, rendered wherever the active tab happens to put it — the
  // matrix tab has no table to attach a PaginationBar to.
  const stateControl = (
    <>
      <ViewStateLabel>حالة العرض:</ViewStateLabel>
      <SelectField
        value={view}
        onChange={(v) => setView(v as AdminViewState)}
        options={viewOptions(tab === 'trucks' ? 'لا توجد أنواع شاحنات' : 'لا توجد أنواع شحنات')}
        variant="quiet"
        aria-label="حالة العرض"
      />
    </>
  );

  return (
    <>
      <AdminHeader title="أنواع الشحنات والشاحنات" subtitle="أنواع الحمولات وأنواع الشاحنات ومصفوفة التوافق بينهما" />

      <FilterBar>
        <ContentTabs
          tabs={[
            { key: 'cargo', label: 'أنواع الشحنات', count: CARGO_TYPES.length },
            { key: 'trucks', label: 'أنواع الشاحنات', count: TRUCK_TYPE_DEFS.length },
            { key: 'matrix', label: 'مصفوفة التوافق' },
          ]}
          active={tab}
          onChange={setTab}
        />
        {tab !== 'matrix' ? (
          <SearchField value={search} onChange={setSearch} placeholder="ابحث بالاسم…" aria-label="ابحث" />
        ) : null}
        <FilterBarSpacer>
          {tab !== 'matrix' ? (
            <PrimaryCta size="sm" icon="plus">
              {tab === 'cargo' ? 'إضافة نوع شحنة' : 'إضافة نوع شاحنة'}
            </PrimaryCta>
          ) : null}
        </FilterBarSpacer>
      </FilterBar>

      <PageBody>
        {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل الكتالوج…" /> : null}
        {mode === 'error' ? (
          <ErrorState
            title="تعذّر تحميل الكتالوج"
            body="حدث خطأ أثناء جلب أنواع الشحنات والشاحنات. تحقّق من اتصالك ثم أعد المحاولة."
            onRetry={() => setView('default')}
          />
        ) : null}
        {mode === 'empty' ? (
          <EmptyState glyph="truck" title="الكتالوج فارغ" body="أضف نوع شحنة أو نوع شاحنة ليصبح متاحاً عند إنشاء الرحلات." />
        ) : null}
        {mode === 'noresults' ? (
          <NoResultsState
            onClearFilters={() => {
              setSearch('');
              setView('default');
            }}
          />
        ) : null}

        {mode === 'list' && tab === 'cargo' ? (
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <TableCard>
              <DataTable
                head={
                  <>
                    <th>نوع الشحنة</th>
                    <th>يتطلب تبريد</th>
                    <th>مواد خطرة</th>
                    <th>مناولة خاصة</th>
                    <th>حجم غير اعتيادي</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {cargo.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <CellStack>
                        <RowIcon icon="list" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                        <div>
                          <CellPrimary>{c.name}</CellPrimary>
                          <CellSecondary ltr>{c.id}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>{c.requiresTemperature ? <StatusBadge tone="warning">نعم</StatusBadge> : <CellSecondary>لا</CellSecondary>}</td>
                    <td>{c.dangerousGoods ? <StatusBadge tone="danger">نعم</StatusBadge> : <CellSecondary>لا</CellSecondary>}</td>
                    <td>{c.specialHandling ? <StatusBadge tone="warning">نعم</StatusBadge> : <CellSecondary>لا</CellSecondary>}</td>
                    <td>{c.oversized ? <StatusBadge tone="warning">نعم</StatusBadge> : <CellSecondary>لا</CellSecondary>}</td>
                    <td>
                      <StatusBadge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'نشط' : 'معطّل'}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </DataTable>

              <PaginationBar attached showArrows={false} count={cargo.length} total={CARGO_TYPES.length} left={stateControl} />
            </TableCard>
          </div>
        ) : null}

        {mode === 'list' && tab === 'trucks' ? (
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <TableCard>
              <DataTable
                head={
                  <>
                    <th>نوع الشاحنة</th>
                    <th>السعة والملاحظات</th>
                    <th>أنواع الشحنات الممنوعة</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {trucks.map((t) => {
                  const blocked = CARGO_TYPES.filter((c) => state.compatibility[`${c.id}:${t.id}`] === 'blocked');
                  return (
                    <tr key={t.id}>
                      <td>
                        <CellStack>
                          <RowIcon icon="truck" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
                          <div>
                            <CellPrimary>{t.name}</CellPrimary>
                            <CellSecondary ltr>{t.id}</CellSecondary>
                          </div>
                        </CellStack>
                      </td>
                      <td>
                        <CellSecondary>{t.capacityNote}</CellSecondary>
                      </td>
                      <td>
                        {blocked.length ? (
                          <ChipList>
                            {blocked.map((b) => (
                              <Tag key={b.id} tone="danger">
                                {b.name}
                              </Tag>
                            ))}
                          </ChipList>
                        ) : (
                          <CellSecondary>لا يوجد</CellSecondary>
                        )}
                      </td>
                      <td>
                        <StatusBadge tone={t.active ? 'success' : 'neutral'}>{t.active ? 'نشط' : 'معطّل'}</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </DataTable>

              <PaginationBar attached showArrows={false} count={trucks.length} total={TRUCK_TYPE_DEFS.length} left={stateControl} />
            </TableCard>
          </div>
        ) : null}

        {mode === 'list' && tab === 'matrix' ? (
          <>
            <AlertBanner tone="warning">
              تغيير خانة إلى «ممنوع» يمنع العملاء من اختيار هذا التركيب فوراً عند إنشاء رحلة جديدة. الرحلات الجارية لا تتأثر.
            </AlertBanner>

            <Section
              title="مصفوفة التوافق بين الحمولات والشاحنات"
              subtitle="الصفوف أنواع الشحنات، الأعمدة أنواع الشاحنات"
            >
              <CompatibilityMatrix
                rows={activeCargo.map((c) => ({ id: c.id, label: c.name }))}
                columns={activeTrucks.map((t) => ({ id: t.id, label: t.name }))}
                value={state.compatibility}
                onChange={(rowId, colId, next) => {
                  const cargoName = CARGO_TYPES.find((c) => c.id === rowId)?.name ?? rowId;
                  const truckName = TRUCK_TYPE_DEFS.find((t) => t.id === colId)?.name ?? colId;
                  dispatch({
                    type: 'compatibility/set',
                    key: `${rowId}:${colId}`,
                    value: next,
                    label: `${cargoName} × ${truckName} → ${COMPATIBILITY_LABEL[next]}`,
                  });
                }}
              />
            </Section>

            <ActionBar note={`${activeCargo.length} نوع شحنة × ${activeTrucks.length} نوع شاحنة`}>{stateControl}</ActionBar>
          </>
        ) : null}
      </PageBody>
    </>
  );
}
