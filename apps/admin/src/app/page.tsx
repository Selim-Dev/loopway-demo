import type { Metadata } from 'next';
import { AdminHome } from './AdminHome';

export const metadata: Metadata = { title: 'الصفحة الرئيسية التشغيلية — LoopWay' };

export default function Page() {
  return <AdminHome />;
}
