'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { CommercialLoading } from 'src/modules/commercials/commercial-loading';
import useGetTinySharings from 'src/modules/sharings/_hooks/use-get-tiny-sharings';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';

export default function SharingPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/sharings/sharing-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  const geolocation = useGeolocationStore((state) => state.geolocation);

  const searchParams = useSearchParams();

  // query filter (sharing)
  const status = searchParams.get('status');
  const location = searchParams.get('location');
  const district = searchParams.get('district');

  const { data: tinySharings, isLoading } = useGetTinySharings({
    ...(location && { location }),
    ...(geolocation && {
      latitude: geolocation[0].toString(),
      longitude: geolocation[1].toString(),
    }),
    ...(status && { status }),
    ...(district && { district }),
  });

  return <Map tinySharings={tinySharings ?? []} isLoading={isLoading} />;
}
