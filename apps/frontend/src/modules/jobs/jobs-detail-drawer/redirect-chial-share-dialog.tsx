'use client';

import { useCallback } from 'react';
import { common, primary } from 'src/theme/core';
import { type UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

type RedirectChialShareDialogProps = {
  controller: UseBooleanReturn;
};

export function RedirectChialShareDialog({ controller }: RedirectChialShareDialogProps) {
  // send to chial share
  const redirectToChialShare = useCallback(() => {
    controller.onFalse();

    // TODO: change this link
    // We don't have the link yet, do we?
    window.open('https://www.issie-chula.org/', '_blank');
  }, [controller]);

  return (
    <Dialog fullWidth maxWidth="xs" open={controller.value} onClose={controller.onFalse}>
      <DialogTitle sx={{ typography: 'body1', fontWeight: 'bold', textAlign: 'center', pt: 2 }}>
        ต้องการเปลี่ยนไปเข้าสู่ระบบของ <br /> &quot;เชื่ยวแชร์ แคร์เรีย&quot; ?
      </DialogTitle>

      <DialogActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Button
          sx={{
            width: '100%',
            bgcolor: common.background,
            color: primary.main,
            '&:hover': {
              bgcolor: common.background,
            },
            borderRadius: '9999px',
          }}
          onClick={controller.onFalse}
        >
          ยกเลิก
        </Button>

        <Button
          sx={{
            width: '100%',
            bgcolor: primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: primary.dark,
            },
            borderRadius: '9999px',
          }}
          onClick={redirectToChialShare}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
