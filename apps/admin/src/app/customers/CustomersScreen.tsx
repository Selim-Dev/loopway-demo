'use client';

import * as React from 'react';
import {
  AvatarInitial,
  CellPrimary,
  CellSecondary,
  CellStack,
  ConfirmDialog,
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
  PanelCta,
  PrimaryCta,
  SearchField,
  SectionLabel,
  SelectField,
  SidePanel,
  StatusBadge,
  TableCard,
  ViewStateLabel,
  type AccountStatus,
  type BadgeTone,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { COMPANY_CUSTOMERS, INDIVIDUAL_CUSTOMERS, ADMIN_SHIPMENTS } from '@/mocks/operations';
import { ADMIN_PAYMENTS } from '@/mocks/finance';

/** إدارة العملاء والشركات — SRS M04-E05. */

const STATUS_META: Record<AccountStatus, { tone: BadgeTone; label: string }> = {
  Active: { tone: 'success', label: 'نشط' },
  'Pending Review': { tone: 'warning', label: 'قيد المراجعة' },
  Suspended: { tone: 'danger', label: 'موقوف' },
  'Documents Expired': { tone: 'danger', label: 'وثائق منتهية' },
};

const STATUSES = [
  { value: 'all', label: 'الحالة: الكل' },
  { value: 'Active', label: 'نشط' },
  { value: 'Pending Review', label: 'قيد المراجعة' },
  { value: 'Suspended', label: 'موقوف' },
  { value: 'Documents Expired', label: 'وثائق منتهية' },
];

type Selected = { kind: 'individual' | 'company'; id: string } | null;

export function CustomersScreen() {
  const [tab, setTab] = React.useState<'individual' | 'company'>('company');
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');
  const [selected, setSelected] = React.useState<Selected>(null);
  const [innerTab, setInnerTab] = React.useState('docs');
  const [suspending, setSuspending] = React.useState(false);

  const individuals = INDIVIDUAL_CUSTOMERS.filter((c) => {
    if (status !== 'all' && c.status !== status) return false;
    const q = search.trim();
    return !q || c.name.includes(q) || c.mobile.includes(q) || c.id.includes(q);
  });

  const companies = COMPANY_CUSTOMERS.filter((c) => {
    if (status !== 'all' && c.status !== status) return false;
    const q = search.trim();
    return !q || c.companyName.includes(q) || c.commercialRegistration.includes(q) || c.id.includes(q);
  });

  const rowCount = tab === 'company' ? companies.length : individuals.length;
  const mode = resolveMode(view, rowCount);

  const company = selected?.kind === 'company' ? COMPANY_CUSTOMERS.find((c) => c.id === selected.id) : undefined;
  const individual = selected?.kind === 'individual' ? INDIVIDUAL_CUSTOMERS.find((c) => c.id === selected.id) : undefined;
  const name = company?.companyName ?? individual?.name ?? '';
  const accountStatus = company?.status ?? individual?.status;

  const shipments = ADMIN_SHIPMENTS.filter((s) => s.customerName === name);
  const payments = ADMIN_PAYMENTS.filter((p) => p.payerName === name);

  return (
    <>
      <AdminHeader title="إدارة العملاء والشركات" subtitle="حسابات الأفراد والشركات ووثائقها وشحناتها ومدفوعاتها" />

      <FilterBar>
        <ContentTabs
          tabs={[
            { key: 'company', label: 'شركات', count: COMPANY_CUSTOMERS.length },
            { key: 'individual', label: 'أفراد', count: INDIVIDUAL_CUSTOMERS.length },
          ]}
          active={tab}
          onChange={(k) => {
            setTab(k as 'individual' | 'company');
            setSelected(null);
          }}
        />
        <SearchField value={search} onChange={setSearch} placeholder="ابحث بالاسم أو السجل أو الجوال…" aria-label="ابحث" />
        <SelectField value={status} onChange={setStatus} options={STATUSES} aria-label="تصفية حسب الحالة" />
        <FilterBarSpacer>
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير
          </PrimaryCta>
        </FilterBarSpacer>
      </FilterBar>

      {mode === 'list' ? (
        <PageBody variant="row">
          <TableCard>
            {tab === 'company' ? (
              <DataTable
                head={
                  <>
                    <th>الشركة</th>
                    <th>السجل التجاري</th>
                    <th>المفوّض</th>
                    <th>المدينة</th>
                    <th>الرحلات</th>
                    <th>الإنفاق</th>
                    <th>الباقة</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {companies.map((c) => (
                  <tr key={c.id} onClick={() => setSelected({ kind: 'company', id: c.id })}>
                    <td>
                      <CellStack>
                        <AvatarInitial initial={c.initial} size={36} fontSize={14} />
                        <div>
                          <CellPrimary>{c.companyName}</CellPrimary>
                          <CellSecondary ltr>{c.id}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.commercialRegistration}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary>{c.authorizedContact}</CellPrimary>
                      <CellSecondary ltr>{c.mobile}</CellSecondary>
                    </td>
                    <td>
                      <CellPrimary>{c.city}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.shipmentCount}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.totalSpend} ر.س</CellPrimary>
                    </td>
                    <td>
                      <CellSecondary>{c.planName}</CellSecondary>
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_META[c.status].tone}>{STATUS_META[c.status].label}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </DataTable>
            ) : (
              <DataTable
                head={
                  <>
                    <th>العميل</th>
                    <th>الجوال</th>
                    <th>المدينة</th>
                    <th>تاريخ الانضمام</th>
                    <th>الرحلات</th>
                    <th>الإنفاق</th>
                    <th>بلاغات مفتوحة</th>
                    <th>الحالة</th>
                  </>
                }
              >
                {individuals.map((c) => (
                  <tr key={c.id} onClick={() => setSelected({ kind: 'individual', id: c.id })}>
                    <td>
                      <CellStack>
                        <AvatarInitial initial={c.initial} size={36} fontSize={14} />
                        <div>
                          <CellPrimary>{c.name}</CellPrimary>
                          <CellSecondary ltr>{c.id}</CellSecondary>
                        </div>
                      </CellStack>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.mobile}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary>{c.city}</CellPrimary>
                    </td>
                    <td>
                      <CellSecondary>{c.joinedAt}</CellSecondary>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.shipmentCount}</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.totalSpend} ر.س</CellPrimary>
                    </td>
                    <td>
                      <CellPrimary ltr>{c.openCases}</CellPrimary>
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_META[c.status].tone}>{STATUS_META[c.status].label}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </DataTable>
            )}

            <PaginationBar
              attached
              showArrows={false}
              count={rowCount}
              total={rowCount}
              left={
                <>
                  <ViewStateLabel>حالة العرض:</ViewStateLabel>
                  <SelectField
                    value={view}
                    onChange={(v) => setView(v as AdminViewState)}
                    options={viewOptions('لا توجد حسابات')}
                    variant="quiet"
                    aria-label="حالة العرض"
                  />
                </>
              }
            />
          </TableCard>

          {selected ? (
            <SidePanel
              title="ملف الحساب"
              onClose={() => setSelected(null)}
              footer={
                accountStatus === 'Suspended' ? (
                  <PanelCta icon="check">إعادة تفعيل الحساب</PanelCta>
                ) : (
                  <PanelCta variant="danger" onClick={() => setSuspending(true)}>
                    إيقاف الحساب
                  </PanelCta>
                )
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <AvatarInitial initial={(company?.initial ?? individual?.initial) as string} size={44} fontSize={17} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{name}</div>
                  <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                    <span className="lw-ltr">{selected.id}</span>
                  </div>
                </div>
                {accountStatus ? (
                  <StatusBadge tone={STATUS_META[accountStatus].tone}>{STATUS_META[accountStatus].label}</StatusBadge>
                ) : null}
              </div>

              <DetailList>
                {company ? (
                  <>
                    <DetailRow label="السجل التجاري">
                      <span className="lw-ltr">{company.commercialRegistration}</span>
                    </DetailRow>
                    <DetailRow label="الرقم الضريبي">
                      <span className="lw-ltr">{company.vatNumber}</span>
                    </DetailRow>
                    <DetailRow label="المفوّض">{company.authorizedContact}</DetailRow>
                    <DetailRow label="الباقة">{company.planName}</DetailRow>
                  </>
                ) : null}
                <DetailRow label="المدينة">{(company?.city ?? individual?.city) as string}</DetailRow>
                <DetailRow label="الجوال">
                  <span className="lw-ltr">{(company?.mobile ?? individual?.mobile) as string}</span>
                </DetailRow>
                <DetailRow label="تاريخ الانضمام">{(company?.joinedAt ?? individual?.joinedAt) as string}</DetailRow>
                <DetailRow label="إجمالي الإنفاق">
                  <span className="lw-ltr">{(company?.totalSpend ?? individual?.totalSpend) as string}</span> ر.س
                </DetailRow>
              </DetailList>

              <div style={{ marginTop: 20, marginBottom: 14 }}>
                <ContentTabs
                  tabs={[
                    { key: 'docs', label: 'وثائق' },
                    { key: 'shipments', label: 'شحنات', count: shipments.length },
                    { key: 'payments', label: 'مدفوعات', count: payments.length },
                    { key: 'cases', label: 'بلاغات', count: (company?.openCases ?? individual?.openCases) as number },
                  ]}
                  active={innerTab}
                  onChange={setInnerTab}
                />
              </div>

              {innerTab === 'docs' ? (
                <DetailList>
                  <DetailRow label="السجل التجاري">
                    <StatusBadge tone="success">معتمد</StatusBadge>
                  </DetailRow>
                  <DetailRow label="شهادة الضريبة">
                    <StatusBadge tone="success">معتمدة</StatusBadge>
                  </DetailRow>
                  <DetailRow label="العنوان الوطني">
                    <StatusBadge tone={accountStatus === 'Documents Expired' ? 'danger' : 'success'}>
                      {accountStatus === 'Documents Expired' ? 'منتهٍ' : 'معتمد'}
                    </StatusBadge>
                  </DetailRow>
                </DetailList>
              ) : null}

              {innerTab === 'shipments' ? (
                shipments.length ? (
                  <DetailList>
                    {shipments.map((s) => (
                      <DetailRow key={s.id} label={s.id}>
                        {s.from} ← {s.to} · {s.status}
                      </DetailRow>
                    ))}
                  </DetailList>
                ) : (
                  <SectionLabel>لا توجد شحنات مسجّلة</SectionLabel>
                )
              ) : null}

              {innerTab === 'payments' ? (
                payments.length ? (
                  <DetailList>
                    {payments.map((p) => (
                      <DetailRow key={p.id} label={p.id}>
                        <span className="lw-ltr">{p.amount}</span> ر.س · {p.date}
                      </DetailRow>
                    ))}
                  </DetailList>
                ) : (
                  <SectionLabel>لا توجد مدفوعات</SectionLabel>
                )
              ) : null}

              {innerTab === 'cases' ? (
                <SectionLabel>
                  {((company?.openCases ?? individual?.openCases) as number) > 0
                    ? `${(company?.openCases ?? individual?.openCases) as number} بلاغات مفتوحة — راجعها من قسم الدعم`
                    : 'لا توجد بلاغات مفتوحة'}
                </SectionLabel>
              ) : null}
            </SidePanel>
          ) : null}
        </PageBody>
      ) : null}

      {mode === 'loading' ? <LoadingState rows={5} label="جارٍ تحميل الحسابات…" /> : null}
      {mode === 'error' ? (
        <ErrorState
          title="تعذّر تحميل الحسابات"
          body="حدث خطأ أثناء جلب بيانات العملاء والشركات. تحقّق من اتصالك ثم أعد المحاولة."
          onRetry={() => setView('default')}
        />
      ) : null}
      {mode === 'empty' ? <EmptyState glyph="user" title="لا توجد حسابات" body="حسابات العملاء والشركات ستظهر هنا." /> : null}
      {mode === 'noresults' ? (
        <NoResultsState
          onClearFilters={() => {
            setSearch('');
            setStatus('all');
            setView('default');
          }}
        />
      ) : null}

      <ConfirmDialog
        open={suspending}
        onClose={() => setSuspending(false)}
        onConfirm={() => setSuspending(false)}
        tone="danger"
        title="إيقاف الحساب"
        body={`لن يتمكن ${name} من إنشاء رحلات جديدة. الرحلات الجارية والمدفوعات القائمة لا تتأثر.`}
        confirmLabel="تأكيد الإيقاف"
        reasonRequired
        reasonLabel="سبب الإيقاف"
      />
    </>
  );
}
