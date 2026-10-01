import { cache } from 'react';
import { serverApiUrl } from 'src/config-global';
import { endpoints } from 'src/shared/configs/endpoints.config';

// Server-side shop data for metadata, structured data, the sitemap and llms.txt.

export type ShopSummary = { _id: string; name: string; category: 'RESTAURANT' | 'BUSINESS' };

export type ShopDetail = ShopSummary & {
  imageUrl?: string;
  phoneNumber?: string;
  moreInfo?: string;
  location?: { coordinates: [number, number] };
  district?: { districtName?: string; provinceName?: string };
  types?: { name: string }[];
  displayOpening?: { days: string; time: { open: string; close: string }[] }[];
};

/** Every approved shop (id, name, category). Empty when the API is unreachable, so builds never fail on it. */
export async function getShops(): Promise<ShopSummary[]> {
  try {
    const res = await fetch(serverApiUrl(endpoints.commercials.list), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const { data } = await res.json();
    return data;
  } catch {
    return [];
  }
}

/** null when the shop doesn't exist (404, or an id that isn't one); throws on other failures. */
export const getShop = cache(async (id: string): Promise<ShopDetail | null> => {
  const res = await fetch(serverApiUrl(endpoints.commercials.details(id)), { next: { revalidate: 3600 } });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to load shop ${id}: HTTP ${res.status}`);
  const { data } = await res.json();
  return data;
});

// ----------------------------------------------------------------------

const DAY_OF_WEEK: Record<string, string> = {
  วันจันทร์: 'Monday',
  วันอังคาร: 'Tuesday',
  วันพุธ: 'Wednesday',
  วันพฤหัสบดี: 'Thursday',
  วันศุกร์: 'Friday',
  วันเสาร์: 'Saturday',
  วันอาทิตย์: 'Sunday',
};

const hhmm = (t: string) => t.replace('.', ':').padStart(5, '0');

/** schema.org Restaurant / LocalBusiness for a shop page. */
export function shopJsonLd(shop: ShopDetail, url: string) {
  const [lng, lat] = shop.location?.coordinates ?? [];
  const region = shop.district;

  return {
    '@context': 'https://schema.org',
    '@type': shop.category === 'RESTAURANT' ? 'Restaurant' : 'LocalBusiness',
    '@id': `${url}#shop`,
    name: shop.name,
    url,
    image: shop.imageUrl || undefined,
    telephone: shop.phoneNumber || undefined,
    description: shop.moreInfo || undefined,
    ...(shop.category === 'RESTAURANT' && shop.types?.length
      ? { servesCuisine: shop.types.map((t) => t.name) }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: region?.districtName,
      addressRegion: region?.provinceName,
      addressCountry: 'TH',
    },
    geo: lat != null && lng != null ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } : undefined,
    openingHoursSpecification: shop.displayOpening?.flatMap(({ days, time }) =>
      DAY_OF_WEEK[days]
        ? time.map(({ open, close }) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${DAY_OF_WEEK[days]}`,
            opens: hhmm(open),
            closes: hhmm(close),
          }))
        : []
    ),
  };
}
