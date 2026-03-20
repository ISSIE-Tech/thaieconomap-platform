'use client';

import type {
  UploadProps} from 'src/components/upload';

import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, FormHelperText } from '@mui/material';

import { varAlpha } from 'src/theme/styles/utils';

import { Iconify } from 'src/components/iconify';
import { UploadPlaceholder } from 'src/components/upload/components/placeholder';

export function FileUpload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  multiple = false,
  ...other
}: UploadProps) {
  const { getRootProps, isDragActive, getInputProps, isDragReject } = useDropzone({
    multiple,
    disabled,
    ...other,
  });
  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;
  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const handlePreviewClick = (preview: File | null) => {
    if (preview) {
      const previewUrl = URL.createObjectURL(preview);
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Box sx={{ width: 1, position: 'relative', ...sx }}>
        <Box
          {...getRootProps()}
          sx={{
            p: 5,
            outline: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: (theme) => `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
            transition: (theme) => theme.transitions.create(['opacity', 'padding']),
            '&:hover': { opacity: 0.72 },
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            ...(hasFile && { padding: '16% 0' }),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <input {...getInputProps()} />

          <UploadPlaceholder />
        </Box>
        {hasFiles && (
          <Stack direction="row" spacing={2}>
            {Array.isArray(value) &&
              value.map((file, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <Button onClick={() => handlePreviewClick(file instanceof File ? file : null)}>
                    <Typography variant="subtitle1">
                      {typeof file === 'string' ? file : file.name}
                    </Typography>
                  </Button>
                  {onRemove && (
                    <IconButton size="small" onClick={() => onRemove(file)}>
                      <Iconify icon="mingcute:close-line" width={16} />
                    </IconButton>
                  )}
                </Stack>
              ))}
          </Stack>
        )}

        {helperText && (
          <FormHelperText error={!!error} sx={{ px: 2 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </Stack>
  );
}
