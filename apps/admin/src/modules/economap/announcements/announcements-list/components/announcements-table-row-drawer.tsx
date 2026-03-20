import type { UseBooleanReturn } from 'src/hooks/use-boolean';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Stack, Button, Drawer, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { createFileFormUrl } from 'src/utils/get-file-form-url';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ANNOUNCEMENT_STATUS, ANNOUNCEMENT_STATUS_TRANSLATIONS } from '../../types';

import type { AnnouncementItem } from '../../types';

type Props = {
  drawerController: UseBooleanReturn;
  row: AnnouncementItem;
};
export function AnnouncementsTableRowDrawer({ drawerController, row }: Props) {
  const router = useRouter();
  const editIsLoading = useBoolean();
  const startDate = new Date(row.startAt);
  const endDate = new Date(row.endAt);
  const [pdfFile, setPdfFile] = useState<File>();

  const handleEdit = async () => {
    editIsLoading.onTrue();
    try {
      await router.replace(paths.announcements.dashboard.edit(row._id));
    } catch (error) {
      console.error(error);
    } finally {
      editIsLoading.onFalse();
    }
  };

  const handlePreviewClick = (preview: File | null) => {
    if (preview) {
      const previewUrl = URL.createObjectURL(preview);
      window.open(previewUrl, '_blank');
    }
  };

  const createPdfFile = useCallback(async () => {
    const file = await createFileFormUrl([row.pdfUrl], 'pdf');
    setPdfFile(file[0]);
  }, [row.pdfUrl]);

  const statusStyle = () => {
    switch (ANNOUNCEMENT_STATUS[row.status]) {
      case ANNOUNCEMENT_STATUS.ANNOUNCED:
        return 'success';
      case ANNOUNCEMENT_STATUS.PENDING:
        return 'warning';
      case ANNOUNCEMENT_STATUS.EXPIRED:
        return 'error';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    if (!pdfFile) {
      createPdfFile();
    }
  }, [createPdfFile, pdfFile]);

  return (
    <Drawer
      open={drawerController.value}
      onClose={drawerController.onFalse}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 360 } }}
    >
      <Scrollbar>
        <Stack px={3} pt={3} pb={1.5} spacing={4}>
          <Stack spacing={1}>
            <Grid container alignItems="center">
              <Grid xs={9}>
                <Typography variant="h3">{row.name}</Typography>
              </Grid>
              <Grid xs={3}>
                <Label variant="soft" color={statusStyle()}>
                  {ANNOUNCEMENT_STATUS_TRANSLATIONS[row.status]}
                </Label>
              </Grid>
            </Grid>

            {row.subDistricts && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:map-point-outline" width={16} />
                <Typography>มีผลใช้ในพื้นที่{row.subDistricts}</Typography>
              </Stack>
            )}

            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:map-point-outline" width={16} />
              <Typography>
                {row.districts.map((district) => `${district.districtName}`).join(', ')}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="body1" fontWeight="bold">
              ประกาศ
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:clock-circle-linear" width={16} />
              <Typography>{`${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`}</Typography>
            </Stack>
          </Stack>
          <Divider />

          <Grid container alignItems="center">
            <Grid xs={1}>
              <Iconify icon="solar:info-circle-linear" width={16} />
            </Grid>
            <Grid xs={11}>
              <Typography
                sx={{
                  wordWrap: 'break-word',
                }}
              >
                {row.detail}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:user-linear" width={16} />
              <Typography>{row.announcer}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:phone-rounded-linear" width={16} />

              <Typography>{row.phoneNumber}</Typography>
            </Stack>
          </Stack>
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
              width={16}
              sx={{ color: (theme) => theme.palette.warning.main }}
            />
            <Typography variant="body2">แก้ไขข้อมูล</Typography>
          </Stack>
        </LoadingButton>

        {pdfFile && (
          <Button variant="contained" onClick={() => handlePreviewClick(pdfFile)}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:code-file-line-duotone" width={16} />
              <Typography>ไฟล์ประกาศ</Typography>
            </Stack>
          </Button>
        )}
      </Stack>
    </Drawer>
  );
}
