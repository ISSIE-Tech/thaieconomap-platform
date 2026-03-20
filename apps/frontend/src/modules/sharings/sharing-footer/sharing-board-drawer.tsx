'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { fToNow } from 'src/shared/utils/format-time';
import { Iconify } from 'src/shared/components/iconify';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { useBoolean, type UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import { translateTimeExpressionEngThai } from 'src/shared/components/constants/date';

import useGetSharing from '../_hooks/use-get-sharing';
import { SharingDrawer } from '../sharing-detail-drawer';
import useGetAllTinySharings from '../_hooks/use-get-all-tiny-sharings';

import type { SharingTiny } from '../_types/sharing.type';

type Props = {
  controller: UseBooleanReturn;
};

export function SharingBoardDrawer({ controller }: Props) {
  const { data: sharings } = useGetAllTinySharings();

  // drawer
  const [sharingId, setSharingId] = useState('');
  const detailDrawerController = useBoolean();
  const { data: sharing } = useGetSharing({ sharingId });
  const openSharingDrawer = (id: string) => {
    setSharingId(id);
    detailDrawerController.onTrue();
  };

  return (
    <Drawer
      open={controller.value}
      onClose={controller.onFalse}
      anchor="right"
      slotProps={{ backdrop: { sx: { display: { md: 'none' } } } }}
      PaperProps={{ sx: { width: { xs: '100vw', md: 480 }, overflowX: 'hidden' } }}
    >
      <BlueRoundedHeader title="บอร์ดแบ่งสิ่งของ" onClose={controller.onFalse} />

      <Typography variant="body1" fontWeight="bold" px={3} mt={4} mb={2}>
        ประกาศล่าสุด
      </Typography>

      <Stack spacing={1} px={3} flexGrow={1} overflow="hidden">
        {sharings && sharings.length > 0 && (
          <Stack
            divider={<Divider />}
            flexGrow={1}
            sx={{
              overflowY: 'scroll',
            }}
          >
            {sharings?.map((fetchSharing) => (
              <Post key={fetchSharing._id} sharing={fetchSharing} onClick={openSharingDrawer} />
            ))}
          </Stack>
        )}

        {sharings?.length === 0 && (
          <Stack alignItems="center" spacing={1}>
            <Image
              src="/assets/illustrations/not-found.svg"
              alt="search not found illustrations"
              width="216"
              height="216"
            />
            <Typography variant="body1" fontWeight="bold">
              ไม่มีประกาศในขณะนี้
            </Typography>
          </Stack>
        )}
      </Stack>

      <SharingDrawer controller={detailDrawerController} sharing={sharing} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

type PostProps = {
  sharing: SharingTiny;
  onClick: (id: string) => void;
};

function Post({ sharing, onClick }: PostProps) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      py={2}
      width="100%"
      onClick={() => onClick(sharing._id)}
      sx={{ cursor: 'pointer' }}
    >
      <Image
        src={sharing.imageUrl}
        alt="shared object"
        ratio="4/3"
        sx={{ objectFit: 'cover', minWidth: '80px', width: '80px', borderRadius: '4px' }}
      />

      <Stack width="50%" flexGrow={1}>
        <Typography fontWeight={500}>{sharing.name}</Typography>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" maxWidth="50%" sx={maxLine({ line: 1 })}>
            {sharing.types.map((type) => type.name).join(', ')}
          </Typography>

          <Typography
            variant="body2"
            maxWidth="50%"
            color={theme.palette.grey[500]}
            sx={maxLine({ line: 1 })}
          >
            {translateTimeExpressionEngThai(fToNow(sharing.approvedAt) ?? '')}
          </Typography>
        </Stack>
      </Stack>

      <Iconify icon="material-symbols-light:arrow-forward-ios" width={24} />
    </Stack>
  );
}
