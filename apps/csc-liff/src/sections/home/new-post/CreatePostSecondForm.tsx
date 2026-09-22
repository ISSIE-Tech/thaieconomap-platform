import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { BackDrawerButton } from '@/components/button';
import { FromProvider, RHFAutocomplete } from '@/components/hook-form';
import RHFTextField from '@/components/hook-form/RHFTextField';
import RHFDatePicker from '@/components/hook-form/RHFDatePicker';

import { Drawer } from '@mui/material';
import EditProfileDrawer from '@/components/EditProfileDrawer';
import { usePostStore } from '@/store';

// ----------------------------------------------------------------------

const defaultValues = {
  applicants: '',
  startDate: '',
  endDate: '',
  closeDate: '',
  wage: '',
  wageUnit: '',
};

export type SecondFormDataType = typeof defaultValues;

const validationSchema = yup.object().shape({
  applicants: yup
    .number()
    .min(1, 'ต้องมีตำแหน่งอย่างน้อย 1 ตำแหน่ง')
    .typeError('กรอกเฉพาะตัวเลยเท่านั้น')
    .required('ยังไม่ได้กรอกจำนวนตำแหน่ง'),
  startDate: yup
    .string()
    .typeError('ยังไม่ได้เลือกวันเริ่มงาน')
    .required('ยังไม่ได้เลือกวันเริ่มงาน'),
  endDate: yup
    .string()
    .typeError('ยังไม่ได้เลือกวันสิ้นสุดงาน')
    .required('ยังไม่ได้เลือกวันสิ้นสุดงาน'),
  closeDate: yup
    .string()
    .typeError('ยังไม่ได้เลือกวันปิดประกาศ')
    .required('ยังไม่ได้เลือกวันปิดประกาศ'),
  wage: yup
    .number()
    .min(0, 'ยังไม่ได้กรอกค่าตอบแทน')
    .typeError('ยังไม่ได้กรอกค่าตอบแทน')
    .required('ยังไม่ได้กรอกค่าตอบแทน'),
  wageUnit: yup
    .string()
    .typeError('ยังไม่ได้เลือกหน่วย')
    .required('ยังไม่ได้เลือกหน่วย'),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: SecondFormDataType) => void;
};

const CreatePostPostSecondForm = ({ open, setOpen, onSubmit }: Props) => {
  const wageUnits = usePostStore((state) => state.wageUnits);

  // ----------------------------------------------------------------------

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  type FormValues = typeof defaultValues;

  // text inputs submit strings and yup casts them (number/date); keep the form's
  // value type as the defaults so nothing about the submitted payload changes
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<FormValues>,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const form = (
    <div className="pb-14 mt-6">
      <FromProvider methods={methods}>
        <div className="flex flex-col gap-4">
          <RHFTextField name="applicants" label="จำนวนตำแหน่งที่เปิดรับ" />
          <div className="flex gap-3">
            <RHFDatePicker name="startDate" label="เริ่มงาน" />
            <RHFDatePicker name="endDate" label="สิ้นสุดงาน" />
          </div>
          <RHFDatePicker name="closeDate" label="วันที่ปิดรับสมัคร" />

          <div>
            <p className="mb-4 text-lg text-ink">ค่าตอบแทน</p>
            <div className="flex gap-3">
              <RHFTextField name="wage" label="ค่าตอบแทนทั้งหมด" />
              <RHFAutocomplete
                name="wageUnit"
                label="หน่วย"
                options={wageUnits.map((unit) => 'บาท' + unit.name)}
                fullWidth
              />
            </div>
          </div>
        </div>
      </FromProvider>

      <div className="my-4">
        <p className="mb-4 text-lg text-ink relative top-2">
          ข้อมูลส่วนตัวผู้ประกาศงาน
        </p>

        <EditProfileDrawer />
      </div>

      <button
        className="btn btn-solid w-fit px-14 mt-2"
        onClick={handleSubmit(onSubmit)}
      >
        ถัดไป
      </button>
    </div>
  );

  // ----------------------------------------------------------------------

  return (
    <>
      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '100vw', padding: '1rem 1.5rem', overflowX: 'hidden' },
        }}
      >
        <BackDrawerButton label="กลับ" toggleDrawer={toggleDrawer} />

        <Image
          src="/assets/illustrations/Progressing.svg"
          alt="backdrop icon"
          width={132}
          height={120}
          className="absolute top-1.5 right-1.5 -z-10"
        />

        <section className="mt-28 relative">
          <h1 className="text-2xl font-bold">สร้างโพสประกาศงาน</h1>
          <p className="absolute right-0 top-0">2/3</p>
        </section>

        <section>{form}</section>
      </Drawer>
    </>
  );
};

export default CreatePostPostSecondForm;
