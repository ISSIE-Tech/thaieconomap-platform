'use client';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { DarkModeButton } from 'src/layouts/components/dark-mode-button';

import { useGetLineLoginUrl } from 'src/auth/hooks/use-get-line-login-url';
import { useGetAuthentikLoginUrl } from 'src/auth/hooks/use-get-authentik-login-url';

// ----------------------------------------------------------------------

export default function AuthLoginPage() {
  const getLineLoginUrl = useGetLineLoginUrl();

  const getAuthentikLoginUrl = useGetAuthentikLoginUrl();

  const redirectToLineLoginPage = async () => {
    const lineLoginUrl = await getLineLoginUrl.mutateAsync();

    if (lineLoginUrl) window.location.replace(lineLoginUrl);
  };

  const redirectToAuthentikLoginPage = async () => {
    const authentikLoginUrl = await getAuthentikLoginUrl.mutateAsync();

    if (authentikLoginUrl) window.location.replace(authentikLoginUrl);
  };

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
          <Box component="img" src="/logo/logo-single.svg" alt="logo" sx={{ width: 36, height: 38 }} />
          <Typography variant="h6" fontWeight="bold" color="common.white">
            Thai Economap
          </Typography>
        </Stack>

        <Image
          src="/assets/illustrations/onboarding.svg"
          alt="onboarding"
          width={320}
          height={320}
        />

        <Typography variant="h3" fontWeight="bold" color="common.white" mt={4} textAlign="center">
          ระบบจัดการข้อมูล
          <br />
          Thai Economap
        </Typography>

        <Typography variant="body1" color="grey.400" mt={2} textAlign="center">
          จัดการธุรกิจ บริการ และข้อมูลชุมชนในระบบของคุณ
        </Typography>
      </Stack>

      {/* Right login panel */}
      <Stack
        sx={{
          width: { xs: '100%', md: '50%' },
          justifyContent: 'center',
          p: 3,
          position: 'relative',
        }}
      >
        <DarkModeButton sx={{ position: 'absolute', top: 16, right: 16 }} />
        <Stack
          sx={{
            maxWidth: { md: 400 },
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Mobile illustration */}
          <Stack alignItems="center" sx={{ display: { md: 'none' }, mb: 4 }}>
            <Image
              src="/assets/illustrations/onboarding.svg"
              alt="onboarding"
              width={216}
              height={216}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body1" color="text.secondary">
              Thai Economap Admin
            </Typography>

            <Typography variant="h3" sx={{ display: { xs: 'none', md: 'block' } }}>
              เข้าสู่ระบบ
            </Typography>

            <Typography variant="h4" sx={{ display: { md: 'none' } }}>
              เข้าสู่ระบบ
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เชื่อมต่อบัญชีของคุณเพื่อเริ่มต้นใช้งาน
            </Typography>
          </Stack>

          <Alert severity="warning" sx={{ mt: 3 }}>
            เฉพาะเจ้าหน้าที่เท่านั้น
          </Alert>

          <Stack spacing={2} mt={3}>
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              color="success"
              endIcon={<Iconify icon="simple-icons:line" />}
              loadingPosition="end"
              onClick={redirectToLineLoginPage}
              loading={getLineLoginUrl.isPending}
              disabled={getLineLoginUrl.isSuccess}
              sx={{ borderRadius: 2 }}
            >
              เข้าสู่ระบบด้วย LINE
            </LoadingButton>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                หรือ
              </Typography>
            </Divider>

            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              endIcon={<Iconify icon="mdi:shield-key" />}
              loadingPosition="end"
              onClick={redirectToAuthentikLoginPage}
              loading={getAuthentikLoginUrl.isPending}
              disabled={getAuthentikLoginUrl.isSuccess}
              sx={{ borderRadius: 2 }}
            >
              เข้าสู่ระบบด้วย SSO
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
