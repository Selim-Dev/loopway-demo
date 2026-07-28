import { getDictionary, type Locale } from '@/content';
import { Hero } from './Hero';
import { SiteNav } from './SiteNav';
import { CtaBand, Features, Footer, HowItWorks, Platforms, Proof, Rules } from './Sections';

/**
 * The page, composed. Both locale routes render this with a different `locale`
 * — there is one layout and one set of components, so the two languages cannot
 * drift apart structurally, only in their copy.
 */
export function LandingPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <>
      <SiteNav t={t} locale={locale} />
      <main id="main">
        <Hero t={t} rtl={locale === 'ar'} />
        <Proof t={t} />
        <HowItWorks t={t} />
        <Features t={t} />
        <Platforms t={t} />
        <Rules t={t} />
        <CtaBand t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
