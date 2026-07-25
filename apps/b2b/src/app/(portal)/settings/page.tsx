import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertBanner, Icon, PrimaryCta, ProgressBar, StatusBadge } from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY } from '@/mocks/company';
import { LIVE_TRIPS, OFFER_TRIPS } from '@/mocks/trips';
import styles from '../derived.module.css';

export const metadata: Metadata = { title: 'الإعدادات — LoopWay' };

const NOTIFICATION_PREFS = [
  { label: 'وصول عروض جديدة', body: 'تنبيه فوري عند وصول أي عرض على رحلة منشورة.' },
  { label: 'تغيّر حالة الرحلة', body: 'التحميل، عبور الحدود، التسليم، والإغلاق.' },
  { label: 'المدفوعات والفواتير', body: 'نجاح أو فشل عمليات الدفع وشحن الرصيد.' },
  { label: 'المستندات والتصاريح', body: 'وثيقة مطلوبة أو على وشك الانتهاء.' },
];

/** DERIVED, NOT DESIGNED — plan + preferences behind the rail's gear icon. */
export default function SettingsPage() {
  const used = LIVE_TRIPS.length + OFFER_TRIPS.length;
  const pct = Math.round((used / COMPANY.maxConcurrent) * 100);

  return (
    <>
      <Header title="الإعدادات" subtitle="الباقة والتنبيهات وإعدادات الحساب" />
      <div className={styles.body}>
        <div className={styles.split}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <div className={styles.sectionTitle}>{COMPANY.planName}</div>
                <div className={styles.sectionSub}>إدارة عدة رحلات متزامنة حسب حد باقتك</div>
              </div>
              <StatusBadge tone="success">نشطة</StatusBadge>
            </div>
            <div className={styles.sectionBody}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className={styles.kvKey}>الرحلات المتزامنة المستخدمة</span>
                <span className={styles.kvValue}>
                  <span className="lw-ltr">
                    {used} / {COMPANY.maxConcurrent}
                  </span>
                </span>
              </div>
              <ProgressBar percent={pct} label="استهلاك حد الباقة" />

              {used >= COMPANY.maxConcurrent ? (
                <div style={{ marginTop: 16 }}>
                  <AlertBanner tone="warning">
                    لقد وصلت إلى الحد الأقصى للرحلات الحالية المسموح به في باقتك
                  </AlertBanner>
                </div>
              ) : null}

              <div className={styles.kv} style={{ marginTop: 16 }}>
                <span className={styles.kvKey}>تاريخ التجديد</span>
                <span className={styles.kvValue}>1 أغسطس 2026</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>طريقة الدفع</span>
                <span className={styles.kvValue}>محفظة LoopWay</span>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <PrimaryCta size="sm">ترقية الباقة</PrimaryCta>
                <PrimaryCta size="sm" variant="secondary" href="/finance" linkAs={Link}>
                  سجل المدفوعات
                </PrimaryCta>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>التنبيهات</span>
              </div>
              <div className={styles.sectionBodyFlush}>
                {NOTIFICATION_PREFS.map((p) => (
                  <div key={p.label} className={styles.row}>
                    <span className={styles.glyph}>
                      <Icon name="bell" size={18} />
                    </span>
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{p.label}</div>
                      <div className={styles.rowMeta}>{p.body}</div>
                    </div>
                    <StatusBadge tone="success">مفعّلة</StatusBadge>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>المستخدمون</span>
              </div>
              <div className={styles.sectionBody}>
                <div className={styles.muted}>
                  يعمل حساب الشركة برقم جوال واحد للمفوّض في هذه النسخة. الصلاحيات المتعددة داخل الشركة خارج نطاق الإصدار
                  الحالي وستُضاف لاحقاً.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
