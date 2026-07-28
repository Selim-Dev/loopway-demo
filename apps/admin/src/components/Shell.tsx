'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSidebar, SidebarShell } from '@loopway/ui';
import { ADMIN_GROUPS } from '@/config/sections';
import { AdminStoreProvider } from '@/store/AdminStore';

/**
 * The Admin portal runs the labelled navy sidebar rather than the B2B icon
 * rail: sixteen destinations cannot be carried by unlabelled 44px buttons.
 * Both shells come from the same design source — see
 * packages/ui/src/components/NavSidebar.module.css.
 *
 * The sidebar carries no queue badges. Counts live where the decision is taken
 * — the home dashboard's KPI tiles and each queue's filter-bar tabs — and both
 * of those still derive from the store, so they drop as a queue empties.
 */
function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarShell
      sidebar={
        <NavSidebar
          groups={ADMIN_GROUPS}
          pathname={pathname}
          subtitle="لوحة الإدارة"
          footer={{
            title: 'وضع القراءة والاعتماد',
            body: 'كل إجراء حساس يُسجَّل في سجل القرارات مع المستخدم والوقت والقيمة قبل وبعد.',
          }}
          linkAs={Link}
        />
      }
    >
      {children}
    </SidebarShell>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AdminStoreProvider>
      <Chrome>{children}</Chrome>
    </AdminStoreProvider>
  );
}
