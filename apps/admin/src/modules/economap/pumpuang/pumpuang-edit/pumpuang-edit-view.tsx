'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { minutesToTimeString, timeStringToMinutes } from '../../_utils/time-transform';
import { useGetPumpuang } from '../_hooks/use-get-pumpuang';
import { useUpdatePumpuang } from '../_hooks/use-update-pumpuang';
import useUploadPumpuangImage from '../_hooks/use-upload-pumpuang-image';
import { PumpuangForm } from '../pumpuang-form/pumpuang-form';
import type { PumpuangFormSchema } from '../pumpuang-form/form-schema';

type Props = {
  pumpuangId: string;
};

export function PumpuangEditView({ pumpuangId }: Props) {
  const router = useRouter();
  const loading = useBoolean();
  const { data: pumpuangResponse, isLoading } = useGetPumpuang(pumpuangId);
  const { mutateAsync: updatePumpuang } = useUpdatePumpuang();
  const { mutateAsync: uploadImage } = useUploadPumpuangImage();

  const pumpuang = pumpuangResponse?.data;

  const defaultValues = useMemo<PumpuangFormSchema | undefined>(() => {
    if (!pumpuang) return undefined;

    return {
      name: pumpuang.name,
      licensePlate: pumpuang.licensePlate,
      owner: pumpuang.owner,
      color: pumpuang.color,
      phoneNumber: pumpuang.phoneNumber,
      moreInfo: pumpuang.moreInfo ?? '',
      opening: pumpuang.opening.map((o) => ({
        day: o.day ? [o.day] : [],
        openTime: o.hours?.[0] ? minutesToTimeString(o.hours[0].open) : '',
        closeTime: o.hours?.[0] ? minutesToTimeString(o.hours[0].close) : '',
      })),
      types: pumpuang.types.map((t) => t._id),
      thumbnail: pumpuang.imageUrl ? [pumpuang.imageUrl] : [],
      images: pumpuang.additionalImageUrl ?? [],
    };
  }, [pumpuang]);

  const handleSubmit = useCallback(
    async (data: PumpuangFormSchema) => {
      try {
        loading.onTrue();

        // Upload new additional images
        let additionalImageUrls: string[] = [];
        const existingUrls = data.images.filter((img): img is string => typeof img === 'string');
        const newFiles = data.images.filter((img): img is File => img instanceof File);

        if (newFiles.length > 0) {
          const formData = new FormData();
          newFiles.forEach((file) => formData.append('image', file));
          const uploadRes = await uploadImage(formData);
          additionalImageUrls = [...existingUrls, ...(uploadRes.data ?? uploadRes)];
        } else {
          additionalImageUrls = existingUrls;
        }

        // Build FormData for update
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('licensePlate', data.licensePlate);
        formData.append('owner', data.owner);
        formData.append('color', data.color);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('moreInfo', data.moreInfo ?? '');
        const openingPayload = data.opening.flatMap((o) =>
          o.day.map((d) => ({
            enable: true,
            day: d,
            hours: [
              {
                open: timeStringToMinutes(o.openTime),
                close: timeStringToMinutes(o.closeTime),
              },
            ],
          }))
        );
        formData.append('opening', JSON.stringify(openingPayload));
        formData.append('types', JSON.stringify(data.types));
        formData.append('additionalImageUrl', JSON.stringify(additionalImageUrls));

        // Thumbnail - only append if it's a new file
        const thumbnailFile = data.thumbnail.find((img): img is File => img instanceof File);
        if (thumbnailFile) {
          formData.append('image', thumbnailFile);
        }

        await updatePumpuang({ id: pumpuangId, params: formData });
        toast.success('แก้ไขรถพุ่มพวงสำเร็จ');
        router.push(paths.pumpuang.dashboard.list);
      } catch (error: any) {
        console.error(error);
        toast.error(error?.display ?? 'เกิดข้อผิดพลาด');
      } finally {
        loading.onFalse();
      }
    },
    [updatePumpuang, uploadImage, loading, router, pumpuangId]
  );

  if (isLoading) {
    return (
      <DashboardContent>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
          <CircularProgress />
        </Stack>
      </DashboardContent>
    );
  }

  if (!pumpuang || !defaultValues) {
    return (
      <DashboardContent>
        <Typography>ไม่พบข้อมูลรถพุ่มพวง</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        แก้ไขรถพุ่มพวง: {pumpuang.name}
      </Typography>

      <PumpuangForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={loading.value}
      />
    </DashboardContent>
  );
}
