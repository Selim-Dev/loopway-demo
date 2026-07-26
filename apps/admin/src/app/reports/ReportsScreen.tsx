'use client';

import * as React from 'react';
import {
  ActionBar,
  BarList,
  EmptyState,
  ErrorState,
  Grid,
  KpiGrid,
  KpiTile,
  LoadingState,
  NoResultsState,
  PageBody,
  PrimaryCta,
  Section,
  SelectField,
  ViewStateLabel,
  toBarData,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { ADMIN_SHIPMENTS } from '@/mocks/operations';
import { ADMIN_PAYMENTS } from '@/mocks/finance';
import { useAdminStore } from '@/store/AdminStore';

/**
 * التقارير — SRS M04-E14.
 *
 * No chart library, deliberately: the brand has no chart vocabulary — no axes,
 * no legends, no plotting palette are defined anywhere in the design system.
 * `BarList` says the same thing using tokens the product already speaks.
 * See docs/design-system/10-admin-portal-guide.md → "What not to invent".
 */

const RANGES = [
  { value: '30', label: 'آخر 30 يوماً' },
  { value: '90', label: 'آخر 3 أشهر' },
  { value: '180', label: 'آخر 6 أشهر' },
];

const SCOPES = [
  { value: 'all', label: 'النطاق: الكل' },
  { value: 'محلية', label: 'محلية' },
  { value: 'دولية', label: 'دولية' },
];

const num = (s: string) => Number(s.replace(/,/g, '')) || 0;

export function ReportsScreen() {
  const { state } = useAdminStore();
  const [range, setRange] = React.useState('90');
  const [scope, setScope] = React.useState('all');
  const [view, setView] = React.useState<AdminViewState>('default');

  const shipments = React.useMemo(
    () => ADMIN_SHIPMENTS.filter((s) => scope === 'all' || s.scope === scope),
    [scope],
  );

  const byStatus = toBarData([
    { label: 'مكتملة', value: shipments.filter((s) => s.status === 'مكتملة').length, color: 'var(--lw-green-500)' },
    { label: 'جارية الآن', value: shipments.filter((s) => ['متجه للاستلام', 'جاري التحميل', 'في الطريق', 'عند الحدود', 'جاري التسليم'].includes(s.status)).length, color: 'var(--lw-green-600)' },
    { label: 'بانتظار العروض', value: shipments.filter((s) => s.status === 'بانتظار العروض' || s.status === 'وصلت عروض').length, color: 'var(--lw-amber-500)' },
    { label: 'ملغاة', value: shipments.filter((s) => s.status === 'ملغاة').length, color: 'var(--lw-red-500)' },
    { label: 'منتهية دون عرض', value: shipments.filter((s) => s.status === 'منتهية دون عرض').length, color: 'var(--lw-slate-400)' },
  ]);

  const routeCounts = shipments.reduce<Record<string, number>>((acc, s) => {
    const k = `${s.from} ← ${s.to}`;
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const topRoutes = toBarData(
    Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value, color: 'var(--lw-green-500)' })),
  );

  const captured = ADMIN_PAYMENTS.filter((p) => p.status === 'Captured');
  const revenue = captured.reduce((s, p) => s + num(p.amount), 0);
  const refunded = ADMIN_PAYMENTS.filter((p) => p.status === 'Refunded').reduce((s, p) => s + num(p.amount), 0);
  const failed = ADMIN_PAYMENTS.filter((p) => p.status === 'Failed').reduce((s, p) => s + num(p.amount), 0);
  const penaltyTotal = state.penalties.reduce((s, p) => s + num(p.adjustedAmount ?? p.proposedAmount), 0);
  const payoutTotal = state.payouts.reduce((s, p) => s + num(p.netAmount), 0);

  const financial = toBarData(
    [
      { label: 'مدفوعات محصّلة', value: revenue, color: 'var(--lw-green-500)' },
      { label: 'مستحقات السائقين', value: payoutTotal, color: 'var(--lw-navy-800)' },
      { label: 'مبالغ مستردة', value: refunded, color: 'var(--lw-slate-400)' },
      { label: 'غرامات محتملة', value: penaltyTotal, color: 'var(--lw-amber-500)' },
      { label: 'مدفوعات فاشلة', value: failed, color: 'var(--lw-red-500)' },
    ],
    (n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 }),
  );

  const paid = shipments.filter((s) => s.paymentStatus === 'Captured').length;
  const conversion = Math.round((paid / Math.max(1, shipments.length)) * 100);

  const driverPerf = toBarData(
    Object.entries(
      shipments
        .filter((s) => s.driverName)
        .reduce<Record<string, number>>((acc, s) => {
          acc[s.driverName!] = (acc[s.driverName!] ?? 0) + 1;
          return acc;
        }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value, color: 'var(--lw-green-500)' })),
  );

  const portUsage = toBarData([
    { label: 'ميناء الملك عبدالعزيز', value: 12, color: 'var(--lw-navy-800)' },
    { label: 'ميناء جبل علي', value: 9, color: 'var(--lw-navy-800)' },
    { label: 'منفذ البطحاء', value: 7, color: 'var(--lw-navy-800)' },
    { label: 'ميناء جدة الإسلامي', value: 5, color: 'var(--lw-navy-800)' },
    { label: 'منفذ الشويخ', value: 3, color: 'var(--lw-navy-800)' },
  ]);

  const delayed = toBarData([
    { label: 'انتظار التحميل', value: 6, color: 'var(--lw-amber-500)' },
    { label: 'تأخير الجمارك', value: 4, color: 'var(--lw-amber-500)' },
    { label: 'انتظار التفريغ', value: 3, color: 'var(--lw-amber-500)' },
    { label: 'تأخر السائق', value: 2, color: 'var(--lw-amber-500)' },
  ]);

  const mode = resolveMode(view, shipments.length);

  return (
    <>
      <AdminHeader title="التقارير" subtitle="تقارير تشغيلية ومالية على مستوى المنصة" />

      <PageBody>
        <ActionBar note={`الفترة: ${RANGES.find((r) => r.value === range)?.label} · ${shipments.length} شحنة`}>
          <ViewStateLabel>حالة العرض:</ViewStateLabel>
          <SelectField
            value={view}
            onChange={(v) => setView(v as AdminViewState)}
            options={viewOptions('لا توجد بيانات')}
            variant="quiet"
            aria-label="حالة العرض"
          />
          <SelectField value={range} onChange={setRange} options={RANGES} size="sm" aria-label="الفترة" />
          <SelectField value={scope} onChange={setScope} options={SCOPES} size="sm" aria-label="النطاق" />
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير التقرير (PDF)
          </PrimaryCta>
        </ActionBar>

        {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل التقارير…" /> : null}
        {mode === 'error' ? (
          <ErrorState
            title="تعذّر تحميل التقارير"
            body="حدث خطأ أثناء احتساب التقارير. تحقّق من اتصالك ثم أعد المحاولة."
            onRetry={() => setView('default')}
          />
        ) : null}
        {mode === 'empty' ? (
          <EmptyState glyph="document" title="لا توجد بيانات لهذه الفترة" body="اختر فترة أوسع أو نطاقاً مختلفاً." />
        ) : null}
        {mode === 'noresults' ? (
          <NoResultsState
            onClearFilters={() => {
              setScope('all');
              setRange('90');
              setView('default');
            }}
          />
        ) : null}

        {mode === 'list' ? (
        <>
        <KpiGrid cols={4}>
          <KpiTile label="إجمالي الشحنات" value={shipments.length} icon="truck" background="var(--color-success-bg)" color="var(--lw-green-700)" />
          <KpiTile label="التحوّل إلى مدفوعة" value={`${conversion}%`} icon="card" background="var(--lw-icon-tint-bg)" color="var(--lw-navy-800)" />
          <KpiTile label="إجمالي المحصّل" value={revenue.toLocaleString('en-US')} suffix="ر.س" icon="arrowIn" background="var(--color-success-bg)" color="var(--lw-green-700)" />
          <KpiTile label="غرامات محتملة" value={penaltyTotal.toLocaleString('en-US')} suffix="ر.س" icon="warning" background="var(--color-warning-bg)" color="var(--lw-amber-600)" />
        </KpiGrid>

        <Grid cols={2}>
          <Section title="الشحنات حسب الحالة" subtitle={`${shipments.length} شحنة`}>
            <BarList data={byStatus} />
          </Section>

          <Section title="الملخّص المالي" subtitle="بالريال السعودي">
            <BarList data={financial} />
          </Section>

          <Section title="أكثر المسارات تكراراً">
            <BarList data={topRoutes} />
          </Section>

          <Section title="أسباب التأخير" subtitle="عدد الحالات المسجّلة">
            <BarList data={delayed} />
          </Section>

          <Section title="أداء السائقين" subtitle="عدد الرحلات المنفّذة">
            <BarList data={driverPerf} />
          </Section>

          <Section title="استخدام الموانئ والمنافذ">
            <BarList data={portUsage} />
          </Section>
        </Grid>
        </>
        ) : null}
      </PageBody>
    </>
  );
}
