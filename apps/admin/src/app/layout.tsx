import type { Metadata } from 'next';
import '@loopway/ui/styles.css';
import './globals.css';
import { Shell } from '@/components/Shell';
import { fontClass } from './fonts';

export const metadata: Metadata = {
  title: 'LoopWay — لوحة الإدارة',
  description: 'اعتماد ومراقبة وإعدادات ومراجعة غرامات ومدفوعات ودعم لمنصة LoopWay.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontClass}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
