import { Montserrat, Tajawal } from 'next/font/google';

/** Same self-hosted stack as the B2B portal — see apps/b2b/src/app/fonts.ts. */

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--lw-font-tajawal',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--lw-font-montserrat',
  display: 'swap',
});

export const fontClass = `${tajawal.variable} ${montserrat.variable}`;
