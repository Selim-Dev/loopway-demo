import type { Metadata } from 'next';
import { NotificationsScreen } from './NotificationsScreen';

export const metadata: Metadata = { title: 'إدارة الإشعارات — LoopWay' };

export default function Page() {
  return <NotificationsScreen />;
}
