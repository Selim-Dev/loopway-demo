/**
 * The bilingual contract.
 *
 * `ar.ts` and `en.ts` are both typed `Dictionary`, so a key that exists in one
 * language and not the other is a compile error rather than a blank section on
 * a live page. Add a field here first, then to both files — in that order.
 */

export type Locale = 'ar' | 'en';

export const LOCALES: Locale[] = ['ar', 'en'];
export const DEFAULT_LOCALE: Locale = 'ar';

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Stage {
  /** Short label on the road waypoint. */
  short: string;
  /** Full stage name in the how-it-works timeline. */
  title: string;
  body: string;
}

export interface FeatureRow {
  /** SRS business-rule code, shown as a small monospace credential. */
  rule: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Two or three short supporting points. */
  points: string[];
}

export interface PlatformCard {
  name: string;
  role: string;
  /** Live URL, or null when the platform is not shipped yet. */
  href: string | null;
  /** Badge text: "عرض توضيحي" / "قريباً". */
  status: string;
  /** True for the one platform that is the primary public entry point. */
  primary?: boolean;
}

export interface RuleCard {
  code: string;
  title: string;
  body: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    links: NavLink[];
    cta: string;
    switchTo: string;
    switchToShort: string;
    skipToContent: string;
  };
  hero: {
    eyebrow: string;
    /** Rendered as three display lines; the middle one takes the green rule. */
    titleLines: [string, string, string];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Caption under the live product panel. */
    liveCaption: string;
    /** Caption shown only on /en, explaining why the panels stay Arabic. */
    productLanguageNote: string | null;
    tripLabel: string;
    /** Caption above the wallet card. Site chrome, so it translates — the label
     *  inside the card itself is product content and stays Arabic. */
    walletLabel: string;
  };
  proof: {
    items: { value: string; label: string }[];
  };
  how: {
    eyebrow: string;
    title: string;
    lead: string;
    stages: Stage[];
  };
  features: {
    eyebrow: string;
    title: string;
    lead: string;
    rows: FeatureRow[];
  };
  platforms: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: PlatformCard[];
    open: string;
  };
  rules: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: RuleCard[];
  };
  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    columns: { title: string; links: NavLink[] }[];
    legal: string;
    note: string;
  };
}
