'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { timeStringToMinutes } from '../../_utils/time-transform';
import { useCreatePumpuang } from '../_hooks/use-create-pumpuang';
import useUploadPumpuangImage from '../_hooks/use-upload-pumpuang-image';
import { PumpuangForm } from '../pumpuang-form/pumpuang-form';
import type { PumpuangFormSchema } from '../pumpuang-form/form-schema';

export function PumpuangCreateView() {
  const router = useRouter();
  const loading = useBoolean();
  const { mutateAsync: createPumpuang } = useCreatePumpuang();
  const { mutateAsync: uploadImage } = useUploadPumpuangImage();

  const handleSubmit = useCallback(
    async (data: PumpuangFormSchema) => {
      try {
        loading.onTrue();

        // Upload additional images first
        let additionalImageUrls: string[] = [];
        const imageFiles = data.images.filter((img): img is File => img instanceof File);
        if (imageFiles.length > 0) {
          const formData = new FormData();
          imageFiles.forEach((file) => formData.append('image', file));
          const uploadRes = await uploadImage(formData);
          additionalImageUrls = uploadRes.data ?? uploadRes;
        }

        // Build FormData for create
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

        if (additionalImageUrls.length > 0) {
          formData.append('additionalImageUrl', JSON.stringify(additionalImageUrls));
        }

        // Thumbnail
        const thumbnailFile = data.thumbnail.find((img): img is File => img instanceof File);
        if (thumbnailFile) {
          formData.append('image', thumbnailFile);
        }

        await createPumpuang(formData);
        toast.success('ลงทะเบียนรถพุ่มพวงสำเร็จ');
        router.push(paths.pumpuang.dashboard.list);
      } catch (error: any) {
        console.error(error);
        toast.error(error?.display ?? 'เกิดข้อผิดพลาด');
      } finally {
        loading.onFalse();
      }
    },
    [createPumpuang, uploadImage, loading, router]
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        ลงทะเบียนรถพุ่มพวง
      </Typography>

      <PumpuangForm mode="create" onSubmit={handleSubmit} loading={loading.value} />
    </DashboardContent>
  );
}
