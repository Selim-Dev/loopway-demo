'use client';

import { PageHeader, type PageTab } from '@loopway/ui';
import { useQueueCounts } from '@/store/AdminStore';

/**
 * Binds the shared PageHeader to the admin identity so screens only pass their
 * own title. The bell count is the total decision backlog — the number an
 * operator actually cares about when they glance at the chrome.
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
      notificationCount={backlog}
      accountName="فريق التشغيل"
      accountId="LW-ADM-0001"
      accountInitial="ت"
    />
  );
}
