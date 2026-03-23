'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';
import { DEFAULT_COORDINATE } from 'src/modules/commercials/_config';
import FormButton from 'src/shared/components/custom-buttons/form-button';
import { CommercialLoading } from 'src/modules/commercials/commercial-loading';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';

import { BackBtn } from '../../custom-buttons';

type LatLng = {
  latitude: number;
  longitude: number;
};

type Props = {
  locationDrawerController: UseBooleanReturn;
  setLocation: Dispatch<SetStateAction<{ latitude: number; longitude: number }>>;
  location: LatLng;
  handleClickOnMap: () => void;
  currentValue: { latitude: number; longitude: number };
};

export function LocationDrawer({
  locationDrawerController,
  setLocation,
  location,
  handleClickOnMap,
  currentValue,
}: Props) {
  const Map = useMemo(
    () =>
      dynamic(() => import('src/shared/components/hook-form/rhf-location-picker/location-map'), {
        loading: () => <CommercialLoading />,
        ssr: false,
      }),
    []
  );

  const geolocation = useGeolocationStore((state) => state.geolocation);

  useEffect(() => {
    if (currentValue.latitude === 0 && geolocation) {
      setLocation({ latitude: geolocation[0], longitude: geolocation[1] });
    } else if (currentValue.latitude === 0 && currentValue.longitude === 0 && !geolocation) {
      setLocation({ latitude: DEFAULT_COORDINATE[0], longitude: DEFAULT_COORDINATE[1] });
    } else {
      setLocation({ latitude: currentValue.latitude, longitude: currentValue.longitude });
    }
  }, [locationDrawerController.value, currentValue, setLocation, geolocation]);

  return (
    <Drawer
      open={locationDrawerController.value}
      onClose={locationDrawerController.onFalse}
      anchor="right"
      PaperProps={{
        sx: {
          width: { xs: '100vw', md: 480 },
          overflowX: 'hidden',
          overflowY: 'scroll',
        },
      }}
    >
      <Stack sx={{ width: '100%', height: '100%' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <BackBtn
            onClick={locationDrawerController.onFalse}
            sx={{ position: 'absolute', top: 56, left: 16, zIndex: 1000 }}
          />

          <Map setLocation={setLocation} center={[location.latitude, location.longitude]} />
        </Stack>

        <Stack sx={{ padding: '20px' }}>
          <Typography variant="body1" fontWeight="bold">
            กดเลือกตำแหน่งในแผนที่
          </Typography>

          <Typography variant="body2">ละติจูด : {location.latitude.toFixed(4)}</Typography>
          <Typography variant="body2">ลองติจูด : {location.longitude.toFixed(4)}</Typography>

          <Box sx={{ marginBottom: '60px' }}>
            <FormButton onClick={handleClickOnMap} label="ยืนยัน" />
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
