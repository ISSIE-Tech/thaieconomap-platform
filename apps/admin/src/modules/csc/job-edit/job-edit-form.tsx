'use client';

import type { JobPost } from '../types';
import type { FormSchema } from './form-schema';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Stack, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Field } from 'src/components/hook-form';
import { Form } from 'src/components/hook-form/form-provider';
import { ImagesForm } from 'src/components/hook-form/custom-hook-form/images-form';

import { formSchema } from './form-schema';
import { toFormData, toFormValues } from './utils';
import { useUpdateJob } from '../_hooks/use-update-job';
import { useGetWageUnits, useGetJobCategories } from '../_hooks/use-csc-options';

type Props = {
  job: JobPost;
};

export function JobEditForm({ job }: Props) {
  const router = useRouter();
  const { data: categories = [] } = useGetJobCategories();
  const { data: wageUnits = [] } = useGetWageUnits();
  const { mutate, isPending } = useUpdateJob();

  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(job),
  });

  const onSubmit = methods.handleSubmit((values) =>
    mutate(
      { id: job._id, params: toFormData(values) },
      {
        onSuccess: () => {
          toast.success('แก้ไขข้อมูลสำเร็จ');
          router.push(paths.csc.dashboard.jobs.view('active', job._id));
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message ?? 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล'),
      }
    )
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Field.Text name="title" label="ชื่องาน" />

          <Field.Select name="category" label="ประเภทงาน">
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text name="description" label="รายละเอียดงานเบื้องต้น" multiline rows={3} />
          <Field.Text name="workload" label="ภาระงานโดยละเอียด" multiline rows={3} />
          <Field.Text name="qualification" label="คุณสมบัติที่ต้องการ" multiline rows={3} />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            <Field.Text name="applicants" label="จำนวนตำแหน่งที่เปิดรับ" type="number" />
            <Field.Text name="wageAmount" label="ค่าตอบแทน" type="number" />

            <Field.Select name="wageUnit" label="หน่วยค่าตอบแทน">
              {wageUnits.map((unit) => (
                <MenuItem key={unit._id} value={unit.name}>
                  {unit.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            <Field.DatePicker name="startDate" label="เริ่มงาน" />
            <Field.DatePicker name="endDate" label="สิ้นสุดงาน" />
            <Field.DatePicker name="closeDate" label="ปิดรับสมัคร" />
          </Box>

          <ImagesForm
            name="images"
            title="รูปภาพ"
            subheader="ลบรูปที่ไม่ต้องการ หรือเพิ่มรูปใหม่ได้"
          />

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <LoadingButton variant="outlined" onClick={() => router.back()}>
              ยกเลิก
            </LoadingButton>

            <LoadingButton type="submit" variant="contained" loading={isPending}>
              บันทึก
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </Form>
  );
}
