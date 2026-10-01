'use client';

import { useEffect } from 'react';
import { Marker } from 'react-leaflet';
import { useMapStore } from 'src/shared/stores/map';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { MapControls } from 'src/shared/components/map-sidebar';
import { userMarker } from 'src/shared/components/leaflet-map/map';
import { MapSetter, MapContainer } from 'src/shared/components/leaflet-map';

import Stack from '@mui/material/Stack';

import { PumpuangDrawer } from './detail-drawer';
import useGetPumpuangById from './_hooks/use-get-pumpuang';
import { DEFAULT_COORDINATE } from '../commercials/_config';
import useGetTinyPumpuangs from './_hooks/use-get-tiny-pumpuangs';
import { PumpuangLocationMarkers } from './pumpuang-location-markers';
import { useCommercialStore } from '../commercials/_store/commercials.store';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';

export default function PumpuangMap() {
  const setMap = useCommercialStore((state) => state.setMap);
  const map = useCommercialStore((state) => state.map);
  const isDesktop = useIsDesktop();
  const lastViewedCoord = useMapStore((state) => state.commercialLastViewedCoord);
  const lastZoom = useMapStore((state) => state.commercialLastZoom);

  // tiny pumpuangs
  const { data: tinyPumpuangs } = useGetTinyPumpuangs();

  // pumpuang and drawer; the desktop sidebar list selects through the same store
  const pumpuangId = useCommercialStore((state) => state.selectedId);
  const setPumpuangId = useCommercialStore((state) => state.setSelectedId);
  const drawer = useBoolean();
  const detailDrawerController = {
    ...drawer,
    onFalse: () => {
      drawer.onFalse();
      setPumpuangId('');
    },
  };
  const openPumpuangDrawer = setPumpuangId;
  const openDrawer = drawer.onTrue;
  useEffect(() => {
    if (pumpuangId) openDrawer();
  }, [pumpuangId, openDrawer]);
  const { data: pumpuang, isLoading } = useGetPumpuangById(pumpuangId ?? '');

  // user geolocation
  const geolocation = useGeolocationStore((state) => state.geolocation);

  return (
    <Stack width="100%" height="100%" position="relative">
      {/* The react leaflet MapContainer doesn't have whenCreated? whenReady doesn't have map */}
      {/* ref={setMap} doesn't work */}
      <MapContainer
        center={lastViewedCoord ?? geolocation ?? DEFAULT_COORDINATE}
        zoom={lastZoom ?? 12}
      >
        {/* user location */}
        {geolocation && <Marker position={geolocation} icon={userMarker} />}

        <PumpuangLocationMarkers
          isLoading={isLoading}
          locations={tinyPumpuangs}
          onMarkerClick={openPumpuangDrawer}
        />

        <PumpuangDrawer controller={detailDrawerController} pumpuang={pumpuang} />

        <MapSetter setMap={setMap} />
      </MapContainer>

      <MapControls map={map} zoom={isDesktop} />
    </Stack>
  );
}
