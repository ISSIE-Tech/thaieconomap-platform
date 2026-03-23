import { Image } from 'src/shared/components/image';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  isFullScreen?: boolean;
};

export const FormLoading = ({ isFullScreen }: Props) => (
  <Stack
    position="relative"
    height={isFullScreen ? '100vh' : '100%'}
    alignItems="center"
    justifyContent="center"
    zIndex={3000}
    // bgcolor="white"
  >
    <Image
      src="/assets/icons/logo.svg"
      alt="logo"
      width={48}
      height={48}
      sx={{ position: 'absolute', inset: 0, m: 4 }}
    />

    <Stack spacing={4} alignItems="center">
      <Stack
        justifyContent="center"
        sx={{
          animation: 'bounce 2s infinite',
        }}
      >
        <Image src="/assets/illustrations/success.svg" alt="logo" width={240} height={240} />
      </Stack>

      {/* <Typography variant="h1" fontFamily="Poppins" alignSelf="flex-start">
        economap
      </Typography>

      <Typography variant="h6" textAlign="center">
        เริ่มต้นประสบการณ์ใหม่ในแต่ละชุมชนไปกับเรา
      </Typography> */}

      <Stack direction="row" alignItems="center" justifyContent="center" spacing={4}>
        <CircularProgress />

        <Typography variant="body1">กรุณารอสักครู่...</Typography>
      </Stack>
    </Stack>
  </Stack>
);
