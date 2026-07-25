import type { Metadata } from 'next';
import { AlertBanner, Icon, PrimaryCta, StatusBadge } from '@loopway/ui';
import { Header } from '@/components/Header';
import { BROKERS } from '@/mocks/company';
import styles from '../../derived.module.css';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'البروكرز المحفوظين — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E09. */
export default function BrokersPage() {
  return (
    <>
      <Header title="البروكرز المحفوظين" subtitle="المخلّصون الجمركيون الذين تتعامل معهم في الشحن الدولي" />
      <div className={styles.body}>
        <AccountTabs />

        <AlertBanner tone="info" icon="document">
          البروكر ليس مستخدماً داخل المنصة. تُرسل له بيانات الرحلة عبر رابط واتساب يُفتح من جهازك أنت.
        </AlertBanner>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>القائمة</span>
            <PrimaryCta size="sm" icon="plus">
              إضافة بروكر
            </PrimaryCta>
          </div>
          <div className={styles.sectionBodyFlush}>
            {BROKERS.map((b) => (
              <div key={b.id} className={styles.row}>
                <span className={styles.glyph}>
                  <Icon name="user" size={18} />
                </span>
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{b.name}</div>
                  <div className={styles.rowMeta}>
                    {b.country} · {b.portOrBorder} · <span className="lw-ltr">{b.whatsappNumber}</span>
                  </div>
                  {b.notes ? <div className={styles.rowMeta}>{b.notes}</div> : null}
                </div>
                <div className={styles.rowSide}>
                  <span className={styles.tag}>
                    ترخيص <span className="lw-ltr">{b.authorizationNumber}</span>
                  </span>
                  <StatusBadge tone="success">سارٍ حتى {b.expiryDate}</StatusBadge>
                  <PrimaryCta size="sm" variant="secondary">
                    تعديل
                  </PrimaryCta>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
