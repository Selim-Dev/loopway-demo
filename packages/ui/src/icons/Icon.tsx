import * as React from 'react';

/**
 * LoopWay icon set.
 *
 * PROVENANCE — every path below is lifted verbatim from the two designed B2B
 * screens ("لوحة الشركات - رحلاتي (standalone).html" and
 * "سجل العمليات المالية.dc.html"). Nothing was redrawn from memory and no
 * external icon library is used. The upstream product has no icon font,
 * sprite sheet or SVG assets — every icon is hand-authored inline.
 *
 * ONE INTENTIONAL DEVIATION: the source hard-codes stroke colours on a few
 * icons (e.g. the bell ships `stroke="var(--lw-navy-800)"`). Here every stroke
 * is `currentColor` so colour is owned by the call site. Rendered output is
 * identical as long as the parent sets the same colour — see
 * docs/design-system/04-iconography.md.
 *
 * THE STROKE RECIPE (follow it for any icon you must add):
 *   24×24 viewBox · fill="none" · stroke-width 1.6–2.4
 *   stroke-linecap="round" · stroke-linejoin="round" · stroke="currentColor"
 */

export type IconName =
  | 'home'
  | 'truck'
  | 'card'
  | 'user'
  | 'gear'
  | 'bell'
  | 'support'
  | 'list'
  | 'calendar'
  | 'search'
  | 'plus'
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronLeft'
  | 'close'
  | 'check'
  | 'clock'
  | 'warning'
  | 'retry'
  | 'expand'
  | 'upload'
  | 'download'
  | 'waybill'
  | 'document'
  | 'shield'
  | 'emptyTruck'
  | 'arrowIn'
  | 'arrowOut';

type Shape =
  | { t: 'path'; d: string; w?: number; cap?: boolean; join?: boolean; fill?: boolean }
  | { t: 'circle'; cx: number; cy: number; r: number; w?: number; fill?: boolean }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx: number; sw?: number };

