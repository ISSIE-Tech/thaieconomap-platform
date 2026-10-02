'use client';

import type { Pumpuang } from '../_types/pumpuangs.type';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { useCallback } from 'react';
import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { MapContainer } from 'src/shared/components/leaflet-map';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { DEFAULT_COORDINATE } from 'src/modules/commercials/_config';
import { SubmissionStatus } from 'src/modules/form-history/_types/history.type';
import { CallButton, FavoriteButton } from 'src/shared/components/custom-buttons/action-btn';
import { CommercialDetail } from 'src/modules/commercials/commercial-detail-drawer/commercial-detail';
import CommercialCarouselImages from 'src/modules/commercials/commercial-detail-drawer/commercial-carousel-images';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { MAP_ZOOM } from '../_config';
import useGetPumpuangById from '../_hooks/use-get-pumpuang';
import { PumpuangWorkingStatus } from '../_types/pumpuangs.type';
import useFavoritePumpuang from '../_hooks/use-favorite-pumpuang';
import { PumpuangRoutingHistory } from './pumpuang-route-history';
import useUnfavoritePumpuang from '../_hooks/use-unfavorite-pumpuang';

type DrawerProps = {
  controller: UseBooleanReturn;
  pumpuang?: Pumpuang | null;
};

// in case you want to disable map zoom entirely...
// const disableMapDragZoom = {
//   dragging: false,
//   zoomControl: false,
//   scrollWheelZoom: false,
//   doubleClickZoom: false,
//   touchZoom: false,
//   boxZoom: false,
// };

export default function PumpuangDrawer({ controller, pumpuang }: DrawerProps) {
  return (
    <Drawer
      open={controller.value}
      onClose={controller.onFalse}
      anchor="right"
      slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}
      PaperProps={{
        sx: { width: { xs: '100vw', md: 480 }, overflowX: 'hidden', overflowY: 'scroll', pb: 8 },
      }}
    >
      <Stack spacing={4}>
        <BlueRoundedHeader
          title="ข้อมูลรถ"
          onClose={controller.onFalse}
          isFavorite={pumpuang?.isFavorite}
          favoriteTitle="รถคันโปรด"
        />

        <MainInfo pumpuang={pumpuang} />

        <PumpuangActionButtons pumpuang={pumpuang} />
      </Stack>

      <Stack
        py={4}
        sx={{
          flexShrink: 0,
          height: {
            xs: 'auto', // Default height for extra-small screens and above
            sm: 300, // Set height to 300px for small screens and larger
          },
          // TODO: remove minHeight, it's just for testing
          minHeight: 300,
          backgroundColor: 'transparent', // Make the background transparent
        }}
      >
        {/* <MapContainer center={DEFAULT_COORDINATE} {...disableMapDragZoom} /> */}
        <MapContainer center={DEFAULT_COORDINATE} zoom={MAP_ZOOM.PUMPUANG_HISTORY}>
          {pumpuang && <PumpuangRoutingHistory id={pumpuang?._id} />}
        </MapContainer>
      </Stack>

      <Typography variant="body1" fontWeight="bold" px={3}>
        ข้อมูลรถ
      </Typography>

      <Image
        src={pumpuang?.imageUrl}
        alt="commercial place"
        ratio="4/3"
        py={4}
        width="100%"
        sx={{
          flexShrink: 0,
          height: {
            xs: 'auto', // Default height for extra-small screens and above
            sm: 300, // Set height to 300px for small screens and larger
          },
        }}
      />

      <CommercialDetail commercial={{ ...pumpuang, commercialOwner: pumpuang?.owner }} title="" />

      {pumpuang?.additionalImageUrl && pumpuang?.additionalImageUrl.length > 0 && (
        <CommercialCarouselImages title="รูปภาพรถพุ่มพวง" imageUrls={pumpuang.additionalImageUrl} />
      )}
    </Drawer>
  );
}

// -------------------------------------------------------------

type PumpuangProps = {
  pumpuang?: Pumpuang | null;
  submissionStatus?: SubmissionStatus;
  submissionMessage?: string;
};

export function MainInfo({ pumpuang, submissionMessage }: Partial<PumpuangProps>) {
  const theme = useTheme();

  const workingStatusStyle = {
    RUNNING: {
      foreground: theme.palette.success.main,
      background: theme.palette.success.lighter,
    },
    INACTIVE: {
      foreground: theme.palette.error.main,
      background: theme.palette.error.lighter,
    },
  };

  return (
    <Stack spacing={1} px={3}>
      <Typography variant="h5" fontWeight="bold" sx={maxLine({ line: 1 })}>
        {pumpuang?.name}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
        <Typography>{pumpuang?.types.map((type) => type.name).join(', ')}</Typography>

        {pumpuang?.status && (
          <Box
            sx={{
              borderRadius: '9999px',
              px: 1.5,
              py: 0.5,
              bgcolor: workingStatusStyle[pumpuang.status].background,
            }}
          >
            <Typography fontWeight="bold" color={workingStatusStyle[pumpuang.status].foreground}>
              {PumpuangWorkingStatus[pumpuang.status]}
            </Typography>
          </Box>
        )}
      </Stack>

      <Typography variant="body2" fontWeight="medium">
        {`${pumpuang?.licensePlate} - ${pumpuang?.color}`}
      </Typography>
      <Divider />
    </Stack>
  );
}

// -------------------------------------------------------------

function PumpuangActionButtons({ pumpuang, submissionStatus }: Partial<PumpuangProps>) {
  // favorite/unfavorite api
  const { mutateAsync: favorite } = useFavoritePumpuang();
  const { mutateAsync: unfavorite } = useUnfavoritePumpuang();
  // update after fav/unfav
  const { refetch } = useGetPumpuangById(pumpuang?._id ?? '');

  const favoriteCallback = useCallback(async () => {
    await favorite(pumpuang?._id ?? '');
    await refetch();
  }, [pumpuang?._id, favorite, refetch]);
  const unfavoriteCallback = useCallback(async () => {
    await unfavorite(pumpuang?._id ?? '');
    await refetch();
  }, [pumpuang?._id, refetch, unfavorite]);

  return (
    <Stack direction="row" spacing={3} px={3}>
      {pumpuang?.phoneNumber && <CallButton phoneNumber={pumpuang?.phoneNumber} highlight />}

      {pumpuang && (!submissionStatus || submissionStatus === SubmissionStatus.ACCEPTED) && (
        <FavoriteButton
          defaultIsFavorite={pumpuang.isFavorite}
          favoriteCallback={favoriteCallback}
          unfavoriteCallback={unfavoriteCallback}
        />
      )}
    </Stack>
  );
}
