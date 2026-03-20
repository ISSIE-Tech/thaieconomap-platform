'use client';

import { useState } from 'react';
import { Marker } from 'react-leaflet';

import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/shared/hooks/use-boolean';
import { STORAGE_KEY } from 'src/shared/components/constants';
import { jobMarker, userMarker, activeJobMarker } from 'src/shared/components/leaflet-map/map';
import {
  MapSetter,
  MapContainer,
  DialogCluster,
  LocationMarkers,
} from 'src/shared/components/leaflet-map';

import useGetJob from './_hooks/use-get-job';
import { useJobsStore } from './_store/jobs.store';
import useGetTinyJobs from './_hooks/use-get-tiny-jobs';
import { JobsDetailDrawer } from './jobs-detail-drawer';
import { DEFAULT_COORDINATE } from '../commercials/_config';
import { useGeolocationStore } from '../geolocation/_store/geolocation.store';

export default function JobsMap() {
  const { setMap } = useJobsStore((state) => state.actions);

  // tiny jobs
  const { data: tinyJobs, isLoading } = useGetTinyJobs();
  // selected job
  const [jobId, setJobId] = useState('');
  const detailDrawerController = useBoolean();
  const { data: job } = useGetJob({ jobId });
  const openJobDetailDrawer = (id: string) => {
    setJobId(id);
    detailDrawerController.onTrue();
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
          />
        </DialogCluster>

        <JobsDetailDrawer controller={detailDrawerController} job={job} />

        <MapSetter setMap={setMap} />
      </MapContainer>
    </Stack>
  );
}