const ICONS: Record<IconName, Shape[]> = {
  home: [
    { t: 'path', d: 'M4 11l8-6.5L20 11', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M6 10v9h12v-9', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M10 19v-5h4v5', w: 1.9, cap: true, join: true },
  ],
  truck: [
    { t: 'path', d: 'M3 8.5A1.5 1.5 0 0 1 4.5 7H13a1 1 0 0 1 1 1v7.5H3.5A.5.5 0 0 1 3 15z', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M14 10h2.7a1 1 0 0 1 .8.4l2.1 2.8a1 1 0 0 1 .2.6v2.2a.5.5 0 0 1-.5.5H14z', w: 1.9, cap: true, join: true },
    { t: 'circle', cx: 7, cy: 17.5, r: 1.9, w: 1.9 },
    { t: 'circle', cx: 16.8, cy: 17.5, r: 1.9, w: 1.9 },
  ],
  card: [
    { t: 'rect', x: 3, y: 6, w: 18, h: 13, rx: 2.5, sw: 1.9 },
    { t: 'path', d: 'M3 10h18', w: 1.9 },
    { t: 'path', d: 'M15.5 14.5h2.5', w: 1.9, cap: true },
  ],
  user: [
    { t: 'circle', cx: 12, cy: 8, r: 3.6, w: 1.9 },
    { t: 'path', d: 'M5 19.5a7 7 0 0 1 14 0', w: 1.9, cap: true },
  ],
  gear: [
    { t: 'circle', cx: 12, cy: 12, r: 3, w: 1.9 },
    {
      t: 'path',
      d: 'M12 4v2.2M12 17.8V20M20 12h-2.2M6.2 12H4M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9L6.3 6.3',
      w: 1.9,
      cap: true,
    },
  ],
  bell: [
    { t: 'path', d: 'M6 9a6 6 0 1 1 12 0c0 3.2 1 4.6 2 5.5H4c1-.9 2-2.3 2-5.5z', w: 1.9, join: true },
    { t: 'path', d: 'M10 17.5a2 2 0 0 0 4 0', w: 1.9, cap: true },
  ],
  support: [
    { t: 'path', d: 'M5 13a7 7 0 0 1 14 0', w: 1.9, cap: true },
    { t: 'rect', x: 3.5, y: 12.5, w: 3.5, h: 6, rx: 1.5, sw: 1.9 },
    { t: 'rect', x: 17, y: 12.5, w: 3.5, h: 6, rx: 1.5, sw: 1.9 },
    { t: 'path', d: 'M19 18.5c0 1.5-1.5 2.5-3.5 2.5', w: 1.9, cap: true },
  ],
  list: [
    { t: 'path', d: 'M9 6h11M9 12h11M9 18h11', w: 1.9, cap: true },
    { t: 'circle', cx: 4.5, cy: 6, r: 1.3, fill: true },
    { t: 'circle', cx: 4.5, cy: 12, r: 1.3, fill: true },
    { t: 'circle', cx: 4.5, cy: 18, r: 1.3, fill: true },
  ],
  calendar: [
    { t: 'rect', x: 3.5, y: 5, w: 17, h: 15.5, rx: 2.5, sw: 1.9 },
    { t: 'path', d: 'M3.5 9.5h17M8 3.5v3.5M16 3.5v3.5', w: 1.9, cap: true },
  ],
  search: [
    { t: 'circle', cx: 11, cy: 11, r: 7, w: 1.9 },
    { t: 'path', d: 'M20 20l-3.2-3.2', w: 1.9, cap: true },
  ],
  plus: [{ t: 'path', d: 'M12 5v14M5 12h14', w: 2.2, cap: true }],
  chevronDown: [{ t: 'path', d: 'M6 9l6 6 6-6', w: 2, cap: true, join: true }],
  chevronRight: [{ t: 'path', d: 'M9 6l6 6-6 6', w: 2, cap: true, join: true }],
  chevronLeft: [{ t: 'path', d: 'M15 6l-6 6 6 6', w: 2, cap: true, join: true }],
  close: [{ t: 'path', d: 'M6 6l12 12M18 6L6 18', w: 2, cap: true }],
  check: [{ t: 'path', d: 'M5 12l5 5 9-10', w: 2.6, cap: true, join: true }],
  clock: [
    { t: 'circle', cx: 12, cy: 12, r: 8.5, w: 1.9 },
    { t: 'path', d: 'M12 8v4.5l3 1.8', w: 1.9, cap: true, join: true },
  ],
  warning: [
    { t: 'path', d: 'M12 3l9 16H3z', w: 1.9, join: true },
    { t: 'path', d: 'M12 10v4M12 16.5v.01', w: 1.9, cap: true },
  ],
  retry: [
    { t: 'path', d: 'M20 11a8 8 0 1 0-2 5.3', w: 2, cap: true },
    { t: 'path', d: 'M20 5v5h-5', w: 2, cap: true, join: true },
  ],
  expand: [
    { t: 'path', d: 'M17 17L7.5 7.5', w: 2.1, cap: true },
    { t: 'path', d: 'M7 14V7h7', w: 2.1, cap: true, join: true },
  ],
  upload: [
    { t: 'path', d: 'M12 16V5M8 8.5L12 4.5l4 4', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15', w: 1.9, cap: true },
  ],
  download: [
    { t: 'path', d: 'M12 4v10M8 10.5L12 14.5l4-4', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16', w: 1.9, cap: true },
  ],
  /** Document with a "live" lens — the البوليصة الحية CTA glyph. */
  waybill: [
    { t: 'path', d: 'M7 3.5h7.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5z', w: 1.9, join: true },
    { t: 'path', d: 'M14 3.5V8h4.5', w: 1.9, join: true },
    { t: 'circle', cx: 12, cy: 15, r: 3.4, w: 1.7 },
    { t: 'circle', cx: 12, cy: 15, r: 1.1, fill: true },
  ],
  document: [
    { t: 'path', d: 'M7 3.5h7.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5z', w: 1.9, join: true },
    { t: 'path', d: 'M14 3.5V8h4.5', w: 1.9, join: true },
  ],
  /** Shield + tick — the "محمي" chip on the wallet balance card. */
  shield: [
    { t: 'path', d: 'M12 3l7 3v5.5c0 4.8-3 8.3-7 9.5-4-1.2-7-4.7-7-9.5V6z', w: 1.9, join: true },
    { t: 'path', d: 'M9 12l2 2 4-4.5', w: 1.9, cap: true, join: true },
  ],
  /** Flat-bed silhouette used by the "no trips" empty state. */
  emptyTruck: [
    { t: 'path', d: 'M4 7h16v3H4z', w: 1.8, join: true },
    { t: 'path', d: 'M6 10v9h12v-9', w: 1.8, join: true },
    { t: 'path', d: 'M10 14h4', w: 1.8, cap: true },
  ],
  /** Money in (شحن رصيد). */
  arrowIn: [
    { t: 'path', d: 'M12 4v11M8 11.5L12 15.5l4-4', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16', w: 1.9, cap: true },
  ],
  /** Money out (سحب أموال). */
  arrowOut: [
    { t: 'path', d: 'M12 16V5M8 8.5L12 4.5l4 4', w: 1.9, cap: true, join: true },
    { t: 'path', d: 'M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15', w: 1.9, cap: true },
  ],
};

export interface IconProps {
  name: IconName;
  size?: number;
  /** Overrides the inherited stroke width on every shape. Use sparingly. */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 22, strokeWidth, className, style }: IconProps) {
  const shapes = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flex: 'none', display: 'block', ...style }}
    >
      {shapes.map((s, i) => {
        if (s.t === 'circle') {
          return s.fill ? (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="currentColor" />
          ) : (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} stroke="currentColor" strokeWidth={strokeWidth ?? s.w ?? 1.9} />
          );
        }
        if (s.t === 'rect') {
          return (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.rx}
              stroke="currentColor"
              strokeWidth={strokeWidth ?? s.sw ?? 1.9}
            />
          );
        }
        return (
          <path
            key={i}
            d={s.d}
            stroke="currentColor"
            strokeWidth={strokeWidth ?? s.w ?? 1.9}
            strokeLinecap={s.cap ? 'round' : undefined}
            strokeLinejoin={s.join ? 'round' : undefined}
          />
        );
      })}
    </svg>
  );
}

