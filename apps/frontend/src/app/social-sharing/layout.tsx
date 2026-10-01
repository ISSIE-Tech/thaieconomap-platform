import type { PropsWithChildren } from 'react';

import { EconomapHeader } from 'src/modules/economap-headers';
import { SharingSidebar } from 'src/modules/sharings/sharing-sidebar';
import { SharingFooter } from 'src/modules/sharings/sharing-footer/sharing-footer';
import { mobileOnly, desktopOnly, mapScreenSx } from 'src/shared/components/map-sidebar/screen';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function CommercialLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="ช่วยเหลือแบ่งปัน" />

      <Box sx={mapScreenSx}>
        <Box sx={desktopOnly}>
          <SharingSidebar />
        </Box>

        <Box flexGrow={1} minWidth={0}>
          {children}
        </Box>
      </Box>

      <Box sx={mobileOnly}>
        <SharingFooter />
      </Box>
    </Stack>
  );
}
