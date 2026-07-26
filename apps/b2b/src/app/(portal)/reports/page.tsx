import type { Metadata } from 'next';
import { ActionBar, BarList, Grid, ListRow, PageBody, PrimaryCta, Section, Tag } from '@loopway/ui';
import { Header } from '@/components/Header';

export const metadata: Metadata = { title: 'التقارير — LoopWay' };

/**
 * تقارير خفيفة — DERIVED, NOT DESIGNED (SRS M03-E11).
 *
 * Deliberately chart-library-free: the brand has no chart language of its own,
 * so this uses the same horizontal bar + token colours the rest of the portal
 * already speaks rather than importing a visual vocabulary the design never
 * established. Swap in real charts only once they are designed.
 */

const BY_STATUS = [
  { label: 'مكتملة', value: '38', percent: 100, color: 'var(--lw-green-500)' },
  { label: 'جارية الآن', value: '5', percent: 13, color: 'var(--lw-green-600)' },
  { label: 'بانتظار العروض', value: '2', percent: 5, color: 'var(--lw-amber-500)' },
  { label: 'ملغاة', value: '3', percent: 8, color: 'var(--lw-red-500)' },
  { label: 'منتهية دون عرض', value: '1', percent: 3, color: 'var(--lw-slate-400)' },
];

const TOP_ROUTES = [
  { label: 'الرياض ← جدة', value: '12', percent: 100, color: 'var(--lw-green-500)' },
  { label: 'الدمام ← دبي', value: '9', percent: 75, color: 'var(--lw-green-500)' },
  { label: 'الرياض ← الدمام', value: '7', percent: 58, color: 'var(--lw-green-500)' },
  { label: 'جدة ← المدينة', value: '5', percent: 42, color: 'var(--lw-green-500)' },
  { label: 'الرياض ← الكويت', value: '4', percent: 33, color: 'var(--lw-green-500)' },
];

const MONTHLY_SPEND = [
  { label: 'أبريل 2026', value: '18,400', percent: 52, color: 'var(--lw-navy-800)' },
  { label: 'مايو 2026', value: '24,900', percent: 70, color: 'var(--lw-navy-800)' },
  { label: 'يونيو 2026', value: '29,300', percent: 82, color: 'var(--lw-navy-800)' },
  { label: 'يوليو 2026', value: '35,600', percent: 100, color: 'var(--lw-navy-800)' },
];

const DELAYED = [
  { trip: 'LW-2026-002955', route: 'جدة ← المدينة', reason: 'انتظار التحميل تجاوز الحد', delay: '2:40 ساعة' },
  { trip: 'LW-2026-002962', route: 'الرياض ← الكويت', reason: 'تأخير في إجراءات الجمارك', delay: '5:10 ساعات' },
  { trip: 'LW-2026-002905', route: 'الدمام ← دبي', reason: 'انتظار التفريغ', delay: '1:25 ساعة' },
];

export default function ReportsPage() {
  return (
    <>
      <Header title="التقارير" subtitle="ملخص تشغيلي ومالي مبسّط لرحلات شركتك" />
      <PageBody>
        <ActionBar note="الفترة: آخر 4 أشهر · جميع الرحلات">
          <PrimaryCta size="sm" variant="secondary" icon="download">
            تصدير التقرير (PDF)
          </PrimaryCta>
        </ActionBar>

        <Grid cols={2}>
          <Section title="الرحلات حسب الحالة" subtitle="49 رحلة">
            <BarList data={BY_STATUS} />
          </Section>

          <Section title="الإنفاق الشهري" subtitle="بالريال السعودي">
            <BarList data={MONTHLY_SPEND} />
          </Section>

          <Section title="أكثر المسارات تكراراً">
            <BarList data={TOP_ROUTES} />
          </Section>

          <Section title="الرحلات المتأخرة" subtitle="قد ينتج عنها غرامات بعد مراجعة الإدارة" flush>
            {DELAYED.map((d) => (
              <ListRow
                key={d.trip}
                icon="clock"
                iconBackground="var(--color-warning-bg)"
                iconColor="var(--lw-amber-600)"
                title={
                  <>
                    <span className="lw-ltr">{d.trip}</span> · {d.route}
                  </>
                }
                meta={d.reason}
                side={
                  <Tag>
                    <span className="lw-ltr">{d.delay}</span>
                  </Tag>
                }
              />
            ))}
          </Section>
        </Grid>
      </PageBody>
    </>
  );
}
