import type { Metadata } from 'next';
import { ShipmentsScreen } from './ShipmentsScreen';

export const metadata: Metadata = { title: 'إدارة الشحنات — LoopWay' };

export default function Page() {
  return <ShipmentsScreen />;
}
