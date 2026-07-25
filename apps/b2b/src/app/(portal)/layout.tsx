import { Shell } from '@/components/Shell';

/** Everything inside the signed-in portal renders in the rail + header shell. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
