import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'إدارة الشحنات — LoopWay' };

export default function Page() {
  return <SectionPage href="/shipments" />;
}
