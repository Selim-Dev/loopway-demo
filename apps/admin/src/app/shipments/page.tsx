import type { Metadata } from 'next';
import { ShipmentsScreen } from './ShipmentsScreen';

export const metadata: Metadata = { title: 'إدارة الرحلات — LoopWay' };

export default function Page() {
  return <ShipmentsScreen />;
}
