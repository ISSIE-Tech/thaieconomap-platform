'use client';


import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { Form } from 'src/components/hook-form';

import { formSchema } from '../form-schema';
import ManagerInfoForm from './manager-info-form';
import { useRegisterManager } from '../../_hooks/use-register-manager';

import type { ManagerItem } from '../../types';
import type { FormSchema} from '../form-schema';

// ----------------------------------------------------------------------

type Props = {
  manager: ManagerItem;
  defaultValues: FormSchema;
};

export default function ManagerEditForm({ manager, defaultValues }: Props) {
  const router = useRouter();
  const updateManager = useRegisterManager();

  const methods = useForm({ defaultValues, resolver: zodResolver(formSchema) });

  const { handleSubmit } = methods;

  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    try {
      const jsonData = {
        name: data.name,
        phone: data.phone,
        role: data.role,
        districts: data.districts,
      };

      await updateManager.mutateAsync({ id: manager.shortId, params: jsonData });

      toast.success('แก้ไขข้อมูลสำเร็จ');
      router.replace(paths.user.dashboard.root);
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 }, marginBottom: '80px' }}
      >
        <Card>
          <CardHeader title="แก้ไขข้อมูล" subheader="แก้ไขข้อมูลส่วนตัวของผู้ดูแล" sx={{ mb: 3 }} />

          <Divider />

          <Stack direction="row" spacing={5} sx={{ p: 3 }}>
            <Avatar
              alt={manager.name}
              src={manager.profileImageUrl}
              sx={{ width: 320, height: 320 }}
            />

            <Stack width="100%">
              <ManagerInfoForm />

              <Stack alignItems="end" marginTop={4}>
                <LoadingButton type="submit" variant="contained" loading={updateManager.isPending}>
                  ยืนยันการแก้ไข
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Form>
  );
}
