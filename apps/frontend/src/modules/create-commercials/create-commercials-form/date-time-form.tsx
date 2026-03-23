import Image from 'next/image';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTimePicker } from 'src/shared/components/hook-form/rhf-time-picker';
import RHFDatePickerCustom from 'src/shared/components/hook-form/rht-date-picker-custom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DateTimeButton from './date-time-button';

const DateTimeForm = () => {
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
    <Box>
      {fields.map((field, index) => (
        <Stack key={field.id}>
          <Stack
            sx={{
              padding: '18px',
              border: 1,
              borderRadius: '20px',
              borderColor: (theme) => theme.palette.grey[200],
              boxShadow: '3px 5px 3px rgba(0, 0, 0, 0.1)',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              ข้อมูลวันทำการ {index + 1}
            </Typography>

            <RHFDatePickerCustom
              name={`opening.${index}.day`}
              options={DAY_OF_WEEK}
              defaultValue={getValues(`opening.${index}.day`)}
            />

            <Stack direction="row" spacing={2}>
              <RHFTimePicker name={`opening.${index}.openTime`} label="เวลาเปิด" />
              <RHFTimePicker name={`opening.${index}.closeTime`} label="เวลาปิด" />
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

          <Box
            sx={{
              width: 'full',
              height: '1px',
              backgroundColor: (theme) => theme.palette.grey[200],
              marginBottom: '20px',
            }}
          />
        </Stack>
      ))}

      <DateTimeButton onClick={() => append({ day: [], openTime: '', closeTime: '' })} />
    </Box>
  );
};

export default DateTimeForm;
