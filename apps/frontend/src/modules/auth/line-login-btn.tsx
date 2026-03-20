'use client';

import Image from 'next/image';

import Button from '@mui/material/Button';

import { useGetLineLoginUrl } from './_hooks/use-get-line-login-url';

// ----------------------------------------------------------------------

export function LineLoginBtn() {
  const { mutateAsync: getLineLoginUrl } = useGetLineLoginUrl();

  const redirectToLineLoginPage = async () => {
    const lineLoginUrl = await getLineLoginUrl();

    window.location.replace(lineLoginUrl);
  };

  return (
    <Button
      variant="contained"
      sx={{
        py: 1.5,
        px: 2.5,
        borderRadius: 4,
        justifyContent: 'flex-start',
      }}
      startIcon={
        <Image src="/assets/images/line-brand.png" alt="Line brand icon" width="24" height="24" />
      }
      onClick={redirectToLineLoginPage}
    >
      เชื่อมกับบัญชี Line
    </Button>
  );
}
