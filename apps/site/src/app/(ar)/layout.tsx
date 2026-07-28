import type { Metadata } from 'next';
import { buildMetadata, LocaleRoot } from '../rootLayout';

export const metadata: Metadata = buildMetadata('ar');

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <LocaleRoot locale="ar">{children}</LocaleRoot>;
}
