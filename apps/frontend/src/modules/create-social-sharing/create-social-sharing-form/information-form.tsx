import type { ShareOptions } from '../_types/create-social-sharing.type';

import { useFormContext } from 'react-hook-form';
import { RHFTextField, RHFAutocomplete } from 'src/shared/components/hook-form';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  types: ShareOptions[];
  conditions: ShareOptions[];
};

const InformationForm = ({ types, conditions }: Props) => {
  const { setValue, watch } = useFormContext();

  const selectedTypeId = watch('types');

  const selectedConditionId = watch('condition');

  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold">
        กรอกข้อมูลสิ่งของ
      </Typography>
      <RHFTextField name="name" label="ชื่อสิ่งของ" />

      <RHFAutocomplete
        name="types"
        label="ประเภทสิ่งของ"
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

      <RHFAutocomplete
        name="condition"
        label="สภาพสิ่งของ"
        options={conditions}
        getOptionLabel={(option) => option?.name || ''}
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
            {option.name}
          </li>
        )}
        value={conditions.find((condition) => condition._id === selectedConditionId) || null}
        onChange={(event, newValue) => {
          setValue('condition', newValue?._id || '', { shouldValidate: true });
        }}
      />

      <Stack direction="row" spacing={2}>
        <RHFTextField name="amount" label="จำนวน" type="number" />
        <RHFTextField name="unit" label="หน่วย" />
      </Stack>
      <RHFTextField name="detail" multiline rows={4} label="ข้อมูลเพิ่มเติม เช่น เซรามิกสีขาว" />
      <RHFTextField name="moreDetail" multiline rows={4} label="เพิ่มเติม" />
    </Stack>
  );
};

export default InformationForm;
