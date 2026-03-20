'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import { CommercialLoading } from 'src/modules/commercials/commercial-loading';

export default function FavoritePage() {
  const Favorites = useMemo(
    () =>
      dynamic(() => import('src/modules/favorites/favorites'), {
        loading: () => <CommercialLoading isFullScreen />,
        ssr: false,
      }),
    []
  );

  return <Favorites />;
}
