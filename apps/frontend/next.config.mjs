/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  // A real HTTP redirect: a redirect() in app/page.tsx streams as 200 because the root layout wraps pages in <Suspense>.
  async redirects() {
    return [{ source: '/', destination: '/commercials/restaurants', permanent: false }];
  },
};

export default nextConfig;
