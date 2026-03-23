'use client';

import { useEffect, useCallback } from 'react';
import { Image } from 'src/shared/components/image';
import { toast } from 'src/shared/components/snackbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function LineCallbackPage() {
  const { login } = useAuthContext();

  const router = useRouter();

  // ----------------------------------------------------------------------

  const searchParms = useSearchParams();

  const code = searchParms.get('code');

  const state = searchParms.get('state');

  // ----------------------------------------------------------------------

  const handleLogin = useCallback(
    async (authorizationCode: string) => {
      try {
        await login(authorizationCode);

        router.push('/');
        toast.success('เข้าสู่ระบบสำเร็จ');
      } catch (error) {
        console.log(error);
        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับบัญชี Line');
      }
    },
    [login, router]
  );

  useEffect(() => {
    if (code && state) handleLogin(code);
  }, [code, handleLogin, state]);

  return (
    <Stack
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgcolor="white"
    >
      <Stack spacing={4} alignItems="center">
        <Stack
          justifyContent="center"
          sx={{ animation: 'bounce 2s infinite' }}
        >
          <Image
            src="/assets/illustrations/fill-info.svg"
            alt="connecting"
            width={200}
            height={200}
          />
        </Stack>

        <Typography variant="h1" fontFamily="Poppins">
          economap
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress size={24} />

          <Typography variant="body1" color="text.secondary">
            กำลังเชื่อมต่อกับบัญชี Line...
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
