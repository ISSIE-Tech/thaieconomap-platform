'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { error, common, primary } from 'src/theme/core';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { LocationMap, startLocation, LocationDrawer } from './location-drawer';

type LatLng = {
  latitude: number;
  longitude: number;
};

export function RHFLocationPicker() {
  const {
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();
  const currentVal = watch('location');

  const [title, setTitle] = useState('แตะเพื่อเลือกตำแหน่งบนแผนที่');
  const [location, setLocation] = useState<LatLng>({ latitude: 0, longitude: 0 });

  const locationDrawerController = useBoolean();

  const handleClickOnMap = async () => {
    setValue('location', { latitude: location.latitude, longitude: location.longitude });
    locationDrawerController.onFalse();
    await trigger('location');
  };

  useEffect(() => {
    if (currentVal.latitude !== 0 && currentVal.longitude !== 0) {
      setTitle(`${currentVal.latitude.toFixed(4)},${currentVal.longitude.toFixed(4)}`);
    }
  }, [currentVal.latitude, currentVal.longitude]);

  const isDesktop = useIsDesktop();
  const geolocation = useGeolocationStore((state) => state.geolocation);
  // desktop: map is inline, so it opens where the drawer would
  const [mapCenter] = useState(() => startLocation(currentVal, geolocation));
  const shown = location.latitude === 0 ? mapCenter : location;
  const picked = currentVal.latitude !== 0 && currentVal.longitude !== 0;

  const errorText = errors.location && (
    <Typography variant="body2" color={error.main}>
      {errors.location.message as string}
    </Typography>
  );

  if (isDesktop)
    return (
      <Stack spacing={1.5}>
        <Typography variant="body2" color="grey.600">
          เลื่อนแผนที่ให้หมุดอยู่ตรงตำแหน่ง แล้วกด “ใช้ตำแหน่งนี้”
        </Typography>

        <Box
          sx={{
            height: 420,
            display: 'flex',
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${primary.light}`,
          }}
        >
          <LocationMap
            setLocation={setLocation}
            center={[mapCenter.latitude, mapCenter.longitude]}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack flexGrow={1}>
            <Typography variant="body2">
              ละติจูด {shown.latitude.toFixed(4)} · ลองติจูด {shown.longitude.toFixed(4)}
            </Typography>
            <Typography variant="caption" color={picked ? 'success.main' : 'grey.600'}>
              {picked ? `ตำแหน่งที่เลือก: ${title}` : 'ยังไม่ได้เลือกตำแหน่ง'}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => {
              setLocation(shown);
              setValue('location', shown);
              trigger('location');
            }}
            sx={{ borderRadius: '9999px', px: 2.5, height: 40 }}
          >
            ใช้ตำแหน่งนี้
          </Button>
        </Stack>

        {errorText}
      </Stack>
    );

  return (
    <Box>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: common.background,
          height: '96px',
          border: `2px dashed ${primary.light}`,
          borderRadius: '16px',
        }}
      >
        <Button
          onClick={locationDrawerController.onTrue}
          sx={{ backgroundColor: common.white, padding: '16px', borderRadius: '24px', gap: '5px' }}
        >
          <Image src="/assets/icons/marker-plus.svg" alt="marker" width="20" height="20" />
          <Typography variant="body1">{title}</Typography>
        </Button>
      </Stack>

      <LocationDrawer
        locationDrawerController={locationDrawerController}
        location={location}
        setLocation={setLocation}
        handleClickOnMap={handleClickOnMap}
        currentValue={currentVal}
      />

      {errorText}
    </Box>
  );
}
