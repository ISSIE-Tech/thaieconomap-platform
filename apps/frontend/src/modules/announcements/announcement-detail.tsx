import type { Announcement } from './_types/announcements.type';

import dayjs from 'dayjs';
import { Iconify } from 'src/shared/components/iconify';
import { dayOfWeekThai, monthEngThaiMap } from 'src/shared/components/constants/date';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type Props = {
  announcement?: Announcement;
};

export default function AnnouncementFullDetail({ announcement }: Props) {
  return (
    <Stack spacing={2} px={3}>
      <Typography variant="body1" fontWeight="bold">
        ประกาศ
      </Typography>

      <AnnouncementDate announcement={announcement} />
      <Divider />

      <AnnouncementDetail announcement={announcement} />
      <Divider />

      <AnnouncementAnnouncer announcement={announcement} />
    </Stack>
  );
}

// --------------------------------------------------

function AnnouncementDate({ announcement }: Props) {
  const startAt = dayjs(announcement?.startAt);
  const endAt = dayjs(announcement?.endAt);
  const isSameDay = startAt.isSame(endAt, 'day');

  const thaiStartMonth = monthEngThaiMap[startAt.format('MMMM') as keyof typeof monthEngThaiMap];
  const thaiEndMonth = monthEngThaiMap[endAt.format('MMMM') as keyof typeof monthEngThaiMap];
  /* ===== Day of week and time ===== */
  return (
    <Stack direction="row" spacing={1}>
      <Iconify width={24} icon="wi:time-9" my={0.5} />

      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" fontWeight="bold">
            {`วัน${dayOfWeekThai[startAt.day() - 1]}ที่ ${startAt.format('D')} ${thaiStartMonth}`}
            {isSameDay
              ? ''
              : ` - วัน${dayOfWeekThai[endAt.day() - 1]}ที่ ${endAt.format('D')} ${thaiEndMonth}`}
          </Typography>

          {isSameDay && (
            <Typography variant="body2">
              {`${startAt.format('HH:mm')} - ${endAt.format('HH:mm')}`}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

// --------------------------------------------------

function AnnouncementDetail({ announcement }: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <Iconify width={24} icon="fluent:info-24-regular" my={0.5} />

      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">{announcement?.detail}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

// --------------------------------------------------

function AnnouncementAnnouncer({ announcement }: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <Iconify width={24} icon="carbon:user" my={0.5} />

      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">{announcement?.announcer}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
