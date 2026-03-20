'use client';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Image } from 'src/shared/components/image';

import { useAuthContext } from '../auth/_hooks/use-auth-context';

export function UserProfile() {
  const { user } = useAuthContext();
  const theme = useTheme();

  return (
    <Stack
      py={4}
      alignItems="center"
      spacing={2}
      sx={{ backgroundColor: theme.palette.common.background }}
    >
      <Stack position="relative">
        <Image
          src={user?.profileImageUrl ?? '/assets/illustrations/default-profile.svg'}
          width="6rem"
          borderRadius="100%"
        />
      </Stack>

      <Stack alignItems="center">
        <Typography variant="h2">{user?.name}</Typography>
        <Typography variant="body1" color={theme.palette.grey['500']}>
          ID: {user?.shortId}
        </Typography>
      </Stack>
    </Stack>
  );
}
