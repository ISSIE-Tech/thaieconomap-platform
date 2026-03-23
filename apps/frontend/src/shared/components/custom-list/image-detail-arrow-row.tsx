'use client';

import type { ReactNode } from 'react';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { Iconify } from 'src/shared/components/iconify';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

type Props = {
  imageUrl: string;
  name: string;
  time: string;
  // use detailComponent to customize the greyed out component instead of time
  detailComponent?: ReactNode;
  onClick?: () => void;
};

export function ImageDetailArrowRow({ imageUrl, name, time, detailComponent, onClick }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      py={2}
      width="100%"
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      <Image
        src={imageUrl}
        alt="list item"
        ratio="4/3"
        // TODO: zIndex to avoid image being on top of header, but why is image being on top of header in the first place???
        zIndex={-1}
        sx={{ objectFit: 'cover', minWidth: '80px', width: '80px', borderRadius: '4px' }}
      />

      <Stack width="50%" flexGrow={1}>
        <Typography fontWeight={500}>{name}</Typography>
        {!detailComponent ? (
          <Typography
            variant="body2"
            maxWidth="50%"
            color={theme.palette.grey[500]}
            sx={maxLine({ line: 1 })}
          >
            {time}
          </Typography>
        ) : (
          detailComponent
        )}
      </Stack>

      <Iconify icon="material-symbols-light:arrow-forward-ios" width={24} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

// TODO: could optimized by having one skeleton and not found but too lazy
// this component isn't even used yet (7 Dec 2024)
export function ImageDetailArrowRowSkeleton() {
  return (
    <Stack direction="row" alignItems="center" spacing={2} py={2} width="100%">
      <Skeleton variant="rectangular" width={80} height={60} sx={{ borderRadius: '4px' }} />

      <Stack width="50%" flexGrow={1}>
        <Skeleton width="70%" height={20} />
        <Skeleton width="50%" height={14} />
      </Stack>

      <Skeleton variant="circular" width={24} height={24} />
    </Stack>
  );
}
