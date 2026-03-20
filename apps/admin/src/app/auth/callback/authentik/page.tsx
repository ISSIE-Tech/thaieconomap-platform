'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

export default function CallbackAuthentikAuthPage() {
  const { loginWithAuthentik } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const code = searchParams.get('code');

  // ----------------------------------------------------------------------

  const handleLogin = useCallback(
    async (authorizationCode: string) => {
      try {
        await loginWithAuthentik(authorizationCode);

        router.push('/');
        toast.success('เข้าสู่ระบบสำเร็จ');
      } catch (error) {
        console.log(error);
        toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย SSO');
      }
    },
    [loginWithAuthentik, router]
  );

  useEffect(() => {
    if (code) handleLogin(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default' }}
    >
      <Stack spacing={4} alignItems="center">
        <Stack
          justifyContent="center"
          sx={{
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        >
          <Image
            src="/assets/illustrations/fill-info.svg"
            alt="connecting"
            sx={{ width: 200, height: 200 }}
          />
        </Stack>

        <Typography variant="h2" fontWeight="bold" color="primary.main">
          economap
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress size={24} />

          <Typography variant="body1" color="text.secondary">
            กำลังเชื่อมต่อกับ SSO...
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
