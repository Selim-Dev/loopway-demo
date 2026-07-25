/**
 * Typed mirrors of the CSS token layers.
 *
 * The CSS custom properties in `tokens/` remain the single source of truth —
 * these constants exist so TS/TSX can reference the *same* values where a
 * computed style is unavoidable (grid templates, inline shadows on generated
 * elements, canvas/SVG fills).
 *
 * Rule: never introduce a literal here that does not already exist in a token
 * file or in the design source.
 */

/** Semantic tone shared by every status surface in the product. */
export type Tone = 'success' | 'warning' | 'danger' | 'done' | 'neutral';

export interface ToneColors {
  /** Row/card tint (the large, low-saturation fill). */
  tint: string;
  /** Text + icon colour on that tint. */
  text: string;
  /** Hairline border on that tint. */
  border: string;
  /** Slightly lighter fill used behind the stage chip. */
  stageBg: string;
  /** Colour of the LTR reference code (trip ID). */
  id: string;
  /** Solid dot colour. */
  dot: string;
}

/**
 * Verbatim from `decorate()` / `toneColors()` in the designed رحلاتي screen.
 * `done` deliberately shares the green tint with `success` but inks its ID in
 * navy — a completed trip is no longer "live", so the ID stops shouting.
 */
export const TONE: Record<Tone, ToneColors> = {
  success: {
    tint: '#E9F9F0',
    text: 'var(--lw-green-700)',
    border: 'var(--lw-green-200)',
    stageBg: '#F2FBF6',
    id: 'var(--lw-green-600)',
    dot: 'var(--lw-green-500)',
  },
  warning: {
    tint: 'var(--lw-amber-100)',
    text: 'var(--lw-amber-600)',
    border: 'var(--lw-amber-border)',
    stageBg: '#FFFBF2',
    id: 'var(--lw-amber-600)',
    dot: 'var(--lw-amber-500)',
  },
  danger: {
    tint: 'var(--lw-red-100b)',
    text: 'var(--lw-red-600)',
    border: 'var(--lw-red-border-b)',
    stageBg: '#FEF5F4',
    id: 'var(--lw-red-600)',
    dot: 'var(--lw-red-500)',
  },
  done: {
    tint: '#E9F9F0',
    text: 'var(--lw-green-700)',
    border: 'var(--lw-green-200)',
    stageBg: '#F2FBF6',
    id: 'var(--lw-navy-800)',
    dot: 'var(--lw-green-500)',
  },
  neutral: {
    tint: 'var(--lw-icon-tint-bg)',
    text: 'var(--lw-slate-600)',
    border: 'var(--lw-border)',
    stageBg: 'var(--lw-bg-subtle)',
    id: 'var(--lw-slate-600)',
    dot: 'var(--lw-slate-400)',
  },
};

/**
 * Badge palette — the flatter variant used by `StatusBadge` in tables
 * (`سجل العمليات المالية`). Distinct from TONE: badges sit on white, so they
 * use the *semantic* background aliases rather than the row tints.
 */
export const BADGE_TONE: Record<Exclude<Tone, 'done'>, { bg: string; color: string; dot: string }> = {
  success: { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', dot: 'var(--lw-green-500)' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', dot: 'var(--lw-amber-500)' },
  danger: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', dot: 'var(--lw-red-500)' },
  neutral: { bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-slate-600)', dot: 'var(--lw-slate-400)' },
};

/** Shell geometry, mirrored from tokens/web.css. */
export const WEB = {
  frameWidth: 1440,
  frameHeight: 980,
  framePadding: 28,
  frameGap: 22,
  railWidth: 78,
  headerHeight: 66,
  panelWidth: 372,
  tripRowSideWidth: 216,
  tripRowGrid: '200px 118px 290px 158px 24px',
} as const;
