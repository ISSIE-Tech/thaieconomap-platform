import type { PumpuangItem } from '../../type';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ECONOMAP_STATUS } from 'src/modules/economap/_config/economap-status.config';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import type { AlertColor } from '@mui/material/Alert';

import { useBoolean, type UseBooleanReturn } from 'src/hooks/use-boolean';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Carousel, useCarousel } from 'src/components/carousel';

import { useRejectPumpuang } from '../../_hooks/use-reject-pumpuang';
import { useApprovePumpuang } from '../../_hooks/use-approve-pumpuang';

// ----------------------------------------------------------------------

type Props = {
  drawerController: UseBooleanReturn;
  row: PumpuangItem;
};

const defaultValues = {
  rejectMessage: '',
};

const validateSchema = zod.object({
  rejectMessage: zod.string().min(1, 'กรุณากรอกเหตุผล'),
});

// ----------------------------------------------------------------------

export default function PumpuangTableRowDrawer({ drawerController, row }: Props) {
  const carousel = useCarousel({
    loop: true,
    slidesToShow: '70%',
    slideSpacing: '20px',
  });

  const approveDialog = useBoolean();

  const rejectDialog = useBoolean();

  const approvePumpuang = useApprovePumpuang();

  const rejectPumpuang = useRejectPumpuang();

  const methods = useForm({ defaultValues, resolver: zodResolver(validateSchema) });

  // ----------------------------------------------------------------------

  const handleApprove = useCallback(async () => {
    try {
      await approvePumpuang.mutateAsync(row._id);
      toast.success('อนุมัติเรียบร้อยแล้ว');
      approveDialog.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  }, [approveDialog, approvePumpuang, row._id]);

  const handleReject = methods.handleSubmit(async (data) => {
    try {
      await rejectPumpuang.mutateAsync({ id: row._id, message: data.rejectMessage });
      toast.success('ไม่อนุมัติเรียบร้อยแล้ว');
      rejectDialog.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการไม่อนุมัติ');
    }
  });

  // ----------------------------------------------------------------------

  const renderAlert = () => {
    const getVariants = (): { title: string; severity: AlertColor } | null => {
      switch (row?.submissionStatus) {
        case ECONOMAP_STATUS.PENDING:
          return { title: 'ประกาศนี้อยู่ในระหว่างการตรวจสอบ', severity: 'warning' };
        case ECONOMAP_STATUS.REJECTED:
          return { title: 'ประกาศนี้ถูกปฏิเสธการอนุมัติแล้ว', severity: 'error' };
        case ECONOMAP_STATUS.REMOVED:
          return { title: 'ประกาศนี้ถูกลบออกแล้ว', severity: 'error' };
        default:
          return null;
      }
    };

    const variants = getVariants();

    if (!variants) return null;

    return (
      <Alert variant="outlined" severity={variants.severity}>
        <Typography variant="body2">{variants.title}</Typography>

        {row?.submissionMessage && (
          <>
            <Typography variant="caption" display="block" sx={{ textDecoration: 'underline' }}>
              สาเหตุที่ไม่อนุมัติ
            </Typography>
            <Typography variant="caption" whiteSpace="pre-line">
              {row?.submissionMessage}
            </Typography>
          </>
        )}
      </Alert>
    );
  };

  // ----------------------------------------------------------------------

  const renderPendingActionButtons = row?.submissionStatus === ECONOMAP_STATUS.PENDING && (
    <Stack direction="row" justifyContent="end" spacing={1}>
      <Button variant="text" color="inherit" onClick={rejectDialog.onTrue}>
        ไม่อนุมัติ
      </Button>

      <Button variant="outlined" color="success" onClick={approveDialog.onTrue}>
        อนุมัติ
      </Button>
    </Stack>
  );

  // ----------------------------------------------------------------------

  return (
    <Drawer
      open={drawerController.value}
      onClose={drawerController.onFalse}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 360 } }}
    >
      {renderAlert()}

      <Scrollbar>
        <Stack px={3} pt={3} pb={1.5}>
          <Typography variant="h3">{row?.name}</Typography>

          <Typography variant="body2" color="primary.main" pt={1}>
            {row?.types?.map((type) => type.name).join(', ')}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack direction="row" spacing={3}>
            <Stack alignItems="center" spacing={0.5}>
              <Stack
                p={0.8}
                sx={{
                  border: '1px solid',
                  borderRadius: '100%',
                  borderColor: (theme) => theme.palette.primary.main,
                  bgcolor: 'primary.main',
                }}
              >
                <Iconify icon="solar:phone-rounded-bold" color="white" width={20} />
              </Stack>
              <Typography variant="body2" color="primary.main" fontWeight="bold">
                ติดต่อ
              </Typography>
            </Stack>

            <Stack alignItems="center" spacing={0.5}>
              <Stack
                p={0.6}
                sx={{
                  border: '1px solid',
                  borderRadius: '100%',
                  borderColor: (theme) => theme.palette.primary.main,
                }}
              >
                <Iconify icon="solar:route-bold" color="primary.main" width={24} />
              </Stack>
              <Typography variant="body2">เส้นทาง</Typography>
            </Stack>

            <Stack alignItems="center" spacing={0.5}>
              <Stack
                p={1}
                sx={{
                  border: '1px solid',
                  borderRadius: '100%',
                  borderColor: (theme) => theme.palette.grey[400],
                }}
              >
                <Iconify
                  icon="solar:star-bold"
                  width={18}
                  sx={{ color: (theme) => theme.palette.grey[400] }}
                />
              </Stack>
              <Typography variant="body2">บันทึก</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Image src={row?.imageUrl} alt="commercial image" ratio="4/3" height={200} />

        <Stack p={3} spacing={3}>
          <Stack spacing={2}>
            <Typography variant="body1" fontWeight="bold">
              ข้อมูลรถพุ่มพวง
            </Typography>
            <Grid container>
              <Grid size={1} pt={0.2}>
                <Iconify icon="solar:clock-circle-linear" width={16} />
              </Grid>

              <Grid size={11}>
                {row?.displayOpening.map((opening) => (
                  <Stack key={opening.days} direction="row" spacing={1.5}>
                    <Typography variant="body2" fontWeight="bold">
                      {opening.days}
                    </Typography>
                    <Typography variant="body2">
                      {opening.time.map((time) => `${time.open} - ${time.close}`).join(', ')}
                    </Typography>
                  </Stack>
                ))}
              </Grid>
            </Grid>

            {row?.moreInfo && (
              <>
                <Divider />

                <Grid container>
                  <Grid size={1} pt={0.2}>
                    <Iconify icon="solar:info-circle-linear" width={16} />
                  </Grid>

                  <Grid size={11}>
                    <Typography variant="body2">{row?.moreInfo}</Typography>
                  </Grid>
                </Grid>
              </>
            )}
            <Divider />

            <Grid container>
              <Grid size={1} display="flex" alignItems="center">
                <Iconify icon="solar:user-linear" width={16} />
              </Grid>

              <Grid size={11}>
                <Typography variant="body2">{row?.owner}</Typography>
              </Grid>
            </Grid>

            {row?.additionalImageUrl.length > 0 && (
              <Stack spacing={1.5}>
                <Typography variant="body1" fontWeight="bold">
                  รูปภาพร้าน
                </Typography>

                <Carousel carousel={carousel}>
                  {row?.additionalImageUrl.map((item) => (
                    <Image key={item} alt={item} src={item} ratio="4/3" />
                  ))}
                </Carousel>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Scrollbar>

      <Stack direction="row" p={2.5} spacing={1} alignItems="center" justifyContent="flex-end">
        {renderPendingActionButtons}
      </Stack>

      <ConfirmDialog
        open={approveDialog.value}
        onClose={approveDialog.onFalse}
        title="ยืนยันการอนุมัติ"
        content="คุณต้องการอนุมัติประกาศนี้ใช่หรือไม่"
        action={
          <LoadingButton
            variant="contained"
            color="success"
            onClick={handleApprove}
            loading={approvePumpuang.isPending}
          >
            อนุมัติ
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={rejectDialog.value}
        onClose={rejectDialog.onFalse}
        title="ยืนยันการไม่อนุมัติ"
        content={
          <Box py={1}>
            <Form methods={methods}>
              <Field.Text
                name="rejectMessage"
                label="เหตุผลที่ไม่อนุมัติประกาศนี้"
                multiline
                rows={3}
              />
            </Form>
          </Box>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleReject}
            loading={rejectPumpuang.isPending}
          >
            ไม่อนุมัติ
          </LoadingButton>
        }
      />
    </Drawer>
  );
}
