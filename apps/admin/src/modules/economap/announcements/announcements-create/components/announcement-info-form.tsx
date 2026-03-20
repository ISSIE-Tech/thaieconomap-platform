import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { Field } from 'src/components/hook-form';
import { PDFUploadForm } from 'src/components/hook-form/custom-hook-form/file-upload/pdf-upload-form';
import { RHFDatePickerISOFormat } from 'src/components/hook-form/custom-hook-form/date-picker-iso-format';

import { DistrictsMultiAutocomplete } from './districts-multi-autocomplete';

export function AnnouncementInfoForm() {
  return (
    <Card>
      <CardHeader title="กรอกข้อมูลเบื้องต้นของประกาศ" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="ชื่อโพลประกาศ" />
        <DistrictsMultiAutocomplete />
        <Field.Text
          name="subDistricts"
          label="แขวงหรือตำบลที่มีผล"
          placeholder="ไม่จำเป็นต้องใส่"
          multiline
          rows={4}
        />
        <Stack direction="row" gap={4}>
          <RHFDatePickerISOFormat name="startAt" label="มีผลตั้งแต่วันที่" />
          <RHFDatePickerISOFormat name="endAt" label="วันที่สิ้นสุด" />
        </Stack>
        <Field.Text name="detail" label="ข้อมูล" multiline rows={8} />
        <Field.Text name="announcer" label="ชื่อผู้ประกาศ" />
        <Field.Text name="phoneNumber" label="เบอร์โทรศัพท์" />

        <PDFUploadForm name="pdf" />
      </Stack>
    </Card>
  );
}
