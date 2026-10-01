import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { type UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import { useAuthContext } from 'src/modules/auth/_hooks/use-auth-context';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import NavigateLink from './navigate-link';

// -------------------------------------------------------------

type Props = {
  menuController: UseBooleanReturn;
};

export function MenuDrawer({ menuController }: Props) {
  const router = useRouter();

  const { authenticated, logout } = useAuthContext();

  const closeDrawerAndNavigate = (path: string) => () => {
    menuController.onFalse();

    router.push(path);
  };

  const userSection = authenticated ? (
    <Stack spacing={2}>
      <NavigateLink text="จัดการบัญชี" onClick={closeDrawerAndNavigate(paths.account.root)} />

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Image src="/assets/icons/logout.svg" alt="logout icon" width={20} height={20} />
        <NavigateLink
          text="ออกจากระบบ"
          color="error"
          onClick={async () => {
            await logout();

            menuController.onFalse();
          }}
        />
      </Stack>
    </Stack>
  ) : (
    <NavigateLink text="เข้าสู่ระบบ" onClick={() => router.push(paths.auth.login)} />
  );

  return (
    <Drawer
      open={menuController.value}
      onClose={menuController.onFalse}
      slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}
      PaperProps={{
        sx: { width: { xs: '100vw', md: 360 }, overflowX: 'hidden', px: 3, py: 2 },
      }}
    >
      <Stack justifyContent="space-between" height="100%">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Image src="/assets/icons/logo-full.svg" alt="full logo icon" width="140" height="24" />

            <Fab
              color="default"
              size="small"
              sx={{ bgcolor: 'white' }}
              onClick={menuController.onFalse}
            >
              <Image src="/assets/icons/cross.svg" alt="cross icon" width="24" height="24" />
            </Fab>
          </Stack>

          <Stack spacing={2}>
            <NavigateLink text="แผนที่ธุรกิจ" onClick={closeDrawerAndNavigate(paths.roots)} />
            <NavigateLink text="งานและอาชีพ" onClick={closeDrawerAndNavigate(paths.jobs)} />
            <NavigateLink
              text="ช่วยเหลือแบ่งปัน"
              onClick={closeDrawerAndNavigate(paths.sharings)}
            />
            <NavigateLink
              text="ประกาศ"
              onClick={closeDrawerAndNavigate(paths.announcements.root)}
            />
          </Stack>

          <Divider />

          <Stack spacing={2}>{userSection}</Stack>

          <Divider />

          <Stack spacing={2}>
            <NavigateLink text="เกี่ยวกับเรา" onClick={closeDrawerAndNavigate(paths.about)} />
            <NavigateLink
              text="ข้อกำหนดการใช้งาน"
              onClick={closeDrawerAndNavigate(paths.legal.terms)}
            />
            <NavigateLink
              text="นโยบายความเป็นส่วนตัว"
              onClick={closeDrawerAndNavigate(paths.legal.privacy)}
            />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          marginBottom={4}
        >
          <Typography variant="body2">Powered by</Typography>
          <Image src="/assets/images/chula.png" alt="chula icon" width={40} height={50} />
          <Iconify icon="ri:close-line" width={16} height={16} />
          <Image
            src="/assets/images/thai-health.png"
            alt="thaiHealth icon"
            width={50}
            height={50}
          />
        </Stack>
      </Stack>
    </Drawer>
  );
}
