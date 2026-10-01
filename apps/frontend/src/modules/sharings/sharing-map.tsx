'use client';

import { useState } from 'react';
import { Marker } from 'react-leaflet';
import { useSearchParams } from 'next/navigation';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { STORAGE_KEY } from 'src/shared/components/constants';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { MapControls } from 'src/shared/components/map-sidebar';
import { SearchInput } from 'src/shared/components/custom-inputs';
import { FilterBtn } from 'src/shared/components/custom-buttons/filter-btn';
import {
  userMarker,
  sharingMarker,
  activeSharingMarker,
} from 'src/shared/components/leaflet-map/map';
import {
  MapSetter,
  MapContainer,
  DialogCluster,
  LocationMarkers,
} from 'src/shared/components/leaflet-map';

import Stack from '@mui/material/Stack';

import useGetSharing from './_hooks/use-get-sharing';
import { SharingFilterDrawer } from './filter-drawer';
import { SharingDrawer } from './sharing-detail-drawer';
import { useSharingStore } from './_store/sharing.store';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';
import { DistrictSearchDrawer } from '../commercials/search-drawer/district-search-drawer';
import {
  type SharingTiny,
  type StatusFilter,
  getIsSharingDefault,
  type LocationFilter,
} from './_types/sharing.type';

type Props = {
  tinySharings: SharingTiny[];
  isLoading: boolean;
};

export default function SharingMap({ tinySharings, isLoading }: Props) {
  const setMap = useSharingStore((state) => state.setMap);

  const map = useSharingStore((state) => state.map);
  const isDesktop = useIsDesktop();

  // Sharing: drawer on mobile, the desktop sidebar shows the selected sharing instead
  const sharingId = useSharingStore((state) => state.selectedId);
  const setSharingId = useSharingStore((state) => state.setSelectedId);
  const hoveredId = useSharingStore((state) => state.hoveredId);
  const detailDrawerController = useBoolean();
  const { data: sharing } = useGetSharing({ sharingId });
  const openSharingDrawer = (id: string) => {
    setSharingId(id);
    if (!isDesktop) detailDrawerController.onTrue();
  };

  // user geolocation
  const geolocation = useGeolocationStore((state) => state.geolocation);
  const DEFAULT_LOCATION = [13, 100] as [number, number];

  return (
    <Stack width="100%" height="100%" position="relative">
      {!isDesktop && <ControlPanel />}

      {/* TODO: bring back cluster with dialog, maybe */}
      <MapContainer center={geolocation ?? DEFAULT_LOCATION}>
        <DialogCluster storageKey={STORAGE_KEY.SHARING_DIALOG_OPENED} type='สิ่งของ'>
          <LocationMarkers
            isLoading={isLoading}
            locations={tinySharings}
            onMarkerClick={openSharingDrawer}
            markerIcon={sharingMarker}
            activeMarkerIcon={activeSharingMarker}
            activeId={hoveredId || sharingId}
          />
        </DialogCluster>

        {/* user location */}
        {geolocation && <Marker position={geolocation} icon={userMarker} />}

        <SharingDrawer controller={detailDrawerController} sharing={sharing} />

        <MapSetter setMap={setMap} />
      </MapContainer>

      <MapControls map={map} zoom={isDesktop} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

function ControlPanel() {
  const filterController = useBoolean();
  const searchController = useBoolean();
  const [searchedDistrict, setSearchedDistrict] = useState('');

  const map = useSharingStore((state) => state.map);

  const searchParams = useSearchParams();

  // query filter (sharing)
  const status = searchParams.get('status');
  const location = searchParams.get('location');
  const district = searchParams.get('district');

  // filter
  const isSharingDefault = getIsSharingDefault(
    status as StatusFilter,
    location as LocationFilter,
    district
  );

  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        width="100vw"
        position="absolute"
        px={2}
        pt={2}
        alignItems="center"
      >
        <SearchInput
          value={searchedDistrict}
          placeholder="พิมพ์ชื่อเขต/อำเภอ"
          onClick={searchController.onTrue}
        />

        <FilterBtn filterController={filterController} isFilterDefault={isSharingDefault} />
      </Stack>

      {map && (
        <DistrictSearchDrawer
          controller={searchController}
          map={map}
          onClose={(inputDistrict: string) => setSearchedDistrict(inputDistrict)}
        />
      )}

      <SharingFilterDrawer controller={filterController} />
    </>
  );
}
