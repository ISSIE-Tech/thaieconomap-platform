'use client';

import type { CommercialType } from './types';

import { toast } from 'sonner';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form } from 'src/components/hook-form';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { reformatFormData } from './utils';
import { formSchema } from './form-schema';
import useCreateCommercials from '../_hooks/use-create-commercial';
import { CommercialInfoForm } from './components/commercial-info-form';
import useCreateAdditionalImage from '../_hooks/use-create-additional-images';
import CommercialOpeningDaysForm from './components/commercial-opening-days-form';

type Props = {
  commercialType: CommercialType;
};

export function CommercialCreateForm({ commercialType }: Props) {
  const { mutateAsync: createAdditionalImage } = useCreateAdditionalImage();
  const { mutateAsync: createCommercials } = useCreateCommercials();

  const loading = useBoolean();

  const defaultValues = useMemo(
    () => ({
      types: [],
      name: '',
      phoneNumber: '',
      commercialOwner: '',
      province: null,
      district: null,
      moreInfo: '',
      opening: [{ day: [], openTime: '', closeTime: '' }],
      location: { latitude: 0, longitude: 0 },
      thumbnail: [],
      images: [],
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      loading.onTrue();

      const formatteddata = await reformatFormData(
        data,
        commercialType,
        createAdditionalImage,
        loading
      );

      await createCommercials(formatteddata);

      reset();
      toast.success(`ลงทะเบียน${data.name}สำเร็จ`);
      loading.onFalse();
    } catch (error) {
      console.log(error);
      toast.error(error.display);
      loading.onFalse();
    }
  });

  // ----------------------------------------------------------------------

  const CommercialLocationForm = useMemo(
    () =>
      dynamic(() => import('./components/commercial-location-form'), {
        loading: () => <p>Map loading...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <CommercialInfoForm commercialType={commercialType} />

        <CommercialOpeningDaysForm commercialType={commercialType} />

        <CommercialLocationForm />

        <ImagesForm
          name="thumbnail"
          title="รูปภาพแบนเนอร์"
          subheader="เพิ่มรูปภาพแบนเนอร์ของร้าน (1 รูปภาพ)"
        />

        <ImagesForm
          name="images"
          title="รูปภาพเพิ่มเติม"
          subheader="เพิ่มรูปภาพเพิ่มเติมของร้าน (ไม่เกิน 20 รูปภาพ)"
        />

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={loading.value}>
            {`ลงทะเบียน${commercialType}`}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
