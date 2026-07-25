import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'الدول والمدن والموانئ — LoopWay' };

export default function Page() {
  return <SectionPage href="/settings/geography" />;
}
