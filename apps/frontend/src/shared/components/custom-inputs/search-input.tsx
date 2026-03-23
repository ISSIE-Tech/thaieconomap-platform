'use client';

import type { ChangeEvent } from 'react';

import { Iconify } from 'src/shared/components/iconify';

import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

type Props = {
  placeholder: string;
  value?: string;
  onClick?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function SearchInput({ placeholder, value, onClick, onChange }: Props) {
  const theme = useTheme();

  return (
    <TextField
      autoFocus
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="gravity-ui:magnifier" width={24} />
          </InputAdornment>
        ),
        autoComplete: 'off',
        value,
        placeholder,
        onClick,
        onChange,
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
}
