'use client';

import type { FormSchema } from './form-schema';
import type { AnnouncementItem } from '../types';

import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { Form } from 'src/components/hook-form/form-provider';

import { formSchema } from './form-schema';
import { reformatFormData } from '../announcements-create/utils';
import useUpdateAnnouncements from '../_hooks/use-update-announcements';
import { AnnouncementInfoForm } from '../announcements-create/components/announcement-info-form';

type Props = {
  defaultValue: FormSchema;
  announcementData: AnnouncementItem;
};

export function AnnouncementsEditForm({ defaultValue, announcementData }: Props) {
  const router = useRouter();
  const updateAnnouncements = useUpdateAnnouncements();
  const methods = useForm({ defaultValues: defaultValue, resolver: zodResolver(formSchema) });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formatteddata = await reformatFormData(data);

      await updateAnnouncements.mutateAsync({ id: announcementData._id, params: formatteddata });
      toast.success('แก้ไขประกาศสำเร็จ');
      router.replace(paths.announcements.dashboard.list);
    } catch (error) {
      toast.error(error.display);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4}>
        <AnnouncementInfoForm />

        <Stack alignItems="flex-end">
          <LoadingButton type="submit" variant="contained" loading={updateAnnouncements.isPending}>
            ยืนยันการแก้ไข
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
