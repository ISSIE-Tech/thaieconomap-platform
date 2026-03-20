'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Image from 'next/image';

import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type Props = {
  controller: UseBooleanReturn;
};

export function FilterHeader({ controller }: Props) {
  return (
    <Grid container py={2} px={3}>
      <Grid xs={4} />

      <Grid container xs={4} alignContent="center" justifyContent="center">
        <Typography variant="body1" fontWeight="bold">
          ฟิลเตอร์
        </Typography>
      </Grid>

      <Grid container xs={4} alignContent="center" justifyContent="end">
        <Fab color="default" size="small" sx={{ bgcolor: 'white' }} onClick={controller.onFalse}>
          <Image src="/assets/icons/cross.svg" alt="cross icon" width="24" height="24" />
        </Fab>
      </Grid>
    </Grid>
  );
}
