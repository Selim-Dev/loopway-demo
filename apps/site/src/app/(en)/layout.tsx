import type { Metadata } from 'next';
import { buildMetadata, LocaleRoot } from '../rootLayout';

export const metadata: Metadata = buildMetadata('en');

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <LocaleRoot locale="en">{children}</LocaleRoot>;
}
