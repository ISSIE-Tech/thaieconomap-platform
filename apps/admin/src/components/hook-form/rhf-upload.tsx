import type { UploadProps } from '../upload';

import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { compressImageFile, compressImageFiles } from 'src/utils/compress-image';

import { Upload, UploadBox, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = async (acceptedFiles: File[]) => {
          const value = await compressImageFile(acceptedFiles[0]);

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = async (acceptedFiles: File[]) => {
          const compressedFiles = await compressImageFiles(acceptedFiles);
          const newFiles = compressedFiles.map((file) => {
            const uniqueName = `${file.name.split('.')[0]}-${Date.now()}.${file.name.split('.').pop()}`;
            return new File([file], uniqueName, {
              type: file.type,
              lastModified: file.lastModified,
            });
          });
          const value = multiple ? [...field.value, ...newFiles] : newFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
