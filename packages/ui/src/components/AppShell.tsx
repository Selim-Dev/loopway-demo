import * as React from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps {
  /** The icon rail. Rendered as the first flex child, RTL-right. */
  rail: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The desktop portal frame: page canvas → rounded white card → rail + content
 * column. Shared by the B2B and Admin portals so both inherit the same
 * geometry. See docs/design-system/07-patterns.md → "Page shell".
 */
export function AppShell({ rail, children }: AppShellProps) {
  return (
    <div className={styles.page} dir="rtl">
      <div className={styles.frame}>
        {rail}
        <div className={styles.column}>{children}</div>
      </div>
    </div>
  );
}
