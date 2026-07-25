import type { Metadata } from 'next';
import { SectionPage } from '@/components/SectionPage';

export const metadata: Metadata = { title: 'أنواع الشحنات والشاحنات — LoopWay' };

export default function Page() {
  return <SectionPage href="/settings/catalog" />;
}
