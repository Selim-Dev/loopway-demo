import type { Metadata } from 'next';
import { DriversScreen } from './DriversScreen';

export const metadata: Metadata = { title: 'اعتماد السائقين — LoopWay' };

export default function Page() {
  return <DriversScreen />;
}
