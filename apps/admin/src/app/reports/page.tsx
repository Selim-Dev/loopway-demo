import type { Metadata } from 'next';
import { ReportsScreen } from './ReportsScreen';

export const metadata: Metadata = { title: 'التقارير — LoopWay' };

export default function Page() {
  return <ReportsScreen />;
}
