import * as React from 'react';
import styles from './BarList.module.css';

export interface BarDatum {
  label: string;
  /** Rendered as-is on the left — pre-format thousands separators. */
  value: string | number;
  /** 0–100. Callers normalise against their own max. */
  percent: number;
  /** Defaults to brand green. Use a status colour only when it means something. */
  color?: string;
}

/**
 * Horizontal labelled bars. Deliberately not a chart library —
 * see BarList.module.css for why.
 */
export function BarList({ data }: { data: BarDatum[] }) {
  return (
    <div className={styles.bars}>
      {data.map((d) => (
        <div key={d.label} className={styles.row}>
          <span className={styles.label} title={d.label}>
            {d.label}
          </span>
          <span className={styles.track}>
            <span
              className={styles.fill}
              style={{
                width: `${Math.max(0, Math.min(100, d.percent))}%`,
                background: d.color ?? 'var(--lw-green-500)',
              }}
            />
          </span>
          <span className={styles.value}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Normalises raw values to percentages against the largest. */
export function toBarData(
  rows: { label: string; value: number; color?: string }[],
  format: (n: number) => string = (n) => n.toLocaleString('en-US'),
): BarDatum[] {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return rows.map((r) => ({
    label: r.label,
    value: format(r.value),
    percent: (r.value / max) * 100,
    color: r.color,
  }));
}
