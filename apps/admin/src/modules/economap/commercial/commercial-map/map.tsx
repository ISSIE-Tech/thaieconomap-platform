'use client';

import 'leaflet/dist/leaflet.css';

import type { PropsWithChildren } from 'react';
import type { LatLngTuple, LatLngExpression } from 'leaflet';

import { TileLayer, MapContainer } from 'react-leaflet';

// ----------------------------------------------------------------------

type Props = {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
};

const defaultValues = {
  zoom: 14,
};

// ----------------------------------------------------------------------

export default function Map({
  posix,
  children,
  zoom = defaultValues.zoom,
}: PropsWithChildren<Props>) {
  return (
    <MapContainer center={posix} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {children}
    </MapContainer>
  );
}
