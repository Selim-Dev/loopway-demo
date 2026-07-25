import type { Metadata } from 'next';
import { Icon, PrimaryCta, StatusBadge, type BadgeTone } from '@loopway/ui';
import { Header } from '@/components/Header';
import { SUPPORT_CASES } from '@/mocks/notifications';
import styles from '../derived.module.css';

export const metadata: Metadata = { title: 'الدعم — LoopWay' };

const CASE_TONE: Record<string, BadgeTone> = {
  'مفتوحة': 'warning',
  'قيد المعالجة': 'warning',
  'مغلقة': 'neutral',
};

const PRIORITY_TONE: Record<string, BadgeTone> = {
  'عالية': 'danger',
  'متوسطة': 'warning',
  'منخفضة': 'neutral',
};

/** DERIVED, NOT DESIGNED — SRS M03-E10-F02. */
export default function SupportPage() {
  return (
    <>
      <Header title="الدعم والبلاغات" subtitle="افتح بلاغاً أو تابع حالة بلاغاتك السابقة" />
      <div className={styles.body}>
        <div className={styles.split}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>بلاغاتي</span>
              <span className={styles.sectionSub}>{SUPPORT_CASES.length} بلاغات</span>
            </div>
            <div className={styles.sectionBodyFlush}>
              {SUPPORT_CASES.map((c) => (
                <div key={c.id} className={styles.row}>
                  <span className={styles.glyph}>
                    <Icon name="support" size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>
                      {c.type} · <span className="lw-ltr">{c.id}</span>
                    </div>
                    <div className={styles.rowMeta}>
                      {c.tripId ? (
                        <>
                          <span className="lw-ltr">{c.tripId}</span> ·{' '}
                        </>
                      ) : null}
                      فُتح في {c.openedAt}
                    </div>
                    <div className={styles.rowMeta}>{c.description}</div>
                  </div>
                  <div className={styles.rowSide}>
                    <StatusBadge tone={PRIORITY_TONE[c.priority] ?? 'neutral'}>{c.priority}</StatusBadge>
                    <StatusBadge tone={CASE_TONE[c.status] ?? 'neutral'}>{c.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>فتح بلاغ جديد</span>
            </div>
            <div className={styles.sectionBody}>
              <div className={`${styles.formGrid} ${styles.formGridWide}`}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>
                    نوع البلاغ <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.control} defaultValue="delay">
                    <option value="delay">تأخير في التحميل أو التسليم</option>
                    <option value="damage">تلف أو نقص في الحمولة</option>
                    <option value="penalty">اعتراض على غرامة</option>
                    <option value="payment">مشكلة في الدفع أو الفاتورة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>الرحلة المرتبطة</label>
                  <select className={styles.control} defaultValue="">
                    <option value="">لا ترتبط برحلة معيّنة</option>
                    <option value="LW-2026-002960">LW-2026-002960</option>
                    <option value="LW-2026-002951">LW-2026-002951</option>
                    <option value="LW-2026-002955">LW-2026-002955</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>
                    وصف المشكلة <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={`${styles.control} ${styles.textarea}`}
                    placeholder="اشرح ما حدث بالتفصيل، مع الأوقات والمواقع إن أمكن."
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>مرفقات</label>
                  <PrimaryCta size="sm" variant="secondary" icon="upload">
                    إرفاق صور أو مستندات
                  </PrimaryCta>
                  <span className={styles.help}>الصيغ المدعومة: صور وPDF حتى 10 م.ب لكل ملف.</span>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <PrimaryCta size="sm">إرسال البلاغ</PrimaryCta>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
