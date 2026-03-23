import type { CommercialSmallDetail } from '../_types/commercials.type';

import { Iconify } from 'src/shared/components/iconify';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type CommercialProps = {
  commercial?: CommercialSmallDetail | null;
  title?: string;
};

export function CommercialDetail({ commercial, title }: CommercialProps) {
  return (
    <Stack spacing={2} px={3} pb={4}>
      <Typography variant="body1" fontWeight="bold">
        {title ?? 'ข้อมูลร้านค้า'}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Iconify width={24} icon="wi:time-9" my={0.5} />

        <Stack spacing={0.5} flexGrow={1}>
          {commercial?.displayOpening?.map((openingTime, index) => (
            <Grid key={index} container>
              <Grid size={4}>
                <Typography variant="body2" fontWeight="bold">
                  {openingTime.days}
                </Typography>
              </Grid>
              <Grid size={8}>
                <Typography variant="body2">
                  {openingTime.time.map((hour) => `${hour.open} - ${hour.close}`).join(', ')}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Stack>

      <Divider />

      {commercial?.moreInfo && (
        <>
          <Stack direction="row" spacing={1}>
            <Iconify width={24} icon="fluent:info-24-regular" my={0.5} />

            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">{commercial?.moreInfo}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider />
        </>
      )}

      <Stack direction="row" spacing={1}>
        <Iconify width={24} icon="carbon:user" my={0.5} />

        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">คุณ{commercial?.commercialOwner}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
