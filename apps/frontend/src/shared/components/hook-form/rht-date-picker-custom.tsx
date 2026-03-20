'use client';

import React from 'react';

import { primary } from 'src/theme/core';

import { RHFMultiSelect } from './rhf-select';

type Props = {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string[];
};

const RHFDatePickerCustom = ({ name, options, defaultValue }: Props) => (
  <RHFMultiSelect
    name={name}
    label="เลือกระยะวันทำการ"
    defaultValue={defaultValue}
    chip
    options={options}
    sx={{ width: '100%', lineHeight: '2rem' }}
    horizontal
    titleText="เลือกระยะเวลาทำการ"
    slotProps={{
      select: { sx: { display: 'flex' } },
      paper: {
        maxHeight: 300,
        width: '100%',
        display: 'flex',
        padding: '10px',
      },
      menuItem: {
        sx: {
          width: '12%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            border: '1px solid',
            borderColor: primary.main,
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    }}
  />
);

export default RHFDatePickerCustom;
