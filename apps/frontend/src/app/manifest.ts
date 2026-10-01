import type { MetadataRoute } from 'next';

import { SITE_NAME, SITE_NAME_TH, SITE_DESCRIPTION } from 'src/shared/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} | ${SITE_NAME_TH}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: 'th',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0061a8',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
