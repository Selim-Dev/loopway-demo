'use client';

import Link from 'next/link';
import { PageHeader, type PageTab } from '@loopway/ui';
import { COMPANY } from '@/mocks/company';
import { UNREAD_COUNT } from '@/mocks/notifications';

/**
 * Thin wrapper that binds the shared PageHeader to this portal's account
 * identity, unread count and router, so pages only pass their own title/tabs.
 */
export function Header({
  title,
  subtitle,
  tabs,
}: {
  title: string;
  subtitle?: string;
  tabs?: PageTab[];
}) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      tabs={tabs}
      notificationCount={UNREAD_COUNT}
      accountName={COMPANY.companyName}
      accountId={COMPANY.accountId}
      accountInitial={COMPANY.initial}
      linkAs={Link}
    />
  );
}
