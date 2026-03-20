'use client';

import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { formatCreateDate } from 'src/shared/components/constants/date';

import { ENTITY_TYPE } from './_types/history.type';
import { CommercialCategory } from '../commercials/_types/commercials.type';

import type { FormHistory } from './_types/history.type';
import type { Commercial } from '../commercials/_types/commercials.type';

type Props = {
  history: FormHistory;
  onClick: (history: FormHistory) => void;
};

export function HistoryRow({ history, onClick }: Props) {
  const theme = useTheme();

  const entityTypeThai = ENTITY_TYPE[history.entityType].th;
  const categoryThai = useMemo(() => {
    if (history.entityType === ENTITY_TYPE.commercials.en) {
      return CommercialCategory[(history as Commercial).category];
    }
    return null;
  }, [history]);

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      py={2}
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(history)}
    >
      <Stack direction="row" flexGrow={1} spacing={1.5} alignItems="center" width="80%">
        <Image
          src={history?.imageUrl}
          alt="history"
          ratio="4/3"
          flexShrink={0}
          sx={{ width: '100px', borderRadius: '5px' }}
        />

        <Stack>
          <Typography
            variant="body2"
            color={theme.palette.primary.main}
            sx={maxLine({ line: 1 })}
          >
            {entityTypeThai} {categoryThai && ` - ${categoryThai}`}
          </Typography>
          <Typography fontWeight="bold" sx={maxLine({ line: 1 })}>
            {history?.name}
          </Typography>
          <Typography variant="body2" color={theme.palette.grey['500']}>
            {formatCreateDate(history.createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Stack>
        <Image src="/assets/icons/right-arrow.svg" alt="right-arrow" sx={{ width: '24px' }} />
      </Stack>
    </Stack>
  );
}

// --------------------------------------------------

export function HistoryRowSkeleton() {
  return (
    <Stack direction="row" spacing={2} alignItems="center" py={2} sx={{ cursor: 'pointer' }}>
      {/* Skeleton for Image */}
      <Skeleton variant="rectangular" width={60} height={45} />

      {/* Skeleton for Text */}
      <Stack flexGrow={1} gap={1}>
        <Typography fontWeight="bold">
          <Skeleton width="80%" />
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Skeleton width="60%" />
        </Typography>
      </Stack>

      {/* Skeleton for Status */}
      <Skeleton variant="rounded" width={100} height={40} />
    </Stack>
  );
}
