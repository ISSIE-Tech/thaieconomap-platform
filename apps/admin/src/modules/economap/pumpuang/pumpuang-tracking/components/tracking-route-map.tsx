import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import 'leaflet/dist/leaflet.css';

type Props = {
  routePoints: [number, number][];
};

function FitBounds({ routePoints }: { routePoints: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (routePoints.length > 0) {
      const bounds = L.latLngBounds(routePoints.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, routePoints]);

  return null;
}

export default function TrackingRouteMap({ routePoints }: Props) {
  if (routePoints.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 400,
        }}
      >
        <Typography color="text.secondary">ไม่มีข้อมูลเส้นทางในช่วงเวลานี้</Typography>
      </Box>
    );
  }

  const center = routePoints[0];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', minHeight: 500, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={routePoints}
        pathOptions={{ color: '#1976d2', weight: 4, opacity: 0.8 }}
      />
      <FitBounds routePoints={routePoints} />
    </MapContainer>
  );
}
