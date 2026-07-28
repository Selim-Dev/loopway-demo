import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@loopway/ui'],
  // See apps/b2b/next.config.mjs — same monorepo tracing fix.
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
