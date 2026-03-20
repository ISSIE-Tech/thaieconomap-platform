import type { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { EconomapHeader } from 'src/modules/economap-headers';
import CommercialTabs from 'src/modules/commercials/commercial-tabs';
import SearchFilterBar from 'src/modules/commercials/commercial-search-filter-bar';

// ----------------------------------------------------------------------

export default function CommercialLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="แผนที่ธุรกิจ" />

      <CommercialTabs />

      <Box position="relative" flexGrow={1}>
        <SearchFilterBar />

        {children}
      </Box>
    </Stack>
  );
}
