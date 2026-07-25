import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'التسعير والرسوم والضرائب — LoopWay' };

export default function Page() {
  return <SectionPage href="/settings/pricing" />;
}
