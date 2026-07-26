'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ContentTabs } from '@loopway/ui';

/**
 * Sub-navigation for الملف الشخصي وإعدادات البروكر.
 *
 * The design's rail collapses four SRS sections (company profile & documents,
 * saved brokers, saved locations, document archive) behind this single item,
 * so they surface here rather than as new rail entries.
 */
const TABS = [
  { key: '/account', label: 'الملف الشخصي', href: '/account' },
  { key: '/account/company', label: 'بيانات ووثائق الشركة', href: '/account/company' },
  { key: '/account/brokers', label: 'البروكرز المحفوظين', href: '/account/brokers' },
  { key: '/account/locations', label: 'المواقع المحفوظة', href: '/account/locations' },
  { key: '/account/documents', label: 'أرشيف المستندات', href: '/account/documents' },
];

export function AccountTabs() {
  const pathname = usePathname();
  return <ContentTabs tabs={TABS} active={pathname} linkAs={Link} />;
}
