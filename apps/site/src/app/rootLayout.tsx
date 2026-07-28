import '@loopway/ui/styles.css';
import '../styles/marketing.css';
import './globals.css';
import type { Metadata } from 'next';
import { fontClass } from './fonts';
import { dirFor, getDictionary, type Locale } from '@/content';

/**
 * Both root layouts are the same shell with a different locale.
 *
 * WHY TWO ROOT LAYOUTS. `<html lang>` and `<html dir>` have to be correct in
 * the server-rendered markup — a client-side flip would ship the wrong
 * direction on first paint and break RTL for anyone on a slow connection. Next
 * only lets a layout own `<html>` if it is a ROOT layout, so the two locales
 * live in route groups `(ar)` and `(en)`, each with its own.
 *
 * That also gives Arabic the bare `/` URL rather than a redirect, which is
 * right for an Arabic-first product.
 */
export function buildMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  const path = locale === 'ar' ? '/' : '/en';

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: path,
      languages: { ar: '/', en: '/en', 'x-default': '/' },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    icons: { icon: '/loopway-logo.png' },
  };
}

export function LocaleRoot({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} dir={dirFor(locale)} className={fontClass}>
      <body>{children}</body>
    </html>
  );
}
