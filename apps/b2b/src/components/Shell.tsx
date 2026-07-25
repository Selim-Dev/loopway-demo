'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppShell, IconRail } from '@loopway/ui';
import { RAIL_ITEMS } from '@/config/nav';
import { COMPANY } from '@/mocks/company';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell
      rail={
        <IconRail
          items={RAIL_ITEMS}
          pathname={pathname}
          avatarInitial={COMPANY.initial}
          linkAs={Link}
        />
      }
    >
      {children}
    </AppShell>
  );
}
