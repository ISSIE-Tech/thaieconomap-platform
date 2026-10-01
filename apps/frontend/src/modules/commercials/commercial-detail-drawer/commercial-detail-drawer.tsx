'use client';

import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import Link from 'next/link';
import { useCallback } from 'react';
import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { paths } from 'src/shared/routes/paths.config';
import { Iconify } from 'src/shared/components/iconify';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { SubmissionStatus } from 'src/modules/form-history/_types/history.type';
import { IconLabelButton } from 'src/shared/components/custom-buttons/icon-label-btn';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import {
  CallButton,
  formatCoord,
  FavoriteButton,
  DirectionButton,
} from 'src/shared/components/custom-buttons/action-btn';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import EditCommercial from './edit-commercial';
import { StatusBox } from './right-status-box';
import { CommercialDetail } from './commercial-detail';
import useGetCommercial from '../_hooks/use-get-commercial';
import CommercialCarouselImages from './commercial-carousel-images';
import useFavoriteCommercial from '../_hooks/use-favorite-commercial';
import useUnfavoriteCommercial from '../_hooks/use-unfavorite-commercial';
import {
  type Commercial,
  CommercialCategory,
  CommercialWorkingStatus,
} from '../_types/commercials.type';

type Props = {
  controller: UseBooleanReturn;
  commercial?: Commercial | null;
  submissionStatus?: SubmissionStatus;
  submissionMessage?: string;
};

export function CommercialDrawer({
  controller,
  commercial,
  submissionStatus,
  submissionMessage,
}: Props) {
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
          title="ข้อมูลร้าน"
          rightComponent={commercial?.isNewlyOpened && <StatusBox text="ร้านใหม่แกะกล่อง" />}
          onClose={controller.onFalse}
        />

        <MainInfo commercial={commercial} submissionMessage={submissionMessage} />

        <Stack direction="row" spacing={3} px={3}>
          <CommercialActionButtons commercial={commercial} submissionStatus={submissionStatus} />
        </Stack>

        {/* submissions (form history) may not be public shops yet */}
        {commercial && !submissionStatus && (
          <Box px={3}>
            <Button
              fullWidth
              component={Link}
              href={paths.shop(commercial._id)}
              endIcon={<Iconify icon="eva:arrow-forward-fill" width={20} />}
              sx={{
                height: 48,
                borderRadius: '9999px',
                border: 2,
                borderColor: 'primary.lighter',
                color: 'primary.dark',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              ดูหน้าร้านแบบเต็ม
            </Button>
          </Box>
        )}
      </Stack>
      <Image
        src={commercial?.imageUrl}
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

      <CommercialDetail commercial={commercial} />
      {commercial?.additionalImageUrl && commercial?.additionalImageUrl.length > 0 && (
        <CommercialCarouselImages
          title={`รูปภาพ${CommercialCategory[commercial.category]}`}
          imageUrls={commercial.additionalImageUrl}
        />
      )}

      {submissionStatus === SubmissionStatus.REJECTED && <EditCommercial commercial={commercial} />}
    </Drawer>
  );
}

// -------------------------------------------------------------

export function MainInfo({ commercial, submissionMessage }: Partial<Props>) {
  const theme = useTheme();

  const workingStatusStyle = {
    OPEN: {
      foreground: theme.palette.success.main,
      background: theme.palette.success.lighter,
    },
    CLOSED: {
      foreground: theme.palette.error.main,
      background: theme.palette.error.lighter,
    },
    NEAR_OPEN: {
      foreground: theme.palette.warning.main,
      background: theme.palette.warning.lighter,
    },
  };

  return (
    <Stack spacing={1} px={3}>
      <Typography variant="h5" fontWeight="bold" sx={maxLine({ line: 1 })}>
        {commercial?.name}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
        <Typography>{commercial && CommercialCategory[commercial.category]}</Typography>

        {commercial?.workingStatus && (
          <Box
            sx={{
              borderRadius: '9999px',
              px: 1,
              py: 0.25,
              bgcolor: workingStatusStyle[commercial.workingStatus].background,
            }}
          >
            <Typography
              fontWeight="bold"
              color={workingStatusStyle[commercial.workingStatus].foreground}
            >
              {commercial && CommercialWorkingStatus[commercial.workingStatus]}
            </Typography>
          </Box>
        )}
      </Stack>

      <Typography color={theme.palette.primary.dark} variant="body2" fontWeight="medium">
        {commercial?.types?.map((type) => type.name).join(', ')}
      </Typography>

      {submissionMessage && (
        <>
          <Divider />
          <Typography variant="body1" fontWeight="bold">
            เหตุผลที่ถูกปฏิเสธ
          </Typography>
          <Typography>{submissionMessage}</Typography>
        </>
      )}

      <Divider />
    </Stack>
  );
}

// -------------------------------------------------------------

type CommercialProps = {
  commercial?: Commercial | null;
  submissionStatus?: SubmissionStatus;
};

export function CommercialActionButtons({ commercial, submissionStatus }: CommercialProps) {
  const geolocation = useGeolocationStore((state) => state.geolocation);

  const { mutateAsync: favorite } = useFavoriteCommercial();
  const { mutateAsync: unfavorite } = useUnfavoriteCommercial();
  const { refetch } = useGetCommercial({
    commercialId: commercial?._id ?? '',
    enabled: !submissionStatus,
  });

  const favoriteCallback = useCallback(async () => {
    await favorite(commercial?._id ?? '');
    await refetch();
  }, [commercial?._id, favorite, refetch]);
  const unfavoriteCallback = useCallback(async () => {
    await unfavorite(commercial?._id ?? '');
    await refetch();
  }, [commercial?._id, refetch, unfavorite]);

  return (
    <>
      {commercial?.phoneNumber && <CallButton phoneNumber={commercial.phoneNumber} highlight />}

      {commercial && (
        <DirectionButton
          srcCoord={geolocation ?? null}
          dstCoord={formatCoord(commercial?.location.coordinates)}
        />
      )}

      {commercial && (!submissionStatus || submissionStatus === SubmissionStatus.ACCEPTED) && (
        <FavoriteButton
          defaultIsFavorite={commercial.isFavorite}
          favoriteCallback={favoriteCallback}
          unfavoriteCallback={unfavoriteCallback}
        />
      )}

      {commercial?.base?.botInfo?.basicId && (
        <IconLabelButton
          icon="fluent:food-24-filled"
          label="สั่งอาหาร"
          onClick={() =>
            window.open(`https://line.me/R/ti/p/${commercial?.base?.botInfo?.basicId}`, '_blank')
          }
        />
      )}
    </>
  );
}
