import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'اعتماد الشاحنات — LoopWay' };

export default function Page() {
  return <SectionPage href="/trucks" />;
}
