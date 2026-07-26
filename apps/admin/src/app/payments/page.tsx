import type { Metadata } from 'next';
import { PaymentsScreen } from './PaymentsScreen';

export const metadata: Metadata = { title: 'الدفع والـ Ledger — LoopWay' };

export default function Page() {
  return <PaymentsScreen />;
}
