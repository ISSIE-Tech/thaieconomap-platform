import type { CommercialTableFilters } from '../types';

import React, { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<CommercialTableFilters>;
  options: {
    category: { value: string; label: string }[];
  };
};

export function CommercialTableToolbar({ filters, options, onResetPage }: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ category: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="commercial-filter-category-select-label">ประเภท</InputLabel>
        <Select
          multiple
          value={filters.state.category}
          onChange={handleFilterCategory}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) =>
            selected
              .map((value) => options.category.find((option) => option.value === value)?.label)
              .join(', ')
          }
          inputProps={{ id: 'commercial-filter-category-select-label' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {options.category.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.state.category.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        value={filters.state.name}
        onChange={handleFilterName}
        placeholder="ค้นหา..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
