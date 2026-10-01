'use client';

import type { Announcement } from './_types/announcements.type';
import type { UseBooleanReturn } from 'src/shared/hooks/use-boolean';

import { useMemo } from 'react';
import { maxLine } from 'src/theme/styles/mixins';
import { Iconify } from 'src/shared/components/iconify';
import { BackBtn } from 'src/shared/components/custom-buttons';
import { replaceShortMonthToThai } from 'src/shared/components/constants/date';
import { fIsBetween, fDateRangeShortLabel } from 'src/shared/utils/format-time';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AnnouncementFullDetail from './announcement-detail';
import useGetAnnouncement from './_hooks/use-get-announcement';

type Props = {
  controller: UseBooleanReturn;
  id: string;
};

export default function AnnouncementDetailDrawer({ controller, id }: Props) {
  const theme = useTheme();
  const { data: announcement } = useGetAnnouncement({ id });

  return (
    <Drawer
      open={controller.value}
      onClose={controller.setValue}
      anchor="right"
      slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}
      PaperProps={{
        sx: { width: { xs: '100vw', md: 480 }, overflowX: 'hidden', overflowY: 'scroll', pb: 8 },
      }}
    >
      <Grid
        container
        py={2}
        px={3}
        sx={{ bgcolor: theme.palette.primary.dark, borderBottomRightRadius: '3rem' }}
      >
        <Grid container size={4} alignContent="center">
          <BackBtn onClick={controller.onFalse} />
        </Grid>
      </Grid>

      <MainInfo announcement={announcement} />
      <AnnouncementFullDetail announcement={announcement} />
    </Drawer>
  );
}

// -------------------------------------------------------------

type MainInfoProps = {
  announcement?: Announcement;
};

export function MainInfo({ announcement }: MainInfoProps) {
  const theme = useTheme();

  const statusStyle = {
    ACTIVE: {
      foreground: theme.palette.success.main,
      background: theme.palette.success.lighter,
    },
    INACTIVE: {
      foreground: theme.palette.error.main,
      background: theme.palette.error.lighter,
    },
  };

  const activeStyle = useMemo(
    () =>
      fIsBetween(new Date(), announcement?.startAt, announcement?.endAt)
        ? statusStyle.ACTIVE
        : statusStyle.INACTIVE,
    [announcement?.endAt, announcement?.startAt, statusStyle.ACTIVE, statusStyle.INACTIVE]
  );

  const activeText = useMemo(() => {
    const currentDate = new Date(); // Current date

    // Use fIsBetween to check if today is within the startAt and endAt
    if (fIsBetween(currentDate, announcement?.startAt, announcement?.endAt)) {
      return 'ยังมีผล'; // Between start and end
    }
    if (!announcement || currentDate < new Date(announcement.startAt)) {
      return 'ยังไม่มีผล'; // Before start
    }
    return 'หมดผลแล้ว'; // After end
  }, [announcement]);

  return (
    <Stack spacing={1} px={3} py={3}>
      <Typography variant="h5" fontWeight="bold" sx={maxLine({ line: 1 })}>
        {announcement?.name}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
        <Typography>
          {replaceShortMonthToThai(
            fDateRangeShortLabel(announcement?.startAt, announcement?.endAt)
          )}
        </Typography>

        <Box
          sx={{
            borderRadius: '9999px',
            px: 1,
            py: 0.25,
            bgcolor: activeStyle.background,
          }}
        >
          <Typography fontWeight="bold" color={activeStyle.foreground}>
            {activeText}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} mb={2}>
        <Iconify width={24} mt={1} icon="heroicons:map-pin" />
        {/* each district name split by ',' slice to remove last ','  */}
        {/* ex: เขตพระนคร จังหวัดกรุงเทพ, เขตพญาไท */}
        <Typography>
          {announcement?.districts
            .reduce(
              (acc, curr) => `${acc} เขต/อำเภอ${curr.districtName} จังหวัด${curr.provinceName}, `,
              ''
            )
            .slice(0, -2)}
        </Typography>
      </Stack>

      <Divider />
    </Stack>
  );
}

// -------------------------------------------------------------

/** Desktop right pane: the drawer's content as a card. */
export function AnnouncementArticle({ id }: { id: string }) {
  const { data: announcement } = useGetAnnouncement({ id });

  if (!announcement) return null;

  return (
    <Stack
      component="article"
      sx={{
        maxWidth: 760,
        mx: 'auto',
        pb: 4,
        bgcolor: 'common.white',
        borderRadius: 2,
        boxShadow: '0px 1px 10px 1px #4876D31A',
      }}
    >
      <MainInfo announcement={announcement} />
      <AnnouncementFullDetail announcement={announcement} />

      {(announcement.pdfUrl || announcement.phoneNumber) && (
        <Stack direction="row" spacing={1.5} px={3} pt={3}>
          {announcement.pdfUrl && (
            <Button
              variant="contained"
              href={announcement.pdfUrl}
              target="_blank"
              startIcon={<Iconify icon="solar:document-text-linear" width={20} />}
              sx={{ height: 44, px: 2.5, borderRadius: '9999px' }}
            >
              ดูเอกสาร PDF
            </Button>
          )}
          {announcement.phoneNumber && (
            <Button
              href={`tel:${announcement.phoneNumber}`}
              startIcon={<Iconify icon="ic:round-phone" width={20} />}
              sx={{
                height: 44,
                px: 2.5,
                borderRadius: '9999px',
                border: 2,
                borderColor: 'primary.lighter',
                color: 'primary.dark',
                fontWeight: 700,
              }}
            >
              ติดต่อผู้ประกาศ
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}
