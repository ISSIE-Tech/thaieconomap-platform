'use client';

import type { FavoriteTiny } from './_types/favorites.type';

import Link from 'next/link';
import { useState } from 'react';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { formatCreateDate } from 'src/shared/components/constants/date';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type FavoriteKind = 'restaurants' | 'businesses' | 'pumpuangs' | 'shares';

const TABS: { key: FavoriteKind; label: string; empty: string }[] = [
  { key: 'restaurants', label: 'ร้านอาหาร', empty: paths.commercials.restaurants },
  { key: 'businesses', label: 'ธุรกิจ', empty: paths.commercials.businesses },
  { key: 'pumpuangs', label: 'รถพุ่มพวง', empty: paths.commercials.pumpuang },
  { key: 'shares', label: 'สิ่งของ', empty: paths.sharings },
];

type Props = {
  favorites: Record<FavoriteKind, FavoriteTiny[]>;
  isLoading: boolean;
  onClick: (kind: FavoriteKind, id: string) => void;
};

export function FavoritesDesktop({ favorites, isLoading, onClick }: Props) {
  const [tab, setTab] = useState<FavoriteKind>('restaurants');
  const current = TABS.find((t) => t.key === tab)!;
  // the newest is the first in list
  const items = [...favorites[tab]].reverse();

  return (
    <Stack spacing={2}>
      <Typography component="h1" fontSize={22} fontWeight={700}>
        รายการโปรดของฉัน
      </Typography>

      <Stack direction="row" sx={{ borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}` }}>
        {TABS.map((t) => (
          <ButtonBase
            key={t.key}
            onClick={() => setTab(t.key)}
            sx={{
              position: 'relative',
              height: 44,
              px: 2.5,
              fontSize: 14,
              fontWeight: 700,
              color: tab === t.key ? 'primary.main' : 'grey.600',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 'auto 0 0 0',
                height: '0.3rem',
                borderRadius: '1rem 1rem 0 0',
                bgcolor: tab === t.key ? 'primary.main' : 'transparent',
              },
            }}
          >
            {t.label}
          </ButtonBase>
        ))}
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
        {isLoading &&
          [...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={200} />)}

        {items.map((f) => (
          <ButtonBase
            key={f._id}
            onClick={() => onClick(tab, f._id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              textAlign: 'left',
              border: (theme) => `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 1.5,
              overflow: 'hidden',
              '&:hover': { borderColor: 'primary.lighter' },
            }}
          >
            <Box sx={{ position: 'relative', aspectRatio: '16/9', bgcolor: 'primary.light' }}>
              {f.imageUrl && (
                <Box
                  component="img"
                  src={f.imageUrl}
                  alt=""
                  loading="lazy"
                  sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                />
              )}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Iconify icon="ic:round-star" width={20} />
              </Box>
            </Box>
            <Stack spacing={0.25} px={1.75} py={1.5}>
              <Typography fontSize={15} fontWeight={700} noWrap>
                {f.name}
              </Typography>
              <Typography fontSize={13} color="grey.600" noWrap>
                {(f.updatedAt && formatCreateDate(f.updatedAt)) ??
                  (f.createdAt && formatCreateDate(f.createdAt)) ??
                  f.address}
              </Typography>
            </Stack>
          </ButtonBase>
        ))}
      </Box>

      {!isLoading && items.length === 0 && (
        <Stack alignItems="center" spacing={1} p={5}>
          <Box component="img" src="/assets/illustrations/onboarding.svg" alt="" width={80} height={80} />
          <Typography fontSize={14} fontWeight={700}>
            ไม่มีข้อมูล{current.label}ที่ถูกใจในขณะนี้
          </Typography>
          <Typography component={Link} href={current.empty} fontSize={12} color="primary.main">
            เริ่มต้นค้นหา{current.label}ที่ถูกใจในชุมชนกับเรา
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
