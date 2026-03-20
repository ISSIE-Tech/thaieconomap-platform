'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { common, primary } from 'src/theme/core';
import { paths } from 'src/shared/routes/paths.config';

function NotFoundPage() {
  const router = useRouter();
  return (
    <Stack height="100vh" width="100%" alignItems="center" justifyContent="center" spacing={6}>
      <Image
        src="/assets/illustrations/not-found.svg"
        alt="search not found illustrations"
        width="240"
        height="240"
      />

      <Stack spacing={2}>
        <Typography variant="h2" fontWeight="bold">
          ไม่พบหน้าที่ค้นหา
        </Typography>

        <Button
          variant="contained"
          sx={{
            py: 1.5,
            px: 2.5,
            borderRadius: 4,
            bgcolor: primary.main,
            color: common.white,
            '&:hover': {
              bgcolor: primary.dark,
            },
            '&:active': {
              bgcolor: primary.main,
            },
            '&:focus': {
              bgcolor: primary.main,
            },
          }}
          onClick={() => router.replace(paths.commercials.restaurants)}
        >
          กลับสู่หน้าหลัก
        </Button>
      </Stack>
    </Stack>
  );
}

export default NotFoundPage;
