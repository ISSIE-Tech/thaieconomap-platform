'use client';

import React from 'react';
import { primary } from 'src/theme/core';

import { RHFDatePickerCustom } from './rhf-date-picker-custom';

type Props = {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string[];
};

const DatePicker = ({ name, options, defaultValue }: Props) => (
  <RHFDatePickerCustom
    name={name}
    label="เลือกระยะวันทำการ"
    defaultValue={defaultValue}
    chip
    options={options}
    sx={{ width: '100%', lineHeight: '5rem' }}
    titleText="เลือกระยะเวลาทำการ"
    slotProps={{
      select: {
        sx: {
          display: 'flex',
        },
      },
      paper: {
        maxHeight: 300,
        width: '30%',
        display: 'flex',
        padding: '10px',
      },
      menuItem: {
        sx: {
          width: '3rem',
          height: '3rem',
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

export default DatePicker;
