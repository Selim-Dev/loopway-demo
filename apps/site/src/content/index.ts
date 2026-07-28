import { ar } from './ar';
import { en } from './en';
import type { Dictionary, Locale } from './types';

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export { LOCALES, DEFAULT_LOCALE, dirFor } from './types';
export type { Dictionary, Locale, Stage, FeatureRow, PlatformCard, RuleCard, NavLink } from './types';
export { LINKS } from './links';
