import type { Metadata } from 'next';
import { CustomersScreen } from './CustomersScreen';

export const metadata: Metadata = { title: 'إدارة العملاء والشركات — LoopWay' };

export default function Page() {
  return <CustomersScreen />;
}
