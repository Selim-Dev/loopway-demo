'use client';

import * as React from 'react';
import styles from './ProductFrame.module.css';

/**
 * Renders a real @loopway/ui surface inside a responsive page.
 *
 * THE PROBLEM. The portals enforce `min-width: 1440px` and deliberately do not
 * reflow — docs/design-system/05-web-scale.md calls that a fidelity decision,
 * and it is the right one for a desktop back-office. It is exactly wrong for a
 * marketing page whose first viewer is on a phone.
 *
 * THE FIX. Lay the component out at its true width, then scale the whole box
 * down to whatever space it has. `transform: scale()` is not a compromise
 * here: every proportion, border and shadow stays pixel-exact, the way a
 * screenshot would — except this is live DOM, so the timers still run.
 *
 * The alternative — re-authoring narrow variants of TripRow and WalletCard —
 * would mean the marketing site shows components the product does not have.
 * The whole claim of this page is that these ARE the product.
 */
export function ProductFrame({
  width,
  children,
  align = 'start',
  className,
  /** Decorative instances are hidden from assistive tech; the copy beside them carries the meaning. */
  decorative = true,
  /** Never scale above 1 — a component blown up past its design size looks broken. */
  maxScale = 1,
}: {
  /** The component's true layout width in px. */
  width: number;
  children: React.ReactNode;
  align?: 'start' | 'center';
  className?: string;
  decorative?: boolean;
  maxScale?: number;
}) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const available = outer.clientWidth;
      if (!available) return;
      const next = Math.min(maxScale, available / width);
      setScale(next);
      // The scaled box no longer contributes its real height to layout, so the
      // wrapper has to be told what it collapsed to.
      setHeight(inner.offsetHeight * next);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={outerRef}
      className={className ? `${styles.outer} ${className}` : styles.outer}
      style={{ height }}
      aria-hidden={decorative || undefined}
    >
      <div
        ref={innerRef}
        className={`${styles.inner} productScope`}
        style={{
          width,
          transform: `scale(${scale})`,
          // In RTL the frame anchors to the right edge, in LTR to the left, so
          // the surface stays flush with the column it belongs to.
          transformOrigin: align === 'center' ? 'top center' : 'top var(--mk-frame-origin, right)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
