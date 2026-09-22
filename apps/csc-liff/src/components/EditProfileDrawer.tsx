import React, { useEffect, useState } from 'react';

import { SwiperDrawer } from './drawer';
import { InformationBox, InformationLabel } from './information-box';
import { FromProvider, RHFTextField } from './hook-form';
import RHFDatePicker from './hook-form/RHFDatePicker';

import { useAuth } from '@/auth/useAuth';
import { RegisterValidationSchema } from '@/sections/auth/RegisterDrawer';
import { formatDateThai, formatPhoneNumber } from '@/utils/form';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '@/utils/axios';

export default function EditProfileDrawer() {
  const { user, setProfile } = useAuth();

  // ----------------------------------------------------------------------

  const defaultValues = {
    name: user?.name || '',
    birthDate: user?.birthDate || '',
    phoneNumber: user?.phoneNumber || '',
    experiences: user?.experiences || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(RegisterValidationSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSave = async (form: typeof defaultValues) => {
    try {
      const { data } = await axios.patch('/users/profile', form);

      setProfile(data.profile);
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------------------------------------------------------

  return (
    <InformationBox title="ข้อมูลส่วนตัวผู้ประกาศงาน">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user?.profileImageUrl}
        alt="user"
        className="w-16 h-16 rounded-full border border-main-green"
      />
      <InformationLabel title="ชื่อ-สกุล" desc={user?.name || 'ไม่ทราบ'} />
      <InformationLabel
        title="เกิดวันที่"
        desc={user?.birthDate ? formatDateThai(user?.birthDate) : 'ไม่ทราบ'}
      />
      <InformationLabel
        title="เบอร์ติดต่อ"
        desc={formatPhoneNumber(user?.phoneNumber)}
      />
      <InformationLabel
        title="เคยประกอบอาชีพ"
        desc={user?.experiences || 'ไม่ทราบ'}
      />

      <div>
        <SwiperDrawer
          label="แก้ไขโปรไฟล์ของคุณ"
          onCancel={() => {}}
          onSave={handleSubmit(onSave)}
          isValid={isValid}
        >
          <header>
            <h1 className="font-bold text-lg">ข้อมูลส่วนตัวผู้ประกาศงาน</h1>
            <p className="mt-4 text-main-red">
              *บันทึกข้อมูลมีผลต่อทุกประกาศงานของคุณ
            </p>
          </header>

          <FromProvider methods={methods}>
            <div className="mt-6 space-y-4">
              <RHFTextField name="name" label="ชื่อและนามสกุล" />
              <RHFDatePicker name="birthDate" label="วันเกิด" />
              <RHFTextField name="phoneNumber" label="เบอร์โทรศัพท์" />
              <RHFTextField
                name="experiences"
                label="คุณเคยทำอะไรมาก่อน"
                multiline
                rows={4}
              />
            </div>
          </FromProvider>
        </SwiperDrawer>
      </div>
    </InformationBox>
  );
}
