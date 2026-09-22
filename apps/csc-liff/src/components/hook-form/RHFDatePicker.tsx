import { useFormContext, Controller } from 'react-hook-form';
import { TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFDatePicker({ name, label, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          label={label}
          value={field.value ? new Date(field.value) : null}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
              ...(other as object),
            },
          }}
        />
      )}
    />
  );
}
