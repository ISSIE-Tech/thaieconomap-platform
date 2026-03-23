'use client';

import type { LocationFilter } from '../_types/sharing.type';

import { useMemo } from 'react';
import useGetDistricts from 'src/shared/hooks/use-get-districts';
import {
  filterStyle,
  selectedFilterStyle,
} from 'src/modules/commercials/filter-drawer/filter-tags';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { sharingFilter } from '../_types/sharing.type';

type Props = {
  location: LocationFilter | null;
  setLocation: (location: LocationFilter | null) => void;
  selectedDistrict: string | null;
  setSelectedDistrict: (selectedDistrict: string | null) => void;
};

export function LocationWithDistrictTags({
  location,
  setLocation,
  selectedDistrict,
  setSelectedDistrict,
}: Props) {
  const theme = useTheme();

  const { data: districts } = useGetDistricts();

  const selected = useMemo(
    () => districts?.find((district) => district._id === selectedDistrict) ?? null,
    [districts, selectedDistrict]
  );

  return (
    <>
      <Typography fontWeight="bold">ตำแหน่ง</Typography>

      <Autocomplete
        disabled={!districts}
        options={districts ?? []}
        getOptionLabel={(option) =>
          `${option?.districtType}${option?.districtName} ${option?.provinceName}`
        }
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
            {`${option?.districtType}${option?.districtName} ${option?.provinceName}`}
          </li>
        )}
        value={selected}
        onChange={(event, newValue) => {
          // TODO: potential race condition?
          setSelectedDistrict(newValue?._id ?? null);
          setLocation(null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="เขตที่อยู่"
            placeholder="เลือกเขตที่อยู่"
            inputProps={{ ...params.inputProps }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.light, // Outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main, // Outline color when focused
                },
              },
            }}
          />
        )}
      />

      <Stack direction="row" spacing={2}>
        {Object.entries(sharingFilter.location).map(([key, value]) => (
          <Button
            key={key}
            variant={location === key ? 'contained' : 'outlined'}
            sx={location === key ? selectedFilterStyle : filterStyle}
            onClick={() => {
              // TODO: potential race condition?
              setSelectedDistrict(null);
              setLocation(key as LocationFilter);
            }}
          >
            {value}
          </Button>
        ))}
      </Stack>

      <Divider />
    </>
  );
}
