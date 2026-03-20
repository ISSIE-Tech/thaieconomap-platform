'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { useMapStore } from 'src/shared/stores/map';
import { DATA_NAME_THAI } from 'src/shared/components/constants';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import useGetTinyRestaurants from 'src/modules/commercials/_hooks/use-get-tiny-restaurants';

export default function RestaurantsPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/commercials/commercial-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  const searchParams = useSearchParams();
  // query filter
  const workingHour = searchParams.get('workingHour');
  const location = searchParams.get('location');
  const types = searchParams.get('types');

  const geolocation = useGeolocationStore((state) => state.geolocation);

  const { data: tinyCommercials, isLoading } = useGetTinyRestaurants({
    ...(location && { location }),
    ...(workingHour && { workingHour }),
    ...(geolocation && {
      latitude: geolocation[0].toString(),
      longitude: geolocation[1].toString(),
    }),
    ...(types && { types }),
  });

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
