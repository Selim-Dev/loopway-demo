import type { Metadata } from 'next';
import { AuditScreen } from './AuditScreen';

export const metadata: Metadata = { title: 'سجل القرارات والاعتمادات — LoopWay' };

export default function Page() {
  return <AuditScreen />;
}
