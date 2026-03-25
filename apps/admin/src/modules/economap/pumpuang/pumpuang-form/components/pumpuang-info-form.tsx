'use client';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormContext, Controller } from 'react-hook-form';

import { Field } from 'src/components/hook-form';

import { useGetPumpuangTypes } from '../../_hooks/use-get-pumpuang-types';

export function PumpuangInfoForm() {
  const { control } = useFormContext();
  const { data: pumpuangTypes = [] } = useGetPumpuangTypes();

  return (
    <Card>
      <CardHeader
        title="ข้อมูลลงทะเบียนรถพุ่มพวง"
        subheader="กรอกข้อมูลเบื้องต้นของรถพุ่มพวง"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="ชื่อรถพุ่มพวง" />

        <Controller
          name="types"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              multiple
              options={pumpuangTypes}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? pumpuangTypes.find((t) => t._id === option)?.name ?? option
                  : option.name
              }
              value={pumpuangTypes.filter((t) => field.value?.includes(t._id))}
              onChange={(_, newValue) => {
                field.onChange(newValue.map((v) => (typeof v === 'string' ? v : v._id)));
              }}
              isOptionEqualToValue={(option, value) => option._id === (typeof value === 'string' ? value : value._id)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={typeof option === 'string' ? option : option._id}
                    label={typeof option === 'string' ? option : option.name}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="ประเภทรถพุ่มพวง"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />

        <Field.Text name="owner" label="ชื่อเจ้าของ" />

        <Field.Text name="licensePlate" label="ทะเบียนรถ" />

        <Field.Text name="color" label="สีรถ" />

        <Field.Text name="phoneNumber" label="เบอร์โทรศัพท์" />

        <Field.Text
          name="moreInfo"
          label="ข้อมูลเพิ่มเติม"
          placeholder="เช่น สินค้าที่จำหน่าย เส้นทางที่ให้บริการ"
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );
}
