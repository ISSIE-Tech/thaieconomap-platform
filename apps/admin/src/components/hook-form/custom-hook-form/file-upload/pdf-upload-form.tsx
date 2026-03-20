'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';

import { RHFFileUpload } from './rhf-file-upload';

type Props = {
  name: string;
};

export function PDFUploadForm({ name }: Props) {
  const { setValue, getValues } = useFormContext();

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const values = getValues(name);
      const filtered = values && values.filter((file: File) => file !== inputFile);
      setValue(name, filtered);
    },
    [setValue, getValues, name]
  );

  return (
    <Stack spacing={2}>
      <RHFFileUpload name={name} onRemove={handleRemoveFile} multiple />
    </Stack>
  );
}
