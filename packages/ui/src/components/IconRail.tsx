'use client';

import * as React from 'react';
import styles from './IconRail.module.css';
import { Icon, LoopwayMark, type IconName } from '../icons/Icon';

export interface RailItem {
  /** Tooltip + accessible name. Arabic, as designed. */
  title: string;
  icon: IconName;
  href: string;
  /** Match the current path against this instead of an exact `href` match. */
  matchPrefix?: string;
}

export interface IconRailProps {
  items: RailItem[];
  /** Current pathname; the rail resolves the active item itself. */
  pathname: string;
  /** Single Arabic letter for the account tile. */
  avatarInitial: string;
  settingsHref?: string;
  /** Injected so the package stays router-agnostic (Next `Link`, `<a>`, …). */
  linkAs?: React.ElementType;
}

function isActive(pathname: string, item: RailItem) {
  const prefix = item.matchPrefix ?? item.href;
  if (prefix === '/') return pathname === '/';
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * The 78px icon rail. Four destinations plus a settings gear, exactly the
 * information architecture the design ships — see
 * docs/design-system/09-ia-and-routes.md for why this beat the SRS's 11-section
 * list.
 */
export function IconRail({
  items,
  pathname,
  avatarInitial,
  settingsHref = '/settings',
  linkAs,
}: IconRailProps) {
  const Link = (linkAs ?? 'a') as React.ElementType;
  const settingsActive = pathname === settingsHref || pathname.startsWith(`${settingsHref}/`);

  return (
    <aside className={styles.rail}>
      <div className={styles.brand}>
        <LoopwayMark width={52} />
      </div>

      <nav className={styles.nav}>
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              aria-label={item.title}
              aria-current={active ? 'page' : undefined}
              className={active ? `${styles.item} ${styles.active}` : styles.item}
            >
              <Icon name={item.icon} size={22} />
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.avatar} aria-hidden="true">
          {avatarInitial}
        </div>
        <Link
          href={settingsHref}
          title="الإعدادات"
          aria-label="الإعدادات"
          className={settingsActive ? `${styles.gear} ${styles.active}` : styles.gear}
        >
          <Icon name="gear" size={21} />
        </Link>
      </div>
    </aside>
  );
}
