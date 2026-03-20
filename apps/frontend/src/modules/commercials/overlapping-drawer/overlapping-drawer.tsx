'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { Iconify } from 'src/shared/components/iconify';
import { BlueRoundedHeader } from 'src/modules/economap-headers';

import useGetCommercial from '../_hooks/use-get-commercial';
import { CommercialCategory, type CommercialTiny } from '../_types/commercials.type';

type Props = {
  controller: UseBooleanReturn;
  overlappingCommercials: CommercialTiny[];
  category: string;
  onCommercialClick: (id: string) => void;
};

export default function OverlappingDrawer({
  controller,
  overlappingCommercials,
  category,
  onCommercialClick,
}: Props) {
  return (
    <Drawer
      open={controller.value}
      onClose={controller.onFalse}
      anchor="right"
      slotProps={{ backdrop: { sx: { display: { md: 'none' } } } }}
      PaperProps={{
        sx: {
          width: { xs: '100vw', md: 480 },
          height: '100vh',
          overflowX: 'hidden',
        },
      }}
    >
      <BlueRoundedHeader title={`${category}ทั้งหมด`} onClose={controller.onFalse} />

      <Stack spacing={1} px={3} mt={4} flexGrow={1} overflow="hidden">
        <Typography variant="body1" fontWeight="bold">
          {overlappingCommercials?.flat().length} {category}ทั้งหมด
        </Typography>

        <Stack
          divider={<Divider />}
          flexGrow={1}
          sx={{
            overflowY: 'scroll',
          }}
        >
          {overlappingCommercials.map((commercial) => (
            <CommercialRow
              key={commercial._id}
              commercial={commercial}
              onClick={onCommercialClick}
            />
          ))}
        </Stack>
      </Stack>
    </Drawer>
  );
}

// ----------------------------------------------------------------------

type CommercialRowProps = {
  commercial: CommercialTiny;
  onClick: (id: string) => void;
};

function CommercialRow({ commercial, onClick }: CommercialRowProps) {
  const { data: commercialFull } = useGetCommercial({ commercialId: commercial._id });
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      py={2}
      width="100%"
      onClick={() => onClick(commercial._id)}
      sx={{ cursor: 'pointer' }}
    >
      <Image
        src={commercialFull?.imageUrl}
        alt="commercial"
        ratio="4/3"
        sx={{ width: '60px' }}
        placeholder={<Skeleton height={45} width={60} />}
      />

      <Stack width="50%" flexGrow={1}>
        <Typography fontWeight={500}>{commercial?.name}</Typography>
        <Stack direction="row" spacing={1}>
          <Typography
            variant="body2"
            maxWidth="50%"
            color={theme.palette.grey[500]}
            sx={maxLine({ line: 1 })}
          >
            {commercial &&
              CommercialCategory[commercial.category as keyof typeof CommercialCategory]}
          </Typography>
        </Stack>
      </Stack>

      <Iconify icon="material-symbols-light:arrow-forward-ios" width={24} />
    </Stack>
  );
}
