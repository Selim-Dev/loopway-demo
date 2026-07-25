'use client';

import * as React from 'react';
import styles from './Surfaces.module.css';
import { Icon, type IconName } from '../icons/Icon';

/* ==========================================================================
   Card
   ========================================================================== */

export function Card({
  children,
  tight = false,
  className,
  style,
}: {
  children: React.ReactNode;
  /** `tight` = the 18px-radius/lighter-shadow variant used for table shells. */
  tight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={[styles.card, tight ? styles.cardTight : '', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}

/* ==========================================================================
   SidePanel — slides in from the RTL-left, 372px wide.
   ========================================================================== */

export function SidePanel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <aside className={styles.panel} aria-label={title}>
      <div className={styles.panelHead}>
        <span className={styles.panelTitle}>{title}</span>
        <button type="button" className={styles.panelClose} onClick={onClose} title="إغلاق" aria-label="إغلاق">
          <Icon name="close" size={16} strokeWidth={2} />
        </button>
      </div>
      <div className={`${styles.panelBody} lw-scroll`}>{children}</div>
      {footer ? <div className={styles.panelFoot}>{footer}</div> : null}
    </aside>
  );
}

export function PanelCta({
  children,
  onClick,
  href,
  variant = 'primary',
  icon,
  linkAs,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  icon?: IconName;
  linkAs?: React.ElementType;
}) {
  const className = [
    styles.panelCta,
    variant === 'ghost' ? styles.panelCtaGhost : '',
    variant === 'danger' ? styles.panelCtaDanger : '',
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
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

  return (
    <button type="button" className={className} onClick={onClick}>
      {body}
    </button>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionLabel}>{children}</div>;
}

export function PanelHint({ children }: { children: React.ReactNode }) {
  return <div className={styles.hint}>{children}</div>;
}

/* ==========================================================================
   DetailList — key/value rows with hairline dividers.
   ========================================================================== */

export function DetailList({ children }: { children: React.ReactNode }) {
  return <div className={styles.detailList}>{children}</div>;
}

export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailKey}>{label}</span>
      <span className={styles.detailValue}>{children}</span>
    </div>
  );
}

/* ==========================================================================
   PaginationBar — also hosts the "حالة العرض" view-state control.
   ========================================================================== */

export function PaginationBar({
  left,
  count,
  total,
  attached = false,
  onPrev,
  onNext,
  showArrows = true,
}: {
  left?: React.ReactNode;
  count: number;
  total: number;
  /** `attached` welds the bar to the bottom of a table card. */
  attached?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  showArrows?: boolean;
}) {
  return (
    <div className={attached ? `${styles.pager} ${styles.pagerAttached}` : styles.pager}>
      <div className={styles.pagerGroup}>{left}</div>
      <div className={styles.pagerRight}>
        <span className={styles.pagerCount}>
          1 - {count} من {total}
        </span>
        {showArrows ? (
          <div className={styles.pagerBtns}>
            <button type="button" className={styles.pagerBtn} onClick={onNext} aria-label="الصفحة التالية">
              <Icon name="chevronRight" size={15} strokeWidth={2} />
            </button>
            <button type="button" className={styles.pagerBtn} onClick={onPrev} aria-label="الصفحة السابقة">
              <Icon name="chevronLeft" size={15} strokeWidth={2} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ViewStateLabel({ children }: { children: React.ReactNode }) {
  return <span className={styles.pagerLabel}>{children}</span>;
}

/* ==========================================================================
   DataTable
   ========================================================================== */

export function TableCard({ children }: { children: React.ReactNode }) {
  return <div className={styles.tableCard}>{children}</div>;
}

export function DataTable({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={`${styles.tableScroll} lw-scroll`}>
      <table className={styles.table}>
        <thead>
          <tr>{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function CellStack({ children }: { children: React.ReactNode }) {
  return <div className={styles.cellStack}>{children}</div>;
}

export function CellPrimary({ children, ltr = false }: { children: React.ReactNode; ltr?: boolean }) {
  return (
    <div className={styles.cellPrimary} style={ltr ? { fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' } : undefined}>
      {children}
    </div>
  );
}

export function CellSecondary({ children, ltr = false }: { children: React.ReactNode; ltr?: boolean }) {
  return (
    <div className={styles.cellSecondary} style={ltr ? { fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' } : undefined}>
      {children}
    </div>
  );
}

export function CellEmpty() {
  return <span className={styles.cellEmpty}>—</span>;
}

export function RowIcon({ icon, background, color }: { icon: IconName; background: string; color: string }) {
  return (
    <span className={styles.rowIcon} style={{ background, color }}>
      <Icon name={icon} size={18} />
    </span>
  );
}

export function IconButtonSm({
  icon,
  title,
  onClick,
}: {
  icon: IconName;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button type="button" className={styles.iconBtnSm} title={title} aria-label={title} onClick={onClick}>
      <Icon name={icon} size={16} />
    </button>
  );
}

/* ==========================================================================
   WalletCard — the only surface in the product with a gradient.
   ========================================================================== */

export interface WalletStat {
  label: string;
  value: string;
}

export function WalletCard({
  label,
  amount,
  currency = 'SAR',
  protectedLabel = 'محمي',
  stats,
  actions,
}: {
  label: string;
  amount: string;
  currency?: string;
  protectedLabel?: string;
  stats?: WalletStat[];
  actions: React.ReactNode;
}) {
  return (
    <div className={styles.wallet}>
      <div className={styles.walletOrb} aria-hidden="true" />

      <div className={styles.walletMain}>
        <div className={styles.walletHead}>
          <span className={styles.walletLabel}>{label}</span>
          <span className={styles.walletChip}>
            <Icon name="shield" size={13} />
            {protectedLabel}
          </span>
        </div>
        <div className={styles.walletFigure}>
          <span className={styles.walletCurrency}>{currency}</span>
          <span className={styles.walletAmount}>{amount}</span>
        </div>
      </div>

      {stats?.map((s) => (
        <div key={s.label} className={styles.walletStat}>
          <span className={styles.walletStatLabel}>{s.label}</span>
          <span className={styles.walletStatValue}>{s.value}</span>
        </div>
      ))}

      <div className={styles.walletSpring} />
      <div className={styles.walletActions}>{actions}</div>
    </div>
  );
}

export function WalletCta({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: IconName }) {
  return (
    <button type="button" className={styles.walletCta} onClick={onClick}>
      {icon ? <Icon name={icon} size={17} /> : null}
      {children}
    </button>
  );
}

/* ==========================================================================
   StatusTimeline
   ========================================================================== */

export interface TimelineStep {
  label: string;
  meta?: string;
  note?: string;
  dotColor: string;
}

export function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className={styles.timeline}>
      {steps.map((s, i) => (
        <div key={i} className={styles.timelineStep}>
          <div className={styles.timelineRail}>
            <span className={styles.timelineDot} style={{ background: s.dotColor }} />
            {i < steps.length - 1 ? <span className={styles.timelineLine} /> : null}
          </div>
          <div>
            <div className={styles.timelineLabel}>{s.label}</div>
            {s.meta ? <div className={styles.timelineMeta}>{s.meta}</div> : null}
            {s.note ? <div className={styles.timelineNote}>{s.note}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
