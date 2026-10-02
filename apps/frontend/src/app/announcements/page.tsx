'use client';

import { useState } from 'react';
import { useIsDesktop } from 'src/shared/hooks/use-is-desktop';
import { DateCards, AnnoucementsHeader } from 'src/modules/announcements';
import { DesktopHeader } from 'src/modules/economap-headers/desktop-header';
import AnnouncementsList from 'src/modules/announcements/announcements-list';
import { AnnouncementArticle } from 'src/modules/announcements/annoucement-detail-drawer';
import DistrictsAutocomplete from 'src/modules/announcements/districts-autocomplete/districts-autocomplete';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function AnnouncementPage() {
  const isDesktop = useIsDesktop();
  const [selectedId, setSelectedId] = useState('');

  if (!isDesktop)
    return (
      <Stack minHeight="100vh" bgcolor={(theme) => theme.palette.common.background}>
        <AnnoucementsHeader />

        <DateCards />

        <AnnouncementsList />
      </Stack>
    );

  return (
    <Stack height="100vh" overflow="hidden">
      <DesktopHeader />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '420px minmax(0, 1fr)',
        }}
      >
        <Stack
          component="aside"
          minHeight={0}
          minWidth={0}
          bgcolor="common.white"
          sx={{
            borderRight: '1px solid #EFF1F3',
            boxShadow: '0px 1px 10px 1px #4876D31A',
            zIndex: 1,
          }}
        >
          <DateCards />

          <Box px={3} pb={2.5}>
            <DistrictsAutocomplete />
          </Box>

          <AnnouncementsList selectedId={selectedId} onSelect={setSelectedId} />
        </Stack>

        <Box sx={{ overflowY: 'auto', bgcolor: '#F5FBFF', px: 5, py: 4 }}>
          {selectedId && <AnnouncementArticle id={selectedId} />}
        </Box>
      </Box>
    </Stack>
  );
}
