import type { PropsWithChildren } from 'react';

import { EconomapHeader } from 'src/modules/economap-headers';
import { SharingFooter } from 'src/modules/sharings/sharing-footer/sharing-footer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function CommercialLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="ช่วยเหลือแบ่งปัน" />

      <Box flexGrow={1}>{children}</Box>

      <SharingFooter />
    </Stack>
  );
}
