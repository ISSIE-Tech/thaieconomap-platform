import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  marker?: string;
  latitude: string;
  longitude: string;
  dragging?: boolean;
  borderRadius?: string;
  zoom?: number;
};

const ICON = icon({
  iconUrl: '/assets/icons/map/Marker.svg',
  iconSize: [32, 32],
});

const LeafletMap = ({
  marker,
  latitude,
  longitude,
  children,
  dragging = true,
  borderRadius = '0px',
  zoom = 14,
}: PropsWithChildren<Props>) => {
  const tileRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      tileRef.current
        .getContainer()
        .style.setProperty(
          'filter',
          `brightness(${110}%) contrast(${90}%) hue-rotate(${20}deg)`
        );
    }
  }, [mapLoaded]);

  return (
    <MapContainer
      center={[parseFloat(latitude), parseFloat(longitude)]}
      zoom={zoom}
      zoomControl={false}
      style={{ height: '100%', borderRadius }}
      whenReady={() => setMapLoaded(true)}
      dragging={dragging}
    >
      <TileLayer
        ref={tileRef}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {children}

      {marker && (
        <Marker
          position={[parseFloat(latitude), parseFloat(longitude)]}
          icon={ICON}
        >
          <Tooltip
            direction="right"
            offset={[0, 10]}
            opacity={1}
            permanent
            className="leaflet-tooltip"
          >
            {marker}
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
