'use client';

import { Marker } from 'react-leaflet';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { STORAGE_KEY } from 'src/shared/components/constants';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { MapControls } from 'src/shared/components/map-sidebar';
import { jobMarker, userMarker, activeJobMarker } from 'src/shared/components/leaflet-map/map';
import {
  MapSetter,
  MapContainer,
  DialogCluster,
  LocationMarkers,
} from 'src/shared/components/leaflet-map';

import Stack from '@mui/material/Stack';

import useGetJob from './_hooks/use-get-job';
import { useJobsStore } from './_store/jobs.store';
import useGetTinyJobs from './_hooks/use-get-tiny-jobs';
import { JobsDetailDrawer } from './jobs-detail-drawer';
import { DEFAULT_COORDINATE } from '../commercials/_config';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';

export default function JobsMap() {
  const { setMap, setSelectedId } = useJobsStore((state) => state.actions);
  const map = useJobsStore((state) => state.map);
  const isDesktop = useIsDesktop();

  // tiny jobs
  const { data: tinyJobs, isLoading } = useGetTinyJobs();
  // selected job: drawer on mobile, the desktop sidebar shows it instead
  const jobId = useJobsStore((state) => state.selectedId);
  const hoveredId = useJobsStore((state) => state.hoveredId);
  const detailDrawerController = useBoolean();
  const { data: job } = useGetJob({ jobId });
  const openJobDetailDrawer = (id: string) => {
    setSelectedId(id);
    if (!isDesktop) detailDrawerController.onTrue();
  };

  // user geolocation
  const geolocation = useGeolocationStore((state) => state.geolocation);

  return (
    <Stack width="100%" height="100%" position="relative">
      <MapContainer center={geolocation ?? DEFAULT_COORDINATE}>
        {/* user location */}
        {geolocation && <Marker position={geolocation} icon={userMarker} />}

        <DialogCluster storageKey={STORAGE_KEY.JOB_DIALOG_OPENED} type="งาน">
          <LocationMarkers
            isLoading={isLoading}
            locations={tinyJobs}
            onMarkerClick={openJobDetailDrawer}
            markerIcon={jobMarker}
            activeMarkerIcon={activeJobMarker}
            activeId={hoveredId || jobId}
          />
        </DialogCluster>

        <JobsDetailDrawer controller={detailDrawerController} job={job} />

        <MapSetter setMap={setMap} />
      </MapContainer>

      <MapControls map={map} zoom={isDesktop} />
    </Stack>
  );
}
