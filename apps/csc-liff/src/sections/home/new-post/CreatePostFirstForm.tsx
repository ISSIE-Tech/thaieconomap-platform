import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { Drawer } from '@mui/material';
import { BackDrawerButton } from '@/components/button';
import {
  FromProvider,
  RHFTextField,
  RHFAutocomplete,
  RHFBulletTextArea,
} from '@/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePostStore } from '@/store';

// ----------------------------------------------------------------------

const defaultValues = {
  title: '',
  category: '',
  description: '',
  qualification: '- ',
  workload: '- ',
};

export type FirstFormDataType = typeof defaultValues;

const validationSchema = yup.object().shape({
  title: yup.string().required('ยังไม่ได้กรอกชื่องาน'),
  category: yup
    .string()
    .typeError('ยังไม่ได้เลือกประเภทงาน')
    .required('ยังไม่ได้เลือกประเภทงาน'),
  description: yup.string().required('ยังไม่ได้กรอกรายละเอียดงาน'),
  qualification: yup
    .string()
    .trim()
    .notOneOf(['-'], 'ยังไม่ได้กรอกภาระงาน')
    .required('ยังไม่ได้กรอกภาระงาน'),
  workload: yup
    .string()
    .trim()
    .notOneOf(['-'], 'ยังไม่ได้กรอกคุณสมบัติ')
    .required('ยังไม่ได้กรอกคุณสมบัติ'),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: FirstFormDataType) => void;
};

export default function CreatePostFirstForm({
  open,
  setOpen,
  onSubmit,
}: Props) {
  const categories = usePostStore((state) => state.categories);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const form = (
    <FromProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 mt-6 pb-14">
        <RHFTextField name="title" label="ชื่องาน" />
        <RHFAutocomplete
          name="category"
          label="ประเภทงาน"
          options={categories.map((c) => c.name)}
        />
        <div>
          <p className="mb-4 text-lg text-ink">รายละเอียดงานเบื้องต้น</p>
          <RHFTextField
            name="description"
            placeholder="กรอกรายละเอียด เช่น งานประจำ ตำแหน่ง วันทำงาน"
            multiline
            rows={4}
          />
        </div>
        <div>
          <p className="mb-4 text-lg text-ink">ภาระงานโดยละเอียด</p>
          <RHFBulletTextArea
            name="qualification"
            placeholder="ภาระงานที่ต้องทราบ"
          />
        </div>
        <div>
          <p className="mb-4 text-lg text-ink">คุณสมบัติที่ต้องการ</p>
          <RHFBulletTextArea
            name="workload"
            placeholder="กรอกรายละเอียดเช่น วุฒิการศึกษา ความสามารถ"
          />
        </div>

        <input
          type="submit"
          className="btn btn-solid w-fit px-14 mt-2"
          value="ถัดไป"
        />
      </div>
    </FromProvider>
  );

  // ----------------------------------------------------------------------

  return (
    <>
      {/* Toggle Button */}
      <button
        className="btn btn-solid w-full mt-6 text-lg"
        onClick={toggleDrawer(true)}
      >
        สร้างประกาศงานใหม่
      </button>

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
          <p className="absolute right-0 top-0">1/3</p>
        </section>

        <section>{form}</section>
      </Drawer>
    </>
  );
}
