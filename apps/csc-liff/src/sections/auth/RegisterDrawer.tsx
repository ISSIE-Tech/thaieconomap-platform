import { useState } from 'react';
import * as yup from 'yup';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { BackDrawerButton } from '@/components/button';
import { FromProvider, RHFTextField } from '@/components/hook-form';
import { Drawer } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import RHFDatePicker from '@/components/hook-form/RHFDatePicker';
import { useAuth } from '@/auth/useAuth';
import axios from '@/utils/axios';
import { useSnackbar } from 'notistack';

const defaultValues = {
  name: '',
  birthDate: new Date(),
  phoneNumber: '',
  experiences: '',
};

export const RegisterValidationSchema = yup.object().shape({
  name: yup.string().required('กรุณากรอกชื่อและนามสกุล'),
  birthDate: yup.string().required('กรูณาเลือกวันเกิด'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'ใส่เพียงตัวเลขเท่านั้น')
    .min(10, 'เบอร์โทรศัพท์ไม่ถูกต้อง')
    .max(10, 'เบอร์โทรศัพท์ไม่ถูกต้อง')
    .typeError('ใส่เพียงตัวเลขเท่านั้น')
    .required('กรุณากรอกเบอร์โทรศัพท์'),
  experiences: yup.string().required('กรุณากรอกประวัติการทำงาน'),
});

// ----------------------------------------------------------------------

export default function RegisterDrawer() {
  const { tokenId } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  type FormValues = typeof defaultValues;

  // text inputs submit strings and yup casts them (number/date); keep the form's
  // value type as the defaults so nothing about the submitted payload changes
  const methods = useForm<FormValues>({
    resolver: yupResolver(RegisterValidationSchema) as unknown as Resolver<FormValues>,
    defaultValues,
    // mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/auth/register', { ...data, tokenId });

      // A full load, so AuthProvider authenticates the new account and sets its session;
      // a client-side push would leave the app signed out until it is reopened. A job
      // asked for from thaieconomap is still in sessionStorage and opens after that.
      window.location.replace('/');
    } catch (error) {
      enqueueSnackbar('ระบบมีปัญหา กรูณาลองใหม่อีกครั้ง', { variant: 'error' });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <button className="btn btn-solid w-full" onClick={toggleDrawer(true)}>
        สร้างโปรไฟล์
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            padding: '1rem 1.5rem 4rem',
            overflowX: 'hidden',
          },
        }}
      >
        <header className="flex items-start justify-between">
          <BackDrawerButton label="กลับ" toggleDrawer={toggleDrawer} />
          <Image
            src="/assets/illustrations/Progressing.svg"
            alt="Progressin image"
            className="relative -top-4 -right-6"
            width={144}
            height={144}
          />
        </header>

        <section>
          <h1 className="text-3xl font-bold">
            สร้างโปรไฟล์
            <br />
            สมัครงานของคุณ
          </h1>
          <p className="text-lg text-ink mt-6">
            กรอกข้อมูลของคุณด้านล่าง​
            <br /> เพื่อเริ่มใช้งานเชี่ยวแชร์
          </p>
        </section>

        <section className="mt-8">
          <FromProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <RHFTextField name="name" label="ชื่อและนามสกุล" />
              <RHFDatePicker name="birthDate" label="วันเกิด" />
              <RHFTextField name="phoneNumber" label="เบอร์โทรศัพท์" />
              <RHFTextField
                name="experiences"
                label="คุณเคยทำอะไรมาก่อน?"
                multiline
                rows={4}
              />
            </div>

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              sx={{ color: '#000' }}
            >
              <span className="pr-2.5">ยืนยันเชื่อมต่อ Line </span>
              {!isSubmitting && (
                <Image
                  src="/assets/icons/social/Line.svg"
                  alt="something"
                  width={25}
                  height={25}
                />
              )}
            </LoadingButton>
          </FromProvider>
        </section>
      </Drawer>
    </div>
  );
}
