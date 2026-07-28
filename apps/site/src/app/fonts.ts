import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Montserrat, Tajawal } from 'next/font/google';

/**
 * Four families, each with a job. The split is deliberate — see
 * docs/design-system/12-marketing-site.md.
 *
 *   Plex Arabic / Plex Sans — the marketing site's own voice. Engineered and
 *   precise, and it holds together at 6rem where Tajawal starts to feel like
 *   UI text blown up.
 *
 *   Tajawal / Montserrat — the PRODUCT's stack. Restored inside `.productScope`
 *   so the live @loopway/ui surfaces embedded on the page render exactly as
 *   they do in the portals. That is the whole point of embedding them.
 *
 * All four are self-hosted by next/font, so the running site makes no request
 * to Google — same fix as the portals, documented in 03-typography-rtl.md.
 */

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--lw-font-plex-ar',
  display: 'swap',
  preload: true,
});

export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--lw-font-plex',
  display: 'swap',
});

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--lw-font-tajawal',
  display: 'swap',
  preload: false,
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--lw-font-montserrat',
  display: 'swap',
  preload: false,
});

export const fontClass = [plexArabic.variable, plexSans.variable, tajawal.variable, montserrat.variable].join(' ');
