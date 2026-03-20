'use client';

import type { SubmissionStatus } from 'src/modules/form-history/_types/history.type';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { maxLine } from 'src/theme/styles/mixins';
import { Image } from 'src/shared/components/image';
import { Iconify } from 'src/shared/components/iconify';
import { BlueRoundedHeader } from 'src/modules/economap-headers';
import { useBoolean, type UseBooleanReturn } from 'src/shared/hooks/use-boolean';
import { IconLabelButton } from 'src/shared/components/custom-buttons/icon-label-btn';
import { useGeolocationStore } from 'src/modules/geolocation/_store/geolocation.store';
import { CallButton, DirectionButton } from 'src/shared/components/custom-buttons/action-btn';
import { StatusBox } from 'src/modules/commercials/commercial-detail-drawer/right-status-box';
import CommercialCarouselImages from 'src/modules/commercials/commercial-detail-drawer/commercial-carousel-images';

import { JobDetail } from './job-detail';
import { RedirectChialShareDialog } from './redirect-chial-share-dialog';
import { type JobPost, ThaiJobAcceptanceStatus } from '../_types/jobs.type';

type Props = {
  controller: UseBooleanReturn;
  job?: JobPost | null;
  submissionStatus?: SubmissionStatus;
  submissionMessage?: string;
};

export const JobsDetailDrawer = ({
  controller,
  job,
  submissionStatus,
  submissionMessage,
}: Props) => (
  <Drawer
    open={controller.value}
    onClose={controller.onFalse}
    anchor="right"
    slotProps={{ backdrop: { sx: { display: { md: 'none' } } } }}
    PaperProps={{
      sx: { width: { xs: '100vw', md: 480 }, overflowX: 'hidden', overflowY: 'scroll', pb: 8 },
    }}
  >
    <Stack spacing={4}>
      <BlueRoundedHeader
        title="ข้อมูลงาน"
        rightComponent={<StatusBox text="เปิดหลายตำแหน่ง" />}
        onClose={controller.onFalse}
      />

      <MainInfo job={job} submissionMessage={submissionMessage} />

      <JobActionButtons job={job} />
    </Stack>

    {/* this Image is from MUI not next/image */}
    {job?.imageUrls && (
      <Image
        // https:// + storage.thaieconomap.com/chial-share-dev/something.jpeg
        src={`https://${job.imageUrls[0]}`}
        alt="job location"
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
    )}

    <JobDetail job={job} />

    {job?.imageUrls && job?.imageUrls.length > 0 && (
      <CommercialCarouselImages
        title="รูปภาพงาน"
        imageUrls={job.imageUrls.map((url) => `https://${url}`)}
      />
    )}
  </Drawer>
);

// --------------------------------------------------

export function MainInfo({ job, submissionMessage }: Partial<Props>) {
  const theme = useTheme();

  const applicationStatusStyle = {
    AVAILABLE: {
      foreground: theme.palette.success.main,
      background: theme.palette.success.lighter,
    },
    UNAVAILABLE: {
      foreground: theme.palette.error.main,
      background: theme.palette.error.lighter,
    },
  };

  return (
    <Stack spacing={1} px={3}>
      <Typography variant="h5" fontWeight="bold" sx={maxLine({ line: 1 })}>
        {job?.title}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
        <Typography>{job?.category.name}</Typography>

        {job?.acceptanceStatus && (
          <Box
            sx={{
              borderRadius: '9999px',
              px: 1,
              py: 0.25,
              bgcolor: applicationStatusStyle[job?.acceptanceStatus].background,
            }}
          >
            <Typography
              fontWeight="bold"
              color={applicationStatusStyle[job?.acceptanceStatus].foreground}
            >
              {job && ThaiJobAcceptanceStatus[job?.acceptanceStatus]}
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

      <Stack direction="row" spacing={2} mb={2}>
        <Iconify width={24} mt={1} icon="heroicons:map-pin" />
        <Typography>{job?.location.address.name}</Typography>
      </Stack>

      <Divider />
    </Stack>
  );
}

// --------------------------------------------------

type JobProps = {
  job?: JobPost | null;
};

function JobActionButtons({ job }: JobProps) {
  const geolocation = useGeolocationStore((state) => state.geolocation);

  const redirectDialogController = useBoolean();

  return (
    <Stack direction="row" spacing={3} px={3}>
      <IconLabelButton
        icon="fluent:briefcase-12-filled"
        label="สมัครงาน"
        highlight
        onClick={redirectDialogController.onTrue}
      />

      {job?.createdBy.phoneNumber && <CallButton phoneNumber={job.createdBy.phoneNumber} />}

      {geolocation && job && (
        <DirectionButton
          srcCoord={geolocation}
          dstCoord={[Number(job.location.latitude), Number(job.location.longitude)]}
        />
      )}

      {/* TODO: do this later */}
      {/* 
        gymSus — 3/1/68 15:36
        @Peqch @k1tt0n job มี favorite กับ unfavorite ยัง
        zantaclaus — 3/1/68 15:37
        ยังไม่ต้องทำๆ 
      */}
      {/* <IconLabelButton
        icon="ic:round-star"
        label="บันทึก"
        // highlight={hasFavorite.value}
        // onClick={handleFavoriteToggle}
        onClick={() => {}}
      /> */}

      <RedirectChialShareDialog controller={redirectDialogController} />
    </Stack>
  );
}
