'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings/context';

// ----------------------------------------------------------------------

export type DarkModeButtonProps = IconButtonProps;

export function DarkModeButton({ sx, ...other }: DarkModeButtonProps) {
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();

  const isDark = mode === 'dark';

  const handleToggle = () => {
    const newMode = isDark ? 'light' : 'dark';
    settings.onUpdateField('colorScheme', newMode);
    setMode(newMode);
  };

  return (
    <IconButton
      aria-label="Toggle dark mode"
      onClick={handleToggle}
      sx={{ p: 0, width: 40, height: 40, ...sx }}
      {...other}
    >
      <Iconify icon={isDark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'} width={24} />
    </IconButton>
  );
}
