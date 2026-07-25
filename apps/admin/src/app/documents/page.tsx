import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'مراجعة الوثائق والتصاريح — LoopWay' };

export default function Page() {
  return <SectionPage href="/documents" />;
}
