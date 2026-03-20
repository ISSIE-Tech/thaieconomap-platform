'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useGetDistricts from 'src/shared/hooks/use-get-districts';
import { RHFTextField, RHFAutocomplete } from 'src/shared/components/hook-form';

const ContactForm = () => {
  const { setValue, watch } = useFormContext();

  const { data: districts } = useGetDistricts();

  const selectedDistrictId = watch('district');

  const selectedDistrict = districts?.find(
    (district) => district._id.toString() === selectedDistrictId
  );

  const province = watch('province');

  const uniqueProvinces = Array.from(
    new Set(districts?.map((district) => `${district.provinceName}`))
  );

  useEffect(() => {
    if (!province) {
      setValue('district', '');
    }
  }, [province, setValue]);

  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold">
        กรอกข้อมูลสิ่งของ
      </Typography>
      <RHFTextField name="ownerName" label="ชื่อ - นามสกุล" />

      <RHFTextField name="phoneNumber" label="เบอร์โทรศัพท์" />

      <RHFAutocomplete
        name="province"
        label="จังหวัด"
        options={uniqueProvinces}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
      />
      <RHFAutocomplete
        disabled={province == null}
        name="district"
        label="เขต/อำเภอ"
        options={districts?.filter((district) => district.provinceName === province) || []}
        getOptionLabel={(option) => option?.districtName || ''}
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
            {option.districtName}
          </li>
        )}
        value={selectedDistrict || null}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(event, newValue) => {
          setValue('district', newValue?._id.toString(), { shouldValidate: true });
        }}
      />
    </Stack>
  );
};

export default ContactForm;
