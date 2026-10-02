'use client';

import type { ApiResponse } from 'src/shared/types/api.type';

import { useState } from 'react';
import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';
import { useMapBounds } from 'src/shared/components/map-sidebar';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha, darken } from '@mui/material/styles';

import { useCommercialStore } from './_store/commercials.store';

type ServingBase = { base: { name: string | null; basicId: string } | null };

const LOGO = '/assets/images/logo-tamsang-tamsong.png';
// tamsang-tamsong CI orange, sampled from the logo
const ORANGE = '#F15B22';

// Bottom-centre card over the map when the map's centre is inside a tamsang-tamsong service area.
// Dismissing it collapses it to a logo button bottom-left that reopens it.
export function TamsangPopup() {
  const map = useCommercialStore((state) => state.map);
  const center = useMapBounds(map)?.getCenter();
  // ~100 m grid so tiny pans reuse the cached answer
  const coord = center && [+center.lat.toFixed(3), +center.lng.toFixed(3)];
  const [dismissed, setDismissed] = useState(false);

  const { data: base } = useQuery({
    queryKey: ['serving-base', coord],
    queryFn: async () => {
      const [latitude, longitude] = coord!;
      const { data } = await axios.get<ApiResponse<ServingBase>>(endpoints.bases.serving, {
        params: { latitude, longitude },
      });
      return data.data.base;
    },
    enabled: !!coord,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });

  if (!base) return null;

  if (dismissed)
    return (
      <ButtonBase
        aria-label="ตามสั่งตามส่ง"
        onClick={() => setDismissed(false)}
        sx={{
          position: 'absolute',
          zIndex: 1000,
          left: 16,
          bottom: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'common.white',
          boxShadow: 8,
          overflow: 'hidden',
        }}
      >
        <Box component="img" src={LOGO} alt="" sx={{ width: 44, height: 'auto' }} />
      </ButtonBase>
    );

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        zIndex: 1000,
        bottom: 32,
        // keep clear of the map controls on the right
        left: { xs: 16, sm: '50%' },
        right: { xs: 80, sm: 'auto' },
        transform: { sm: 'translateX(-50%)' },
        width: { sm: 440 },
        p: 2,
        borderRadius: 3,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="img"
          src={LOGO}
          alt="ตามสั่งตามส่ง"
          sx={{ width: { xs: 56, sm: 80 }, height: 'auto', flexShrink: 0 }}
        />
        <Stack spacing={1.5} flex={1} minWidth={0}>
          <Box>
            <Typography variant="subtitle1">สั่งอาหารเรียกไรเดอร์</Typography>
            {base.name && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {base.name}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              size="large"
              sx={{ borderRadius: '9999px', color: ORANGE, bgcolor: alpha(ORANGE, 0.12) }}
              onClick={() => setDismissed(true)}
            >
              ยกเลิก
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                borderRadius: '9999px',
                color: 'common.white',
                bgcolor: ORANGE,
                '&:hover': { bgcolor: darken(ORANGE, 0.12) },
              }}
              onClick={() => window.open(`https://line.me/R/ti/p/${base.basicId}`, '_blank')}
            >
              สั่งเลย
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
