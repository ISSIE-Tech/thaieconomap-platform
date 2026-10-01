'use client';

import { useRouter } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import NavigateLink from './navigate-link';

// ----------------------------------------------------------------------

export default function AccountMenu() {
  const router = useRouter();

  return (
    <Stack
      width="100%"
      height="100%" // Set width and height as 100% since we use flexGrow in Layout.tsx
      borderRadius="12px 12px 0 0"
      p={3}
    >
      <Stack spacing={1.25}>
        <Typography variant="body1" fontWeight="bold">
          บัญชีของฉัน
        </Typography>

        <Stack spacing={1}>
          <NavigateLink
            text="ร้านค้าของฉัน"
            onClick={() => router.push(paths.account['my-shops'])}
          />

          <Divider />

          <NavigateLink
            text="สิ่งของที่ฉันแบ่งปัน"
            onClick={() => router.push(paths.account['my-sharings'])}
          />

          <Divider />

          <NavigateLink
            text="รายการโปรดของฉัน"
            onClick={() => router.push(paths.account.favorites)}
          />

          <Divider />

          <NavigateLink
            text="ประวัติการทำรายการ"
            onClick={() => router.push(paths.account['form-history'])}
          />

          <Divider />
        </Stack>
      </Stack>

      <Stack spacing={1.25} mt={1.25}>
        <Typography variant="body1" fontWeight="bold">
          การเชื่อมต่อ
        </Typography>

        <Stack spacing={1}>
          <NavigateLink
            text="บริการอื่นๆของเรา"
            onClick={() => router.push(paths.account['our-services'])}
          />

          <Divider />
        </Stack>
      </Stack>
    </Stack>
  );
}
