const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // monorepo: trace from repo root so standalone emits apps/csc-liff/server.js
  // ponytail: @types/react 18 (here) clashes with 19 (workspace peers) until the deps upgrade; remove then
  typescript: { ignoreBuildErrors: true },
  experimental: { outputFileTracingRoot: path.join(__dirname, '../../') },
}

module.exports = nextConfig
