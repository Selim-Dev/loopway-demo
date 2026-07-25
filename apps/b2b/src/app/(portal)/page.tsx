import type { Metadata } from 'next';
import { HomeScreen } from './HomeScreen';

export const metadata: Metadata = { title: 'الرئيسية — LoopWay' };

export default function HomePage() {
  return <HomeScreen />;
}
