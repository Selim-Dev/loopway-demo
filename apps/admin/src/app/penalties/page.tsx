import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'مراجعة الغرامات — LoopWay' };

export default function Page() {
  return <SectionPage href="/penalties" />;
}
