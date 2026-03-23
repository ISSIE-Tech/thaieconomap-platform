'use client';

import { useBoolean } from 'src/shared/hooks/use-boolean';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SharingBoardDrawer } from './sharing-board-drawer';

export function SharingFooter() {
  const sharingBoardController = useBoolean();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" py={2} px={3}>
      <Typography variant="body1" fontWeight="bold">
        บอร์ดแบ่งสิ่งของ
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ py: 1, px: 2, borderRadius: '9999px' }}
        onClick={sharingBoardController.onTrue}
      >
        ดูประกาศทั้งหมด
      </Button>

      <SharingBoardDrawer controller={sharingBoardController} />
    </Stack>
  );
}
