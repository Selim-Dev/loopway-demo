import * as React from 'react';
import styles from './Display.module.css';
import { Icon, RouteArrow } from '../icons/Icon';
import { BADGE_TONE, TONE, type Tone } from '../tokens';
import type { TripScope } from '../types';

/* ==========================================================================
   RefCode — trip IDs, transaction IDs, account IDs.
   Binding rule: reference codes stay LTR inside RTL copy. See
   docs/design-system/03-typography-rtl.md.
   ========================================================================== */

export function RefCode({
  children,
  size = 'var(--web-text-value)',
  weight = 800,
  color,
}: {
  children: React.ReactNode;
  size?: string | number;
  weight?: number;
  color?: string;
}) {
  return (
    <span className={styles.ref} style={{ fontSize: size, fontWeight: weight, color }}>
      {children}
    </span>
  );
}

/* ==========================================================================
   StatusBadge — dot + label on a tinted pill. Used in tables and panels.
   ========================================================================== */

export type BadgeTone = keyof typeof BADGE_TONE;

export function StatusBadge({
  tone,
  children,
  pill = false,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
  pill?: boolean;
}) {
  const t = BADGE_TONE[tone];
  return (
    <span
      className={pill ? `${styles.badge} ${styles.badgePill}` : styles.badge}
      style={{ background: t.bg, color: t.color }}
    >
      <span className={pill ? `${styles.dot} ${styles.dotLg}` : styles.dot} style={{ background: t.dot }} />
      {children}
    </span>
  );
}

/* ==========================================================================
   ScopeTag — محلية / دولية
   ========================================================================== */

export function ScopeTag({ scope }: { scope: TripScope }) {
  const intl = scope === 'دولية';
  return <span className={`${styles.scope} ${intl ? styles.scopeIntl : styles.scopeLocal}`}>{scope}</span>;
}

/* ==========================================================================
   StageChip — the long-form stage sentence, with a live spinner (moving),
   a check (delivered), and an optional running HH:MM:SS elapsed counter.
   ========================================================================== */

export interface StageChipProps {
  tone: Tone;
  label: string;
  showSpinner?: boolean;
  showCheck?: boolean;
  /** Pre-formatted "HH:MM:SS". Omit when the trip is not live. */
  elapsed?: string;
}

export function StageChip({ tone, label, showSpinner, showCheck, elapsed }: StageChipProps) {
  const c = TONE[tone];
  return (
    <span className={styles.stage} style={{ background: c.stageBg, border: `1px solid ${c.border}`, color: c.text }}>
      {showSpinner ? <span className={styles.stageSpinner} style={{ borderColor: c.border, borderTopColor: c.text }} /> : null}
      {showCheck ? <Icon name="check" size={15} strokeWidth={2.6} /> : null}
      <span className={styles.stageLabel}>{label}</span>
      {elapsed ? (
        <span className={styles.elapsed} style={{ border: `1px solid ${c.border}`, color: c.text }}>
          <Icon name="clock" size={12} />
          {elapsed}
        </span>
      ) : null}
    </span>
  );
}

/* ==========================================================================
   ProgressBar
   ========================================================================== */

export function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/* ==========================================================================
   AvatarInitial — driver initial, or "؟" when the row shows an offer count.
   ========================================================================== */

export function AvatarInitial({
  initial,
  variant = 'driver',
  shape = 'circle',
  size = 34,
  fontSize = 13,
}: {
  initial: string;
  variant?: 'driver' | 'offers';
  shape?: 'circle' | 'square';
  size?: number;
  fontSize?: number;
}) {
  return (
    <span
      className={[
        styles.avatar,
        shape === 'circle' ? styles.avatarCircle : styles.avatarSquare,
        variant === 'driver' ? styles.avatarDriver : styles.avatarOffers,
      ].join(' ')}
      style={{ width: size, height: size, fontSize }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

/* ==========================================================================
   AmountText — always LTR, always prefixed, tone-coloured.
   ========================================================================== */

export function AmountText({
  amount,
  direction,
  muted = false,
  hero = false,
  currency = 'ر.س',
}: {
  amount: string;
  direction: 'credit' | 'debit';
  muted?: boolean;
  hero?: boolean;
  currency?: string;
}) {
  const toneClass = muted ? styles.amountMuted : direction === 'credit' ? styles.amountCredit : styles.amountDebit;
  const prefix = direction === 'credit' ? '+ ' : '− ';
  return (
    <span className={`${hero ? styles.amountHero : styles.amount} ${toneClass}`}>
      {prefix}
      {amount} {currency}
    </span>
  );
}

/* ==========================================================================
   RouteChips — origin (round green dot) → destination (square navy dot).
   The dot shapes are meaningful: round = pickup, square = drop-off.
   ========================================================================== */

export function RouteChips({ from, to, variant = 'onTint' }: { from: string; to: string; variant?: 'onTint' | 'plain' }) {
  return (
    <div className={variant === 'plain' ? `${styles.route} ${styles.routePlain}` : styles.route}>
      <span className={styles.routeChip}>
        <span className={styles.originDot} />
        {from}
      </span>
      <span className={styles.routeArrowWrap}>
        <RouteArrow width={variant === 'plain' ? 18 : 13} height={variant === 'plain' ? 12 : 10} />
      </span>
      <span className={styles.routeChip}>
        {to}
        <span className={styles.destDot} />
      </span>
    </div>
  );
}
