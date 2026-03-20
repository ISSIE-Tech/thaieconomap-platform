'use client';

import Stack from '@mui/material/Stack';

import { DateCards, AnnoucementsHeader } from 'src/modules/announcements';
import AnnouncementsList from 'src/modules/announcements/announcements-list';

export default function AnnouncementPage() {
  return (
    <Stack minHeight="100vh" bgcolor={(theme) => theme.palette.common.background}>
      <AnnoucementsHeader />

      <DateCards />

      <AnnouncementsList />
    </Stack>
  );
}
