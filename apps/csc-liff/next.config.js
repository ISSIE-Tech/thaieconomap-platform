const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // monorepo: trace from repo root so standalone emits apps/csc-liff/server.js
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

module.exports = nextConfig
