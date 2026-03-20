'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

import { LineLoginBtn } from 'src/modules/auth';
import { BackBtn } from 'src/shared/components/custom-buttons';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <Stack direction="row" sx={{ minHeight: '100vh' }}>
      {/* Left branding panel — desktop only */}
      <Stack
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          bgcolor: 'primary.dark',
          color: 'common.white',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ position: 'absolute', top: 40, left: 40 }}
        >
          <Image src="/assets/icons/logo.svg" alt="logo" width="36" height="38" />
          <Typography variant="h6" fontWeight="bold" color="common.white">
            Thai Economap
          </Typography>
        </Stack>

        <Image
          src="/assets/illustrations/onboarding.svg"
          alt="onboarding illustrations"
          width="320"
          height="320"
        />

        <Typography variant="h3" fontWeight="bold" color="common.white" mt={4} textAlign="center">
          เริ่มต้นประสบการณ์ใหม่
          <br />
          ในแต่ละชุมชนไปกับเรา
        </Typography>

        <Typography variant="body1" color="grey.400" mt={2} textAlign="center">
          สำรวจธุรกิจ ร้านอาหาร และบริการในชุมชนของคุณ
        </Typography>
      </Stack>

      {/* Right login panel — desktop / Mobile full page */}
      <Stack
        sx={{
          width: { xs: '100%', md: '50%' },
          justifyContent: 'center',
          p: 3,
          position: 'relative',
        }}
      >
        {/* Back button — mobile only */}
        <Stack sx={{ position: 'absolute', top: 20, left: 10, display: { md: 'none' } }}>
          <BackBtn />
        </Stack>

        {/* Back button — desktop only */}
        <Stack sx={{ position: 'absolute', top: 20, left: 20, display: { xs: 'none', md: 'flex' } }}>
          <BackBtn />
        </Stack>

        <Stack
          sx={{
            maxWidth: { md: 400 },
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Illustration — mobile only */}
          <Stack alignItems="center" sx={{ display: { md: 'none' } }}>
            <Image
              src="/assets/illustrations/onboarding.svg"
              alt="onboarding illustrations"
              width="216"
              height="216"
            />
          </Stack>

          <Stack spacing={1} mt={{ xs: 8, md: 0 }}>
            <Typography variant="body1">Thai Economap</Typography>
            <Typography variant="h2" sx={{ display: { md: 'none' } }}>
              เริ่มต้นประสบการณ์ใหม่
              <br />
              ในแต่ละชุมชนไปกับเรา
            </Typography>
            <Typography variant="h3" sx={{ display: { xs: 'none', md: 'block' } }}>
              เข้าสู่ระบบ
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              เชื่อมต่อบัญชีของคุณเพื่อเริ่มต้นใช้งาน
            </Typography>
          </Stack>

          <Stack mt={5}>
            <LineLoginBtn />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
