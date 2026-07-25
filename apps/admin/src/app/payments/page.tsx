import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'الدفع والـ Ledger — LoopWay' };

export default function Page() {
  return <SectionPage href="/payments" />;
}
