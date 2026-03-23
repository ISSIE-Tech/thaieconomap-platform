'use client';

import * as React from 'react';
import { Iconify } from 'src/shared/components/iconify';
import { useDistrictOptionMap } from 'src/shared/hooks/use-get-districts';
import { useProvinceOptionMap } from 'src/modules/commercials/_hooks/use-get-provinces';

import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { styled, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import type { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';

import { ListboxComponent } from './listbox-component';
import { LOCATION_LENGTH } from '../_constants/location';
import { useAnnouncementsStore } from '../_stores/announcements.store';
import { useAnnouncementsFilter } from '../_hooks/use-announcements-filter';


const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export default function DistrictsAutocomplete() {
  // UI style
  const theme = useTheme();

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="gravity-ui:magnifier" width={24} />
          </InputAdornment>
        ),
        placeholder: 'ค้นหาจากเขต หรือ จังหวัด',
        sx: { bgcolor: 'white' },
      }}
      sx={{
        zIndex: 1000,
        flexGrow: 1,
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
  );

  // Fetching
  const { options, districtOptionMap } = useDistrictOptionMap();
  const { provinceIdOptionMap } = useProvinceOptionMap();

  // value from announcements store
  const { announcementsLocation, resetAnnouncementsLocation } = useAnnouncementsFilter();
  // open/close autocomplete
  const { locationAutocompleteOpen } = useAnnouncementsStore();
  const { openLocationAutocomplete, closeLocationAutocomplete } = useAnnouncementsStore(
    (state) => state.actions
  );

  const selectedOption = React.useMemo(() => {
    if (!announcementsLocation) return null;

    if (announcementsLocation?.length <= LOCATION_LENGTH.PROVINCE_ID) {
      return provinceIdOptionMap?.[announcementsLocation];
    }

    return districtOptionMap?.[announcementsLocation];
  }, [announcementsLocation, districtOptionMap, provinceIdOptionMap]);

  return (
    // How to give this MUI Autocomplete autofocus?
    <Autocomplete
      disableListWrap
      options={options}
      groupBy={(option) => `${option.provinceName}:${option.provinceId}`}
      renderInput={renderInput}
      renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
      renderGroup={(params) => params as any}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      // controller props
      value={selectedOption} // district or provinceId
      open={locationAutocompleteOpen}
      onOpen={openLocationAutocomplete}
      onClose={closeLocationAutocomplete}
      onInputChange={(_, newInputValue) => {
        if (newInputValue === '') {
          resetAnnouncementsLocation(); // Clear the selection when input is empty
        }
      }}
    />
  );
}
