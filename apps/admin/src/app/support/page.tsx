import type { Metadata } from 'next';
import { SupportScreen } from './SupportScreen';

export const metadata: Metadata = { title: 'الدعم والاستثناءات — LoopWay' };

export default function Page() {
  return <SupportScreen />;
}
