import type { Sharing } from '../_types/sharing.type';

import { Image } from 'src/shared/components/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type SharingProps = {
  sharing?: Sharing | null;
};

export function SharingDetail({ sharing }: SharingProps) {
  return (
    <Stack spacing={2} px={3} pb={4}>
      <Typography variant="body1" fontWeight="bold">
        ข้อมูลสิ่งของ
      </Typography>

      {sharing?.detail && (
        <>
          <Stack direction="row" spacing={1}>
            <Stack height={32} direction="row" alignItems="center">
              <Box width={4} height={4} borderRadius="50%" bgcolor="black" />
            </Stack>

            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">{sharing?.detail}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </>
      )}

      <Typography variant="body1" fontWeight="bold">
        จำนวน
      </Typography>

      {sharing?.amount && (
        <>
          <Stack direction="row" spacing={1}>
            <Stack height={32} direction="row" alignItems="center">
              <Box width={4} height={4} borderRadius="50%" bgcolor="black" />
            </Stack>

            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">
                  {sharing?.amount.amount} {sharing?.amount.unit}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </>
      )}

      <Typography variant="body1" fontWeight="bold">
        สภาพสิ่งของ
      </Typography>

      {sharing?.condition && (
        <>
          <Stack direction="row" spacing={1}>
            <Stack height={32} direction="row" alignItems="center">
              <Box width={4} height={4} borderRadius="50%" bgcolor="black" />
            </Stack>

            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">{sharing?.condition.name}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </>
      )}

      {/* TODO: there's no owner info in the backend */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Image src="/assets/images/user-profile.svg" width={48} height={48} borderRadius="50%" />

        <Stack>
          <Typography>{sharing?.contact.name}</Typography>
          <Typography variant="caption" sx={{ color: (theme) => theme.palette.grey[500] }}>
            เจ้าของ
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
