'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

import dynamic from 'next/dynamic';
import 'leaflet-defaulticon-compatibility';
import { useWatch } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import { DEFAULT_COORDINATE } from 'src/modules/economap/_config/economap-default-location';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

export default function CommercialLocationForm() {
  const location = useWatch({ name: 'location' });
  const defaultLocation = { latitude: 0, longitude: 0 };
  const [center, setCenter] = useState(defaultLocation);

  // ----------------------------------------------------------------------

  const Map = useMemo(
    () =>
      dynamic(() => import('../../../../../components/hook-form/custom-hook-form/location-map'), {
        loading: () => <p>Map loading...</p>,
        ssr: false,
      }),
    []
  );

  // ----------------------------------------------------------------------

  const geolocation = useGeolocationStore((state) => state.geolocation);

  useEffect(() => {
    if (
      location.latitude === defaultLocation.latitude &&
      location.longitude === defaultLocation.longitude &&
      geolocation
    ) {
      /** ********************************************************
       * to set default location to user location for first render
       ******************************************************** */
      setCenter({ latitude: geolocation[0], longitude: geolocation[1] });
    } else if (
      location.latitude === defaultLocation.latitude &&
      location.longitude === defaultLocation.longitude &&
      !geolocation
    ) {
      setCenter({
        latitude: DEFAULT_COORDINATE[0],
        longitude: DEFAULT_COORDINATE[1],
      });
    } else {
      /** *************************************************************************************************
       * in case of edit commercial,we already have location. so we defind center of map to that location
       ************************************************************************************************** */
      setCenter({ latitude: location.latitude, longitude: location.longitude });
    }
  }, [location, setCenter, geolocation, defaultLocation.latitude, defaultLocation.longitude]);

  return (
    <Card>
      <CardHeader
        title="ตำแหน่งของร้าน"
        subheader="คลิกเลือกตำแหน่งของร้านบนแผนที่"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Box width="100%" height="50vh" p={3}>
        <Map center={[center.latitude, center.longitude]} />
      </Box>
    </Card>
  );
}
