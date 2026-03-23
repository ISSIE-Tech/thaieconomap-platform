'use client';

import type { Map as LeafletMap } from 'leaflet';
import type { District } from '../_types/commercials.type';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BackBtn } from 'src/shared/components/custom-buttons';
import { SearchInput } from 'src/shared/components/custom-inputs';
import { useBoolean, type UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { debounce } from '@mui/material/utils';
import Typography from '@mui/material/Typography';

import { SearchedDistrict } from './searched-districts';

type Props = {
  controller: UseBooleanReturn;
  map: LeafletMap;
  onClose?: (district: string) => void;
};

export function DistrictSearchDrawer({ controller, map, onClose }: Props) {
  const [districtInput, setDistrictInput] = useState('');
  const [searchedDistrict, setSearchedDistrict] = useState('');
  const isSearching = useBoolean();
  const zoomLevel = 15;

  // Debounce the search value update by 300ms
  const debouncedSearch = debounce((value: string) => {
    setSearchedDistrict(value);
  }, 300);

  // Automatically focus the input field when the drawer is opened
  // useEffect(() => {
  //   console.log(searchInputRef.current)
  //   if (searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // }, [controller.value]);

  useEffect(() => {
    if (districtInput === '') {
      setSearchedDistrict('');
    } else {
      debouncedSearch(districtInput);
    }
    return () => {
      debouncedSearch.clear(); // Clear the debounce on unmount
    };
  }, [districtInput, debouncedSearch]);

  const handleDistrictClick = (district: District) => {
    const fullDistrict = `${district.districtType}${district.districtName}`;
    setDistrictInput(fullDistrict);

    if (onClose) onClose(fullDistrict);
    controller.onFalse();
    map?.flyTo([district.latitude, district.longitude], zoomLevel);
  };

  const handleDrawerClose = () => {
    if (onClose) onClose(searchedDistrict);
    controller.onFalse();
  };

  useEffect(() => {
    if (searchedDistrict === '') {
      isSearching.onFalse();
    } else {
      isSearching.onTrue();
    }
  }, [searchedDistrict, isSearching]);

  return (
    <Drawer
      open={controller.value}
      onClose={handleDrawerClose}
      anchor="right"
      slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}
      PaperProps={{
        sx: {
          width: { xs: '100vw', md: 480 },
          height: '100vh',
          overflowX: 'hidden',
        },
      }}
    >
      <Grid container py={2} px={3}>
        <Grid container size={4} alignContent="center">
          <BackBtn onClick={handleDrawerClose} />
        </Grid>

        <Grid container size={4} justifyContent="center">
          <Typography variant="body1" fontWeight="bold">
            ค้นหา
          </Typography>
        </Grid>
      </Grid>

      <Stack spacing={1} direction="row" sx={{ width: '100%', px: 2, alignItems: 'center' }}>
        <SearchInput
          placeholder="พิมพ์ชื่อเขต/อำเภอ"
          value={districtInput}
          onChange={(e) => setDistrictInput(e.target.value)}
        />
      </Stack>

      <Stack spacing={1} px={3} mt={4} flexGrow={1} overflow="hidden">
        <Typography variant="body1" fontWeight="bold">
          {isSearching.value ? 'ผลลัพธ์การค้นหา' : 'ค้นหาเขต/อำเภอ'}
        </Typography>

        {isSearching.value ? (
          <SearchedDistrict
            searchedInput={searchedDistrict}
            onDistrictClick={handleDistrictClick}
          />
        ) : (
          <EmptyInputIllustration />
        )}
      </Stack>
    </Drawer>
  );
}

// ----------------------------------------------------------------------

function EmptyInputIllustration() {
  return (
    <Stack alignItems="center" spacing={1}>
      <Image
        src="/assets/illustrations/onboarding.svg"
        alt="onboarding illustrations"
        width="216"
        height="216"
      />
      <Typography variant="body1" fontWeight="bold">
        กรอกชื่อเขตเพื่อทำการค้นหา
      </Typography>
    </Stack>
  );
}
