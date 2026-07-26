import type { Metadata } from 'next';
import { AuditScreen } from './AuditScreen';

export const metadata: Metadata = { title: 'Audit Log — LoopWay' };

export default function Page() {
  return <AuditScreen />;
}
