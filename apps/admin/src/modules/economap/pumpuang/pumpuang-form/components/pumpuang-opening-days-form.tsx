import Image from 'next/image';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import DatePicker from 'src/components/hook-form/custom-hook-form/date-picker';
import { RHFTimePickerCustom } from 'src/components/hook-form/custom-hook-form/rhf-time-picker-custom';

export function PumpuangOpeningDaysForm() {
  const { control, getValues } = useFormContext();

  const DAY_OF_WEEK = [
    { value: 'Monday', label: 'จ' },
    { value: 'Tuesday', label: 'อ' },
    { value: 'Wednesday', label: 'พ' },
    { value: 'Thursday', label: 'พฤ' },
    { value: 'Friday', label: 'ศ' },
    { value: 'Saturday', label: 'ส' },
    { value: 'Sunday', label: 'อา' },
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'opening',
  });

  useEffect(() => {
    const opening = getValues('opening') || [];
    if (fields.length === 0 && opening.length > 0) {
      opening.forEach(() => append({ day: [], openTime: '', closeTime: '' }));
    }
  }, [fields, append, getValues]);

  const srcIcon = fields.length > 1 ? '/assets/icons/bin-red.svg' : '/assets/icons/bin-grey.svg';

  return (
    <Card>
      <CardHeader
        title="ข้อมูลช่วงเวลา"
        subheader="กรอกช่วงเวลาที่รถพุ่มพวงเปิดให้บริการ"
        sx={{ mb: 3 }}
      />

      <Divider sx={{ mb: 3 }} />

      {fields.map((field, index) => (
        <Stack key={field.id} justifyContent="center" alignItems="center">
          <Stack
            sx={{
              width: '75%',
              padding: '18px',
              border: 1,
              borderRadius: '20px',
              borderColor: (theme) => theme.palette.grey[200],
              boxShadow: '3px 5px 3px rgba(0, 0, 0, 0.1)',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <Typography fontWeight="bold">ข้อมูลวันทำการ {index + 1}</Typography>

            <DatePicker
              name={`opening.${index}.day`}
              options={DAY_OF_WEEK}
              defaultValue={getValues(`opening.${index}.day`)}
            />

            <Stack direction="row" spacing={2}>
              <RHFTimePickerCustom name={`opening.${index}.openTime`} label="เวลาเปิด" />
              <RHFTimePickerCustom name={`opening.${index}.closeTime`} label="เวลาปิด" />
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <Button
                color="error"
                onClick={() => remove(index)}
                disabled={!(fields.length > 1)}
                aria-label="delete"
              >
                <Image src={srcIcon} alt="bin" width="24" height="24" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      ))}

      <Stack alignItems="end" sx={{ padding: '24px' }}>
        <LoadingButton
          onClick={() => append({ day: [], openTime: '', closeTime: '' })}
          variant="contained"
        >
          + เพิ่มวันทำการ
        </LoadingButton>
      </Stack>
    </Card>
  );
}
