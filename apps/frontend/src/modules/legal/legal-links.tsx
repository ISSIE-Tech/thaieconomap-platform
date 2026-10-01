import Link from 'next/link';
import { paths } from 'src/shared/routes/paths.config';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

/** "ข้อกำหนดการใช้งาน · นโยบายความเป็นส่วนตัว" — used in page footers and sidebars. */
export function LegalLinks({ fontSize = 13, justifyContent = 'center' }: { fontSize?: number; justifyContent?: string }) {
  const sx = { color: 'grey.600', fontSize, textDecoration: 'none', '&:hover': { color: 'primary.dark' } };
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent={justifyContent} flexWrap="wrap">
      <Box component={Link} href={paths.legal.terms} sx={sx}>
        ข้อกำหนดการใช้งาน
      </Box>
      <Box component="span" sx={{ color: 'grey.500', fontSize }}>
        ·
      </Box>
      <Box component={Link} href={paths.legal.privacy} sx={sx}>
        นโยบายความเป็นส่วนตัว
      </Box>
    </Stack>
  );
}
