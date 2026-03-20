'use client';

import React from 'react';

import Card from '@mui/material/Card';
import { Stack, Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

import { Field } from 'src/components/hook-form';
import { DistrictsAutocomplete } from 'src/components/hook-form/custom-hook-form/districts-autocomplete';

export function SocialSharingContactForm() {
  return (
    <Card>
      <CardHeader
        title="ข้อมูลลงทะเบียนเจ้าของสิ่งของ"
        subheader="กรอกข้อมูลเบื้องต้นของเจ้าของสิ่งของ"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="ownerName" label="ชื่อ - นามสกุล" />
        <Field.Text name="phoneNumber" label="เบอร์โทรศัพท์" />

        <DistrictsAutocomplete />
      </Stack>
    </Card>
  );
}
