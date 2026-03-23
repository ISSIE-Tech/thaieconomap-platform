import { useFormContext } from 'react-hook-form';
import { useGetDistricts } from 'src/modules/economap/commercial/_hooks/use-get-districts';

import { Stack } from '@mui/material';

import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export default function ManagerInfoForm() {
  const { data: districts } = useGetDistricts();

  const { setValue, watch } = useFormContext();
  const selectedDistrictIds = watch('districts') as string[];

  const selectedDistricts = districts?.filter((district) =>
    selectedDistrictIds?.includes(district._id)
  );

  return (
    <Stack spacing={2}>
      <RHFTextField name="name" label="ชื่อ - นามสกุล" fullWidth />
      <RHFTextField name="phone" label="เบอร์โทร" fullWidth />
      <RHFAutocomplete name="role" label="สิทธิผู้ใช้" options={['ADMIN', 'MANAGER']} fullWidth />
      <RHFAutocomplete
        multiple
        name="districts"
        label="เขต / อำเภอที่รับผิดชอบ"
        options={districts || []}
        getOptionLabel={(option) =>
          `${option.districtType}${option.districtName} จังหวัด${option.provinceName}`
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
    </Stack>
  );
}
