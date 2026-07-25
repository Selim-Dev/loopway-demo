'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSidebar, SidebarShell } from '@loopway/ui';
import { ADMIN_GROUPS } from '@/config/sections';

/**
 * The Admin portal runs the labelled navy sidebar rather than the B2B icon
 * rail: sixteen destinations cannot be carried by unlabelled 44px buttons.
 * Both shells come from the same design source — see
 * packages/ui/src/components/NavSidebar.module.css.
 */
export function Shell({ children }: { children: React.ReactNode }) {
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
