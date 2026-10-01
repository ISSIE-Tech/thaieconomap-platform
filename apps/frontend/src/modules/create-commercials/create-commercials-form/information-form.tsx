import type { District } from 'src/modules/commercials/_types/commercials.type';
import type { CommercialType, CommercialOptions } from '../_types/create-commercials.type';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFTextField, RHFAutocomplete } from 'src/shared/components/hook-form';
import { fullRowSx, fieldGridSx, mobileHeadingSx } from 'src/modules/form-wizard';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type Props = {
  commercialType: CommercialType;
  districts: District[];
  types: CommercialOptions[];
};

const InformationForm = ({ commercialType, districts, types }: Props) => {
  const { setValue, watch } = useFormContext();

  const selectedDistrictId = watch('district');

  const selectedTypeId = watch('types');

  const province = watch('province');

  const uniqueProvinces = Array.from(
    new Set(districts?.map((district) => `${district.provinceName}`))
  );

  const selectedDistrict = districts?.find(
    (district) => district._id.toString() === selectedDistrictId
  );

  /** ***************************************************
   * reset district value when province value is empty
   *************************************************** */

  useEffect(() => {
    if (!province) {
      // resetField('district') is not work with edit form because it reset to default value so it would be error when select new province
      setValue('district', '');
    }
  }, [province, setValue]);

  return (
    <Box sx={fieldGridSx}>
      <Typography variant="body1" fontWeight="bold" sx={mobileHeadingSx}>
        {`กรอกข้อมูล${commercialType}`}
      </Typography>
      <RHFTextField name="name" label={`ชื่อ${commercialType}`} sx={fullRowSx} />

      <RHFAutocomplete
        name="types"
        label={`ประเภท${commercialType}`}
        sx={fullRowSx}
        multiple
        freeSolo
        options={types}
        getOptionLabel={(option) => option?.name || null}
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
            {option.name}
          </li>
        )}
        value={selectedTypeId?.map((id: string) => types.find((type) => type._id === id)) || []}
        onChange={(event, newValue) => {
          setValue(
            'types',
            newValue.map((val: { name: string; _id: string }) => val?._id),
            { shouldValidate: true }
          );
        }}
        renderTags={(selected, getTagProps) =>
          selected
            .filter((option) => option?._id)
            .map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option._id}
                label={option.name}
                size="small"
                color="info"
                variant="soft"
              />
            ))
        }
      />

      <RHFTextField name="commercialOwner" label={`เจ้าของ${commercialType}`} />
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
        options={districts.filter((district) => district.provinceName === province)}
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

      <RHFTextField
        name="moreInfo"
        label="ข้อมูลเพิ่มเติม เช่น สถานที่จอดรถ"
        multiline
        rows={4}
        sx={fullRowSx}
      />
    </Box>
  );
};

export default InformationForm;
