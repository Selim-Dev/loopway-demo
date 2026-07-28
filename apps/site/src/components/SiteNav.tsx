'use client';

import * as React from 'react';
import { Icon } from '@loopway/ui';
import { LINKS, type Dictionary, type Locale } from '@/content';
import styles from './SiteNav.module.css';

/**
 * Sticky top nav.
 *
 * It starts transparent over the navy hero and gains its surface once the page
 * scrolls past it — the only scroll-driven behaviour on the site, and it is
 * functional (legibility over a light background) rather than decorative.
 */
export function SiteNav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [solid, setSolid] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet on Esc, and lock the page behind it.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const otherHref = otherLocale === 'ar' ? '/' : '/en';

  return (
    <>
      <a className={styles.skip} href="#main">
        {t.nav.skipToContent}
      </a>

      <header className={solid ? `${styles.nav} ${styles.solid}` : styles.nav}>
        <div className={`mkShell ${styles.inner}`}>
          <a className={styles.brand} href={locale === 'ar' ? '/' : '/en'} aria-label="LoopWay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/loopway-logo.png" alt="" className={styles.mark} width={44} height={24} />
            <span className={styles.wordmark}>LoopWay</span>
          </a>

          <nav className={styles.links} aria-label={t.nav.links.map((l) => l.label).join(', ')}>
            {t.nav.links.map((l) => (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={styles.right}>
            <a className={styles.lang} href={otherHref} hrefLang={otherLocale} lang={otherLocale}>
              {t.nav.switchTo}
            </a>
            <a className={styles.cta} href={LINKS.b2b} target="_blank" rel="noreferrer">
              {t.nav.cta}
              <Icon name="arrowOut" size={15} />
            </a>
            <button
              type="button"
              className={styles.burger}
              aria-expanded={open}
              aria-label={t.nav.links[0]?.label}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? 'close' : 'list'} size={20} />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className={styles.sheet}>
          <nav className={styles.sheetLinks}>
            {t.nav.links.map((l) => (
              <a key={l.href} href={l.href} className={styles.sheetLink} onClick={() => setOpen(false)}>
                {l.label}
                <Icon name="chevronLeft" size={17} />
              </a>
            ))}
          </nav>
          <div className={styles.sheetFoot}>
            <a className={styles.sheetLang} href={otherHref} hrefLang={otherLocale} lang={otherLocale}>
              {t.nav.switchTo}
            </a>
            <a className={styles.sheetCta} href={LINKS.b2b} target="_blank" rel="noreferrer">
              {t.nav.cta}
              <Icon name="arrowOut" size={16} />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
