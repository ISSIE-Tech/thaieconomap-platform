import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { LatLngTuple } from 'leaflet';

import { BackDrawerButton } from '@/components/button';
import {
  FromProvider,
  RHFTextField,
  RHFLocation,
  RHFAutocomplete,
} from '@/components/hook-form';

import { Drawer } from '@mui/material';

import { useForm } from 'react-hook-form';
import RHFUpload from '@/components/hook-form/RHFUpload';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { ImageType } from '@/types/image';
import { useDistrictStore } from '@/store';
import { OptionType } from '@/types/form';
import { useAuth } from '@/auth/useAuth';

const defaultValues = {
  address: '',
  district: { label: '', value: '' },
};

const validationSchema = yup.object().shape({
  address: yup.string().required('ยังไม่ได้ดรอกชื่ออาคาร'),
  district: yup
    .object()
    .shape({
      label: yup.string().required('ยังไม่ได้เลือกเขตหรืออำเภอ'),
      value: yup.string().required('ยังไม่ได้เลือกเขตหรืออำเภอ'),
    })
    .typeError('ยังไม่ได้เลือกเขตหรืออำเภอ')
    .required('ยังไม่ได้เลือกเขตหรืออำเภอ'),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: any) => void;
};

const CreatePostThirdForm = ({ open, setOpen, onSubmit }: Props) => {
  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const districts = useDistrictStore((state) => state.districts);
  const { location: userLocation } = useAuth();

  // ----------------------------------------------------------------------

  const [location, setLocation] = useState<LatLngTuple | null>(null);
  const [images, setImages] = useState<ImageType[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;

  // ----------------------------------------------------------------------

  const validateLocationAndImage = (data: typeof defaultValues) => {
    // validate location
    if (!location) {
      enqueueSnackbar('กรุณาเลือกตำแหน่งที่ตั้ง', { variant: 'error' });
      return;
    }

    // validate image
    if (!images || !images[0]) {
      enqueueSnackbar('กรุณาอัพโหลดรูปภาพ (สูงสุด 6 รูป)', {
        variant: 'error',
      });
      return;
    }

    const forms = { ...data, location, images };

    onSubmit(forms);
  };

  // ----------------------------------------------------------------------

  return (
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
        <p className="absolute right-0 top-0">3/3</p>
      </section>

      <div className="flex flex-col gap-4 mt-6 pb-14">
        <FromProvider methods={methods}>
          <div className="flex flex-col gap-4">
            <RHFTextField name="address" label="ชื่ออาคาร หรือ สถานที่ทำงาน" />

            <RHFAutocomplete
              name="district"
              label="เขต/อำเภอ"
              options={districts.map((district) => ({
                label: `${district.districtName} จ.${district.provinceName}`,
                value: district._id,
              }))}
              getOptionLabel={(option) => (option as OptionType).label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </div>
        </FromProvider>

        <RHFLocation
          location={location}
          setLocation={setLocation}
          errors={''}
        />

        <RHFUpload images={images} setImages={setImages} />

        <button
          onClick={handleSubmit(validateLocationAndImage)}
          className="btn btn-solid w-fit"
        >
          สร้างประกาศงาน
        </button>
      </div>
    </Drawer>
  );
};

export default CreatePostThirdForm;
