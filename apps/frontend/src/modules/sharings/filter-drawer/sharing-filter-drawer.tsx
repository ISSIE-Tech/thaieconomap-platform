'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import type { StatusFilter, LocationFilter } from '../_types/sharing.type';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TagsSection } from 'src/modules/commercials/filter-drawer/filter-tags';

import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { LocationWithDistrictTags } from './filter-tags';
import { sharingFilter, sharingFilterDefault } from '../_types/sharing.type';

type Props = {
  controller: UseBooleanReturn;
};

export function SharingFilterDrawer({ controller }: Props) {
  const { replace } = useRouter();

  // unsaved filter
  const [status, setStatus] = useState<StatusFilter>(sharingFilterDefault.status);
  const [location, setLocation] = useState<LocationFilter | null>(sharingFilterDefault.location);
  const [district, setDistrict] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // query filter (sharing)
  const sharingStatus = searchParams.get('status');
  const sharingLocation = searchParams.get('location');
  const sharingDistrict = searchParams.get('district');

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    if (status) params.set('status', status);
    if (location) {
      params.set('location', location);
      params.delete('district');
    } else if (district) {
      params.set('district', district);
      params.delete('location');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleConfirmClick = useCallback(() => {
    handleFilter();
    controller.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, location, district]);

  // set local value of filter to the one saved in the state
  useEffect(() => {
    // set only when controller is opened
    if (!controller.value) return;

    setStatus((sharingStatus as StatusFilter) ?? sharingFilterDefault.status);

    if (!sharingLocation && !sharingDistrict) {
      setLocation(sharingFilterDefault.location);
    } else if (sharingLocation) {
      setLocation(sharingLocation as LocationFilter);
    }
    setDistrict(sharingDistrict);
  }, [controller.value, sharingDistrict, sharingLocation, sharingStatus]);

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
        <Grid size={4} />

        <Grid container size={4} alignContent="center" justifyContent="center">
          <Typography variant="body1" fontWeight="bold">
            ฟิลเตอร์
          </Typography>
        </Grid>

        <Grid container size={4} alignContent="center" justifyContent="end">
          <Fab color="default" size="small" sx={{ bgcolor: 'white' }} onClick={controller.onFalse}>
            <Image src="/assets/icons/cross.svg" alt="cross icon" width="24" height="24" />
          </Fab>
        </Grid>
      </Grid>

      <Stack spacing={2} px={3}>
        <Divider />

        <TagsSection
          title="จำนวนสิ่งของ"
          filter={sharingFilter.status}
          selectedTag={status}
          setSelectedTag={setStatus as (key: string) => void}
        />
        <Divider />

        <LocationWithDistrictTags
          location={location}
          setLocation={setLocation}
          selectedDistrict={district}
          setSelectedDistrict={setDistrict}
        />

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
