import { useFormContext } from 'react-hook-form';
import { useGetDistricts } from 'src/modules/economap/commercial/_hooks/use-get-districts';

import { RHFAutocomplete } from 'src/components/hook-form';

export function DistrictsMultiAutocomplete() {
  const { data: districts } = useGetDistricts();

  const { watch, setValue } = useFormContext();

  const selectedDistrictIds = watch('districts') as string[];

  const selectedDistricts = districts?.filter((district) =>
    selectedDistrictIds?.includes(district._id)
  );
  return (
    <RHFAutocomplete
      multiple
      name="districts"
      label="เขตที่ประกาศ"
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
  );
}
