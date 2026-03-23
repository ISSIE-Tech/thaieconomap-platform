'use client';

import type { CommercialType } from '../types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Field, RHFTextField } from 'src/components/hook-form';
import { DistrictsAutocomplete } from 'src/components/hook-form/custom-hook-form/districts-autocomplete';

import RestaurantTypesAutocomplete from './restaurant-types-autocomplete';

// ----------------------------------------------------------------------

type Props = {
  commercialType: CommercialType;
};

export function CommercialInfoForm({ commercialType }: Props) {
  return (
    <Card>
      <CardHeader
        title={`ข้อมูลลงทะเบียน${commercialType}`}
        subheader={`กรอกข้อมูลเบื้องต้นของ${commercialType}`}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="name" label={`ชื่อ${commercialType}`} />

        <RestaurantTypesAutocomplete commercialType={commercialType} />

        <Field.Text name="commercialOwner" label="ชื่อเจ้าของร้าน" />

        <Field.Text name="phoneNumber" label="เบอร์โทรศัพท์" />

        <DistrictsAutocomplete />

        <Field.Text
          name="moreInfo"
          label="ข้อมูลเพิ่มเติม"
          placeholder="เช่น สถานที่จอดรถ สามารถจ่ายเงินด้วยบัตรเครดิตได้"
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );
}
