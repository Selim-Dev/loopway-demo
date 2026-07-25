import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'Audit Log — LoopWay' };

export default function Page() {
  return <SectionPage href="/audit" />;
}
