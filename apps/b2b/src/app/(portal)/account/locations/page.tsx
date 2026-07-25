import type { Metadata } from 'next';
import { Icon, PrimaryCta, StatusBadge } from '@loopway/ui';
import { Header } from '@/components/Header';
import { SAVED_LOCATIONS } from '@/mocks/company';
import styles from '../../derived.module.css';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'المواقع المحفوظة — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E08. */
export default function LocationsPage() {
  return (
    <>
      <Header title="المواقع المحفوظة" subtitle="مستودعات وموانئ تُستخدم مباشرة عند إنشاء رحلة جديدة" />
      <div className={styles.body}>
        <AccountTabs />

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>القائمة</span>
            <PrimaryCta size="sm" icon="plus">
              إضافة موقع
            </PrimaryCta>
          </div>
          <div className={styles.sectionBodyFlush}>
            {SAVED_LOCATIONS.map((l) => (
              <div key={l.id} className={styles.row}>
                <span className={styles.glyph}>
                  <Icon name={l.isPort ? 'truck' : 'home'} size={18} />
                </span>
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{l.label}</div>
                  <div className={styles.rowMeta}>
                    {l.country} · {l.city} · {l.address}
                  </div>
                  {l.supervisorName ? (
                    <div className={styles.rowMeta}>
                      مشرف: {l.supervisorName} · <span className="lw-ltr">{l.supervisorPhone}</span>
                    </div>
                  ) : null}
                </div>
                <div className={styles.rowSide}>
                  {l.isPort ? <span className={styles.tag}>{l.portName}</span> : null}
                  {l.permitRequired ? (
                    <StatusBadge tone="warning">يتطلب تصريح</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">لا يتطلب تصريح</StatusBadge>
                  )}
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
