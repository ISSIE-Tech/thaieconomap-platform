'use client';

import type { Map as LeafletMap } from 'leaflet';
import type { MapContainerProps } from 'react-leaflet';

import 'leaflet-defaulticon-compatibility';
import { TileLayer, MapContainer as LeafletMapContainer } from 'react-leaflet';
import { useRef, useState, useEffect, type LegacyRef, type ReactNode } from 'react';

interface Props extends MapContainerProps {
  ref?: LegacyRef<LeafletMap>;
  children?: ReactNode;
}

export const MapContainer = ({ ref, children, ...props }: Props) => {
  const tileRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      tileRef.current
        .getContainer()
        .style.setProperty('filter', `brightness(${110}%) contrast(${90}%) hue-rotate(${20}deg)`);
    }
  }, [mapLoaded]);

  // NOTE: MapContainer props are immutable: changing them after they have been set a first time will have no effect
  // on the Map instance or its container.
  return (
    <LeafletMapContainer
      ref={ref}
      zoom={props.zoom ?? 12}
      zoomControl={false}
      style={{ flexGrow: 1 }}
      whenReady={() => setMapLoaded(true)}
      {...props}
    >
      <TileLayer
        ref={tileRef}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafletMapContainer>
  );
};

/*
Leaflet Map can't be used without dynamic import due to NextJS's SSR, and it can only be imported in page.tsx

Example import:

  const Map = useMemo(
    () =>
      dynamic(() => import("@/sections/economap/economap-drawer"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
*/
