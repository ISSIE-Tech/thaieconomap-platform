'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form } from 'src/components/hook-form';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { PumpuangInfoForm } from './components/pumpuang-info-form';
import { PumpuangOpeningDaysForm } from './components/pumpuang-opening-days-form';
import { pumpuangFormSchema, type PumpuangFormSchema } from './form-schema';

type Props = {
  mode: 'create' | 'edit';
  defaultValues?: PumpuangFormSchema;
  onSubmit: (data: PumpuangFormSchema) => Promise<void>;
  loading: boolean;
};

export function PumpuangForm({ mode, defaultValues: defaultValuesProp, onSubmit, loading }: Props) {
  const defaultValues = useMemo(
    () =>
      defaultValuesProp ?? {
        name: '',
        licensePlate: '',
        owner: '',
        color: '',
        phoneNumber: '',
        moreInfo: '',
        opening: [{ day: [], openTime: '', closeTime: '' }],
        types: [],
        thumbnail: [],
        images: [],
      },
    [defaultValuesProp]
  );

  const methods = useForm<PumpuangFormSchema>({
    defaultValues,
    resolver: zodResolver(pumpuangFormSchema),
  });

  const { handleSubmit } = methods;

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <PumpuangInfoForm />

        <PumpuangOpeningDaysForm />

        <ImagesForm
          name="thumbnail"
          title="รูปภาพหลัก"
          subheader="เพิ่มรูปภาพหลักของรถพุ่มพวง (1 รูปภาพ)"
        />

        <ImagesForm
          name="images"
          title="รูปภาพเพิ่มเติม"
          subheader="เพิ่มรูปภาพเพิ่มเติม (ไม่เกิน 20 รูปภาพ)"
        />

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {mode === 'create' ? 'ลงทะเบียนรถพุ่มพวง' : 'ยืนยันการแก้ไข'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
