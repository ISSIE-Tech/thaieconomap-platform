import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { StatusText } from 'src/modules/favorites';
import { Iconify } from 'src/shared/components/iconify';
import { BackBtn } from 'src/shared/components/custom-buttons';

import type { Commercial } from '../_types/commercials.type';

type Props = {
  commercial?: Commercial | null;
  closeDrawer: () => void;
  title?: string;
};

export function CommercialHeader({ commercial, closeDrawer, title }: Props) {
  const hasFavorite = commercial?.isFavorite;

  return (
    <Grid
      container
      py={2}
      px={3}
      sx={{ bgcolor: (theme) => theme.palette.primary.dark, borderBottomRightRadius: '3rem' }}
    >
      <Grid container xs={4} alignContent="center">
        <BackBtn onClick={closeDrawer} />
      </Grid>

      <Grid container xs={4} justifyContent="center">
        <Typography textAlign="center" color="white" fontWeight="bold">
          {title ?? 'ข้อมูลร้าน'}
        </Typography>

        {hasFavorite && (
          <StatusText sx={{ bgcolor: '#2F9F5C' }}>
            <Iconify width={20} icon="ic:round-star" color="white" />
            <Typography color="white" variant="overline" fontWeight="bold">
              รายการโปรด
            </Typography>
          </StatusText>
        )}
      </Grid>

      {commercial?.isNewlyOpened && (
        <Grid container xs={4} justifyContent="end">
          {/* invisible box to align status text, aria-hidden for screen reader */}
          <Box visibility="hidden" aria-hidden="true">
            invisible
          </Box>

          <StatusText
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              right: 0,
              left: 'auto',
              transform: 'none',
            }}
          >
            <Typography color="white" variant="overline" fontWeight="bold">
              ร้านใหม่แกะกล่อง
            </Typography>
          </StatusText>
        </Grid>
      )}
    </Grid>
  );
}
