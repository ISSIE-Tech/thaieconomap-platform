import type { MetadataRoute } from 'next';

import { absoluteUrl } from 'src/shared/seo';
import { paths } from 'src/shared/routes/paths.config';
import { getShops } from 'src/modules/shop-page/shop.server';

export const revalidate = 3600;

const PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: paths.commercials.restaurants, priority: 1, changeFrequency: 'daily' },
  { path: paths.commercials.businesses, priority: 0.9, changeFrequency: 'daily' },
  { path: paths.commercials.pumpuang, priority: 0.7, changeFrequency: 'daily' },
  { path: paths.jobs, priority: 0.8, changeFrequency: 'daily' },
  { path: paths.sharings, priority: 0.7, changeFrequency: 'daily' },
  { path: paths.announcements.root, priority: 0.6, changeFrequency: 'daily' },
  { path: paths.about, priority: 0.6, changeFrequency: 'monthly' },
  { path: paths.legal.terms, priority: 0.2, changeFrequency: 'monthly' },
  { path: paths.legal.privacy, priority: 0.2, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getShops();

  return [
    ...PAGES.map(({ path, priority, changeFrequency }) => ({ url: absoluteUrl(path), priority, changeFrequency })),
    ...shops.map((shop) => ({
      url: absoluteUrl(paths.shop(shop._id)),
      priority: 0.5,
      changeFrequency: 'weekly' as const,
    })),
  ];
}
