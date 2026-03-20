'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';

import Map from '../../../modules/economap/commercial/commercial-map/map';

type Props = {
  center: [number, number];
};

export default function LocationMap({ center }: Props) {
  const { setValue } = useFormContext();
  const isFirstRender = useBoolean(true);

  const MapEvents = () => {
    useMapEvents({
      moveend: (event) => {
        const map = event.target;
        const mapCenter = map.getCenter();

        setValue('location', { latitude: mapCenter.lat, longitude: mapCenter.lng });
      },
    });

    return null;
  };

  /** ***********************************************
   * to set default value of location to current location
   *********************************************** */
  useEffect(() => {
    if (isFirstRender.value) {
      setValue('location', { latitude: center[0], longitude: center[1] });
      isFirstRender.onFalse();
    }
  }, [isFirstRender, setValue, center]);

  return (
    <Map posix={center}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          zIndex: 1000,
          transform: 'translate(-50%, -43px)',
        }}
      >
        <Image
          src="/assets/icons/active-commercial-node.svg"
          alt="location"
          height={40}
          width={40}
        />
      </Box>
      <MapEvents />
    </Map>
  );
}
