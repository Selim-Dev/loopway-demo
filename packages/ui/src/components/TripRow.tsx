'use client';

import * as React from 'react';
import styles from './TripRow.module.css';
import { Icon } from '../icons/Icon';
import { TONE } from '../tokens';
import type { Trip } from '../types';
import { AvatarInitial, ProgressBar, RouteChips, StageChip } from './Display';
import { LiveWaybillButton } from './LiveWaybillButton';

/**
 * The stylised route map shown on the rail when a row is expanded.
 * Hand-drawn SVG copied verbatim from the design source — the product uses no
 * map tiles or photography anywhere, so this abstract plate is the pattern.
 */
function MapPreview() {
  return (
    <div className={styles.map}>
      <div className={styles.mapClip}>
        <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className={styles.mapSvg} aria-hidden="true">
          <rect width="200" height="120" fill="#E7EEEE" />
          <rect x="8" y="10" width="52" height="34" rx="5" fill="#DCE7E4" />
          <rect x="150" y="74" width="48" height="40" rx="5" fill="#DCE7E4" />
          <rect x="120" y="6" width="42" height="26" rx="5" fill="#E1EAEA" />
          <rect x="10" y="84" width="40" height="30" rx="5" fill="#E1EAEA" />
          <path d="M-5 50H205" stroke="#F5F9F9" strokeWidth="9" />
          <path d="M-5 92H205" stroke="#F5F9F9" strokeWidth="6" />
          <path d="M76 -5V125" stroke="#F5F9F9" strokeWidth="7" />
          <path d="M138 -5V125" stroke="#F5F9F9" strokeWidth="5" />
          <path
            d="M40 100 C 66 84, 60 58, 98 52 S 144 34, 162 22"
            fill="none"
            stroke="var(--lw-green-500)"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="40" cy="100" r="4" fill="#fff" stroke="var(--lw-navy-800)" strokeWidth="2.4" />
          <circle cx="162" cy="22" r="10" fill="var(--lw-green-500)" opacity="0.18" />
          <circle cx="162" cy="22" r="5" fill="var(--lw-green-500)" stroke="#fff" strokeWidth="2.2" />
        </svg>
      </div>

      <div className={styles.mapTipWrap}>
        <button type="button" className={styles.mapBtn} aria-label="عرض آخر موقع مُسجَّل للشحنة على الخريطة">
          <Icon name="expand" size={14} strokeWidth={2.1} />
        </button>
        <div className={styles.mapTip} role="tooltip">
          عرض آخر موقع مُسجَّل للشحنة على الخريطة
          <span className={styles.mapTipArrow} />
        </div>
      </div>
    </div>
  );
}

export interface TripRowProps {
  trip: Trip;
  expanded: boolean;
  onToggle: () => void;
  /** Pre-formatted "HH:MM:SS" for live trips; undefined otherwise. */
  elapsed?: string;
  onUploadDocuments?: () => void;
  waybillHref?: string;
  linkAs?: React.ElementType;
}

export function TripRow({
  trip,
  expanded,
  onToggle,
  elapsed,
  onUploadDocuments,
  waybillHref,
  linkAs,
}: TripRowProps) {
  const c = TONE[trip.tone];
  // Live trips spin; awaiting-offers rows spin too (something is pending);
  // delivered rows show a tick. Verbatim from the design's decorate().
  const showSpinner = trip.live || trip.tone === 'warning';
  const showCheck = trip.tone === 'done';

  return (
    <div className={styles.row} style={{ background: c.tint }}>
      <div className={styles.inner}>
        <div
          className={expanded ? `${styles.side} ${styles.sideExpanded}` : styles.side}
          onClick={expanded ? undefined : onToggle}
        >
          <div className={styles.identity}>
            <span className={styles.tripId} style={{ color: c.id }}>
              {trip.id}
            </span>
            <RouteChips from={trip.from} to={trip.to} />
          </div>
          {expanded ? <MapPreview /> : null}
        </div>

        <div className={styles.panel}>
          <div
            className={styles.grid}
            onClick={onToggle}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggle();
              }
            }}
          >
            <span className={styles.cell}>
              <span className={styles.cellLabel}>الحمولة</span>
              <span className={styles.cellValue}>{trip.cargo}</span>
            </span>

            <span className={styles.cell}>
              <span className={styles.cellLabel}>تاريخ الاستلام</span>
              <span className={styles.cellValue}>{trip.pickupDate}</span>
            </span>

            <StageChip
              tone={trip.tone}
              label={trip.stage}
              showSpinner={showSpinner}
              showCheck={showCheck}
              elapsed={trip.live ? elapsed : undefined}
            />

            <span>
              <button
                type="button"
                className={`${styles.action} ${trip.kind === 'primary' ? styles.actionPrimary : styles.actionSecondary}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
              >
                {trip.action}
              </button>
            </span>

            <span className={expanded ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}>
              <Icon name="chevronDown" size={16} strokeWidth={2} />
            </span>
          </div>

          {expanded ? (
            <>
              <div className={styles.divider} />
              <div className={styles.detail}>
                <div className={styles.detailProgress}>
                  <div className={styles.detailTitle}>تقدم الرحلة</div>
                  <div className={styles.progressHead}>
                    <span className={styles.progressStage}>{trip.stage}</span>
                    <span className={styles.progressPct}>{trip.progress}%</span>
                  </div>
                  <ProgressBar percent={trip.progress} label="تقدم الرحلة" />
                </div>

                <div className={styles.detailWho}>
                  <div className={styles.detailTitle}>{trip.driver ? 'السائق' : 'العروض'}</div>
                  <div className={styles.whoRow}>
                    <AvatarInitial
                      initial={trip.driver ? trip.who.trim().charAt(0) : '؟'}
                      variant={trip.driver ? 'driver' : 'offers'}
                    />
                    <span>
                      <span className={styles.whoLabel}>{trip.who}</span>
                      <span className={styles.whoSub}>{trip.whoSub}</span>
                    </span>
                  </div>
                </div>

                <div className={styles.detailActions}>
                  <div className={styles.detailTitle}>إجراءات الرحلة</div>
                  <div className={styles.actionRow}>
                    <button type="button" className={styles.ghostBtn} onClick={onUploadDocuments}>
                      <Icon name="upload" size={15} />
                      رفع المستندات
                    </button>
                    <LiveWaybillButton href={waybillHref} linkAs={linkAs} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
