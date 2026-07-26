import type { Metadata } from 'next';
import { PricingScreen } from './PricingScreen';

export const metadata: Metadata = { title: 'التسعير والرسوم والضرائب — LoopWay' };

export default function Page() {
  return <PricingScreen />;
}
