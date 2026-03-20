import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { RHFUpload } from 'src/components/hook-form/rhf-upload';

export function CommercialThumbnailForm() {
  const { setValue, getValues } = useFormContext();

  const handleRemoveAllFiles = useCallback(() => {
    setValue('thumbnail', [], { shouldValidate: true });
  }, [setValue]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const values = getValues('thumbnail');
      const filtered = values && values.filter((file: File) => file !== inputFile);
      setValue('thumbnail', filtered);
    },
    [setValue, getValues]
  );

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          title="รูปภาพแบนเนอร์"
          subheader="เพิ่มรูปภาพแบนเนอร์ของร้าน (1 รูปภาพ)"
          sx={{ mb: 3 }}
        />

        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFUpload
            name="thumbnail"
            thumbnail
            multiple
            onRemoveAll={handleRemoveAllFiles}
            onRemove={handleRemoveFile}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
