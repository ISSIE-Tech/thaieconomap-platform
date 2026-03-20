'use client';

import React from 'react';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type Props = {
  name: string;
  label: string;
};

export function RHFTimePicker({ name, label }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DesktopTimePicker
            label={label}
            value={field.value ? dayjs(field.value, 'HH:mm') : null}
            onChange={(newValue) => {
              const formattedTime = dayjs(newValue).format('HH:mm');
              setValue(name, formattedTime, { shouldValidate: true });
            }}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error ? error.message : null,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