/**
 * The route arrow that sits between the origin and destination chips.
 * Non-square viewBox (20×12) — kept separate rather than forced into the
 * 24×24 grid, exactly as the design source has it.
 */
export function RouteArrow({ width = 13, height = 10 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 12" fill="none" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M18 6H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The LoopWay brand mark.
 *
 * SUBSTITUTION NOTE: the raster `loopway-mark.png` referenced by the design
 * files could not be extracted through the design API (the file exceeds the
 * 256 KiB per-read cap and comes back truncated). This vector is the loop
 * geometry the same design file ships in its own thumbnail template:
 *   stroke #2ECC71, width 34, round caps,
 *   d="M-150 0 a75 75 0 1 1 150 0 a75 75 0 1 0 150 0"
 * Drop the real PNG into `public/brand/loopway-mark.png` and swap this out if
 * you need the exact raster. See docs/design-system/11-design-source-map.md.
 */
export function LoopwayMark({ width = 52, color = 'var(--lw-green-500)' }: { width?: number; color?: string }) {
  return (
    <svg
      width={width}
      height={width * (42 / 52)}
      viewBox="0 0 520 420"
      fill="none"
      role="img"
      aria-label="LoopWay"
      style={{ display: 'block' }}
    >
      <g transform="translate(260 210)" fill="none" stroke={color} strokeWidth="52" strokeLinecap="round">
        <path d="M-150 0 a75 75 0 1 1 150 0 a75 75 0 1 0 150 0" />
      </g>
    </svg>
  );
}
