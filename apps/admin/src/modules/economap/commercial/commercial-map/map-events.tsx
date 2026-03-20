'use client';

import type { LatLng } from 'leaflet';

import { useMapEvents } from 'react-leaflet';

type Props = {
  setLocation: (location: LatLng) => void;
};

// ----------------------------------------------------------------------

export default function MapEvents({ setLocation }: Props) {
  const map = useMapEvents({
    click: (e) => {
      setLocation(e.latlng);
      map.flyTo(e.latlng);
    },
  });

  return null;
}
