'use client';

import React from 'react';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
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
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{
        okButtonLabel: 'ตกลง',
      }}
    >
      <Box sx={{ width: '50%' }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DesktopTimePicker
              label={label}
              value={field.value ? dayjs(field.value, 'HH:mm') : null}
              onChange={(newValue) => {
                if (newValue) {
                  const hour = newValue.hour();
                  const minute = newValue.minute();

                  setValue(name, `${hour}:${minute < 10 ? `0${minute}` : minute}`, {
                    shouldValidate: true,
                  });
                } else {
                  setValue(name, '', { shouldValidate: true });
                }
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
      </Box>
    </LocalizationProvider>
  );
}
