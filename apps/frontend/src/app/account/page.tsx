import React from 'react';
import { UserProfile } from 'src/modules/account';
import AccountMenu from 'src/modules/account/account-menu';
import { EconomapHeader } from 'src/modules/economap-headers';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <Stack width="100vw" height="100vh">
      <EconomapHeader title="จัดการบัญชี" />

      <UserProfile />

      <Box flexGrow={1}>
        <AccountMenu />
      </Box>
    </Stack>
  );
}
