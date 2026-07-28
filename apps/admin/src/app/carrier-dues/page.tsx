import type { Metadata } from 'next';
import { CarrierDuesScreen } from './CarrierDuesScreen';

export const metadata: Metadata = { title: 'إدارة مستحقات الشركات — LoopWay' };

export default function Page() {
  return <CarrierDuesScreen />;
}
