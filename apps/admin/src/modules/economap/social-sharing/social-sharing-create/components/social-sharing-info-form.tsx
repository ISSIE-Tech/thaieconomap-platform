'use client';


import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Field } from 'src/components/hook-form';

import { SocialSharingAutocomplete } from './social-sharing-autocomplete';

// ----------------------------------------------------------------------

export function SocialSharingInfoForm() {
  return (
    <Card>
      <CardHeader
        title="ข้อมูลลงทะเบียนสิ่งของ"
        subheader="กรอกข้อมูลเบื้องต้นของสิ่งของ"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="ชื่อสิ่งของ" />
        <SocialSharingAutocomplete />

        <Stack direction="row" spacing={2}>
          <Field.Text name="amount" label="จำนวน" type="number" />
          <Field.Text name="unit" label="หน่วย" />
        </Stack>
      </Stack>
    </Card>
  );
}
