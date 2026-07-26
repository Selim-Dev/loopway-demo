'use client';

import * as React from 'react';
import styles from './Layout.module.css';
import { Icon, type IconName } from '../icons/Icon';

/* ==========================================================================
   PageBody / grids
   ========================================================================== */

/** The scrolling region under the PageHeader. */
export function PageBody({
  children,
  variant = 'stack',
  className,
}: {
  children: React.ReactNode;
  /** `row` for screens whose body is table + side panel. */
  variant?: 'stack' | 'row';
  className?: string;
}) {
  const base = variant === 'row' ? styles.bodyRow : `${styles.body} lw-scroll`;
  return <div className={className ? `${base} ${className}` : base}>{children}</div>;
}

export function Grid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  const cls = cols === 4 ? styles.grid4 : cols === 3 ? styles.grid3 : styles.grid2;
  return <div className={cls}>{children}</div>;
}

/** Asymmetric 1.4fr / 1fr split — the default two-column detail layout. */
export function Split({ children }: { children: React.ReactNode }) {
  return <div className={styles.split}>{children}</div>;
}

/* ==========================================================================
   Section card
   ========================================================================== */

export function Section({
  title,
  subtitle,
  action,
  flush = false,
  children,
}: {
  title?: string;
  subtitle?: string;
  /** Rendered on the RTL-left of the header — a link, a CTA, a count. */
  action?: React.ReactNode;
  /** `flush` removes body padding — use when the body is a list or table. */
  flush?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      {title || action ? (
        <div className={styles.sectionHead}>
          <div>
            {title ? <div className={styles.sectionTitle}>{title}</div> : null}
            {subtitle ? <div className={styles.sectionSub}>{subtitle}</div> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children != null ? (
        <div className={flush ? styles.sectionBodyFlush : styles.sectionBody}>{children}</div>
      ) : null}
    </section>
  );
}

export function InlineLink({
  children,
  href,
  onClick,
  linkAs,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  linkAs?: React.ElementType;
}) {
  if (href) {
    const Link = (linkAs ?? 'a') as React.ElementType;
    return (
      <Link href={href} className={styles.link}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={styles.link} onClick={onClick} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <div className={styles.muted}>{children}</div>;
}

/* ==========================================================================
   ListRow
   ========================================================================== */

export interface ListRowProps {
  /** Leading glyph inside a tinted 36px badge. */
  icon?: IconName;
  iconBackground?: string;
  iconColor?: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  /** Second meta line — used by broker/location rows. */
  metaSecondary?: React.ReactNode;
  /** Trailing controls: badges, buttons, timestamps. */
  side?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Applies the faint green "needs attention" tint. */
  unread?: boolean;
  linkAs?: React.ElementType;
}

export function ListRow({
  icon,
  iconBackground,
  iconColor,
  title,
  meta,
  metaSecondary,
  side,
  href,
  onClick,
  unread = false,
  linkAs,
}: ListRowProps) {
  const interactive = Boolean(href || onClick);
  const className = [styles.row, interactive ? styles.rowHover : '', unread ? styles.rowUnread : '']
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {icon ? (
        <span className={styles.glyph} style={{ background: iconBackground, color: iconColor }}>
          <Icon name={icon} size={18} />
        </span>
      ) : null}
      <span className={styles.rowMain}>
        <span className={styles.rowTitle}>{title}</span>
        {meta ? <span className={styles.rowMeta}>{meta}</span> : null}
        {metaSecondary ? <span className={styles.rowMeta}>{metaSecondary}</span> : null}
      </span>
      {side ? <span className={styles.rowSide}>{side}</span> : null}
    </>
  );

  if (href) {
    const Link = (linkAs ?? 'a') as React.ElementType;
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className={className} role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}>
        {body}
      </div>
    );
  }

  return <div className={className}>{body}</div>;
}

/* ==========================================================================
   ContentTabs — the navy pill set used inside a page body.
   Distinct from PageHeader's segmented tabs and FilterBar's TabGroup.
   ========================================================================== */

export interface ContentTab {
  key: string;
  label: string;
  count?: number;
  href?: string;
}

export function ContentTabs({
  tabs,
  active,
  onChange,
  linkAs,
}: {
  tabs: ContentTab[];
  active: string;
  onChange?: (key: string) => void;
  linkAs?: React.ElementType;
}) {
  const Link = (linkAs ?? 'a') as React.ElementType;

  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((t) => {
        const isActive = t.key === active;
        const className = isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab;
        const body = (
          <>
            {t.label}
            {typeof t.count === 'number' ? <span className={styles.tabCount}>{t.count}</span> : null}
          </>
        );

        if (t.href) {
          return (
            <Link key={t.key} href={t.href} role="tab" aria-selected={isActive} className={className}>
              {body}
            </Link>
          );
        }

        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={className}
            onClick={() => onChange?.(t.key)}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   ActionBar — sticky footer strip: explanatory note on the right,
   buttons on the RTL-left.
   ========================================================================== */

export function ActionBar({ note, children }: { note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.actionBar}>
      {note ? <span className={styles.actionBarNote}>{note}</span> : <span />}
      <div className={styles.actionBarGroup}>{children}</div>
    </div>
  );
}

/* ==========================================================================
   Tag / ChipList
   ========================================================================== */

export type TagTone = 'neutral' | 'success' | 'warning' | 'danger';

const TAG_TONE: Record<TagTone, string> = {
  neutral: '',
  success: styles.tagSuccess,
  warning: styles.tagWarning,
  danger: styles.tagDanger,
};

export function Tag({
  children,
  tone = 'neutral',
  icon,
}: {
  children: React.ReactNode;
  tone?: TagTone;
  icon?: IconName;
}) {
  return (
    <span className={[styles.tag, TAG_TONE[tone]].filter(Boolean).join(' ')}>
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </span>
  );
}

export function ChipList({ children }: { children: React.ReactNode }) {
  return <div className={styles.chipList}>{children}</div>;
}

/* ==========================================================================
   KpiTile
   ========================================================================== */

export interface KpiTileProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: IconName;
  /** Tinted badge behind the icon. */
  background?: string;
  color?: string;
  href?: string;
  linkAs?: React.ElementType;
}

export function KpiTile({
  label,
  value,
  suffix,
  icon,
  background = 'var(--lw-icon-tint-bg)',
  color = 'var(--lw-navy-800)',
  href,
  linkAs,
}: KpiTileProps) {
  const body = (
    <>
      <span className={styles.kpiIcon} style={{ background, color }}>
        <Icon name={icon} size={21} />
      </span>
      <span className={styles.kpiText}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiValue}>
          {value}
          {suffix ? <span className={styles.kpiSuffix}> {suffix}</span> : null}
        </span>
      </span>
    </>
  );

  if (href) {
    const Link = (linkAs ?? 'a') as React.ElementType;
    return (
      <Link href={href} className={styles.kpi}>
        {body}
      </Link>
    );
  }

  return <div className={styles.kpi}>{body}</div>;
}

/** Grid wrapper for KpiTiles. `cols` drives the CSS custom property. */
export function KpiGrid({ cols = 4, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div className={styles.kpiGrid} style={{ ['--kpi-cols' as string]: String(cols) }}>
      {children}
    </div>
  );
}
