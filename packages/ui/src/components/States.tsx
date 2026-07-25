'use client';

import * as React from 'react';
import styles from './States.module.css';
import { Icon, type IconName } from '../icons/Icon';

/* ==========================================================================
   Spinner
   ========================================================================== */

export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span
      className={className ? `${styles.spinner} ${className}` : styles.spinner}
      style={size !== 18 ? { width: size, height: size } : undefined}
      role="status"
      aria-label="جارٍ التحميل"
    />
  );
}

/* ==========================================================================
   EmptyState / NoResultsState / ErrorState
   ========================================================================== */

export interface StateCardProps {
  glyph: IconName;
  glyphTone: 'neutral' | 'warning' | 'danger';
  title: string;
  body: string;
  narrow?: boolean;
  action?: { label: string; icon?: IconName; onClick?: () => void; href?: string };
  quietAction?: { label: string; onClick: () => void };
  linkAs?: React.ElementType;
}

/** The shared 70px-padded white card behind every non-list view state. */
export function StateCard({
  glyph,
  glyphTone,
  title,
  body,
  narrow = false,
  action,
  quietAction,
  linkAs,
}: StateCardProps) {
  const Link = (linkAs ?? 'a') as React.ElementType;
  const glyphClass = [
    styles.glyph,
    glyphTone === 'danger' ? styles.glyphError : '',
    glyphTone === 'neutral' ? styles.glyphNeutral : '',
    glyphTone === 'warning' ? styles.glyphWarning : '',
    glyphTone === 'danger' ? styles.glyphDanger : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.card}>
      <div className={glyphClass}>
        <Icon name={glyph} size={glyphTone === 'danger' ? 30 : 32} strokeWidth={glyphTone === 'neutral' ? 1.8 : 1.9} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={narrow ? `${styles.body} ${styles.bodyNarrow}` : styles.body}>{body}</div>

      {action ? (
        action.href ? (
          <Link href={action.href} className={styles.primaryAction}>
            {action.icon ? <Icon name={action.icon} size={18} strokeWidth={2.2} /> : null}
            {action.label}
          </Link>
        ) : (
          <button type="button" className={styles.primaryAction} onClick={action.onClick}>
            {action.icon ? <Icon name={action.icon} size={18} strokeWidth={2.2} /> : null}
            {action.label}
          </button>
        )
      ) : null}

      {quietAction ? (
        <button type="button" className={styles.quietAction} onClick={quietAction.onClick}>
          {quietAction.label}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState(props: Omit<StateCardProps, 'glyph' | 'glyphTone'> & { glyph?: IconName }) {
  return <StateCard glyph={props.glyph ?? 'emptyTruck'} glyphTone="neutral" {...props} />;
}

export function NoResultsState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <StateCard
      glyph="search"
      glyphTone="warning"
      title="لا توجد نتائج مطابقة"
      body="لم نعثر على رحلات تطابق بحثك أو الفلاتر المحددة. جرّب تعديل الفلاتر."
      narrow
      quietAction={{ label: 'مسح جميع الفلاتر', onClick: onClearFilters }}
    />
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry: () => void;
}) {
  return (
    <StateCard
      glyph="warning"
      glyphTone="danger"
      title={title}
      body={body}
      narrow
      action={{ label: 'إعادة المحاولة', icon: 'retry', onClick: onRetry }}
    />
  );
}

/* ==========================================================================
   LoadingState — static grey blocks. The brand forbids shimmer animation.
   ========================================================================== */

export function LoadingState({ rows = 4, label }: { rows?: number; label: string }) {
  return (
    <div className={styles.loadingWrap}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.skeletonRow} aria-hidden="true">
          <div className={`${styles.sk} ${styles.sk1}`} />
          <div className={`${styles.sk} ${styles.sk2}`} />
          <div className={`${styles.sk} ${styles.sk3}`} />
          <div className={`${styles.sk} ${styles.sk4}`} />
          <div className={`${styles.sk} ${styles.sk5}`} />
        </div>
      ))}
      <div className={styles.loadingFoot}>
        <Spinner />
        <span className={styles.loadingLabel}>{label}</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   AlertBanner
   ========================================================================== */

export type AlertTone = 'warning' | 'danger' | 'info' | 'success';

const ALERT_CLASS: Record<AlertTone, string> = {
  warning: styles.alertWarning,
  danger: styles.alertDanger,
  info: styles.alertInfo,
  success: styles.alertSuccess,
};

const ALERT_ICON: Record<AlertTone, IconName> = {
  warning: 'warning',
  danger: 'warning',
  info: 'document',
  success: 'check',
};

export function AlertBanner({
  tone = 'warning',
  children,
  icon,
}: {
  tone?: AlertTone;
  children: React.ReactNode;
  icon?: IconName;
}) {
  return (
    <div className={`${styles.alert} ${ALERT_CLASS[tone]}`} role="status">
      <Icon name={icon ?? ALERT_ICON[tone]} size={20} />
      <span className={styles.alertText}>{children}</span>
    </div>
  );
}
