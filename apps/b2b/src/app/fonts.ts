import { Montserrat, Tajawal } from 'next/font/google';

/**
 * Webfonts.
 *
 * The design system's `tokens/fonts.css` pulls Tajawal + Montserrat from
 * Google Fonts with a plain CSS `@import`. That works for a standalone HTML
 * mock, but a bundler concatenates stylesheets and any `@import` that ends up
 * mid-file is dropped by the browser — the fonts silently fall back.
 *
 * `next/font` fetches the same two families at build time and self-hosts them,
 * so the running app makes no request to Google at all. The families, weights
 * and stack order are unchanged.
 */

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
