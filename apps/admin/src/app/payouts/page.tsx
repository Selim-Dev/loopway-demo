import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'Payout Management — LoopWay' };

export default function Page() {
  return <SectionPage href="/payouts" />;
}
