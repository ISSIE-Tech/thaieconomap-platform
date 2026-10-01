'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMapStore } from 'src/shared/stores/map';
import { DATA_NAME_THAI } from 'src/shared/components/constants';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';
import { useTinyCommercialsFromUrl } from 'src/modules/commercials/_hooks/use-tiny-commercials-from-url';

export default function RestaurantsPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/commercials/commercial-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  const { data: tinyCommercials, isLoading } = useTinyCommercialsFromUrl('RESTAURANT');

  const lastViewedCoord = useMapStore((state) => state.commercialLastViewedCoord);
  const zoom = useMapStore((state) => state.commercialLastZoom);

  return (
    <Map
      tinyCommercials={tinyCommercials ?? []}
      isLoading={isLoading}
      lastViewedCoord={lastViewedCoord}
      lastZoom={zoom}
      type={DATA_NAME_THAI.RESTAURANT}
    />
  );
}
