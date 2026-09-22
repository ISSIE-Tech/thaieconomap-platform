import { useState } from 'react';

import { Button, Dialog, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onReject: (rejectMessage: string) => void;
};

export function RejectDialog({ open, onClose, onReject }: Props) {
  const [reason, setReason] = useState('');

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>คุณยืนยันที่จะปฏิเสธ?</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="ระบุเหตุผล"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button
          variant="contained"
          color="error"
          disabled={!reason.trim()}
          onClick={() => {
            onReject(reason.trim());
            setReason('');
            onClose();
          }}
        >
          ปฏิเสธ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
