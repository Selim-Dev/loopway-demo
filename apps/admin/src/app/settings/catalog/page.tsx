import type { Metadata } from 'next';
import { CatalogScreen } from './CatalogScreen';

export const metadata: Metadata = { title: 'أنواع الشحنات والشاحنات — LoopWay' };

export default function Page() {
  return <CatalogScreen />;
}
