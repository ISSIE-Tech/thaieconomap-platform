'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { Iconify } from 'src/shared/components/iconify';
import { BackBtn } from 'src/shared/components/custom-buttons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles/createTheme';

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
      <Box
        py={2}
        px={3}
        position="fixed"
        sx={{
          bgcolor: (theme) => theme.palette.primary.dark,
          borderBottomRightRadius: '3rem',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100vw', md: 480 },
          zIndex: 1,
          ...headerStyle,
        }}
      >
        <BackBtn onClick={handleClose} />

        <Typography
          color="white"
          fontWeight="bold"
          whiteSpace="nowrap"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {title}
        </Typography>

        {isFavorite && (
          <StatusText sx={{ bgcolor: '#2F9F5C', ml: 'auto' }}>
            <Iconify width={20} icon="ic:round-star" color="white" />
            <Typography color="white" variant="overline" fontWeight="bold">
              {favoriteTitle ?? 'รายการโปรด'}
            </Typography>
          </StatusText>
        )}

        {rightComponent && (
          <Box sx={{ ml: isFavorite ? 1 : 'auto' }}>
            {rightComponent}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
