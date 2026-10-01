'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';
import useGetTinySharings from 'src/modules/sharings/_hooks/use-get-tiny-sharings';

export default function SharingPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/sharings/sharing-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  const { data: tinySharings, isLoading } = useGetTinySharings();

  return <Map tinySharings={tinySharings ?? []} isLoading={isLoading} />;
}
