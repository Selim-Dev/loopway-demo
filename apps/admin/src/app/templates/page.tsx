import type { Metadata } from 'next';
import { TemplatesScreen } from './TemplatesScreen';

export const metadata: Metadata = { title: 'الإشعارات والقوالب — LoopWay' };

export default function Page() {
  return <TemplatesScreen />;
}
