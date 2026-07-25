'use client';

import * as React from 'react';
import styles from './TripCalendar.module.css';
import { Icon } from '../icons/Icon';
import type { CalendarTrip } from '../types';

export const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
] as const;

export const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] as const;

const PALETTE = {
  active: { tint: '#E9F9F0', text: 'var(--lw-green-700)', border: 'var(--lw-green-200)', dot: 'var(--lw-green-500)' },
  scheduled: {
    tint: 'var(--lw-amber-100)',
    text: 'var(--lw-amber-600)',
    border: 'var(--lw-amber-border)',
    dot: 'var(--lw-amber-500)',
  },
} as const;

interface Day {
  inMonth: boolean;
  day: number | '';
  isToday: boolean;
}

interface Bar {
  trip: CalendarTrip;
  colStart: number;
  colEnd: number;
  lane: number;
  isStart: boolean;
  isEnd: boolean;
}

interface Week {
  days: Day[];
  bars: Bar[];
  laneCount: number;
}

export interface Today {
  day: number;
  month: number;
  year: number;
}

/**
 * Lays trips out into non-overlapping lanes per week.
 *
 * Ported line-for-line from `buildCalendar()` in the design source: greedy
 * first-fit lane packing after sorting by start column, then by span length
 * descending. Week height is `30 + laneCount * 26 + 6` — 30px reserves the day
 * numbers, each lane is a 22px bar plus 4px row-gap.
 */
export function buildCalendar(trips: CalendarTrip[], month: number, year: number, today: Today) {
  const first = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const numWeeks = Math.ceil((first + dim) / 7);

  const weeks: Week[] = [];
  const seen = new Set<string>();

  for (let w = 0; w < numWeeks; w++) {
    const weekStartDay = Math.max(1, w * 7 - first + 1);
    const weekEndDay = Math.min(dim, w * 7 + 6 - first + 1);

    const days: Day[] = [];
    for (let col = 0; col < 7; col++) {
      const dayNum = w * 7 + col - first + 1;
      const inMonth = dayNum >= 1 && dayNum <= dim;
      days.push({
        inMonth,
        day: inMonth ? dayNum : '',
        isToday: inMonth && dayNum === today.day && month === today.month && year === today.year,
      });
    }

    const segs: Bar[] = [];
    for (const t of trips) {
      const segStart = Math.max(t.start, weekStartDay);
      const segEnd = Math.min(t.end, weekEndDay);
      if (segStart > segEnd) continue;
      seen.add(t.id);
      segs.push({
        trip: t,
        colStart: segStart - 1 + first - w * 7,
        colEnd: segEnd - 1 + first - w * 7,
        lane: 0,
        isStart: t.start >= weekStartDay,
        isEnd: t.end <= weekEndDay,
      });
    }

    segs.sort((a, b) => a.colStart - b.colStart || (b.colEnd - b.colStart) - (a.colEnd - a.colStart));

    const laneEnds: number[] = [];
    for (const s of segs) {
      let lane = 0;
      while (lane < laneEnds.length && laneEnds[lane] >= s.colStart) lane++;
      laneEnds[lane] = s.colEnd;
      s.lane = lane;
    }

    weeks.push({ days, bars: segs, laneCount: Math.max(1, laneEnds.length) });
  }

  return { weeks, tripCount: seen.size };
}

export interface TripCalendarProps {
  trips: CalendarTrip[];
  month: number;
  year: number;
  today: Today;
  /** Dims every other bar and lifts this one. */
  highlightedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function TripCalendar({
  trips,
  month,
  year,
  today,
  highlightedId,
  onHover,
  onSelect,
  onPrev,
  onNext,
  onToday,
}: TripCalendarProps) {
  const { weeks, tripCount } = React.useMemo(
    () => buildCalendar(trips, month, year, today),
    [trips, month, year, today],
  );

  return (
    <div className={styles.calendar}>
      <div className={styles.head}>
        <div className={styles.titleGroup}>
          <span className={styles.month}>
            {MONTH_NAMES_AR[month]} {year}
          </span>
          <span className={styles.count}>{tripCount} رحلة هذا الشهر</span>
        </div>
        <div className={styles.nav}>
          <button type="button" className={styles.today} onClick={onToday}>
            اليوم
          </button>
          <button type="button" className={styles.navBtn} onClick={onPrev} title="الشهر السابق" aria-label="الشهر السابق">
            <Icon name="chevronRight" size={16} strokeWidth={2} />
          </button>
          <button type="button" className={styles.navBtn} onClick={onNext} title="الشهر التالي" aria-label="الشهر التالي">
            <Icon name="chevronLeft" size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS_AR.map((wd) => (
          <div key={wd} className={styles.weekday}>
            {wd}
          </div>
        ))}
      </div>

      <div className={styles.weeks}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week} style={{ minHeight: 30 + week.laneCount * 26 + 6 }}>
            <div className={styles.cells} aria-hidden="true">
              {week.days.map((d, di) => (
                <div
                  key={di}
                  className={!d.inMonth ? styles.cellOut : d.isToday ? styles.cellToday : styles.cell}
                >
                  {d.inMonth ? (
                    <div className={styles.dayWrap}>
                      <span className={d.isToday ? styles.dayNumToday : styles.dayNum}>{d.day}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className={styles.bars}>
              {week.bars.map((bar) => {
                const c = PALETTE[bar.trip.status] ?? PALETTE.active;
                const dimmed = highlightedId !== null && highlightedId !== bar.trip.id;
                const hot = highlightedId === bar.trip.id;
                const rr = bar.isStart ? '9px' : '3px';
                const rl = bar.isEnd ? '9px' : '3px';

                return (
                  <button
                    key={`${bar.trip.id}-${bar.colStart}`}
                    type="button"
                    className={styles.bar}
                    onClick={() => onSelect(bar.trip.id)}
                    onMouseEnter={() => onHover(bar.trip.id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(bar.trip.id)}
                    onBlur={() => onHover(null)}
                    style={{
                      gridColumn: `${bar.colStart + 1} / ${bar.colEnd + 2}`,
                      gridRow: bar.lane + 1,
                      borderRadius: `${rl} ${rr} ${rr} ${rl}`,
                      background: c.tint,
                      color: c.text,
                      borderColor: c.border,
                      opacity: dimmed ? 0.26 : 1,
                      boxShadow: hot ? 'var(--web-shadow-bar-hot)' : 'none',
                      transform: hot ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    <span className={styles.barDot} style={{ background: c.dot }} />
                    <span className={styles.barLabel}>
                      {bar.trip.id} · {bar.trip.to}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
