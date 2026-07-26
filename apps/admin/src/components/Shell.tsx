'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSidebar, SidebarShell, type SidebarGroup } from '@loopway/ui';
import { ADMIN_GROUPS } from '@/config/sections';
import { AdminStoreProvider, useQueueCounts } from '@/store/AdminStore';

/**
 * The Admin portal runs the labelled navy sidebar rather than the B2B icon
 * rail: sixteen destinations cannot be carried by unlabelled 44px buttons.
 * Both shells come from the same design source — see
 * packages/ui/src/components/NavSidebar.module.css.
 */
function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const counts = useQueueCounts();

  // Badges are derived from the store, never hard-coded, so a queue that
  // empties during a session visibly drops to zero.
  const groups: SidebarGroup[] = React.useMemo(
    () =>
      ADMIN_GROUPS.map((g) => ({
        ...g,
        items: g.items.map((item) => {
          const key = QUEUE_BY_HREF[item.href];
          return key ? { ...item, count: counts[key] } : item;
        }),
      })),
    [counts],
  );

  return (
    <SidebarShell
      sidebar={
        <NavSidebar
          groups={groups}
          pathname={pathname}
          subtitle="لوحة الإدارة"
          footer={{
            title: 'وضع القراءة والاعتماد',
            body: 'كل إجراء حساس يُسجَّل في Audit Log مع المستخدم والوقت والقيمة قبل وبعد.',
          }}
          linkAs={Link}
        />
      }
    >
      {children}
    </SidebarShell>
  );
}

const QUEUE_BY_HREF: Record<string, keyof ReturnType<typeof useQueueCounts>> = {
  '/drivers': 'drivers',
  '/trucks': 'trucks',
  '/documents': 'documents',
  '/penalties': 'penalties',
  '/payouts': 'payouts',
  '/support': 'support',
};

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AdminStoreProvider>
      <Chrome>{children}</Chrome>
    </AdminStoreProvider>
  );
}
