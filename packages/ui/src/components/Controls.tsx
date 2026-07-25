'use client';

import * as React from 'react';
import styles from './Controls.module.css';
import { Icon, type IconName } from '../icons/Icon';

/* ==========================================================================
   FilterBar — the 44px row that sits between the header and the content.
   ========================================================================== */

export function FilterBar({ children }: { children: React.ReactNode }) {
  return <div className={styles.bar}>{children}</div>;
}

/** Pushes its children to the far (RTL-left) edge of the FilterBar. */
export function FilterBarSpacer({ children }: { children: React.ReactNode }) {
  return <div className={styles.spacer}>{children}</div>;
}

/* ==========================================================================
   TabGroup
   ========================================================================== */

export interface TabItem {
  key: string;
  label: string;
  /** Omit for tabs that carry no count (e.g. سجل الرحلات). */
  count?: number;
}

export interface TabGroupProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export function TabGroup({ tabs, active, onChange }: TabGroupProps) {
  return (
    <div className={styles.tabTrack} role="tablist">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
          >
            {t.label}
            {typeof t.count === 'number' ? <span className={styles.tabCount}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   SearchField
   ========================================================================== */

/** `md` = the رحلاتي row (44px / r13). `sm` = the finance row (42px / r12). */
export type ControlSize = 'md' | 'sm';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  size?: ControlSize;
  'aria-label'?: string;
}

export function SearchField({ value, onChange, placeholder, size = 'md', ...rest }: SearchFieldProps) {
  return (
    <div className={size === 'sm' ? `${styles.searchWrap} ${styles.searchWrapSm}` : styles.searchWrap}>
      <span className={styles.searchIcon}>
        <Icon name="search" size={17} />
      </span>
      <input
        type="search"
        className={size === 'sm' ? `${styles.searchInput} ${styles.searchInputSm}` : styles.searchInput}
        value={value}
        placeholder={placeholder}
        aria-label={rest['aria-label'] ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ==========================================================================
   SelectField
   ========================================================================== */

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** `quiet` is the dashed, inset variant used by the view-state control. */
  variant?: 'default' | 'quiet';
  size?: ControlSize;
  'aria-label': string;
}

export function SelectField({ value, onChange, options, variant = 'default', size = 'md', ...rest }: SelectFieldProps) {
  const className = [styles.select, variant === 'quiet' ? styles.selectQuiet : '', size === 'sm' && variant === 'default' ? styles.selectSm : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={styles.selectWrap}>
      <select
        className={className}
        value={value}
        aria-label={rest['aria-label']}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className={styles.selectChevron}>
        <Icon name="chevronDown" size={variant === 'quiet' ? 12 : 14} strokeWidth={2} />
      </span>
    </div>
  );
}

/* ==========================================================================
   PrimaryCta
   ========================================================================== */

export interface PrimaryCtaProps {
  children: React.ReactNode;
  icon?: IconName;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  /** Native tooltip — the design uses it to explain the disabled state. */
  title?: string;
  variant?: 'primary' | 'secondary';
  size?: ControlSize;
  linkAs?: React.ElementType;
}

export function PrimaryCta({
  children,
  icon,
  onClick,
  href,
  disabled = false,
  title,
  variant = 'primary',
  size = 'md',
  linkAs,
}: PrimaryCtaProps) {
  const className = [
    styles.cta,
    variant === 'secondary' ? styles.ctaSecondary : '',
    size === 'sm' ? styles.ctaSm : '',
    disabled ? styles.ctaDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {icon ? <Icon name={icon} size={18} strokeWidth={2.2} /> : null}
      {children}
    </>
  );

  if (href && !disabled) {
    const Link = (linkAs ?? 'a') as React.ElementType;
    return (
      <Link href={href} className={className} title={title}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={disabled ? undefined : onClick} disabled={disabled} title={title}>
      {body}
    </button>
  );
}
