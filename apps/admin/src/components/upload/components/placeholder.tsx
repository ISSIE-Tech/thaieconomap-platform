import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }: BoxProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>ลาก หรือ เลือกไฟล์</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          ลากไฟล์ภาพมาวางทีนี่ หรือคลิก
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            ค้นหาไฟล์
          </Box>
          บนเครื่องของคุณ
        </Box>
      </Stack>
    </Box>
  );
}
