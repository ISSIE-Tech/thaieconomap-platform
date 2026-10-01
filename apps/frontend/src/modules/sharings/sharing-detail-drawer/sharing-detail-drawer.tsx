'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { useCallback } from 'react';
import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { SubmissionStatus } from 'src/modules/form-history/_types/history.type';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import CommercialCarouselImages from 'src/modules/commercials/commercial-detail-drawer/commercial-carousel-images';
import {
  CallButton,
  formatCoord,
  FavoriteButton,
  DirectionButton,
} from 'src/shared/components/custom-buttons/action-btn';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import EditSharing from './edit-sharing';
import { SharingDetail } from './sharing-detail';
import useGetSharing from '../_hooks/use-get-sharing';
import useFavoriteSharing from '../_hooks/use-favorite-sharing';
import useUnfavoriteSharing from '../_hooks/use-unfavorite-sharing';
import { type Sharing, SharingStatus } from '../_types/sharing.type';

type Props = {
  controller: UseBooleanReturn;
  sharing?: Sharing | null;
  submissionStatus?: SubmissionStatus;
  submissionMessage?: string;
};

export function SharingDrawer({ controller, sharing, submissionStatus, submissionMessage }: Props) {
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
          title="ช้อมูลสิ่งของ"
          onClose={controller.onFalse}
          isFavorite={sharing?.isFavorite}
        />

        <MainInfo sharing={sharing} submissionMessage={submissionMessage} />

        <Stack direction="row" spacing={3} px={3}>
          <SharingActionButtons sharing={sharing} submissionStatus={submissionStatus} />
        </Stack>
      </Stack>

      <Image
        src={sharing?.imageUrl}
        alt="sharing place"
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

      <SharingDetail sharing={sharing} />

      {sharing?.additionalImageUrl && sharing?.additionalImageUrl.length > 0 && (
        <CommercialCarouselImages title="รูปภาพสิ่งของ" imageUrls={sharing.additionalImageUrl} />
      )}

      {submissionStatus === SubmissionStatus.REJECTED && <EditSharing sharing={sharing} />}
    </Drawer>
  );
}

// -------------------------------------------------------------

export function MainInfo({ sharing, submissionMessage }: Partial<Props>) {
  const theme = useTheme();

  const sharingStatusStyle = {
    OPEN: {
      foreground: theme.palette.success.main,
      background: theme.palette.success.lighter,
    },
    FULL: {
      foreground: theme.palette.error.main,
      background: theme.palette.error.lighter,
    },
    NEAR_FULL: {
      foreground: theme.palette.warning.main,
      background: theme.palette.warning.lighter,
    },
  };

  return (
    <Stack spacing={1} px={3}>
      <Typography variant="h5" fontWeight="bold" sx={maxLine({ line: 1 })}>
        {sharing?.name}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
        <Typography color={theme.palette.primary.dark} variant="body2" fontWeight="medium">
          {sharing?.types.map((type) => type.name).join(', ')}
        </Typography>

        {sharing?.status && (
          <Box
            sx={{
              borderRadius: '9999px',
              px: 1,
              py: 0.25,
              bgcolor: sharingStatusStyle[sharing.status].background,
            }}
          >
            <Typography fontWeight="bold" color={sharingStatusStyle[sharing.status].foreground}>
              {sharing && SharingStatus[sharing.status]}
            </Typography>
          </Box>
        )}
      </Stack>

      {submissionMessage && (
        <>
          <Divider />
          <Typography variant="body1" fontWeight="bold">
            เหตุผลที่ถูกปฏิเสธ
          </Typography>
          <Typography>{submissionMessage}</Typography>
          <Divider />
        </>
      )}

      <Divider />
    </Stack>
  );
}

// -------------------------------------------------------------

type SharingProps = {
  sharing?: Sharing | null;
  submissionStatus?: SubmissionStatus;
};

export function SharingActionButtons({ sharing, submissionStatus }: SharingProps) {
  const geolocation = useGeolocationStore((state) => state.geolocation);

  // Sharing (for refetching)
  // TODO: might want to refactor favorite entirely, lots of duplicate logic
  const { mutateAsync: favorite } = useFavoriteSharing();
  const { mutateAsync: unfavorite } = useUnfavoriteSharing();
  const { refetch } = useGetSharing({ sharingId: sharing?._id ?? '', enabled: !submissionStatus });

  const favoriteCallback = useCallback(async () => {
    await favorite(sharing?._id ?? '');
    await refetch();
  }, [sharing?._id, favorite, refetch]);
  const unfavoriteCallback = useCallback(async () => {
    await unfavorite(sharing?._id ?? '');
    await refetch();
  }, [sharing?._id, refetch, unfavorite]);

  return (
    <>
      {/* TODO: implement this */}
      {/* <IconLabelButton
        icon="ic:baseline-back-hand"
        label="รับเลย"
        highlight
        onClick={() => {}}
        iconSx={{ transform: 'rotate(90deg)' }}
      /> */}

      {sharing?.contact?.phoneNumber && (
        <CallButton phoneNumber={sharing.contact.phoneNumber} highlight />
      )}

      {geolocation && sharing && (
        <DirectionButton
          srcCoord={geolocation}
          dstCoord={formatCoord(sharing?.location.coordinates)}
        />
      )}

      {sharing && (!submissionStatus || submissionStatus === SubmissionStatus.ACCEPTED) && (
        <FavoriteButton
          defaultIsFavorite={sharing.isFavorite}
          favoriteCallback={favoriteCallback}
          unfavoriteCallback={unfavoriteCallback}
        />
      )}
    </>
  );
}
