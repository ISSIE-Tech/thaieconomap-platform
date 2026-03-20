'use client';

import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form } from 'src/components/hook-form';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { formSchema } from './form-schema';
import { reformatFormData } from './utils';
import useCreateSocialSharing from '../_hooks/use-create-social-sharing';
import useCreateAdditionalImage from '../_hooks/use-create-additional-image';
import { SocialSharingInfoForm } from './components/social-sharing-info-form';
import { SocialSharingContactForm } from './components/social-sharing-contact-form';

export function SocialSharingForm() {
  const { mutateAsync: createAdditionalImage } = useCreateAdditionalImage();
  const createSocialSharing = useCreateSocialSharing();

  const loading = useBoolean();

  const defaultValues = useMemo(
    () => ({
      name: '',
      types: [],
      condition: '',
      amount: 0,
      unit: '',
      detail: '',
      moreDetail: '',
      ownerName: '',
      phoneNumber: '',
      province: null,
      district: null,
      location: { latitude: 0, longitude: 0 },
      thumbnail: [],
      images: [],
    }),
    []
  );

  const methods = useForm({ defaultValues, resolver: zodResolver(formSchema) });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      loading.onTrue();
      const formatteddata = await reformatFormData(data, createAdditionalImage, loading);

      await createSocialSharing.mutateAsync(formatteddata);

      reset();
      toast.success('ลงทะเบียนสิ่งของสำเร็จ');
      loading.onFalse();
    } catch (error) {
      console.log(error);
      toast.error(error.display);
      loading.onFalse();
    }
  });

  // ----------------------------------------------------------------------

  const SocialSharingLocationForm = useMemo(
    () =>
      dynamic(() => import('./components/social-sharing-location-form'), {
        loading: () => <p>Map loading...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <SocialSharingInfoForm />

        <SocialSharingContactForm />

        <SocialSharingLocationForm />

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
            ลงทะเบียนสิ่งของ
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
