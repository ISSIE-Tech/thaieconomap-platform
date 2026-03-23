'use client';

import { useRouter } from 'next/navigation';
import { Image } from 'src/shared/components/image';
import { paths } from 'src/shared/routes/paths.config';
import { useEffect, type PropsWithChildren } from 'react';
import { useBoolean } from 'src/shared/hooks/use-boolean';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuthContext } from '../_hooks/use-auth-context';

// ----------------------------------------------------------------------

export function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();

  const { authenticated, loading } = useAuthContext();

  const isChecking = useBoolean(true);

  const checkPermission = async (): Promise<void> => {
    if (loading) return;

    if (!authenticated) {
      router.replace(paths.auth.login);
      return;
    }

    isChecking.onFalse();
  };

  useEffect(() => {
    checkPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking.value) {
    return <PermissionLoading />;
  }

  return <>{children}</>;
}

// --------------------------------------------------

export const PermissionLoading = () => (
  <Stack
    position="relative"
    height="100vh"
    alignItems="center"
    justifyContent="center"
    zIndex={3000}
    bgcolor="white"
  >
    <Stack spacing={4} alignItems="center">
      <Stack
        justifyContent="center"
        sx={{
          animation: 'bounce 2s infinite',
        }}
      >
        <Image src="/assets/illustrations/fill-info.svg" alt="logo" width={240} height={240} />
      </Stack>

      <Typography variant="h1" fontFamily="Poppins" alignSelf="flex-start">
        economap
      </Typography>

      <Typography variant="h6" textAlign="center">
        ตรวจสอบสิทธิ์การใช้งานของท่าน
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="center" spacing={4}>
        <CircularProgress />

        <Typography variant="body1">กรุณารอสักครู่...</Typography>
      </Stack>
    </Stack>
  </Stack>
);
