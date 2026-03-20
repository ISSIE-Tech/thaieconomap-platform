import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { RHFUpload } from 'src/components/hook-form/rhf-upload';

export function CommercialAdditionalImagesForm() {
  const { setValue, getValues } = useFormContext();

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const values = getValues('images');
      const filtered = values && values.filter((file: File) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, getValues]
  );

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          title="รูปภาพเพิ่มเติม"
          subheader="เพิ่มรูปภาพเพิ่มเติมของร้าน (ไม่เกิน 20 รูปภาพ)"
          sx={{ mb: 3 }}
        />
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFUpload
            name="images"
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
