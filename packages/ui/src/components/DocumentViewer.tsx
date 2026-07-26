'use client';

import * as React from 'react';
import styles from './DocumentViewer.module.css';
import { Icon } from '../icons/Icon';

/* ==========================================================================
   DocumentViewer

   Renders a document for review. With no `src` — which is every case in a
   UI-only build — it shows the diagonal-hatch placeholder plate the source
   material uses in place of photography. See DocumentViewer.module.css.
   ========================================================================== */

export interface DocumentViewerProps {
  /** File name as uploaded, e.g. "رخصة-قيادة.pdf". */
  name: string;
  /** "PDF · 620 ك.ب" — composed by the caller. */
  meta?: React.ReactNode;
  /** Real file URL when one exists; omit for the placeholder plate. */
  src?: string;
  tall?: boolean;
  onDownload?: () => void;
  onExpand?: () => void;
  /** Renders the per-document decision strip. */
  onApprove?: () => void;
  onReject?: () => void;
  /** Shown in the strip once decided — suppresses the buttons. */
  decision?: 'approved' | 'rejected' | null;
}

export function DocumentViewer({
  name,
  meta,
  src,
  tall = false,
  onDownload,
  onExpand,
  onApprove,
  onReject,
  decision = null,
}: DocumentViewerProps) {
  const showDecide = Boolean(onApprove || onReject);

  return (
    <div className={styles.viewer}>
      <div className={tall ? `${styles.plate} ${styles.plateTall}` : styles.plate}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className={styles.image} />
        ) : (
          <span className={styles.plateInner}>
            <Icon name="document" size={30} strokeWidth={1.7} />
            <span className={styles.plateLabel}>معاينة المستند</span>
          </span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.icon}>
          <Icon name="document" size={17} />
        </span>
        <span className={styles.metaText}>
          <span className={styles.name}>{name}</span>
          {meta ? <span className={styles.sub}>{meta}</span> : null}
        </span>
        <span className={styles.actions}>
          {onExpand ? (
            <button type="button" className={styles.iconBtn} onClick={onExpand} title="تكبير" aria-label="تكبير">
              <Icon name="expand" size={15} />
            </button>
          ) : null}
          {onDownload ? (
            <button type="button" className={styles.iconBtn} onClick={onDownload} title="تنزيل" aria-label="تنزيل">
              <Icon name="download" size={15} />
            </button>
          ) : null}
        </span>
      </div>

      {showDecide ? (
        <div className={styles.decide}>
          {decision === 'approved' ? (
            <span className={`${styles.decideBtn} ${styles.decideApprove}`}>تم اعتماد المستند</span>
          ) : decision === 'rejected' ? (
            <span className={`${styles.decideBtn} ${styles.decideReject}`}>تم رفض المستند</span>
          ) : (
            <>
              {onApprove ? (
                <button type="button" className={`${styles.decideBtn} ${styles.decideApprove}`} onClick={onApprove}>
                  اعتماد
                </button>
              ) : null}
              {onReject ? (
                <button type="button" className={`${styles.decideBtn} ${styles.decideReject}`} onClick={onReject}>
                  رفض
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ==========================================================================
   PhotoGrid — the 2×2 plate grid used for truck photos.
   ========================================================================== */

export function PhotoGrid({ captions }: { captions: string[] }) {
  return (
    <div className={styles.grid}>
      {captions.map((c) => (
        <div key={c} className={styles.gridPlate}>
          <Icon name="truck" size={22} strokeWidth={1.7} />
          <span className={styles.gridCaption}>{c}</span>
        </div>
      ))}
    </div>
  );
}
