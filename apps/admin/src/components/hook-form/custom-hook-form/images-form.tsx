import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { RHFUpload } from '../rhf-upload';

type Props = {
  name: string;
  title: string;
  subheader: string;
};

export function ImagesForm({ name, title, subheader }: Props) {
  const { setValue, getValues } = useFormContext();

  const handleRemoveAllFiles = useCallback(() => {
    setValue(name, [], { shouldValidate: true });
  }, [setValue, name]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const values = getValues(name);
      const filtered = values && values.filter((file: File) => file !== inputFile);
      setValue(name, filtered);
    },
    [setValue, getValues, name]
  );

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFUpload
            name={name}
            thumbnail
            onRemoveAll={handleRemoveAllFiles}
            onRemove={handleRemoveFile}
            multiple
          />
        </Stack>
      </Card>
    </Stack>
  );
}
