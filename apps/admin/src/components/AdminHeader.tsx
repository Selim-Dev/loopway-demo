'use client';

import Link from 'next/link';
import { PageHeader, type PageTab } from '@loopway/ui';
import { ACTOR, useQueueCounts } from '@/store/AdminStore';

/**
 * Binds the shared PageHeader to the admin identity so screens only pass their
 * own title. The bell count is the total decision backlog — the number an
 * operator actually cares about when they glance at the chrome.
 *
 * `PageHeader` defaults its three chrome links to B2B routes
 * (`/notifications`, `/support`, `/account`). Admin has to name its own or the
 * chip and the bell 404 — which is exactly what they did on the deployment.
 * The bell points at `/`, since the backlog it counts is the decision queue
 * that screen lists.
 */
export function AdminHeader({
  title,
  subtitle,
  tabs,
}: {
  title: string;
  subtitle?: string;
  tabs?: PageTab[];
}) {
  const c = useQueueCounts();
  const backlog = c.drivers + c.trucks + c.documents + c.penalties + c.support;

  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      tabs={tabs}
      notificationsHref="/"
      notificationCount={backlog}
      supportHref="/support"
      accountHref="/account"
      accountName={ACTOR.name}
      accountId={ACTOR.id}
      accountInitial={ACTOR.initial}
      linkAs={Link}
    />
  );
}
