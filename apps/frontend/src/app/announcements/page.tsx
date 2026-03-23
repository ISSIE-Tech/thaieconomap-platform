'use client';

import { DateCards, AnnoucementsHeader } from 'src/modules/announcements';
import AnnouncementsList from 'src/modules/announcements/announcements-list';

import Stack from '@mui/material/Stack';

export default function AnnouncementPage() {
  return (
    <Stack minHeight="100vh" bgcolor={(theme) => theme.palette.common.background}>
      <AnnoucementsHeader />

      <DateCards />

      <AnnouncementsList />
    </Stack>
  );
}
