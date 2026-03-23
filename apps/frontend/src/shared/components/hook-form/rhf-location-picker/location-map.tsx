'use client';

import type { Dispatch, SetStateAction } from 'react';

import Image from 'next/image';
import { useMapEvents } from 'react-leaflet';
import { MapContainer } from 'src/shared/components/leaflet-map';

import Box from '@mui/material/Box';

type Props = {
  setLocation: Dispatch<SetStateAction<{ latitude: number; longitude: number }>>;
  center: [number, number];
};

export default function LocationMap({ setLocation, center }: Props) {
  const MapEvents = () => {
    useMapEvents({
      moveend: (event) => {
        const map = event.target;
        const mapCenter = map.getCenter();

        setLocation({ latitude: mapCenter.lat, longitude: mapCenter.lng });
      },
    });

    return null;
  };

  return (
    <MapContainer center={center}>
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
    </MapContainer>
  );
}
