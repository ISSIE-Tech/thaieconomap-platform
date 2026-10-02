import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DAY_OF_WEEK = [
  { value: 'Monday', label: 'จันทร์' },
  { value: 'Tuesday', label: 'อังคาร' },
  { value: 'Wednesday', label: 'พุธ' },
  { value: 'Thursday', label: 'พฤหัสบดี' },
  { value: 'Friday', label: 'ศุกร์' },
  { value: 'Saturday', label: 'เสาร์' },
  { value: 'Sunday', label: 'อาทิตย์' },
];

const ALL_DAYS = DAY_OF_WEEK.map((d) => d.value);
const WEEKDAYS = ALL_DAYS.slice(0, 5);

type Slot = { day: string[]; openTime: string; closeTime: string };

const perDay = (days: string[], openTime: string, closeTime: string): Slot[] =>
  days.map((d) => ({ day: [d], openTime, closeTime }));

// 24 ชม. = 0:00-23:59 (backend caps close at 23*60+59)
const PRESETS: { label: string; slots: Slot[] }[] = [
  { label: 'ทุกวัน 09:00-18:00', slots: perDay(ALL_DAYS, '9:00', '18:00') },
  { label: 'จ-ศ 08:30-17:30', slots: perDay(WEEKDAYS, '8:30', '17:30') },
  {
    label: 'จ-ศ 09:00-18:00, ส-อา 10:00-16:00',
    slots: [
      ...perDay(WEEKDAYS, '9:00', '18:00'),
      ...perDay(['Saturday', 'Sunday'], '10:00', '16:00'),
    ],
  },
  { label: 'ทุกวัน 24 ชม.', slots: perDay(ALL_DAYS, '0:00', '23:59') },
];

// picker writes '9:00', edit drawer loads '09:00'
const norm = (t = '') => t.replace(/^0(\d)/, '$1');

const sameSlots = (a: Slot[] = [], b: Slot[]) =>
  a.length === b.length &&
  a.every(
    (s, i) =>
      s.day?.length === 1 &&
      s.day[0] === b[i].day[0] &&
      norm(s.openTime) === norm(b[i].openTime) &&
      norm(s.closeTime) === norm(b[i].closeTime)
  );

// One entry per open day, Mon→Sun, so a row's index in `opening` is stable for error lookup.
// ponytail: one time range per day; a split shift (e.g. 9-12, 13-18) keeps only the first range.
const toPerDay = (slots: Slot[] = []): Slot[] =>
  ALL_DAYS.flatMap((d) => {
    const slot = slots.find((s) => s.day?.includes(d));
    return slot ? [{ day: [d], openTime: slot.openTime, closeTime: slot.closeTime }] : [];
  });

type TimeInputProps = {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const TimeInput = ({ label, value, error, onChange }: TimeInputProps) => (
  <DesktopTimePicker
    label={label}
    value={value ? dayjs(value, 'H:mm') : null}
    onChange={(v) =>
      onChange(v?.isValid() ? `${v.hour()}:${String(v.minute()).padStart(2, '0')}` : '')
    }
    ampm={false}
    sx={{ flex: 1, minWidth: 0 }}
    slotProps={{ textField: { error: !!error, helperText: error } }}
  />
);

const DateTimeForm = () => {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const opening: Slot[] = useWatch({ control, name: 'opening' }) ?? [];

  const set = (next: Slot[]) => {
    setValue('opening', next, { shouldDirty: true });
    // re-check only once errors are showing, so untouched rows don't turn red
    if (errors.opening) trigger('opening');
  };

  useEffect(() => {
    const current = getValues('opening') ?? [];
    const normalized = toPerDay(current);
    if (!sameSlots(current, normalized)) setValue('opening', normalized);
  }, [getValues, setValue]);

  const toggleDay = (day: string, on: boolean) => {
    if (!on) {
      set(opening.filter((s) => s.day[0] !== day));
      return;
    }
    // copy hours from the nearest open day above, so going down the list is one tap per day
    const idx = ALL_DAYS.indexOf(day);
    const prev = [...opening].reverse().find((s) => ALL_DAYS.indexOf(s.day[0]) < idx) ?? opening[0];
    set(
      toPerDay([
        ...opening,
        { day: [day], openTime: prev?.openTime ?? '9:00', closeTime: prev?.closeTime ?? '18:00' },
      ])
    );
  };

  const setTime = (index: number, key: 'openTime' | 'closeTime', value: string) =>
    set(opening.map((s, i) => (i === index ? { ...s, [key]: value } : s)));

  const rowErrors = errors.opening as
    | ({ openTime?: { message?: string }; closeTime?: { message?: string } } | undefined)[]
    | undefined;

  const listError = errors.opening as { message?: string; root?: { message?: string } } | undefined;
  const listErrorMessage = listError?.message || listError?.root?.message;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ okButtonLabel: 'ตกลง' }}>
      <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
        ตั้งค่าด่วน
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {PRESETS.map((preset) => {
          const active = sameSlots(opening, preset.slots);
          return (
            <Chip
              key={preset.label}
              label={preset.label}
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              onClick={() => set(preset.slots.map((s) => ({ ...s, day: [...s.day] })))}
            />
          );
        })}
      </Stack>

      <Box
        sx={{
          border: 1,
          borderRadius: '20px',
          borderColor: (theme) => theme.palette.grey[200],
          boxShadow: '3px 5px 3px rgba(0, 0, 0, 0.1)',
          px: { xs: 2, sm: 2.5 },
        }}
      >
        {DAY_OF_WEEK.map((d, i) => {
          const index = opening.findIndex((s) => s.day?.[0] === d.value);
          const open = index !== -1;
          return (
            <Box key={d.value}>
              {i > 0 && <Divider />}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                gap={{ xs: 1, sm: 2 }}
                sx={{ py: 1.5, minHeight: 72 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: { sm: 180 }, flexShrink: 0 }}
                >
                  <Typography fontWeight="bold">{d.label}</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography variant="body2" color={open ? 'primary' : 'text.disabled'}>
                      {open ? 'เปิด' : 'ปิด'}
                    </Typography>
                    <Switch
                      checked={open}
                      onChange={(e) => toggleDay(d.value, e.target.checked)}
                      slotProps={{ input: { 'aria-label': `เปิดวัน${d.label}` } }}
                    />
                  </Stack>
                </Stack>

                {open ? (
                  <Stack direction="row" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                    <TimeInput
                      label="เวลาเปิด"
                      value={opening[index].openTime}
                      error={rowErrors?.[index]?.openTime?.message}
                      onChange={(v) => setTime(index, 'openTime', v)}
                    />
                    <TimeInput
                      label="เวลาปิด"
                      value={opening[index].closeTime}
                      error={rowErrors?.[index]?.closeTime?.message}
                      onChange={(v) => setTime(index, 'closeTime', v)}
                    />
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    ปิดทำการ
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      {listErrorMessage && (
        <FormHelperText error sx={{ mt: 1 }}>
          {listErrorMessage}
        </FormHelperText>
      )}
    </LocalizationProvider>
  );
};

export default DateTimeForm;
