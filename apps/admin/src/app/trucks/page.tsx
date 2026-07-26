import type { Metadata } from 'next';
import { TrucksScreen } from './TrucksScreen';

export const metadata: Metadata = { title: 'اعتماد الشاحنات — LoopWay' };

export default function Page() {
  return <TrucksScreen />;
}
