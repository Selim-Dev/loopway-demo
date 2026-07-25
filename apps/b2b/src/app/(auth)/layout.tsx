/**
 * Auth pages sit outside the portal shell — there is no rail or account chip
 * before sign-in. DERIVED, NOT DESIGNED (SRS M03-E01).
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
