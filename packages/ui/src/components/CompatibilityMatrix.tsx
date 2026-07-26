'use client';

import * as React from 'react';
import styles from './CompatibilityMatrix.module.css';

/** SRS M04-E08-F02: Cargo Compatibility · Blocked Combinations · Warning Rules. */
export type Compatibility = 'allowed' | 'warning' | 'blocked';

export const COMPATIBILITY_LABEL: Record<Compatibility, string> = {
  allowed: 'متوافق',
  warning: 'تحذير',
  blocked: 'ممنوع',
};

const CELL_CLASS: Record<Compatibility, string> = {
  allowed: styles.allowed,
  warning: styles.warning,
  blocked: styles.blocked,
};

/** Clicking a cell cycles متوافق → تحذير → ممنوع → متوافق. */
const NEXT: Record<Compatibility, Compatibility> = {
  allowed: 'warning',
  warning: 'blocked',
  blocked: 'allowed',
};

export interface CompatibilityMatrixProps {
  /** Cargo types — the rows. */
  rows: { id: string; label: string }[];
  /** Truck types — the columns. */
  columns: { id: string; label: string }[];
  /** Keyed `${rowId}:${columnId}`. Missing entries read as `allowed`. */
  value: Record<string, Compatibility>;
  onChange?: (rowId: string, columnId: string, next: Compatibility) => void;
  readOnly?: boolean;
}

export function CompatibilityMatrix({
  rows,
  columns,
  value,
  onChange,
  readOnly = false,
}: CompatibilityMatrixProps) {
  return (
    <>
      <div className={`${styles.wrap} lw-scroll`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.corner} ${styles.colHead}`}>نوع الشحنة \ الشاحنة</th>
              {columns.map((c) => (
                <th key={c.id} className={styles.colHead} scope="col">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th className={styles.rowHead} scope="row">
                  {r.label}
                </th>
                {columns.map((c) => {
                  const key = `${r.id}:${c.id}`;
                  const state = value[key] ?? 'allowed';
                  return (
                    <td key={c.id} className={styles.cell}>
                      <button
                        type="button"
                        className={`${styles.chip} ${CELL_CLASS[state]}`}
                        disabled={readOnly}
                        style={readOnly ? { cursor: 'default' } : undefined}
                        title={`${r.label} × ${c.label} — ${COMPATIBILITY_LABEL[state]}`}
                        onClick={() => onChange?.(r.id, c.id, NEXT[state])}
                      >
                        {COMPATIBILITY_LABEL[state]}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.legend}>
        {(['allowed', 'warning', 'blocked'] as Compatibility[]).map((s) => (
          <span key={s} className={styles.legendItem}>
            <span
              className={`${styles.swatch} ${CELL_CLASS[s]}`}
              style={{ borderWidth: 1, borderStyle: 'solid' }}
            />
            {COMPATIBILITY_LABEL[s]}
          </span>
        ))}
        {!readOnly ? <span className={styles.hint}>اضغط على أي خانة لتبديل حالتها.</span> : null}
      </div>
    </>
  );
}
