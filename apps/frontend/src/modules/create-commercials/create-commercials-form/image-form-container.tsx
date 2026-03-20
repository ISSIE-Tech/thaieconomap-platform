import Image from 'next/image';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { common } from 'src/theme/core';
import { RHFUpload } from 'src/shared/components/hook-form';

type Props = {
  name: string;
  multiple?: boolean;
  label: string;
  title?: string;
  description?: string;
};

export function ImageFormContainer({ name, multiple = false, label, title, description }: Props) {
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
    <Stack>
      <Typography variant="body1" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2">{description}</Typography>

      <RHFUpload
        name={name}
        multiple={multiple}
        thumbnail
        onRemoveAll={handleRemoveAllFiles}
        onRemove={handleRemoveFile}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: common.white,
            borderRadius: '24px',
            width: '75%',
            padding: '14px',
            gap: '5px',
          }}
        >
          <Image src="/assets/icons/image-upload.svg" alt="marker" width="20" height="20" />
          <Typography variant="body1">{label}</Typography>
        </Stack>
      </RHFUpload>
    </Stack>
  );
}
