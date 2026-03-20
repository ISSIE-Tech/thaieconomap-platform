'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const defaultValues = {
  newType: '',
};

const validateSchema = zod.object({
  newType: zod.string().min(1, 'กรุณากรอกประเภทร้านอาหาร'),
});

// ----------------------------------------------------------------------

type Props = {
  createMutation: (variables: string, options?: any) => Promise<any>;
  isPending: boolean;
  label: string;
};

export default function CommercialTypeCreateForm({ createMutation, isPending, label }: Props) {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(validateSchema),
  });

  const { reset, handleSubmit } = methods;

  const dialog = useBoolean();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMutation(data.newType);

      toast.success(`เพิ่ม${data.newType}สำเร็จ`);

      onDialogClose();
    } catch (error) {
      console.log(error);

      toast.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  });

  const onDialogClose = () => {
    reset();
    dialog.onFalse();
  };

  // ----------------------------------------------------------------------

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={dialog.onTrue}
      >
        สร้าง{label}ใหม่
      </Button>

      <Dialog open={dialog.value} onClose={onDialogClose} fullWidth>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>สร้าง{label}ใหม่</DialogTitle>

          <DialogContent>
            <Typography sx={{ mb: 3 }}>กรุณากรอกชื่อ{label}ที่ต้องการ</Typography>

            <Field.Text name="newType" label={`${label}`} />
          </DialogContent>

          <DialogActions>
            <Button onClick={onDialogClose} variant="outlined" color="inherit">
              ยกเลิก
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isPending}>
              ยืนยัน
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
