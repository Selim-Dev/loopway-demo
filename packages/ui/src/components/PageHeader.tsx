'use client';

import * as React from 'react';
import styles from './PageHeader.module.css';
import { Icon, type IconName } from '../icons/Icon';

export interface PageTab {
  label: string;
  icon?: IconName;
  href: string;
  active: boolean;
}

export interface PageHeaderProps {
  title: string;
  /** Optional line under the title (used on سجل العمليات المالية). */
  subtitle?: string;
  /** Segmented page tabs, e.g. القائمة / التقويم. */
  tabs?: PageTab[];
  notificationsHref?: string;
  notificationCount?: number;
  supportHref?: string;
  /** Hide the support glyph where the surface has no support section to reach. */
  showSupport?: boolean;
  accountName: string;
  accountId: string;
  accountInitial: string;
  accountHref?: string;
  linkAs?: React.ElementType;
}

/**
 * The 66px header bar: title block on the RTL right, controls on the left.
 * See docs/design-system/07-patterns.md → "Page header".
 */
export function PageHeader({
  title,
  subtitle,
  tabs,
  notificationsHref = '/notifications',
  notificationCount = 0,
  supportHref = '/support',
  showSupport = true,
  accountName,
  accountId,
  accountInitial,
  accountHref = '/account',
  linkAs,
}: PageHeaderProps) {
  const Link = (linkAs ?? 'a') as React.ElementType;

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>

      <div className={styles.actions}>
        {tabs && tabs.length > 0 ? (
          <div className={styles.tabs} role="tablist">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                role="tab"
                aria-selected={t.active}
                className={t.active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              >
                {t.icon ? <Icon name={t.icon} size={17} /> : null}
                {t.label}
              </Link>
            ))}
          </div>
        ) : null}

        <Link href={notificationsHref} className={styles.iconBtn} title="الإشعارات" aria-label="الإشعارات">
          <Icon name="bell" size={21} />
          {notificationCount > 0 ? (
            <span className={styles.count} aria-label={`${notificationCount} إشعارات غير مقروءة`}>
              {notificationCount}
            </span>
          ) : null}
        </Link>

        {showSupport ? (
          <Link href={supportHref} className={styles.iconBtn} title="الدعم" aria-label="الدعم">
            <Icon name="support" size={21} />
          </Link>
        ) : null}

        <div className={styles.divider} aria-hidden="true" />

        <Link href={accountHref} className={styles.account}>
          <span className={styles.accountAvatar} aria-hidden="true">
            {accountInitial}
          </span>
          <span className={styles.accountText}>
            <span className={styles.accountName}>{accountName}</span>
            <span className={styles.accountId}>{accountId}</span>
          </span>
          <Icon name="chevronDown" size={15} style={{ color: 'var(--lw-slate-400)' }} strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
}
