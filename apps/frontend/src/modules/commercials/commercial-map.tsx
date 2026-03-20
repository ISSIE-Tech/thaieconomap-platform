'use client';

import type { MarkerCluster } from 'leaflet';

import { Marker } from 'react-leaflet';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import { STORAGE_KEY } from 'src/shared/components/constants';
import {
  userMarker,
  commercialMarker,
  activeCommercialMarker,
} from 'src/shared/components/leaflet-map/map';
import {
  MapSetter,
  MapContainer,
  LocationMarkers,
  OverlappingCluster,
} from 'src/shared/components/leaflet-map';

import { DEFAULT_COORDINATE } from './_config';
import { OverlappingDrawer } from './overlapping-drawer';
import useGetCommercial from './_hooks/use-get-commercial';
import { CommercialDrawer } from './commercial-detail-drawer';
import { useCommercialStore } from './_store/commercials.store';
import useCoordCommercialMap from './_hooks/use-coord-commercial-map';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';

import type { CommercialTiny } from './_types/commercials.type';

type Props = {
  tinyCommercials: CommercialTiny[];
  isLoading: boolean;
  lastViewedCoord: [number, number] | null;
  lastZoom: number | null;
  type: string;
};

export default function CommercialMap({
  tinyCommercials,
  isLoading,
  lastViewedCoord,
  lastZoom,
  type,
}: Props) {
  const setMap = useCommercialStore((state) => state.setMap);

  // user geolocation
  const geolocation = useGeolocationStore((state) => state.geolocation);

  return (
    <Stack width="100%" height="100%" position="relative">
      {/* ref={setMap} doesn't work so I have to use <MapSetter /> */}
      <MapContainer
        center={lastViewedCoord ?? geolocation ?? DEFAULT_COORDINATE}
        zoom={lastZoom ?? 12}
      >
        <MarkersGroup tinyCommercials={tinyCommercials} isLoading={isLoading} type={type} />

        {/* user location */}
        {geolocation && <Marker position={geolocation} icon={userMarker} />}

        <MapSetter setMap={setMap} />
      </MapContainer>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type MarkersGroupProps = {
  tinyCommercials: CommercialTiny[];
  isLoading: boolean;
  type: string;
};

const MarkersGroup = ({ tinyCommercials, isLoading, type }: MarkersGroupProps) => {
  // commercial drawer
  const [commercialId, setCommercialId] = useState('');
  const { data: commercial } = useGetCommercial({ commercialId });
  const detailDrawerController = useBoolean();
  const onCommercialClick = useCallback(
    (id: string) => {
      setCommercialId(id);
      detailDrawerController.onTrue();
    },
    [detailDrawerController]
  );

  // Overlapping cluster
  const overlappingDrawerController = useBoolean();
  const [commercialLatLngs, setCommercialLatLngs] = useState<string[]>([]);
  const { overlappingCommercials, category } = useCoordCommercialMap({
    tinyCommercials,
    uniqueLatLngs: commercialLatLngs,
  });

  // remove duplicate lat,lng so that locations at the same coord don't show up twice
  const removeDups = (arr: string[]): string[] => {
    const uniques = new Set(arr);
    return Array.from(uniques);
  };

  const handleOverlappingClick = useCallback(
    (cluster: MarkerCluster) => {
      overlappingDrawerController.onTrue();

      // can't get ids so we use lat,lng to find every location in the overlapping marker
      const latLngs = cluster
        .getAllChildMarkers()
        .map((marker) => `${[marker.getLatLng().lat, marker.getLatLng().lng]}`);

      // give all unique lat,lng to find location based on lat,lng
      setCommercialLatLngs(removeDups(latLngs));
    },
    [overlappingDrawerController]
  );

  return (
    <>
      <OverlappingCluster
        storageKey={STORAGE_KEY.COMMERCIAL_DIALOG_OPENED}
        type={type}
        onOverlappingClick={handleOverlappingClick}
      >
        <LocationMarkers
          isLoading={isLoading}
          locations={tinyCommercials}
          onMarkerClick={onCommercialClick}
          markerIcon={commercialMarker}
          activeMarkerIcon={activeCommercialMarker}
        />
      </OverlappingCluster>

      <OverlappingDrawer
        controller={overlappingDrawerController}
        overlappingCommercials={overlappingCommercials}
        category={category}
        onCommercialClick={onCommercialClick}
      />

      <CommercialDrawer controller={detailDrawerController} commercial={commercial} />
    </>
  );
};
