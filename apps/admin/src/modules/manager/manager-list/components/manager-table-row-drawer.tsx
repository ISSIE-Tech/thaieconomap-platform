import type { UseBooleanReturn } from 'src/hooks/use-boolean';

import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { ManagerItem } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  manager: ManagerItem;
  drawerController: UseBooleanReturn;
};

export default function ManagerTableRowDrawer({ manager, drawerController }: Props) {
  const router = useRouter();

  const onDrawerClose = () => {
    drawerController.onFalse();
  };

  const handleEditOnClick = () => {
    router.replace(paths.user.dashboard.edit(manager._id));
  };

  return (
    <Drawer
      open={drawerController.value}
      onClose={onDrawerClose}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 360 } }}
    >
      <Scrollbar>
        <Stack alignItems="center" px={3} pt={3} pb={1.5} spacing={6}>
          <Stack alignItems="center" spacing={2}>
            {manager.profileImageUrl && (
              <Avatar
                alt={manager.name}
                src={manager.profileImageUrl}
                sx={{ width: 150, height: 150 }}
              />
            )}

            <Stack alignItems="center">
              <Typography variant="body1" fontWeight="bold">
                {manager.name}
              </Typography>
              <Typography variant="body2">short id : {manager.shortId}</Typography>
            </Stack>
          </Stack>

          <Stack width="100%" spacing={2}>
            <Divider />
            <Typography variant="body1" fontWeight="bold">
              ข้อมูลผู้จัดการ
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:user-linear" width={16} />
              <Typography variant="body2">{manager.roles.TEC}</Typography>
            </Stack>

            {manager.phone && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:phone-rounded-linear" width={16} />
                <Typography variant="body2">{manager.phone}</Typography>
              </Stack>
            )}

            {manager.districts.length !== 0 && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:info-circle-linear" width={16} />
                <Typography variant="body2">
                  {manager.districts
                    .map((district) => `${district.districtType}${district.districtName}`)
                    .join(', ')}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Scrollbar>
      <Stack direction="row" p={2.5}>
        <LoadingButton type="submit" variant="contained" onClick={handleEditOnClick}>
          แก้ไขข้อมูล
        </LoadingButton>
      </Stack>
    </Drawer>
  );
}
