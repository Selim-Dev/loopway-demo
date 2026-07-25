import * as React from 'react';
import styles from './LiveWaybillButton.module.css';
import { Icon } from '../icons/Icon';

export interface LiveWaybillButtonProps {
  onClick?: () => void;
  href?: string;
  label?: string;
  linkAs?: React.ElementType;
}

/**
 * "البوليصة الحية" — opens the auto-regenerating waybill for a trip.
 * See LiveWaybillButton.module.css for why this one CTA is animated.
 */
export function LiveWaybillButton({
  onClick,
  href,
  label = 'البوليصة الحية',
  linkAs,
}: LiveWaybillButtonProps) {
  const body = (
    <>
      <span className={styles.haloA} aria-hidden="true" />
      <span className={styles.haloB} aria-hidden="true" />
      <span className={styles.glyph}>
        <Icon name="waybill" size={15} />
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  if (href) {
    const Link = (linkAs ?? 'a') as React.ElementType;
    return (
      <Link href={href} className={styles.button}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {body}
    </button>
  );
}
