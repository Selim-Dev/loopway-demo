import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @loopway/ui ships raw TS/TSX + CSS Modules; Next compiles it in-place so the
  // package needs no build step of its own.
  transpilePackages: ['@loopway/ui'],
  // This app is a workspace member, so its dependencies resolve above its own
  // directory. Pointing file tracing at the repo root stops the build from
  // guessing — which is what makes a monorepo deploy (Vercel "Root Directory =
  // apps/b2b") trace @loopway/ui correctly instead of dropping it.
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
