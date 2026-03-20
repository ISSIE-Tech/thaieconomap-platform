import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';

import { useGetDistricts } from 'src/modules/economap/commercial/_hooks/use-get-districts';

import { RHFAutocomplete } from '../rhf-autocomplete';

export function DistrictsAutocomplete() {
  const { setValue, watch } = useFormContext();

  const { data: districts } = useGetDistricts();

  const currentProvince = watch('province');

  const selectedDistrictId = watch('district');

  const selectedDistrict = districts?.find((district) => district._id === selectedDistrictId);

  const provinces = Array.from(new Set(districts?.map((district) => district.provinceName)));

  useEffect(() => {
    if (!currentProvince) {
      // resetField('district') is not work with edit form because it reset to default value so it would be error when select new currentProvince
      setValue('district', '');
    }
  }, [currentProvince, setValue]);
  return (
    <Stack spacing={3}>
      {districts && (
        <>
          <RHFAutocomplete
            name="province"
            label="จังหวัด"
            options={provinces}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
          <RHFAutocomplete
            disabled={currentProvince == null}
            name="district"
            label="เขต/อำเภอ"
            options={districts.filter((district) => district.provinceName === currentProvince)}
            getOptionLabel={(option) => option?.districtName || ''}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.districtName}
              </li>
            )}
            value={selectedDistrict || null}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, newValue) => {
              setValue('district', newValue?._id, { shouldValidate: true });
            }}
          />
        </>
      )}
    </Stack>
  );
}
