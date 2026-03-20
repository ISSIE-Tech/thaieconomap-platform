'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { LocationFilter } from 'src/modules/commercials/_types/commercials.type';

import Image from 'next/image';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { commercialFilterDefault } from 'src/modules/commercials/_types/commercials.type';
import {
  TypeTags,
  LocationTags,
  WorkingHourTags,
} from 'src/modules/commercials/filter-drawer/filter-tags';

import useGetProductTypes from '../_hooks/use-get-product-types';

import type { PumpuangWorkingHourFilter } from '../_types/pumpuangs.type';

type Props = {
  controller: UseBooleanReturn;
};

export function PumpuangFilterDrawer({ controller }: Props) {
  const pathname = usePathname();

  // fetched filter
  const { data: productTypes } = useGetProductTypes();

  // unsaved filter
  const [workingHour, setWorkingHour] = useState<PumpuangWorkingHourFilter>(
    commercialFilterDefault.workingHour
  );
  const [location, setLocation] = useState<LocationFilter>(commercialFilterDefault.location);

  const [types, setTypes] = useState<Record<string, boolean> | null>(null);

  const pumpuangTypeNames = useMemo(
    () =>
      productTypes?.reduce(
        (acc, type) => {
          acc[type._id] = type.name;
          return acc;
        },
        {} as Record<string, string>
      ) ?? null,
    [productTypes]
  );

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // query filter
  const pumpuangsWorkingHour = searchParams.get('workingHour');
  const pumpuangsLocation = searchParams.get('location');
  const pumpuangsSavedTypes = searchParams.get('types');

  const handleConfirmClick = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    const selectedTypes = types ? Object.keys(types).filter((key) => types[key]) : [];

    if (workingHour) params.set('workingHour', workingHour);
    if (location) params.set('location', location);
    if (types) params.set('types', selectedTypes.join(','));

    controller.onFalse();
    replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workingHour, location, types]);

  // Set the initial value of filter
  useEffect(() => {
    if (!controller.value) return;

    const savedTypes = pumpuangsSavedTypes?.split(',');

    // if query param empty (''), use default filter
    setWorkingHour(
      (pumpuangsWorkingHour as PumpuangWorkingHourFilter) || commercialFilterDefault.workingHour
    );
    setLocation((pumpuangsLocation as LocationFilter) || commercialFilterDefault.location);

    // if that type is in url, the key of that type become true
    setTypes(
      productTypes?.reduce(
        (acc, type) => {
          acc[type._id] = !!savedTypes?.includes(type._id);
          return acc;
        },
        {} as Record<string, boolean>
      ) ?? null
    );
  }, [
    pumpuangsLocation,
    pumpuangsSavedTypes,
    pumpuangsWorkingHour,
    controller.value,
    pathname,
    productTypes,
  ]);

  return (
    <Drawer
      open={controller.value}
      onClose={controller.onFalse}
      anchor="bottom"
      hideBackdrop
      PaperProps={{
        sx: { width: { xs: '100vw', md: 480 }, ml: 'auto', overflowX: 'hidden', pb: 8 },
      }}
    >
      <Grid container py={2} px={3}>
        <Grid xs={4} />

        <Grid container xs={4} alignContent="center" justifyContent="center">
          <Typography variant="body1" fontWeight="bold">
            ฟิลเตอร์
          </Typography>
        </Grid>

        <Grid container xs={4} alignContent="center" justifyContent="end">
          <Fab color="default" size="small" sx={{ bgcolor: 'white' }} onClick={controller.onFalse}>
            <Image src="/assets/icons/cross.svg" alt="cross icon" width="24" height="24" />
          </Fab>
        </Grid>
      </Grid>

      <Stack spacing={2} px={3}>
        <Divider />

        <WorkingHourTags workingHour={workingHour} setWorkingHour={setWorkingHour} isPumpuang />

        <LocationTags location={location} setLocation={setLocation} />

        <TypeTags types={types} setTypes={setTypes} typeNames={pumpuangTypeNames} />

        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '9999px', mt: 4 }}
          onClick={handleConfirmClick}
        >
          ยืนยัน
        </Button>
      </Stack>
    </Drawer>
  );
}
