const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // monorepo: trace from repo root so standalone emits apps/csc-liff/server.js
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    // category icons and job photos are served as presigned urls from the bucket.
    // Set NEXT_PUBLIC_STORAGE_URL to your own S3/MinIO origin; the default is
    // the MinIO service in the repo-root docker-compose.yml.
    remotePatterns: [
      (({ protocol, hostname, port }) => ({ protocol: protocol.replace(':', ''), hostname, port }))(
        new URL(process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000'),
      ),
    ],
    // category icons are svg, which the optimiser refuses by default. Icons are
    // uploaded by admins, so the csp below neutralises anything scriptable.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
