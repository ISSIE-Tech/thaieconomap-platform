import { Controller, useFormContext } from 'react-hook-form';

import type { UploadProps } from 'src/components/upload';

import { FileUpload } from './file-upload';

type Props = UploadProps & {
  name: string;
};

export function RHFFileUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'application/pdf': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const newFiles = acceptedFiles.map((file) => {
            const uniqueName = `${file.name.split('.')[0]}-${Date.now()}.${file.name.split('.').pop()}`;
            return new File([file], uniqueName, {
              type: file.type,
              lastModified: file.lastModified,
            });
          });
          const value = multiple ? [...field.value, ...newFiles] : newFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <FileUpload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
