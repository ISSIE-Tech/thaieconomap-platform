'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { paths } from 'src/shared/routes/paths.config';
import { toast } from 'src/shared/components/snackbar';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

export const useAuthToast = () => {
  const router = useRouter();
  const { authenticated } = useAuthContext();

  const handleGuestClick = useCallback(
    () =>
      toast.warning('กรุณาเข้าสู่ระบบ', {
        id: 'header-action-button',
        description: 'กดเพื่อไปหน้าลงทะเบียน',
        position: 'top-right',
        action: (
          <Button
            size="small"
            sx={{ color: (theme) => theme.palette.primary.main }}
            onClick={() => {
              router.push(paths.auth.login);
              toast.dismiss('header-action-button');
            }}
          >
            ลงทะเบียน
          </Button>
        ),
      }),
    [router]
  );

  const toastIfNotAuthenticated = useCallback(() => {
    if (authenticated) return false;

    handleGuestClick();
    return true;
  }, [authenticated, handleGuestClick]);

  return toastIfNotAuthenticated;
};
