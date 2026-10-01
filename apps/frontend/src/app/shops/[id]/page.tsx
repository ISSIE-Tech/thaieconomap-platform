import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { ShopPage } from 'src/modules/shop-page/shop-page';
import { getShop, shopJsonLd } from 'src/modules/shop-page/shop.server';
import { jsonLd, OPEN_GRAPH, absoluteUrl, SITE_NAME_TH } from 'src/shared/seo';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = await getShop((await params).id).catch(() => null);
  if (!shop) return {};

  const kind = shop.category === 'RESTAURANT' ? 'ร้านอาหาร' : 'ธุรกิจชุมชน';
  const place = [shop.district?.districtName, shop.district?.provinceName].filter(Boolean).join(' ');
  const description =
    [shop.moreInfo, shop.types?.map((t) => t.name).join(', '), place && `${kind}ใน${place}`]
      .filter(Boolean)
      .join(' · ') || `${shop.name} บน${SITE_NAME_TH}`;

  return {
    title: place ? `${shop.name} – ${kind} ${place}` : shop.name,
    description,
    alternates: { canonical: `/shops/${shop._id}` },
    openGraph: {
      ...OPEN_GRAPH,
      title: shop.name,
      description,
      url: `/shops/${shop._id}`,
      ...(shop.imageUrl ? { images: [shop.imageUrl] } : {}),
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  // A missing shop is a real 404 (not a soft 404 rendered by the client); API outages still render the client page.
  const shop = await getShop(id).catch(() => undefined);
  if (shop === null) notFound();

  return (
    <>
      {shop && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(shopJsonLd(shop, absoluteUrl(`/shops/${shop._id}`)))}
        />
      )}
      <ShopPage id={id} />
    </>
  );
}
