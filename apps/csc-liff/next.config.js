const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // monorepo: trace from repo root so standalone emits apps/csc-liff/server.js
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    // category icons and job photos are served as presigned urls from the bucket
    remotePatterns: [{ protocol: 'https', hostname: 's3.issie.dev' }],
  },
}

module.exports = nextConfig
