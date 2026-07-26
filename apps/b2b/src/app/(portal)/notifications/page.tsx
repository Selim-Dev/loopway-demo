import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ListRow,
  PageBody,
  PrimaryCta,
  Section,
  StatusBadge,
  Tag,
  type IconName,
  type NotificationKind,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { NOTIFICATIONS } from '@/mocks/notifications';

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
      <PageBody>
        <Section
          title="التنبيهات"
          flush
          action={
            <PrimaryCta size="sm" variant="secondary">
              تعليم الكل كمقروء
            </PrimaryCta>
          }
        >
          {NOTIFICATIONS.map((n) => {
            const k = KIND[n.kind];
            return (
              <ListRow
                key={n.id}
                href={n.tripId ? `/trips/${n.tripId}` : '/support'}
                linkAs={Link}
                unread={!n.read}
                icon={k.icon}
                iconBackground={k.bg}
                iconColor={k.color}
                title={n.title}
                meta={n.body}
                side={
                  <>
                    <Tag>{k.label}</Tag>
                    {n.read ? null : <StatusBadge tone="success">جديد</StatusBadge>}
                    <span
                      style={{
                        fontSize: 'var(--web-text-micro)',
                        fontWeight: 600,
                        color: 'var(--lw-slate-500)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {n.time}
                    </span>
                  </>
                }
              />
            );
          })}
        </Section>
      </PageBody>
    </>
  );
}
