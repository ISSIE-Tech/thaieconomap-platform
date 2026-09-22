import React from 'react';
import { LatLngTuple } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';

type Props = {
  setCenter: (center: LatLngTuple) => void;
};

export default function MapCenter({ setCenter }: Props) {
  const map = useMap();

  useMapEvents({
    dragend: (e) => {
      setCenter([map.getCenter().lat, map.getCenter().lng]);
    },
  });

  return <></>;
}
