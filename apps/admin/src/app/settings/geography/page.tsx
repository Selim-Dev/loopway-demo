import type { Metadata } from 'next';
import { GeographyScreen } from './GeographyScreen';

export const metadata: Metadata = { title: 'الدول والمدن والموانئ — LoopWay' };

export default function Page() {
  return <GeographyScreen />;
}
