'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../derived.module.css';

/**
 * Sub-navigation for الملف الشخصي وإعدادات البروكر.
 *
 * The design's rail collapses four SRS sections (company profile & documents,
 * saved brokers, saved locations, document archive) behind this single item,
 * so they surface here rather than as new rail entries.
 */
const TABS = [
  { href: '/account', label: 'الملف الشخصي' },
  { href: '/account/company', label: 'بيانات ووثائق الشركة' },
  { href: '/account/brokers', label: 'البروكرز المحفوظين' },
  { href: '/account/locations', label: 'المواقع المحفوظة' },
  { href: '/account/documents', label: 'أرشيف المستندات' },
];

export function AccountTabs() {
  const pathname = usePathname();
  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={active}
            className={active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
