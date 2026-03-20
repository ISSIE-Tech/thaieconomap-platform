'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation'; // Directly import useRouter
import type { SxProps } from '@mui/material';
import type { Theme } from '@mui/material/styles/createTheme';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/components/iconify';
import { BackBtn } from 'src/shared/components/custom-buttons';

import { StatusText } from '../favorites';

type Props = {
  title: string;
  onClose?: () => void;
  rightComponent?: ReactNode;
  wrapperStyle?: SxProps<Theme>;
  headerStyle?: SxProps<Theme>;
  isFavorite?: boolean;
  favoriteTitle?: string;
};

export function BlueRoundedHeader({
  title,
  onClose,
  rightComponent,
  wrapperStyle,
  headerStyle,
  isFavorite = false,
  favoriteTitle,
}: Props) {
  const router = useRouter();

  // Default `onClose` behavior
  const handleClose = onClose ?? (() => router.back());

  return (
    <Stack pb={10} sx={wrapperStyle}>
      <Grid
        container
        py={2}
        px={3}
        position="fixed"
        sx={{
          bgcolor: (theme) => theme.palette.primary.dark,
          borderBottomRightRadius: '3rem',
          ...headerStyle,
        }}
      >
        <Grid container xs={4} alignContent="center">
          <BackBtn onClick={handleClose} />
        </Grid>

        <Grid container xs={4} justifyContent="center">
          <Typography textAlign="center" color="white" fontWeight="bold" whiteSpace="nowrap">
            {title}
          </Typography>

          {isFavorite && (
            <StatusText sx={{ bgcolor: '#2F9F5C' }}>
              <Iconify width={20} icon="ic:round-star" color="white" />
              <Typography color="white" variant="overline" fontWeight="bold">
                {favoriteTitle ?? 'รายการโปรด'}
              </Typography>
            </StatusText>
          )}
        </Grid>

        <Grid container xs={4} justifyContent="center">
          {rightComponent}
        </Grid>
      </Grid>
    </Stack>
  );
}
