import type { CalendarTrip, Today } from '@loopway/ui';

/**
 * Calendar fixtures — the same nine trips the design places across July 2026.
 * `start`/`end` are days of the month, inclusive.
 */
export const CALENDAR_TRIPS: CalendarTrip[] = [
  { id: 'LW-2026-002960', from: 'الرياض', to: 'الدمام', start: 5, end: 8, status: 'active', cargo: 'معدات ثقيلة • 30 طن', driver: 'خالد ناصر' },
  { id: 'LW-2026-002951', from: 'الدمام', to: 'دبي', start: 6, end: 11, status: 'active', cargo: 'مواد بناء • 24 طن', driver: 'عبدالله الغامدي' },
  { id: 'LW-2026-002955', from: 'جدة', to: 'المدينة', start: 8, end: 9, status: 'scheduled', cargo: 'مواد غذائية مبردة • 8 طن', driver: 'عمر السالم' },
  { id: 'LW-2026-002962', from: 'الرياض', to: 'الكويت', start: 12, end: 17, status: 'active', cargo: 'إلكترونيات • 6 طن', driver: 'سعد المطيري' },
  { id: 'LW-2026-002944', from: 'الرياض', to: 'جدة', start: 14, end: 15, status: 'scheduled', cargo: 'أثاث منزلي • 12 طن', driver: 'ماجد العنزي' },
  { id: 'LW-2026-002948', from: 'جدة', to: 'أبها', start: 16, end: 20, status: 'active', cargo: 'منسوجات • 10 طن', driver: 'فيصل الدوسري' },
  { id: 'LW-2026-002965', from: 'الدمام', to: 'الرياض', start: 18, end: 22, status: 'scheduled', cargo: 'مواد كيميائية • 18 طن', driver: 'ناصر القحطاني' },
  { id: 'LW-2026-002970', from: 'جدة', to: 'مكة', start: 22, end: 24, status: 'active', cargo: 'مواد غذائية • 9 طن', driver: 'تركي الشهري' },
  { id: 'LW-2026-002972', from: 'الرياض', to: 'نجران', start: 25, end: 29, status: 'scheduled', cargo: 'معدات زراعية • 15 طن', driver: 'بندر العتيبي' },
];

/**
 * "Today" is pinned rather than read from the system clock.
 *
 * Two reasons: the fixtures live in July 2026 so a real clock would render an
 * empty month, and a fixed date keeps server and client renders identical.
 * Month is 0-based — 6 = July. Matches the design source exactly.
 */
export const TODAY: Today = { day: 16, month: 6, year: 2026 };
