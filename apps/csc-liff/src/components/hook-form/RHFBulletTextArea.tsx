import { useFormContext, Controller } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFBulletTextArea({
  name,
  helperText,
  ...other
}: Props) {
  const { control, watch, setValue } = useFormContext();
  const currentData = watch(name);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const lines = currentData.split('\n');
      const lineIndex = lines.findIndex(
        (line: string[], index: number) =>
          event.currentTarget.selectionStart! <= line.length + index
      );

      lines.splice(lineIndex < 0 ? lines.length : lineIndex, 0, '- ');
      setValue(name, lines.join('\n'));
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={
            typeof field.value === 'number' && field.value === 0
              ? ''
              : field.value
          }
          error={!!error}
          helperText={error ? error?.message : helperText}
          onKeyDown={handleKeyDown}
          multiline
          rows={4}
          {...other}
        />
      )}
    />
  );
}
