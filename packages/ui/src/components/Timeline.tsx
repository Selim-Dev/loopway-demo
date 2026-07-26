import * as React from 'react';
import styles from './Timeline.module.css';
import { Icon } from '../icons/Icon';

export type TimelineState = 'done' | 'active' | 'upcoming' | 'danger';

export interface TimelineItem {
  id: string;
  label: string;
  /** Timestamp, actor, location — composed by the caller into one line. */
  meta?: React.ReactNode;
  note?: React.ReactNode;
  state: TimelineState;
}

/**
 * The full timeline: 22px glyph dots and a 2px connector.
 * For a two- or three-step history inside a panel use the compact
 * `StatusTimeline` instead — see docs/design-system/07-patterns.md.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const dotClass = [
          styles.dot,
          item.state === 'done' ? styles.dotDone : '',
          item.state === 'active' ? styles.dotActive : '',
          item.state === 'danger' ? styles.dotDanger : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={item.id} className={styles.step}>
            <div className={styles.rail}>
              <span className={dotClass}>
                {item.state === 'done' ? <Icon name="check" size={13} strokeWidth={2.8} /> : null}
                {item.state === 'active' ? <Icon name="clock" size={13} /> : null}
                {item.state === 'danger' ? <Icon name="close" size={12} strokeWidth={2.6} /> : null}
              </span>
              {!last ? (
                <span className={item.state === 'done' ? `${styles.line} ${styles.lineDone}` : styles.line} />
              ) : null}
            </div>
            <div className={styles.body}>
              <div className={item.state === 'upcoming' ? `${styles.label} ${styles.labelUpcoming}` : styles.label}>
                {item.label}
              </div>
              {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
              {item.note ? <div className={styles.note}>{item.note}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
