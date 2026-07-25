import type { Metadata } from 'next';
import { Icon, PrimaryCta } from '@loopway/ui';
import { Header } from '@/components/Header';
import styles from '../derived.module.css';

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
  { label: 'مكتملة', value: 38, pct: 100, color: 'var(--lw-green-500)' },
  { label: 'جارية الآن', value: 5, pct: 13, color: 'var(--lw-green-600)' },
  { label: 'بانتظار العروض', value: 2, pct: 5, color: 'var(--lw-amber-500)' },
  { label: 'ملغاة', value: 3, pct: 8, color: 'var(--lw-red-500)' },
  { label: 'منتهية دون عرض', value: 1, pct: 3, color: 'var(--lw-slate-400)' },
];

const TOP_ROUTES = [
  { label: 'الرياض ← جدة', value: 12, pct: 100 },
  { label: 'الدمام ← دبي', value: 9, pct: 75 },
  { label: 'الرياض ← الدمام', value: 7, pct: 58 },
  { label: 'جدة ← المدينة', value: 5, pct: 42 },
  { label: 'الرياض ← الكويت', value: 4, pct: 33 },
];

const MONTHLY_SPEND = [
  { label: 'أبريل 2026', value: '18,400', pct: 52 },
  { label: 'مايو 2026', value: '24,900', pct: 70 },
  { label: 'يونيو 2026', value: '29,300', pct: 82 },
  { label: 'يوليو 2026', value: '35,600', pct: 100 },
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
      <div className={styles.body}>
        <div className={styles.actionBar}>
          <span className={styles.actionBarNote}>الفترة: آخر 4 أشهر · جميع الرحلات</span>
          <div className={styles.actionBarGroup}>
            <PrimaryCta size="sm" variant="secondary" icon="download">
              تصدير التقرير (PDF)
            </PrimaryCta>
          </div>
        </div>

        <div className={styles.grid2}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>الرحلات حسب الحالة</span>
              <span className={styles.sectionSub}>49 رحلة</span>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.bars}>
                {BY_STATUS.map((b) => (
                  <div key={b.label} className={styles.barRow}>
                    <span className={styles.barLabel}>{b.label}</span>
                    <span className={styles.barTrack}>
                      <span className={styles.barFill} style={{ width: `${b.pct}%`, background: b.color }} />
                    </span>
                    <span className={styles.barValue}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>الإنفاق الشهري</span>
              <span className={styles.sectionSub}>بالريال السعودي</span>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.bars}>
                {MONTHLY_SPEND.map((b) => (
                  <div key={b.label} className={styles.barRow}>
                    <span className={styles.barLabel}>{b.label}</span>
                    <span className={styles.barTrack}>
                      <span className={styles.barFill} style={{ width: `${b.pct}%`, background: 'var(--lw-navy-800)' }} />
                    </span>
                    <span className={styles.barValue}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>أكثر المسارات تكراراً</span>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.bars}>
                {TOP_ROUTES.map((b) => (
                  <div key={b.label} className={styles.barRow}>
                    <span className={styles.barLabel}>{b.label}</span>
                    <span className={styles.barTrack}>
                      <span className={styles.barFill} style={{ width: `${b.pct}%`, background: 'var(--lw-green-500)' }} />
                    </span>
                    <span className={styles.barValue}>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>الرحلات المتأخرة</span>
              <span className={styles.sectionSub}>قد ينتج عنها غرامات بعد مراجعة الإدارة</span>
            </div>
            <div className={styles.sectionBodyFlush}>
              {DELAYED.map((d) => (
                <div key={d.trip} className={styles.row}>
                  <span className={styles.glyph} style={{ background: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)' }}>
                    <Icon name="clock" size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>
                      <span className="lw-ltr">{d.trip}</span> · {d.route}
                    </div>
                    <div className={styles.rowMeta}>{d.reason}</div>
                  </div>
                  <span className={styles.tag}>
                    <span className="lw-ltr">{d.delay}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
