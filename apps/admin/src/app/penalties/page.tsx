import type { Metadata } from 'next';
import { PenaltiesScreen } from './PenaltiesScreen';

export const metadata: Metadata = { title: 'مراجعة الغرامات — LoopWay' };

export default function Page() {
  return <PenaltiesScreen />;
}
