'use client';

import type { ApiResponse } from 'src/shared/types/api.type';

import { useState } from 'react';
import axios from 'src/shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { endpoints } from 'src/shared/configs/endpoints.config';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useGeolocationStore } from '../geolocation/_store/geolocation.store';

type ServingBase = { base: { name: string | null; basicId: string } | null };

// Bottom-centre card over the map when the user stands inside a tamsang-tamsong service area.
export function TamsangPopup() {
  const geolocation = useGeolocationStore((state) => state.geolocation);
  const [dismissed, setDismissed] = useState(false);

  const { data: base } = useQuery({
    queryKey: ['serving-base', geolocation],
    queryFn: async () => {
      const [latitude, longitude] = geolocation!;
      const { data } = await axios.get<ApiResponse<ServingBase>>(endpoints.bases.serving, {
        params: { latitude, longitude },
      });
      return data.data.base;
    },
    enabled: !!geolocation,
    staleTime: Infinity,
  });

  if (!base || dismissed) return null;

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
          src="/assets/images/logo-tamsang-tamsong.png"
          alt="ตามสั่งตามส่ง"
          sx={{ width: { xs: 56, sm: 80 }, height: 'auto', flexShrink: 0 }}
        />
        <Stack spacing={1.5} flex={1} minWidth={0}>
          <Typography variant="subtitle1">สั่งอาหารเรียกไรเดอร์</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              size="large"
              color="primary"
              sx={{ borderRadius: '9999px', bgcolor: 'primary.lighter' }}
              onClick={() => setDismissed(true)}
            >
              ยกเลิก
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              sx={{ borderRadius: '9999px' }}
              onClick={() => window.open(`https://line.me/R/ti/p/${base.basicId}`, '_blank')}
            >
              ดูเลย
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
