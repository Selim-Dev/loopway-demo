import type { Metadata } from 'next';
import { FinanceScreen } from './FinanceScreen';

export const metadata: Metadata = { title: 'العمليات المالية — LoopWay' };

export default function FinancePage() {
  return <FinanceScreen />;
}
