import type { Metadata } from 'next';
import { AccountScreen } from './AccountScreen';

export const metadata: Metadata = { title: 'حساب المستخدم — LoopWay' };

export default function Page() {
  return <AccountScreen />;
}
