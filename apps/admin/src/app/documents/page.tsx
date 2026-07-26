import type { Metadata } from 'next';
import { DocumentsScreen } from './DocumentsScreen';

export const metadata: Metadata = { title: 'مراجعة الوثائق والتصاريح — LoopWay' };

export default function Page() {
  return <DocumentsScreen />;
}
