'use client';

import { Marker } from 'react-leaflet';
import { MapContainer } from 'src/shared/components/leaflet-map';
import { activeCommercialMarker } from 'src/shared/components/leaflet-map/map';

// Static preview: every interaction off, so it scrolls with the page.
export default function ShopMiniMap({ coord }: { coord: [number, number] }) {
  return (
    <MapContainer
      center={coord}
      zoom={17}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
      style={{ height: 220, width: '100%' }}
    >
      <Marker position={coord} icon={activeCommercialMarker} interactive={false} />
    </MapContainer>
  );
}
