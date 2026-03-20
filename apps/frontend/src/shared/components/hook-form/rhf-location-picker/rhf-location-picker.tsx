'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { error, common, primary } from 'src/theme/core';
import { useBoolean } from 'src/shared/hooks/use-boolean';

import { LocationDrawer } from './location-drawer';

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

      {errors.location && (
        <Typography variant="body2" color={error.main}>
          {errors.location.message as string}
        </Typography>
      )}
    </Box>
  );
}
