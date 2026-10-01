import type { PropsWithChildren } from 'react';

import { EconomapHeader } from 'src/modules/economap-headers';
import CommercialTabs from 'src/modules/commercials/commercial-tabs';
import { CommercialSidebar } from 'src/modules/commercials/commercial-sidebar';
import SearchFilterBar from 'src/modules/commercials/commercial-search-filter-bar';
import { mobileOnly, desktopOnly, mapScreenSx } from 'src/shared/components/map-sidebar/screen';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function CommercialLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="แผนที่ธุรกิจ" />

      <Box sx={mapScreenSx}>
        <Box sx={desktopOnly}>
          <CommercialSidebar />
        </Box>

        <Box sx={mobileOnly}>
          <CommercialTabs />
        </Box>

        <Box position="relative" flexGrow={1} minWidth={0}>
          {/* stays mounted on desktop too: it syncs the filter query params */}
          <Box sx={mobileOnly}>
            <SearchFilterBar />
          </Box>

          {children}
        </Box>
      </Box>
    </Stack>
  );
}
