'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';

export default function PumpuangPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/jobs/jobs-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  return <Map />;
}
