import type { MetadataRoute } from 'next';

import { SITE_URL, IS_INDEXABLE } from 'src/shared/seo';

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } };

  return {
    // AI search/answer crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…)
    // fall under "*" too: the map is public community data and should be findable there.
    rules: { userAgent: '*', allow: '/', disallow: ['/account', '/create', '/auth', '/map-test'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
