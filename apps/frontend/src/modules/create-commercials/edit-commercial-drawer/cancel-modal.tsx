import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import React from 'react';
import FormButton from 'src/shared/components/custom-buttons/form-button';

import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {
  openModal: UseBooleanReturn;
  handleCloseDrawer: () => void;
};

const CancelModal = ({ openModal, handleCloseDrawer }: Props) => (
  <Modal open={openModal.value} onClose={openModal.onFalse}>
    <Stack sx={{ height: '100vh', width: '100vw' }} justifyContent="center" alignItems="center">
      <Stack
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
          padding: '30px',
          borderRadius: '20px',
        }}
        spacing={2}
      >
        <Typography fontWeight="bold">ต้องการยกเลิกการแก้ไขใช่หรือไม่?</Typography>

        <FormButton
          onClick={handleCloseDrawer}
          label="ยกเลิกการแก้ไข"
          sx={{ mt: 0, paddingY: 1 }}
        />
        <Button
          variant="contained"
          sx={{
            py: 1,
            px: 2.5,
            borderRadius: 4,
            justifyContent: 'center',
          }}
          onClick={openModal.onFalse}
        >
          กลับ
        </Button>
      </Stack>
    </Stack>
  </Modal>
);

export default CancelModal;
