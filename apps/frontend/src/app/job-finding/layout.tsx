import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { JobsSidebar } from 'src/modules/jobs/jobs-sidebar';
import { EconomapHeader } from 'src/modules/economap-headers';
import JobsSearchFilterBar from 'src/modules/jobs/jobs-search-filter-bar';
import { mobileOnly, desktopOnly, mapScreenSx } from 'src/shared/components/map-sidebar/screen';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const metadata: Metadata = {
  title: 'งานและอาชีพในชุมชน',
  description: 'หางานใกล้บ้าน ประกาศรับสมัครงานและอาชีพในชุมชน ทั้งงานประจำ งานพาร์ทไทม์ และงานรายวัน',
  alternates: { canonical: '/job-finding' },
};

// ----------------------------------------------------------------------

export default function JobFindingLayout({ children }: PropsWithChildren) {
  return (
    <Stack height="100vh" overflow="hidden">
      <EconomapHeader title="งานและอาชีพ" />

      <Box sx={mapScreenSx}>
        <Box sx={desktopOnly}>
          <JobsSidebar />
        </Box>

        <Box position="relative" flexGrow={1} minWidth={0}>
          {/* stays mounted on desktop too: it syncs the category query param */}
          <Box sx={mobileOnly}>
            <JobsSearchFilterBar />
          </Box>

          {children}
        </Box>
      </Box>
    </Stack>
  );
}
