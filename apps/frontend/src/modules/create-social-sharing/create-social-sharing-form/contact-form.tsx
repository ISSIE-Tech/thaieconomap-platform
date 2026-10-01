'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import useGetDistricts from 'src/shared/hooks/use-get-districts';
import { fieldGridSx, mobileHeadingSx } from 'src/modules/form-wizard';
import { RHFTextField, RHFAutocomplete } from 'src/shared/components/hook-form';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
    <Box sx={fieldGridSx}>
      <Typography variant="body1" fontWeight="bold" sx={mobileHeadingSx}>
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
    </Box>
  );
};

export default ContactForm;
