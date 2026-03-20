import type { ChipProps } from '@mui/material/Chip';
import type { SelectProps } from '@mui/material/Select';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { MenuItemProps } from '@mui/material/MenuItem';
import type { ControllerRenderProps } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material/TextField';
import type { InputLabelProps } from '@mui/material/InputLabel';
import type { FormControlProps } from '@mui/material/FormControl';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { Button, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { styled, type Theme, type SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type RHFSelectProps = TextFieldProps & {
  name: string;
  native?: boolean;
  children: React.ReactNode;
  slotProps?: {
    paper?: SxProps<Theme>;
  };
};

export function RHFSelect({
  name,
  native,
  children,
  slotProps,
  helperText,
  inputProps,
  InputLabelProps,
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
            sx: { textTransform: 'capitalize' },
          }}
          InputLabelProps={{ htmlFor: labelId, ...InputLabelProps }}
          inputProps={{ id: labelId, ...inputProps }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

const CustomList = styled('ul')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  listStyle: 'none',
  width: '100%',
  boxSizing: 'border-box',
  gap: '5px',
});

type RHFMultiSelectProps = FormControlProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  horizontal?: boolean;
  titleText?: string;
  defaultValue?: string[];
  options: {
    label: string;
    value: string;
  }[];
  slotProps?: {
    menuItem?: MenuItemProps;
    chip?: ChipProps;
    select?: SelectProps;
    checkbox?: CheckboxProps;
    inputLabel?: InputLabelProps;
    formHelperText?: FormHelperTextProps;
    paper?: SxProps<Theme>;
  };
};

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  horizontal,
  titleText,
  defaultValue,
  ...other
}: RHFMultiSelectProps) {
  const { control, setValue } = useFormContext();

  const labelId = `${name}-select-label`;

  const handleClear = (field: ControllerRenderProps) => {
    setValue(name, []);
    field.onChange([]);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && (
            <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
              {label}
            </InputLabel>
          )}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            label={label}
            renderValue={(selected) => {
              const selectedItems = options.filter((item) =>
                (selected as string[]).includes(item.value)
              );

              if (!selectedItems.length && placeholder) {
                return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
              }

              if (chip) {
                return (
                  <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                    {selectedItems.map((item) => (
                      <Chip
                        key={item.value}
                        size="small"
                        variant="soft"
                        color="primary"
                        label={item.label}
                        {...slotProps?.chip}
                      />
                    ))}
                  </Box>
                );
              }

              return selectedItems.map((item) => item.label).join(', ');
            }}
            {...slotProps?.select}
            inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
            MenuProps={{
              PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } },
              ...(horizontal && { MenuListProps: { component: CustomList } }),
            }}
            sx={{ textTransform: 'capitalize' }}
          >
            {horizontal && titleText && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="body1" fontWeight="bold">
                  {titleText}
                </Typography>
              </Box>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} {...slotProps?.menuItem}>
                {checkbox && (
                  <Checkbox
                    size="small"
                    disableRipple
                    checked={field.value.includes(option.value)}
                    {...slotProps?.checkbox}
                  />
                )}

                {option.label}
              </MenuItem>
            ))}

            {horizontal && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    handleClear(field);
                  }}
                >
                  ล้าง
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    field.onBlur(); // Close dropdown
                  }}
                >
                  ยืนยัน
                </Button> */}
              </Box>
            )}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
