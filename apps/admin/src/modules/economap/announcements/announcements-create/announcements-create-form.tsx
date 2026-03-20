'use client';

import { toast } from 'sonner';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form } from 'src/components/hook-form/form-provider';

import { formSchema } from './form-schema';
import { reformatFormData } from './utils';
import useCreateAnnouncements from '../_hooks/use-create-announcements';
import { AnnouncementInfoForm } from './components/announcement-info-form';

export function AnnouncementsCreateForm() {
  const createAnnouncements = useCreateAnnouncements();
  const defaultValues = useMemo(
    () => ({
      name: '',
      detail: '',
      districts: [],
      subDistricts: '',
      pdf: [],
      startAt: '',
      endAt: '',
      announcer: '',
      phoneNumber: '',
    }),
    []
  );

  const methods = useForm({ defaultValues, resolver: zodResolver(formSchema) });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formatteddata = await reformatFormData(data);

      await createAnnouncements.mutateAsync(formatteddata);
      toast.success('ลงทะเบียนประกาศสำเร็จ');
      reset();
    } catch (error) {
      toast.error(error.display);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4}>
        <AnnouncementInfoForm />

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={createAnnouncements.isPending}>
            ลงทะเบียนประกาศ
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
