import type { Metadata } from 'next';

import { CONFIG } from 'src/config-global';
import { ShopPage } from 'src/modules/shop-page/shop-page';
import { endpoints } from 'src/shared/configs/endpoints.config';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${CONFIG.site.serverUrl}${endpoints.commercials.details(id)}`, {
      next: { revalidate: 3600 },
    });
    const { data } = await res.json();

    return {
      title: `${data.name} | Thai Economap`,
      description: [data.moreInfo, data.address].filter(Boolean).join(' · ') || undefined,
      openGraph: data.imageUrl ? { images: [data.imageUrl] } : undefined,
    };
  } catch {
    return { title: 'Thai Economap' };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ShopPage id={id} />;
}
