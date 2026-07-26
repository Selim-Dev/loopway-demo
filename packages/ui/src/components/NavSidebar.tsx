'use client';

import * as React from 'react';
import styles from './NavSidebar.module.css';
import { Icon, type IconName } from '../icons/Icon';

export interface SidebarItem {
  label: string;
  icon: IconName;
  href: string;
  /** Optional queue count, e.g. pending driver approvals. */
  count?: number;
}

export interface SidebarGroup {
  /** Omit on the first group to run items straight under the brand. */
  label?: string;
  items: SidebarItem[];
}

export interface NavSidebarProps {
  groups: SidebarGroup[];
  pathname: string;
  /** Line under the LoopWay wordmark, e.g. "لوحة الإدارة". */
  subtitle: string;
  footer?: { title: string; body: string };
  /** Brand mark served from the app's `public/`. */
  logoSrc?: string;
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Labelled navy sidebar. Use it when a surface has too many destinations for
 * the 78px icon rail — see NavSidebar.module.css for provenance.
 */
export function NavSidebar({
  groups,
  pathname,
  subtitle,
  footer,
  logoSrc = '/loopway-logo.png',
  linkAs,
}: NavSidebarProps & { linkAs?: React.ElementType }) {
  const Link = (linkAs ?? 'a') as React.ElementType;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        {/* The mark carries its own navy and green, so it sits on the navy
            directly rather than inside the green tile the vector needed. */}
        <img src={logoSrc} alt="" className={styles.brandLogo} />
        <div>
          <div className={styles.brandName}>LoopWay</div>
          <div className={styles.brandSub}>{subtitle}</div>
        </div>
      </div>

      {/* Only the destination list scrolls — the brand stays pinned at the top
          and the footer note at the bottom, which matters once a portal has
          sixteen sections and the list outgrows the viewport. */}
      <div className={`${styles.scrollArea} lw-scroll`}>
        {groups.map((g, gi) => (
          <React.Fragment key={g.label ?? `g${gi}`}>
            {g.label ? <div className={styles.groupLabel}>{g.label}</div> : null}
            <nav className={styles.nav}>
              {g.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
                    aria-current={active ? 'page' : undefined}
                    title={item.label}
                  >
                    {active ? <span className={styles.marker} /> : null}
                    <Icon name={item.icon} size={19} />
                    <span className={styles.itemLabel}>{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 ? (
                      <span className={styles.count}>{item.count}</span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </React.Fragment>
        ))}
      </div>

      {footer ? (
        <div className={styles.footer}>
          <div className={styles.footerTitle}>{footer.title}</div>
          <div className={styles.footerBody}>{footer.body}</div>
        </div>
      ) : null}
    </aside>
  );
}

/** Page frame for sidebar-navigated surfaces (the Admin portal). */
export function SidebarShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.shell} dir="rtl">
      {sidebar}
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
