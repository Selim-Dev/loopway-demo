import type { Metadata } from 'next';
import { TripsScreen } from './TripsScreen';

export const metadata: Metadata = { title: 'رحلاتي — LoopWay' };

export default function TripsListPage() {
  return <TripsScreen initialPage="list" />;
}
