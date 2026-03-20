'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { primary } from 'src/theme/core';
import { type UseBooleanReturn } from 'src/shared/hooks/use-boolean';

type MaxFavoriteDialogProps = {
  controller: UseBooleanReturn;
};

export function MaxFavoriteDialog({ controller }: MaxFavoriteDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={controller.value} onClose={controller.onFalse}>
      <DialogTitle sx={{ typography: 'body1', fontWeight: 'bold', textAlign: 'center', pt: 2 }}>
        รายการโปรดของคุณเต็มแล้ว กรุณาลบรายการเก่าออก
      </DialogTitle>

      <DialogActions sx={{ justifyContent: 'space-between', pt: 0 }}>
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
          onClick={controller.onFalse}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
