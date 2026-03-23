import type { Commercial } from '../_types/commercials.type';

import { StatusText } from 'src/modules/favorites';
import { Iconify } from 'src/shared/components/iconify';
import { BackBtn } from 'src/shared/components/custom-buttons';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
  commercial?: Commercial | null;
  closeDrawer: () => void;
  title?: string;
};

export function CommercialHeader({ commercial, closeDrawer, title }: Props) {
  const hasFavorite = commercial?.isFavorite;

  return (
    <Box
      py={2}
      px={3}
      sx={{
        bgcolor: (theme) => theme.palette.primary.dark,
        borderBottomRightRadius: '3rem',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <BackBtn onClick={closeDrawer} />

      <Typography
        color="white"
        fontWeight="bold"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {title ?? 'ข้อมูลร้าน'}
      </Typography>

      {hasFavorite && (
        <StatusText sx={{ bgcolor: '#2F9F5C', ml: 'auto' }}>
          <Iconify width={20} icon="ic:round-star" color="white" />
          <Typography color="white" variant="overline" fontWeight="bold">
            รายการโปรด
          </Typography>
        </StatusText>
      )}

      {commercial?.isNewlyOpened && (
        <StatusText
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            ml: 'auto',
          }}
        >
          <Typography color="white" variant="overline" fontWeight="bold">
            ร้านใหม่แกะกล่อง
          </Typography>
        </StatusText>
      )}
    </Box>
  );
}
