import type { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { EconomapHeader } from 'src/modules/economap-headers';
import JobsSearchFilterBar from 'src/modules/jobs/jobs-search-filter-bar';

// ----------------------------------------------------------------------

export default function JobFindingLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="งานและอาชีพ" />

      <Box position="relative" flexGrow={1}>
        <JobsSearchFilterBar />

        {children}
      </Box>
    </Stack>
  );
}
