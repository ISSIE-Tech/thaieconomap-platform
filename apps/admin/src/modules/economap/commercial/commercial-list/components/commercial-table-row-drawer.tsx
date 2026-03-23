import type { CommercialItem } from '../../types';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { paths } from 'src/routes/paths';

import { useBoolean, type UseBooleanReturn } from 'src/hooks/use-boolean';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Carousel, useCarousel } from 'src/components/carousel';

import { useRejectCommercial } from '../../_hooks/use-reject-commercials';
import { ECONOMAP_STATUS } from '../../../_config/economap-status.config';
import { useApproveCommercial } from '../../_hooks/use-approve-commercial';
import { COMMERCIAL_CATEGORY_TRANSLATIONS } from '../../_configs/commercial-category.config';

// ----------------------------------------------------------------------

type Props = {
  drawerController: UseBooleanReturn;
  row: CommercialItem;
};

const defaultValues = {
  rejectMessage: '',
};

const validateSchema = zod.object({
  rejectMessage: zod.string().min(1, 'กรุณากรอกเหตุผล'),
});

export default function CommercialTableRowDrawer({ drawerController, row }: Props) {
  const router = useRouter();

  const { mutateAsync: approveCommercial, isPending: approvePending } = useApproveCommercial();

  const { mutateAsync: rejectCommercial, isPending: rejectPending } = useRejectCommercial();

  const carousel = useCarousel({
    loop: true,
    slidesToShow: '70%',
    slideSpacing: '20px',
  });

  const approveDialog = useBoolean();
  const rejectDialog = useBoolean();
  const editIsLoading = useBoolean();

  const methods = useForm({ defaultValues, resolver: zodResolver(validateSchema) });

  // ----------------------------------------------------------------------

  const handleApprove = async () => {
    try {
      await approveCommercial(row._id);
      toast.success('อนุมัติเรียบร้อยแล้ว');
      approveDialog.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleReject = methods.handleSubmit(async (data) => {
    try {
      await rejectCommercial({ id: row._id, message: data.rejectMessage });
      toast.success('ไม่อนุมัติเรียบร้อยแล้ว');
      rejectDialog.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('เกิดข้อผิดพลาดในการไม่อนุมัติ');
    }
  });

  const handleEdit = async () => {
    editIsLoading.onTrue();
    try {
      await router.replace(paths.commercial.dashboard.edit(row._id));
    } catch (error) {
      console.error(error);
    } finally {
      editIsLoading.onFalse();
    }
  };

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

  const renderPendingActionButtons = row?.submissionStatus === ECONOMAP_STATUS.PENDING && (
    <Stack direction="row" justifyContent="end">
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

          <Stack direction="row" spacing={1} alignItems="center">
            {row?.category && (
              <Typography variant="body2">
                {COMMERCIAL_CATEGORY_TRANSLATIONS[row.category]}
              </Typography>
            )}

            {/* <Label color="success">เปิดอยู่</Label> */}
          </Stack>

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
              ข้อมูลร้าน
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
                <Typography variant="body2">{row?.commercialOwner}</Typography>
              </Grid>
            </Grid>
          </Stack>

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
      </Scrollbar>

      <Stack direction="row" p={2.5} spacing={1} alignItems="center" justifyContent="space-between">
        <LoadingButton
          variant="outlined"
          color="warning"
          loading={editIsLoading.value}
          onClick={handleEdit}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="material-symbols:edit"
              width={14}
              sx={{ color: (theme) => theme.palette.warning.main }}
            />
            <Typography variant="body2">แก้ไขข้อมูล</Typography>
          </Stack>
        </LoadingButton>

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
            loading={approvePending}
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
            loading={rejectPending}
          >
            ไม่อนุมัติ
          </LoadingButton>
        }
      />
    </Drawer>
  );
}
