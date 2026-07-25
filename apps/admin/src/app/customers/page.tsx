import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'إدارة العملاء والشركات — LoopWay' };

export default function Page() {
  return <SectionPage href="/customers" />;
}
