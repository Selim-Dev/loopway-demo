import type { Metadata } from 'next';
import '@loopway/ui/styles.css';
import './globals.css';
import { fontClass } from './fonts';

export const metadata: Metadata = {
  title: 'LoopWay — لوحة الشركات',
  description: 'إدارة ومتابعة رحلات الشحن البري للشركات على منصة LoopWay.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontClass}>
      <body>{children}</body>
    </html>
  );
}
