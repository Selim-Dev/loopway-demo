import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, PrimaryCta, StatusBadge, type IconName } from '@loopway/ui';
import { Header } from '@/components/Header';
import { NOTIFICATIONS } from '@/mocks/notifications';
import type { NotificationKind } from '@loopway/ui';
import styles from '../derived.module.css';

export const metadata: Metadata = { title: 'التنبيهات — LoopWay' };

const KIND: Record<NotificationKind, { icon: IconName; bg: string; color: string; label: string }> = {
  offer: { icon: 'clock', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', label: 'عروض' },
  payment: { icon: 'card', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', label: 'مدفوعات' },
  status: { icon: 'truck', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)', label: 'حالة الرحلة' },
  document: { icon: 'document', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', label: 'مستندات' },
  support: { icon: 'support', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', label: 'دعم' },
};

/** DERIVED, NOT DESIGNED — SRS M03-E10-F01. */
export default function NotificationsPage() {
  return (
    <>
      <Header title="مركز التنبيهات" subtitle="كل ما يحتاج انتباهك في مكان واحد" />
      <div className={styles.body}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>التنبيهات</span>
            <PrimaryCta size="sm" variant="secondary">
              تعليم الكل كمقروء
            </PrimaryCta>
          </div>
          <div className={styles.sectionBodyFlush}>
            {NOTIFICATIONS.map((n) => {
              const k = KIND[n.kind];
              return (
                <Link
                  key={n.id}
                  href={n.tripId ? `/trips/${n.tripId}` : '/support'}
                  className={[styles.row, styles.rowHover, n.read ? '' : styles.rowUnread].filter(Boolean).join(' ')}
                >
                  <span className={styles.glyph} style={{ background: k.bg, color: k.color }}>
                    <Icon name={k.icon} size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>{n.title}</div>
                    <div className={styles.rowMeta}>{n.body}</div>
                  </div>
                  <div className={styles.rowSide}>
                    <span className={styles.tag}>{k.label}</span>
                    {n.read ? null : <StatusBadge tone="success">جديد</StatusBadge>}
                    <span className={styles.rowMeta} style={{ marginTop: 0, whiteSpace: 'nowrap' }}>
                      {n.time}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
