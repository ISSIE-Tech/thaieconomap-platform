import { useFormContext, Controller } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFDatePicker({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              error={!!error}
              helperText={error?.message}
              {...other}
            />
          )}
        />
      )}
    />
  );
}
