'use client';

import * as React from 'react';

/**
 * Formats a second count as HH:MM:SS.
 * Always rendered LTR — see docs/design-system/03-typography-rtl.md.
 */
export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * A once-per-second tick for the live elapsed counters on in-transit trips.
 *
 * Starts at 0 on mount rather than reading the clock during render, so the
 * server and first client render agree and Next.js reports no hydration
 * mismatch. Pass `enabled: false` when nothing on screen is live.
 */
export function useSecondTick(enabled = true): number {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);

  return tick;
}
