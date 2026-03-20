'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { paths } from 'src/shared/routes/paths.config';

import { FilterHeader } from './filter-header';
import useGetBusinessTypes from '../_hooks/use-get-business-types';
import useGetRestaurantTypes from '../_hooks/use-get-restaurant-types';
import { TypeTags, LocationTags, WorkingHourTags } from './filter-tags';
import {
  type LocationFilter,
  type WorkingHourFilter,
  commercialFilterDefault,
} from '../_types/commercials.type';

type Props = {
  controller: UseBooleanReturn;
};

export function CommercialFilterDrawer({ controller }: Props) {
  const pathname = usePathname();

  // unsaved filter
  const [workingHour, setWorkingHour] = useState<WorkingHourFilter>(
    commercialFilterDefault.workingHour
  );
  const [location, setLocation] = useState<LocationFilter>(commercialFilterDefault.location);

  const { data: restaurantTypes } = useGetRestaurantTypes();
  const { data: businessTypes } = useGetBusinessTypes();
  
  const commercialTypeNames = useMemo(() => {
    let commercialTypes;

    if (pathname === paths.commercials.restaurants) {
      commercialTypes = restaurantTypes;
    } else if (pathname === paths.commercials.businesses) {
      commercialTypes = businessTypes;
    }

    return (
      commercialTypes?.reduce(
        (acc, type) => {
          acc[type._id] = type.name;
          return acc;
        },
        {} as Record<string, string>
      ) ?? null
    );
  }, [businessTypes, pathname, restaurantTypes]);

  const [types, setTypes] = useState<Record<string, boolean> | null>(null);

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // query filter
  const commercialWorkingHour = searchParams.get('workingHour');
  const commercialLocation = searchParams.get('location');
  const commercialSavedTypes = searchParams.get('types');

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

    let commercialTypes;
    const savedTypes = commercialSavedTypes?.split(',');

    // if query param empty (''), use default filter
    setWorkingHour(
      (commercialWorkingHour as WorkingHourFilter) || commercialFilterDefault.workingHour
    );
    setLocation((commercialLocation as LocationFilter) || commercialFilterDefault.location);

    if (pathname === paths.commercials.restaurants) {
      commercialTypes = restaurantTypes;
    } else if (pathname === paths.commercials.businesses) {
      commercialTypes = businessTypes;
    }

    setTypes(
      commercialTypes?.reduce(
        (acc, type) => {
          acc[type._id] = !!savedTypes?.includes(type._id);
          return acc;
        },
        {} as Record<string, boolean>
      ) ?? null
    );
  }, [
    businessTypes,
    commercialLocation,
    commercialSavedTypes,
    commercialWorkingHour,
    controller.value,
    pathname,
    restaurantTypes,
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
      <FilterHeader controller={controller} />

      <Stack spacing={2} px={3}>
        <Divider />

        <WorkingHourTags workingHour={workingHour} setWorkingHour={setWorkingHour} />

        <LocationTags location={location} setLocation={setLocation} />

        <TypeTags types={types} setTypes={setTypes} typeNames={commercialTypeNames} />

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
