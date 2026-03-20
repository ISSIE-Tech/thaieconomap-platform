'use client';

import { toast } from 'sonner';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';

import { paths } from 'src/routes/paths';

import { useGetDistricts } from 'src/modules/economap/commercial/_hooks/use-get-districts';

import { Form, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { USER_ROLE } from '../types';
import { formSchema } from './form-schema';
import { useRegisterManager } from '../_hooks/use-register-manager';

const RegisterForm = () => {
  const { data: districts } = useGetDistricts();

  const registerManager = useRegisterManager();

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      id: '',
      name: '',
      districts: [],
      role: '',
      phone: '',
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, setValue, watch } = methods;

  const selectedDistrictIds = watch('districts') as string[];

  const selectedDistricts = districts?.filter((district) =>
    selectedDistrictIds?.includes(district._id)
  );

  const onSubmit = handleSubmit(async (data) => {
    const jsonData = {
      name: data.name,
      role: data.role,
      districts: data.districts,
      phone: data.phone,
    };

    await registerManager.mutateAsync(
      { id: data.id, params: jsonData },
      {
        onSuccess: () => {
          router.replace(paths.user.dashboard.root);
          toast.success('ลงทะเบียนผู้จัดการใหม่เรียบร้อย');
        },
        onError: () => {
          toast.error('เกิดข้อผิดพลาดในการลงทะเบียน');
        },
      }
    );
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="id" label="id" />

        <RHFTextField name="name" label="ชื่อ - นามสกุล" />

        <RHFTextField name="phone" label="เบอร์โทร" />

        <RHFAutocomplete
          multiple
          name="districts"
          label="เขต / อำเภอที่รับผิดชอบ"
          options={districts || []}
          getOptionLabel={(option) =>
            `${option.districtType}${option.districtName} จังหวัด${option.provinceName}` || ''
          }
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              {option.districtType}
              {option.districtName} จังหวัด{option.provinceName}
            </li>
          )}
          value={selectedDistricts || []}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={(event, newValues) => {
            const newDistrictIds = newValues.map((item: any) => item._id);
            setValue('districts', newDistrictIds, { shouldValidate: true });
          }}
        />

        <RHFAutocomplete name="role" label="สิทธิผู้ใช้" options={Object.values(USER_ROLE)} />

        <Stack alignItems="end">
          <LoadingButton type="submit" variant="contained" loading={registerManager.isPending}>
            ยืนยันการลงทะเบียน
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
};

export default RegisterForm;
