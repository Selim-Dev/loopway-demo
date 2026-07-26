import type { Metadata } from 'next';
import { PayoutsScreen } from './PayoutsScreen';

export const metadata: Metadata = { title: 'Payout Management — LoopWay' };

export default function Page() {
  return <PayoutsScreen />;
}
