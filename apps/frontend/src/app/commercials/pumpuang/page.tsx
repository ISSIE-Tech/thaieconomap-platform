'use client';

// import Image from 'next/image';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// import { CONFIG } from 'src/config-global';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';

export default function PumpuangPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/modules/pumpuangs/pumpuang-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );
  
  return <Map />;
}
