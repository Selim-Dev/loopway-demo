import type { Metadata } from 'next';
import { TripsScreen } from '../TripsScreen';

export const metadata: Metadata = { title: 'التقويم — رحلاتي — LoopWay' };

export default function TripsCalendarPage() {
  return <TripsScreen initialPage="calendar" />;
}
